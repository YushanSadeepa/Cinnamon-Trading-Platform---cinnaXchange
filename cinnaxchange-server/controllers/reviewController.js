import Review from "../models/Review.js";
import Auction from "../models/Auction.js";
import User from "../models/User.js";

// GET /api/reviews/seller/:sellerId
export const getSellerReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ seller: req.params.sellerId })
      .populate("reviewer", "fullName")
      .populate("auction", "title")
      .sort({ createdAt: -1 });
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET /api/reviews/my-reviews — buyer's submitted reviews
export const getMyReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ reviewer: req.user.id })
      .populate("seller", "fullName")
      .populate("auction", "title")
      .sort({ createdAt: -1 });
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// POST /api/reviews — buyer submits review (only when auction completed)
export const createReview = async (req, res) => {
  try {
    const { auctionId, rating, comment } = req.body;

    const auction = await Auction.findById(auctionId);
    if (!auction) return res.status(404).json({ message: "Auction not found" });
    if (auction.status !== "completed") {
      return res.status(400).json({ message: "Reviews are only allowed after the transaction is completed" });
    }
    if (auction.winner.toString() !== req.user.id) {
      return res.status(403).json({ message: "Only the auction winner can leave a review" });
    }

    const review = await Review.create({
      auction: auctionId,
      reviewer: req.user.id,
      seller: auction.seller,
      rating: Number(rating),
      comment,
    });

    // Update seller's average rating
    const allReviews = await Review.find({ seller: auction.seller });
    const avg = allReviews.reduce((sum, r) => sum + r.rating, 0) / allReviews.length;

    await User.findByIdAndUpdate(auction.seller, {
      "ratings.average": Math.round(avg * 10) / 10,
      "ratings.count": allReviews.length,
    });

    // Recalculate trust score (import inline to avoid circular dep)
    const { recalculateTrustScore } = await import("./auctionController.js");
    await recalculateTrustScore(auction.seller);

    await review.populate(["reviewer", "auction"]);
    res.status(201).json(review);
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: "You have already reviewed this transaction" });
    }
    res.status(500).json({ message: error.message });
  }
};
