import express from "express";
import { getMyBids, getAuctionBids, placeBid } from "../controllers/bidController.js";
import { authMiddleware, requireRole } from "../middleware/authMiddleware.js";

const router = express.Router();
router.get("/my-bids", authMiddleware, requireRole("buyer"), getMyBids);
router.get("/auction/:auctionId", authMiddleware, getAuctionBids);
router.post("/", authMiddleware, requireRole("buyer"), placeBid);
export default router;
