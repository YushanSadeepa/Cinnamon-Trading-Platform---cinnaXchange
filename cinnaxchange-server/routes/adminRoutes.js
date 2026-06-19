import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { adminOnly } from "../middleware/adminMiddleware.js";
import User from "../models/User.js";

const router = express.Router();

router.get("/users", protect, adminOnly, async (req, res) => {
  const users = await User.find().select("-password");
  res.json(users);
});

router.put("/suspend/:id", protect, adminOnly, async (req, res) => {
  await User.findByIdAndUpdate(req.params.id, { isVerified: false });
  res.json({ message: "User suspended" });
});

export default router;