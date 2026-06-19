import User from "../models/User.js";
import Product from "../models/Product.js";
import Auction from "../models/Auction.js";
import Complaint from "../models/Complaint.js";
import { createNotification } from "./notificationController.js";
import { recalculateTrustScore } from "./auctionController.js";

// ── USERS ────────────────────────────────────────────
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password").sort({ createdAt: -1 });
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteUser = async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: "User deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ── LISTINGS ─────────────────────────────────────────
export const getAllListings = async (req, res) => {
  try {
    const listings = await Product.find()
      .populate("seller", "fullName email")
      .sort({ createdAt: -1 });
    res.json(listings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteListingAdmin = async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.json({ message: "Listing removed" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ── AUCTIONS ─────────────────────────────────────────
export const getAllAuctions = async (req, res) => {
  try {
    const auctions = await Auction.find()
      .populate("product", "title grade")
      .populate("seller", "fullName email")
      .populate("winner", "fullName")
      .sort({ createdAt: -1 });
    res.json(auctions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ── COMPLAINTS ────────────────────────────────────────
export const getAllComplaints = async (req, res) => {
  try {
    const complaints = await Complaint.find()
      .populate("reporter", "fullName email")
      .populate("against", "fullName email")
      .populate("auction", "title")
      .sort({ createdAt: -1 });
    res.json(complaints);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const resolveComplaint = async (req, res) => {
  try {
    const { status, resolution } = req.body;
    const complaint = await Complaint.findById(req.params.id);
    if (!complaint) return res.status(404).json({ message: "Complaint not found" });

    complaint.status = status;
    complaint.resolution = resolution;
    complaint.resolvedBy = req.user.id;
    complaint.resolvedAt = new Date();
    await complaint.save();

    // If resolved against a seller, penalise trust score
    if (status === "resolved") {
      const targetUser = await User.findById(complaint.against);
      if (targetUser) {
        targetUser.totalComplaints = (targetUser.totalComplaints || 0) + 1;
        await targetUser.save();
        await recalculateTrustScore(complaint.against);
      }
    }

    res.json(complaint);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// POST /api/admin/complaints — any user can file a complaint
export const fileComplaint = async (req, res) => {
  try {
    const { againstUserId, auctionId, reason, description } = req.body;
    const complaint = await Complaint.create({
      reporter: req.user.id,
      against: againstUserId,
      auction: auctionId,
      reason,
      description,
    });
    res.status(201).json(complaint);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ── VERIFICATION ──────────────────────────────────────
export const getVerificationRequests = async (req, res) => {
  try {
    const users = await User.find({ "verification.status": "pending" })
      .select("-password")
      .sort({ "verification.submittedAt": 1 });
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const approveVerification = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    user.isVerified = true;
    user.verification.status = "approved";
    user.verification.reviewedAt = new Date();
    user.verification.reviewedBy = req.user.id;
    await user.save();
    await recalculateTrustScore(user._id);

    await createNotification({
      userId: user._id,
      type: "verification_approved",
      title: "Verification approved",
      message: "Your identity has been verified. Your trust score has been updated.",
    });

    res.json({ message: "User verified", user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const rejectVerification = async (req, res) => {
  try {
    const { reason } = req.body;
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    user.isVerified = false;
    user.verification.status = "rejected";
    user.verification.rejectionReason = reason;
    user.verification.reviewedAt = new Date();
    user.verification.reviewedBy = req.user.id;
    await user.save();

    await createNotification({
      userId: user._id,
      type: "verification_rejected",
      title: "Verification rejected",
      message: `Your verification was rejected. Reason: ${reason}`,
    });

    res.json({ message: "Verification rejected", user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};