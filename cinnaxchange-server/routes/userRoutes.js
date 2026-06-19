import express from "express";
import User from "../models/User.js";
import { calculateTrustScore } from "../utils/trustScore.js";

const router = express.Router();

router.get("/trust/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    const score = calculateTrustScore(user);

    res.json({
      success: true,
      trustScore: score,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});

export default router;