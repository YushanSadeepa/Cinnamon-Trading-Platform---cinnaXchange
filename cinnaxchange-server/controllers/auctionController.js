import Auction from "../models/Auction.js";
import Bid from "../models/Bid.js";
import Product from "../models/Product.js";
import User from "../models/User.js";
import { createNotification } from "./notificationController.js";

// GET /api/auctions — all active auctions (public)
export const getAuctions = async (req, res) => {
  try {
    const { status = "active" } = req.query;
    const auctions = await Auction.find({ status })
      .populate("product", "title grade cinnamonType quantity images")
      .populate("seller", "fullName ratings trustScore isVerified")
      .populate("currentHighestBidder", "fullName")
      .sort({ endTime: 1 });
    res.json(auctions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET /api/auctions/:id
export const getAuctionById = async (req, res) => {
  try {
    const auction = await Auction.findById(req.params.id)
      .populate("product")
      .populate("seller", "fullName ratings trustScore isVerified location mobile")
      .populate("currentHighestBidder", "fullName")
      .populate("winner", "fullName email mobile");
    if (!auction) return res.status(404).json({ message: "Auction not found" });
    res.json(auction);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET /api/auctions/my-auctions — seller's auctions
export const getMyAuctions = async (req, res) => {
  try {
    const auctions = await Auction.find({ seller: req.user.id })
      .populate("product", "title grade images")
      .populate("currentHighestBidder", "fullName")
      .populate("winner", "fullName")
      .sort({ createdAt: -1 });
    res.json(auctions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET /api/auctions/won — buyer's won auctions
export const getWonAuctions = async (req, res) => {
  try {
    const auctions = await Auction.find({
      winner: req.user.id,
      status: { $in: ["awaiting_meeting", "completed"] },
    })
      .populate("product", "title grade cinnamonType images location latitude longitude")
      .populate("seller", "fullName mobile location")
      .sort({ updatedAt: -1 });
    res.json(auctions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET /api/auctions/awaiting-meeting — seller's auctions awaiting physical meeting
export const getAwaitingMeetings = async (req, res) => {
  try {
    const auctions = await Auction.find({
      seller: req.user.id,
      status: "awaiting_meeting",
    })
      .populate("product", "title grade quantity")
      .populate("winner", "fullName mobile email")
      .sort({ updatedAt: -1 });
    res.json(auctions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET /api/auctions/completed-sales — seller's completed auctions
export const getCompletedSales = async (req, res) => {
  try {
    const auctions = await Auction.find({
      seller: req.user.id,
      status: "completed",
    })
      .populate("product", "title grade quantity images")
      .populate("winner", "fullName")
      .sort({ completedAt: -1 });
    res.json(auctions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// POST /api/auctions — seller creates auction
export const createAuction = async (req, res) => {
  try {
    const { productId, title, startingPrice, startTime, endTime } = req.body;

    const product = await Product.findOne({
      _id: productId,
      seller: req.user.id,
    });
    if (!product) return res.status(404).json({ message: "Product not found" });

    const auction = await Auction.create({
      product: productId,
      seller: req.user.id,
      title,
      startingPrice: Number(startingPrice),
      currentHighestBid: Number(startingPrice),
      startTime: new Date(startTime),
      endTime: new Date(endTime),
    });

    await auction.populate("product", "title grade");
    res.status(201).json(auction);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// PUT /api/auctions/:id — seller updates auction (only when active)
export const updateAuction = async (req, res) => {
  try {
    const auction = await Auction.findOne({
      _id: req.params.id,
      seller: req.user.id,
      status: "active",
    });
    if (!auction) return res.status(404).json({ message: "Auction not found or not editable" });

    const { title, startingPrice, endTime } = req.body;
    if (title) auction.title = title;
    if (endTime) auction.endTime = new Date(endTime);
    // Only update startingPrice if no bids yet
    if (startingPrice && auction.currentHighestBid === auction.startingPrice) {
      auction.startingPrice = Number(startingPrice);
      auction.currentHighestBid = Number(startingPrice);
    }

    await auction.save();
    res.json(auction);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// DELETE /api/auctions/:id — seller cancels auction
export const deleteAuction = async (req, res) => {
  try {
    const auction = await Auction.findOne({
      _id: req.params.id,
      seller: req.user.id,
      status: { $in: ["active"] },
    });
    if (!auction) return res.status(404).json({ message: "Cannot cancel this auction" });

    auction.status = "cancelled";
    await auction.save();
    res.json({ message: "Auction cancelled" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// POST /api/auctions/:id/complete — seller confirms physical transaction done
export const completeAuction = async (req, res) => {
  try {
    const auction = await Auction.findOne({
      _id: req.params.id,
      seller: req.user.id,
      status: "awaiting_meeting",
    });
    if (!auction) return res.status(404).json({ message: "Auction not found" });

    auction.status = "completed";
    auction.completedAt = new Date();
    auction.completedBy = req.user.id;
    await auction.save();

    // Update seller's completed sales count and recalculate trust score
    await User.findByIdAndUpdate(req.user.id, { $inc: { completedSales: 1 } });
    await recalculateTrustScore(req.user.id);

    // Notify winner they can now leave a review
    if (auction.winner) {
      await createNotification({
        userId: auction.winner,
        type: "transaction_completed",
        title: "Transaction completed",
        message: `Your auction "${auction.title}" has been marked complete. You can now leave a review.`,
        refModel: "Auction",
        refId: auction._id,
      });
      await createNotification({
        userId: auction.winner,
        type: "review_prompt",
        title: "Leave a review",
        message: `How was your experience with this seller? Share your feedback.`,
        refModel: "Auction",
        refId: auction._id,
      });
    }

    res.json(auction);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Utility: recalculate trust score for a seller
export const recalculateTrustScore = async (sellerId) => {
  const seller = await User.findById(sellerId);
  if (!seller) return;

  let score = 0;
  if (seller.isVerified) score += 30;
  score += Math.min(seller.completedSales * 5, 40); // up to 40 pts
  score += Math.min(Math.round((seller.ratings?.average || 0) * 4), 20); // up to 20 pts
  score -= Math.min(seller.totalComplaints * 5, 20); // up to -20 pts
  score = Math.max(0, Math.min(100, score));

  seller.trustScore = score;
  await seller.save();
  return score;
};
