import Bid from "../models/Bid.js";
import Auction from "../models/Auction.js";
import { createNotification } from "./notificationController.js";

// GET /api/bids/my-bids — buyer sees their bids
export const getMyBids = async (req, res) => {
  try {
    const bids = await Bid.find({ bidder: req.user.id })
      .populate({
        path: "auction",
        select: "title status endTime currentHighestBid currentHighestBidder winner",
        populate: { path: "product", select: "title grade images" },
      })
      .sort({ createdAt: -1 });
    res.json(bids);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET /api/bids/auction/:auctionId — bid history for an auction
export const getAuctionBids = async (req, res) => {
  try {
    const bids = await Bid.find({ auction: req.params.auctionId })
      .populate("bidder", "fullName")
      .sort({ amount: -1 });
    res.json(bids);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// POST /api/bids — place a bid via REST (used alongside Socket.io for DB persistence)
export const placeBid = async (req, res) => {
  try {
    const { auctionId, amount } = req.body;
    const auction = await Auction.findById(auctionId);

    if (!auction) return res.status(404).json({ message: "Auction not found" });
    if (auction.status !== "active") return res.status(400).json({ message: "Auction is not active" });
    if (new Date() > auction.endTime) return res.status(400).json({ message: "Auction has ended" });
    if (Number(amount) <= auction.currentHighestBid) {
      return res.status(400).json({ message: `Bid must be higher than LKR ${auction.currentHighestBid}` });
    }
    if (auction.seller.toString() === req.user.id) {
      return res.status(400).json({ message: "Sellers cannot bid on their own auctions" });
    }

    const previousBidder = auction.currentHighestBidder;

    // Mark previous winning bid as not winning
    if (previousBidder) {
      await Bid.updateMany({ auction: auctionId, isWinning: true }, { isWinning: false });
    }

    // Create new bid
    const bid = await Bid.create({
      auction: auctionId,
      bidder: req.user.id,
      amount: Number(amount),
      isWinning: true,
    });

    // Update auction
    auction.currentHighestBid = Number(amount);
    auction.currentHighestBidder = req.user.id;
    await auction.save();

    // Notify seller of new bid
    await createNotification({
      userId: auction.seller,
      type: "bid_placed",
      title: "New bid received",
      message: `A new bid of LKR ${Number(amount).toLocaleString()} was placed on "${auction.title}".`,
      refModel: "Auction",
      refId: auction._id,
    });

    // Notify previous highest bidder they were outbid
    if (previousBidder && previousBidder.toString() !== req.user.id) {
      await createNotification({
        userId: previousBidder,
        type: "outbid",
        title: "You've been outbid",
        message: `Someone placed a higher bid of LKR ${Number(amount).toLocaleString()} on "${auction.title}".`,
        refModel: "Auction",
        refId: auction._id,
      });
    }

    await bid.populate("bidder", "fullName");
    res.status(201).json({ bid, auction });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};