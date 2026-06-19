import User from "../models/User.js";

export const rateSeller = async (req, res) => {
  try {
    const { sellerId, rating } = req.body;

    if (!sellerId || !rating) {
      return res.status(400).json({
        message: "Seller ID and rating are required",
      });
    }

    if (rating < 1 || rating > 5) {
      return res.status(400).json({
        message: "Rating must be between 1 and 5",
      });
    }

    const seller = await User.findById(sellerId);

    if (!seller) {
      return res.status(404).json({
        message: "Seller not found",
      });
    }

    const currentCount = seller.ratings.count;
    const currentAverage = seller.ratings.average;

    seller.ratings.count += 1;

    seller.ratings.average =
      (currentAverage * currentCount + rating) /
      seller.ratings.count;

    await seller.save();

    res.status(200).json({
      message: "Rating submitted successfully",
      ratings: seller.ratings,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};