import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cors from "cors";
import http from "http";
import { Server } from "socket.io";

import authRoutes from "./routes/authRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import noCache from "./middleware/noCache.js";

dotenv.config();

const app = express();

/**
 * =========================
 * MIDDLEWARE
 * =========================
 */

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

app.use(express.json());
app.use(noCache);

/**
 * =========================
 * HTTP SERVER + SOCKET.IO
 * =========================
 */

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
    credentials: true,
  },
});

/**
 * =========================
 * DATABASE CONNECTION
 * =========================
 */

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

/**
 * =========================
 * API ROUTES
 * =========================
 */

app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);

/**
 * =========================
 * TEST ROUTE
 * =========================
 */

app.get("/", (req, res) => {
  res.send("CinnaXchange API Running");
});

/**
 * =========================
 * SOCKET.IO AUCTION SYSTEM
 * =========================
 */

let auctions = {};

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  // JOIN AUCTION
  socket.on("join_auction", (auctionId) => {
    socket.join(auctionId);
    console.log(`User ${socket.id} joined auction ${auctionId}`);
  });

  // LEAVE AUCTION
  socket.on("leave_auction", (auctionId) => {
    socket.leave(auctionId);
    console.log(`User ${socket.id} left auction ${auctionId}`);
  });

  // PLACE BID
  socket.on("place_bid", ({ auctionId, user, amount }) => {
    const current = auctions[auctionId];

    if (!current) {
      auctions[auctionId] = {
        highestBid: amount,
        bidder: user,
      };
    } else {
      if (amount <= current.highestBid) {
        socket.emit("bid_error", "Bid must be higher than current bid");
        return;
      }

      auctions[auctionId] = {
        highestBid: amount,
        bidder: user,
      };
    }

    io.to(auctionId).emit("bid_update", {
      auctionId,
      highestBid: auctions[auctionId].highestBid,
      bidder: auctions[auctionId].bidder,
    });
  });

  // GET CURRENT AUCTION STATUS
  socket.on("get_auction_status", (auctionId) => {
    const status = auctions[auctionId] || {
      highestBid: 0,
      bidder: null,
    };

    socket.emit("auction_status", {
      auctionId,
      ...status,
    });
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

/**
 * =========================
 * SERVER START
 * =========================
 */

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});