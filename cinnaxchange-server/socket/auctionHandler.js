import Auction from "../models/Auction.js";
import Bid from "../models/Bid.js";
import { createNotification } from "../controllers/notificationController.js";

export default function registerAuctionHandlers(io, socket) {
  // JOIN auction room
  socket.on("join_auction", (auctionId) => {
    socket.join(auctionId);
  });

  // LEAVE auction room
  socket.on("leave_auction", (auctionId) => {
    socket.leave(auctionId);
  });

  // PLACE BID — validates against DB, persists, broadcasts
  socket.on("place_bid", async ({ auctionId, userId, amount }) => {
    try {
      const auction = await Auction.findById(auctionId).populate("seller", "fullName");
      if (!auction) {
        socket.emit("bid_error", "Auction not found");
        return;
      }
      if (auction.status !== "active") {
        socket.emit("bid_error", "This auction is no longer active");
        return;
      }
      if (new Date() > auction.endTime) {
        socket.emit("bid_error", "This auction has ended");
        return;
      }
      if (Number(amount) <= auction.currentHighestBid) {
        socket.emit("bid_error", `Bid must be higher than LKR ${auction.currentHighestBid.toLocaleString()}`);
        return;
      }
      if (auction.seller._id.toString() === userId) {
        socket.emit("bid_error", "You cannot bid on your own auction");
        return;
      }

      const previousBidder = auction.currentHighestBidder;

      // Mark old winning bid as not winning
      if (previousBidder) {
        await Bid.updateMany({ auction: auctionId, isWinning: true }, { isWinning: false });
        // Notify outbid user
        if (previousBidder.toString() !== userId) {
          await createNotification({
            userId: previousBidder,
            type: "outbid",
            title: "You've been outbid",
            message: `A bid of LKR ${Number(amount).toLocaleString()} was placed on "${auction.title}".`,
            refModel: "Auction",
            refId: auction._id,
          });
          // Push real-time outbid notification to that user's room
          io.to(`user_${previousBidder}`).emit("notification", {
            type: "outbid",
            message: `You've been outbid on "${auction.title}"`,
          });
        }
      }

      // Save bid to DB
      await Bid.create({ auction: auctionId, bidder: userId, amount: Number(amount), isWinning: true });

      // Update auction
      auction.currentHighestBid = Number(amount);
      auction.currentHighestBidder = userId;
      await auction.save();

      // Notify seller
      await createNotification({
        userId: auction.seller._id,
        type: "bid_placed",
        title: "New bid received",
        message: `LKR ${Number(amount).toLocaleString()} bid placed on "${auction.title}".`,
        refModel: "Auction",
        refId: auction._id,
      });
      io.to(`user_${auction.seller._id}`).emit("notification", {
        type: "bid_placed",
        message: `New bid of LKR ${Number(amount).toLocaleString()} on "${auction.title}"`,
      });

      // Broadcast updated bid to everyone in the auction room
      io.to(auctionId).emit("bid_update", {
        auctionId,
        highestBid: auction.currentHighestBid,
        bidderId: userId,
      });
    } catch (err) {
      console.error("Socket bid error:", err.message);
      socket.emit("bid_error", "Failed to place bid. Please try again.");
    }
  });

  // GET current auction status on join
  socket.on("get_auction_status", async (auctionId) => {
    try {
      const auction = await Auction.findById(auctionId).select(
        "currentHighestBid currentHighestBidder status"
      ).populate("currentHighestBidder", "fullName");
      if (auction) {
        socket.emit("auction_status", {
          auctionId,
          highestBid: auction.currentHighestBid,
          bidder: auction.currentHighestBidder?.fullName || null,
          status: auction.status,
        });
      }
    } catch (err) {
      console.error("get_auction_status error:", err.message);
    }
  });
}