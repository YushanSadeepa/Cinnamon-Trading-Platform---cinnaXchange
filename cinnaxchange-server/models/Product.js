import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    seller: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    title: { type: String, required: true },
    cinnamonType: { type: String, required: true }, // e.g. "Ceylon True Cinnamon"
    grade: {
      type: String,
      enum: ["Alba", "C5", "C4", "C3", "M5", "H1", "Hamburg"],
      required: true,
    },
    quantity: { type: Number, required: true },   // kg
    price: { type: Number, required: true },       // LKR per kg
    dryingDays: { type: Number, default: 0 },
    description: { type: String },

    images: [{ type: String }],                   // URLs / file paths

    // Location
    location: { type: String, required: true },   // Human-readable label
    latitude: { type: Number },
    longitude: { type: Number },

    // Listing type flags
    isBuyNow: { type: Boolean, default: false },
    isAuction: { type: Boolean, default: false },

    status: {
      type: String,
      enum: ["active", "sold", "inactive"],
      default: "active",
    },
  },
  { timestamps: true }
);

export default mongoose.model("Product", productSchema);
