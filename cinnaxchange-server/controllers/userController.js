import User from "../models/User.js";
import { recalculateTrustScore } from "./auctionController.js";

// GET /api/users/me — current user's full profile
export const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// PUT /api/users/me — update profile (name, mobile, location)
export const updateMe = async (req, res) => {
  try {
    const { fullName, mobile, location } = req.body;
    const user = await User.findById(req.user.id);

    if (fullName) user.fullName = fullName;
    if (mobile) user.mobile = mobile;
    if (location) user.location = location; // { label, lat, lng }

    await user.save();
    res.json({ message: "Profile updated", user: { ...user.toObject(), password: undefined } });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET /api/users/trust/:userId — trust score for a seller
export const getTrustScore = async (req, res) => {
  try {
    const user = await User.findById(req.params.userId).select(
      "trustScore ratings isVerified completedSales totalComplaints fullName"
    );
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json({ trustScore: user.trustScore, ratings: user.ratings, isVerified: user.isVerified });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET /api/users/seller/:id — public seller profile for buyers
export const getSellerProfile = async (req, res) => {
  try {
    const seller = await User.findById(req.params.id).select(
      "fullName ratings trustScore isVerified location createdAt"
    );
    if (!seller || seller.role === "buyer") {
      return res.status(404).json({ message: "Seller not found" });
    }
    res.json(seller);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// POST /api/users/submit-verification — seller submits KYC docs
export const submitVerification = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (user.verification.status === "approved") {
      return res.status(400).json({ message: "Already verified" });
    }

    const files = req.files || {};
    const baseUrl = `${req.protocol}://${req.get("host")}`;
    const filePath = (field) =>
      files[field]?.[0]?.filename
        ? `${baseUrl}/uploads/kyc/${files[field][0].filename}`
        : undefined;

    user.verification = {
      ...user.verification,
      nicFront: filePath("nicFront") || user.verification.nicFront,
      nicBack: filePath("nicBack") || user.verification.nicBack,
      selfie: filePath("selfie") || user.verification.selfie,
      status: "pending",
      submittedAt: new Date(),
    };
    await user.save();
    res.json({ message: "Verification submitted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
