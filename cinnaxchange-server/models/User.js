import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    fullName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    mobile: { type: String },
    nicNumber: { type: String },
    password: { type: String, required: true },

    role: {
      type: String,
      enum: ["buyer", "seller", "admin"],
      default: "buyer",
    },

    isVerified: { type: Boolean, default: false },

    verification: {
      status: {
        type: String,
        enum: ["pending", "approved", "rejected"],
        default: "pending",
      },
      nicFront: { type: String },
      nicBack: { type: String },
      selfie: { type: String },
      rejectionReason: { type: String },
      submittedAt: { type: Date },
      reviewedAt: { type: Date },
      reviewedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    },

    ratings: {
      average: { type: Number, default: 0 },
      count: { type: Number, default: 0 },
    },

    // Computed trust score (0-100)
    trustScore: { type: Number, default: 0 },

    // Seller location for map display
    location: {
      label: { type: String },
      lat: { type: Number },
      lng: { type: Number },
    },

    // Seller stats for trust calculation
    completedSales: { type: Number, default: 0 },
    totalComplaints: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);