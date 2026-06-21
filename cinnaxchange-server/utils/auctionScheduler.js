import Auction from "../models/Auction.js";
import Bid from "../models/Bid.js";
import { createNotification } from "../controllers/notificationController.js";

/**
 * Checks every 60 seconds for auctions whose endTime has passed
 * but whose status is still "active". Closes them, assigns the
 * highest bidder as winner, and sends notifications to both parties.
 */
export function startAuctionScheduler() {
  const run = async () => {
    try {
      const expired = await Auction.find({
        status: "active",
        endTime: { $lte: new Date() },
      }).populate("seller", "fullName");

      for (const auction of expired) {
        // Find the highest bid for this auction
        const topBid = await Bid.findOne({ auction: auction._id, isWinning: true })
          .populate("bidder", "fullName");

        if (topBid) {
          // There is a winner — move to awaiting_meeting
          auction.status = "awaiting_meeting";
          auction.winner = topBid.bidder._id;
          auction.winningBid = topBid.amount;
          await auction.save();

          // Notify winner
          await createNotification({
            userId: topBid.bidder._id,
            type: "auction_won",
            title: "You won an auction!",
            message: `Congratulations! Your bid of LKR ${topBid.amount.toLocaleString()} won "${auction.title}". The seller will contact you to arrange the meeting.`,
            refModel: "Auction",
            refId: auction._id,
          });

          // Notify seller
          await createNotification({
            userId: auction.seller._id,
            type: "auction_ended",
            title: "Auction ended",
            message: `Your auction "${auction.title}" has ended. Winner: ${topBid.bidder.fullName} with LKR ${topBid.amount.toLocaleString()}. Go to Awaiting Meetings to arrange the handover.`,
            refModel: "Auction",
            refId: auction._id,
          });

          // Notify all other bidders they didn't win
          const otherBids = await Bid.find({
            auction: auction._id,
            bidder: { $ne: topBid.bidder._id },
          }).distinct("bidder");

          for (const bidderId of otherBids) {
            await createNotification({
              userId: bidderId,
              type: "auction_ended",
              title: "Auction ended",
              message: `The auction "${auction.title}" has ended. Unfortunately your bid was not the highest.`,
              refModel: "Auction",
              refId: auction._id,
            });
          }

          console.log(`✅ Auction ended: "${auction.title}" — Winner: ${topBid.bidder.fullName} (LKR ${topBid.amount})`);
        } else {
          // No bids — just mark as ended
          auction.status = "ended";
          await auction.save();

          await createNotification({
            userId: auction.seller._id,
            type: "auction_ended",
            title: "Auction ended with no bids",
            message: `Your auction "${auction.title}" ended without receiving any bids.`,
            refModel: "Auction",
            refId: auction._id,
          });

          console.log(`⚠️  Auction ended with no bids: "${auction.title}"`);
        }
      }
    } catch (err) {
      console.error("Auction scheduler error:", err.message);
    }
  };

  // Run immediately on startup to catch any that expired while server was down
  run();
  // Then every 60 seconds
  setInterval(run, 60 * 1000);
  console.log("🕐 Auction scheduler started");
}
