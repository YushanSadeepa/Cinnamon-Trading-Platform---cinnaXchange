import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { adminOnly } from "../middleware/adminMiddleware.js";
import User from "../models/User.js";

const router = express.Router();

// Get all users
router.get("/users", protect, adminOnly, async (req, res) => {
  const users = await User.find().select("-password");
  res.json(users);
});

// Suspend user (simple example)
router.put("/suspend/:id", protect, adminOnly, async (req, res) => {
  await User.findByIdAndUpdate(req.params.id, { isVerified: false });
  res.json({ message: "User suspended" });
});

export default router;