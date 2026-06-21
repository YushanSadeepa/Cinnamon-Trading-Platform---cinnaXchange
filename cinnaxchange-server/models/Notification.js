import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    type: {
      type: String,
      enum: [
        "bid_placed",        // Someone bid on your auction (seller)
        "outbid",            // You were outbid (buyer)
        "auction_won",       // You won an auction (buyer)
        "auction_ended",     // Your auction ended (seller)
        "meeting_required",  // Physical meeting needed (both)
        "transaction_completed", // Seller confirmed completion (buyer)
        "review_prompt",     // Prompt buyer to leave review
        "verification_approved",
        "verification_rejected",
        "complaint_received",
      ],
      required: true,
    },
    title: { type: String, required: true },
    message: { type: String, required: true },
    read: { type: Boolean, default: false },
    // Optional reference to related entity
    refModel: { type: String, enum: ["Auction", "Product", "Review"] },
    refId: { type: mongoose.Schema.Types.ObjectId },
  },
  { timestamps: true }
);

export default mongoose.model("Notification", notificationSchema);
