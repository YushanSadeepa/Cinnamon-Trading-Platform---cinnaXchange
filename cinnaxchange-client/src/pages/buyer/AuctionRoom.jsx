import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import api from "../../services/api";
import socket from "../../services/socket";

function Countdown({ endTime }) {
  const calc = () => {
    const diff = new Date(endTime) - Date.now();
    if (diff <= 0) return null;
    const h = Math.floor(diff / 3600000);
    const m = Math.floor((diff % 3600000) / 60000);
    const s = Math.floor((diff % 60000) / 1000);
    return { h, m, s, urgent: diff < 300000 }; // red under 5 min
  };
  const [t, setT] = useState(calc());
  useEffect(() => {
    const id = setInterval(() => setT(calc()), 1000);
    return () => clearInterval(id);
  }, [endTime]);
  if (!t) return <span style={{ color: "#A32D2D", fontWeight: 700 }}>Auction ended</span>;
  const fmt = (n) => String(n).padStart(2, "0");
  return (
    <span style={{ fontFamily: "monospace", fontSize: 28, fontWeight: 700, color: t.urgent ? "#A32D2D" : "#3D1C02" }}>
      {fmt(t.h)}:{fmt(t.m)}:{fmt(t.s)}
    </span>
  );
}

export default function AuctionRoom() {
  const { id } = useParams();
  const { user } = useSelector((s) => s.auth);
  const navigate = useNavigate();

  const [auction, setAuction] = useState(null);
  const [bids, setBids] = useState([]);
  const [bidAmount, setBidAmount] = useState("");
  const [loading, setLoading] = useState(true);
  const [placing, setPlacing] = useState(false);
  const [error, setError] = useState("");
  const [flash, setFlash] = useState(false);

  useEffect(() => {
    fetchAuction();
    fetchBids();
    socket.emit("join_auction", id);
    socket.emit("get_auction_status", id);

    socket.on("bid_update", ({ auctionId, highestBid }) => {
      if (auctionId !== id) return;
      setAuction((a) => a ? { ...a, currentHighestBid: highestBid } : a);
      setFlash(true);
      setTimeout(() => setFlash(false), 800);
      fetchBids();
    });

    socket.on("bid_error", (msg) => {
      setError(msg);
      setPlacing(false);
    });

    return () => {
      socket.emit("leave_auction", id);
      socket.off("bid_update");
      socket.off("bid_error");
    };
  }, [id]);

  const fetchAuction = async () => {
    try {
      const res = await api.get(`/auctions/${id}`);
      setAuction(res.data);
      setBidAmount(res.data.currentHighestBid + 1);
    } catch { navigate("/auctions"); }
    finally { setLoading(false); }
  };

  const fetchBids = async () => {
    try {
      const res = await api.get(`/bids/auction/${id}`);
      setBids(res.data);
    } catch {/* silent */}
  };

  const placeBid = async () => {
    setError("");
    if (!bidAmount || Number(bidAmount) <= (auction?.currentHighestBid || 0)) {
      setError(`Bid must be higher than LKR ${auction?.currentHighestBid?.toLocaleString()}`);
      return;
    }
    setPlacing(true);
    try {
      await api.post("/bids", { auctionId: id, amount: Number(bidAmount) });
      // Socket will broadcast; we also emit for real-time
      socket.emit("place_bid", { auctionId: id, userId: user._id, amount: Number(bidAmount) });
    } catch (err) {
      setError(err.response?.data?.message || "Failed to place bid");
      setPlacing(false);
    }
  };

  if (loading) return <div style={{ padding: 60, textAlign: "center", color: "#8C6C52", fontFamily: "Inter, sans-serif" }}>Loading auction…</div>;
  if (!auction) return null;

  const isActive = auction.status === "active" && new Date() < new Date(auction.endTime);
  const isSeller = user?._id === auction.seller?._id;
  const minBid = (auction.currentHighestBid || auction.startingPrice) + 1;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600;700&family=Inter:wght@300;400;500;600&display=swap');
        .ar-app { min-height:100vh; background:#FBF6EF; font-family:'Inter',sans-serif; padding:32px; }
        .ar-grid { display:grid; grid-template-columns:1fr 360px; gap:24px; max-width:1100px; margin:0 auto; }
        @media(max-width:800px){.ar-grid{grid-template-columns:1fr;}}
        .ar-card { background:#fff; border:1px solid #EBDFCD; border-radius:14px; padding:24px; }
        .ar-img { width:100%; height:260px; object-fit:cover; border-radius:10px; background:#F3E9D8; margin-bottom:20px; display:flex; align-items:center; justify-content:center; }
        .ar-eyebrow { font-size:11px; text-transform:uppercase; letter-spacing:0.1em; color:#C8722A; font-weight:600; margin-bottom:8px; }
        .ar-title { font-family:'Playfair Display',serif; font-size:24px; font-weight:700; color:#3D1C02; margin-bottom:12px; }
        .ar-meta-grid { display:grid; grid-template-columns:1fr 1fr; gap:10px; margin-bottom:20px; }
        .ar-meta-item { background:#FBF6EF; border-radius:9px; padding:12px; }
        .ar-meta-label { font-size:11px; color:#8C6C52; font-weight:600; text-transform:uppercase; letter-spacing:0.06em; margin-bottom:4px; }
        .ar-meta-val { font-size:14px; font-weight:600; color:#3D1C02; }
        .ar-section-title { font-size:13px; font-weight:600; color:#6B4C35; text-transform:uppercase; letter-spacing:0.08em; margin-bottom:12px; }
        .ar-bid-box { text-align:center; padding:20px; background:#FBF6EF; border-radius:12px; margin-bottom:20px; }
        .ar-bid-label { font-size:12px; color:#8C6C52; text-transform:uppercase; letter-spacing:0.08em; margin-bottom:6px; font-weight:600; }
        .ar-bid-amount { font-family:'Playfair Display',serif; font-size:34px; font-weight:700; transition:color 0.3s; }
        .ar-bid-amount.flash { color:#C8722A; }
        .ar-timer-box { text-align:center; margin-bottom:20px; }
        .ar-timer-label { font-size:12px; color:#8C6C52; margin-bottom:6px; }
        .ar-input-row { display:flex; gap:10px; margin-bottom:12px; }
        .ar-input { flex:1; height:46px; padding:0 14px; border:1.5px solid #E0CDB8; border-radius:10px; font-size:15px; font-family:'Inter',sans-serif; color:#3D1C02; outline:none; }
        .ar-input:focus { border-color:#C8722A; box-shadow:0 0 0 3px rgba(200,114,42,0.1); }
        .ar-btn { height:46px; padding:0 20px; background:#3D1C02; color:#F7F0E6; border:none; border-radius:10px; font-size:14px; font-weight:600; cursor:pointer; transition:background 0.2s; white-space:nowrap; }
        .ar-btn:hover:not(:disabled) { background:#5A2A04; }
        .ar-btn:disabled { opacity:0.6; cursor:not-allowed; }
        .ar-error { background:#FEF2EC; border:1px solid #F5C4B3; border-radius:8px; padding:10px 14px; font-size:13px; color:#993C1D; margin-bottom:12px; }
        .ar-seller-card { background:#FBF6EF; border-radius:10px; padding:14px; margin-bottom:16px; }
        .ar-seller-name { font-size:14px; font-weight:600; color:#3D1C02; margin-bottom:4px; }
        .ar-verified { display:inline-flex; align-items:center; gap:3px; font-size:11px; color:#3B6D11; background:#EAF3DE; padding:2px 8px; border-radius:10px; }
        .ar-bid-history-item { display:flex; justify-content:space-between; align-items:center; padding:10px 0; border-bottom:1px solid #F3E9D8; }
        .ar-bid-history-item:last-child { border-bottom:none; }
        .ar-bid-winner { font-size:11px; color:#3B6D11; background:#EAF3DE; padding:2px 8px; border-radius:10px; font-weight:600; }
      `}</style>

      <div className="ar-app">
        <div className="ar-grid">
          {/* Left: auction details */}
          <div>
            <div className="ar-card">
              {auction.product?.images?.[0] ? (
                <img src={auction.product.images[0]} alt={auction.title} className="ar-img" />
              ) : (
                <div className="ar-img">
                  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#B08060" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/>
                  </svg>
                </div>
              )}
              <div className="ar-eyebrow">Live auction · {auction.status}</div>
              <div className="ar-title">{auction.title}</div>
              <div className="ar-meta-grid">
                <div className="ar-meta-item"><div className="ar-meta-label">Grade</div><div className="ar-meta-val">{auction.product?.grade || "—"}</div></div>
                <div className="ar-meta-item"><div className="ar-meta-label">Type</div><div className="ar-meta-val">{auction.product?.cinnamonType || "—"}</div></div>
                <div className="ar-meta-item"><div className="ar-meta-label">Quantity</div><div className="ar-meta-val">{auction.product?.quantity} kg</div></div>
                <div className="ar-meta-item"><div className="ar-meta-label">Starting price</div><div className="ar-meta-val">LKR {auction.startingPrice?.toLocaleString()}</div></div>
              </div>
              {auction.product?.description && (
                <p style={{ fontSize: 14, color: "#6B4C35", lineHeight: 1.6 }}>{auction.product.description}</p>
              )}
            </div>
          </div>

          {/* Right: bidding panel */}
          <div>
            {/* Timer */}
            <div className="ar-card" style={{ marginBottom: 16 }}>
              <div className="ar-timer-box">
                <div className="ar-timer-label">{isActive ? "Time remaining" : "Auction ended"}</div>
                {isActive && <Countdown endTime={auction.endTime} />}
                {!isActive && <span style={{ fontSize: 14, color: "#8C6C52" }}>{new Date(auction.endTime).toLocaleString("en-LK")}</span>}
              </div>
              <div className="ar-bid-box">
                <div className="ar-bid-label">Current highest bid</div>
                <div className={`ar-bid-amount${flash ? " flash" : ""}`} style={{ color: flash ? "#C8722A" : "#3D1C02" }}>
                  LKR {auction.currentHighestBid?.toLocaleString()}
                </div>
              </div>

              {isActive && !isSeller && (
                <>
                  {error && <div className="ar-error">{error}</div>}
                  <div className="ar-input-row">
                    <input
                      type="number"
                      className="ar-input"
                      min={minBid}
                      value={bidAmount}
                      onChange={(e) => setBidAmount(e.target.value)}
                      placeholder={`Min LKR ${minBid?.toLocaleString()}`}
                    />
                    <button className="ar-btn" onClick={placeBid} disabled={placing}>
                      {placing ? "…" : "Bid"}
                    </button>
                  </div>
                  <p style={{ fontSize: 12, color: "#8C6C52", textAlign: "center" }}>
                    Minimum bid: LKR {minBid?.toLocaleString()}
                  </p>
                </>
              )}
              {isSeller && <p style={{ fontSize: 13, color: "#8C6C52", textAlign: "center" }}>This is your auction</p>}
            </div>

            {/* Seller info */}
            <div className="ar-card" style={{ marginBottom: 16 }}>
              <div className="ar-section-title">Seller</div>
              <div className="ar-seller-card">
                <div className="ar-seller-name">{auction.seller?.fullName}</div>
                {auction.seller?.isVerified && (
                  <span className="ar-verified">
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                    Verified
                  </span>
                )}
                <div style={{ fontSize: 13, color: "#8C6C52", marginTop: 6 }}>
                  Trust score: <strong style={{ color: "#C8722A" }}>{auction.seller?.trustScore ?? "—"}</strong>
                </div>
              </div>
            </div>

            {/* Bid history */}
            <div className="ar-card">
              <div className="ar-section-title">Bid history ({bids.length})</div>
              {bids.length === 0 ? (
                <p style={{ fontSize: 13, color: "#8C6C52", textAlign: "center", padding: "16px 0" }}>No bids yet — be the first!</p>
              ) : (
                bids.map((b, i) => (
                  <div key={b._id} className="ar-bid-history-item">
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 600, color: "#3D1C02" }}>{b.bidder?.fullName}</div>
                      <div style={{ fontSize: 11, color: "#B08060" }}>{new Date(b.createdAt).toLocaleTimeString("en-LK")}</div>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <span style={{ fontWeight: 600, color: "#3D1C02" }}>LKR {b.amount?.toLocaleString()}</span>
                      {i === 0 && <span className="ar-bid-winner">Highest</span>}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
