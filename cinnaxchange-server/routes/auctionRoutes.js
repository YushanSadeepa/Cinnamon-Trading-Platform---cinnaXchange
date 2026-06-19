import express from "express";
import {
  getAuctions, getAuctionById, getMyAuctions, getWonAuctions,
  getAwaitingMeetings, getCompletedSales,
  createAuction, updateAuction, deleteAuction, completeAuction,
} from "../controllers/auctionController.js";
import { authMiddleware, requireRole } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", getAuctions);                                                          // public
router.get("/won", authMiddleware, requireRole("buyer"), getWonAuctions);
router.get("/my-auctions", authMiddleware, requireRole("seller"), getMyAuctions);
router.get("/awaiting-meeting", authMiddleware, requireRole("seller"), getAwaitingMeetings);
router.get("/completed-sales", authMiddleware, requireRole("seller"), getCompletedSales);
router.get("/:id", getAuctionById);                                                    // public
router.post("/", authMiddleware, requireRole("seller"), createAuction);
router.put("/:id", authMiddleware, requireRole("seller"), updateAuction);
router.delete("/:id", authMiddleware, requireRole("seller"), deleteAuction);
router.post("/:id/complete", authMiddleware, requireRole("seller"), completeAuction);

export default router;