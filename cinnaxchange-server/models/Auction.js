import mongoose from "mongoose";

const auctionSchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    seller: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    title: { type: String, required: true },
    startingPrice: { type: Number, required: true },  // LKR
    currentHighestBid: { type: Number, default: 0 },
    currentHighestBidder: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    startTime: { type: Date, required: true },
    endTime: { type: Date, required: true },

    status: {
      type: String,
      enum: ["active", "ended", "awaiting_meeting", "completed", "cancelled"],
      default: "active",
    },

    // Set when auction ends and a winner exists
    winner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    winningBid: { type: Number, default: null },

    // Set by seller to confirm physical transaction happened
    completedAt: { type: Date },
    completedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

export default mongoose.model("Auction", auctionSchema);
