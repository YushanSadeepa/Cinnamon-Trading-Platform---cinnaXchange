import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../services/api";
import socket from "../../services/socket";

const statusColors = {
  active: { bg: "#EAF3DE", color: "#3B6D11" },
  ended: { bg: "#FAEEDA", color: "#854F0B" },
  awaiting_meeting: { bg: "#E6F1FB", color: "#185FA5" },
  completed: { bg: "#EEEDFE", color: "#534AB7" },
  cancelled: { bg: "#FCEBEB", color: "#A32D2D" },
};

function CountdownTimer({ endTime }) {
  const calc = () => {
    const diff = new Date(endTime) - Date.now();
    if (diff <= 0) return null;
    const h = Math.floor(diff / 3600000);
    const m = Math.floor((diff % 3600000) / 60000);
    const s = Math.floor((diff % 60000) / 1000);
    return { h, m, s };
  };
  const [time, setTime] = useState(calc());
  useEffect(() => {
    const t = setInterval(() => setTime(calc()), 1000);
    return () => clearInterval(t);
  }, [endTime]);
  if (!time) return <span style={{ color: "#A32D2D", fontSize: 12, fontWeight: 600 }}>Ended</span>;
  return (
    <span style={{ fontFamily: "monospace", fontSize: 13, color: "#3D1C02", fontWeight: 600 }}>
      {String(time.h).padStart(2, "0")}:{String(time.m).padStart(2, "0")}:{String(time.s).padStart(2, "0")}
    </span>
  );
}

export default function AuctionList() {
  const [auctions, setAuctions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("active");

  useEffect(() => {
    fetchAuctions();
  }, [filter]);

  // Live bid updates from Socket.io
  useEffect(() => {
    socket.on("bid_update", ({ auctionId, highestBid }) => {
      setAuctions((prev) =>
        prev.map((a) =>
          a._id === auctionId ? { ...a, currentHighestBid: highestBid } : a
        )
      );
    });
    return () => socket.off("bid_update");
  }, []);

  const fetchAuctions = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/auctions?status=${filter}`);
      setAuctions(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600;700&family=Inter:wght@300;400;500;600&display=swap');
        .al-app { min-height:100vh; background:#FBF6EF; font-family:'Inter',sans-serif; }
        .al-header { background:#3D1C02; padding:20px 36px; }
        .al-title { font-family:'Playfair Display',serif; font-size:26px; font-weight:700; color:#F7F0E6; }
        .al-subtitle { font-size:13px; color:rgba(247,240,230,0.6); margin-top:4px; }
        .al-filters { padding:14px 36px; background:#fff; border-bottom:1px solid #EBDFCD; display:flex; gap:8px; }
        .al-filter-pill { padding:6px 16px; border-radius:20px; border:1.5px solid #E0CDB8; background:#fff; font-size:13px; font-weight:500; color:#6B4C35; cursor:pointer; transition:all 0.15s; text-transform:capitalize; }
        .al-filter-pill.active { background:#3D1C02; color:#F7F0E6; border-color:#3D1C02; }
        .al-filter-pill:hover:not(.active) { border-color:#C8722A; color:#C8722A; }
        .al-body { padding:28px 36px; }
        .al-grid { display:grid; grid-template-columns:repeat(auto-fill,minmax(300px,1fr)); gap:20px; }
        .al-card { background:#fff; border:1px solid #EBDFCD; border-radius:14px; overflow:hidden; transition:box-shadow 0.2s; }
        .al-card:hover { box-shadow:0 4px 20px rgba(61,28,2,0.1); }
        .al-img { width:100%; height:160px; object-fit:cover; background:#F3E9D8; display:flex; align-items:center; justify-content:center; }
        .al-card-body { padding:16px; }
        .al-card-top { display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:6px; }
        .al-card-title { font-size:15px; font-weight:600; color:#3D1C02; line-height:1.3; }
        .al-status { font-size:11px; font-weight:600; padding:3px 10px; border-radius:12px; flex-shrink:0; text-transform:capitalize; }
        .al-grade { font-size:12px; color:#8C6C52; margin-bottom:10px; }
        .al-bid-section { background:#FBF6EF; border-radius:10px; padding:12px; margin-bottom:12px; }
        .al-bid-label { font-size:11px; color:#8C6C52; margin-bottom:4px; text-transform:uppercase; letter-spacing:0.06em; font-weight:600; }
        .al-bid-amount { font-family:'Playfair Display',serif; font-size:22px; font-weight:700; color:#C8722A; }
        .al-timer-row { display:flex; justify-content:space-between; align-items:center; margin-top:8px; }
        .al-timer-label { font-size:11px; color:#8C6C52; }
        .al-seller-row { display:flex; align-items:center; justify-content:space-between; padding-top:10px; border-top:1px solid #F3E9D8; margin-bottom:12px; }
        .al-seller-name { font-size:13px; font-weight:500; color:#3D1C02; }
        .al-verified { display:inline-flex; align-items:center; gap:3px; font-size:11px; color:#3B6D11; background:#EAF3DE; padding:2px 8px; border-radius:10px; }
        .al-btn { width:100%; height:38px; background:#3D1C02; color:#F7F0E6; border:none; border-radius:9px; font-size:14px; font-weight:600; cursor:pointer; transition:background 0.2s; text-decoration:none; display:flex; align-items:center; justify-content:center; }
        .al-btn:hover { background:#5A2A04; }
        .al-empty { text-align:center; padding:60px; color:#8C6C52; }
        .al-empty-title { font-family:'Playfair Display',serif; font-size:20px; color:#3D1C02; margin-bottom:8px; }
        .al-live-dot { width:8px; height:8px; border-radius:50%; background:#3B6D11; display:inline-block; margin-right:5px; animation:pulse 1.4s ease-in-out infinite; }
        @keyframes pulse { 0%,100%{opacity:1}50%{opacity:0.3} }
      `}</style>

      <div className="al-app">
        <div className="al-header">
          <h1 className="al-title">Live Auctions</h1>
          <p className="al-subtitle">Real-time cinnamon auctions from verified sellers</p>
        </div>

        <div className="al-filters">
          {["active", "ended", "awaiting_meeting", "completed"].map((s) => (
            <button
              key={s}
              className={`al-filter-pill${filter === s ? " active" : ""}`}
              onClick={() => setFilter(s)}
            >
              {s === "awaiting_meeting" ? "Awaiting meeting" : s}
            </button>
          ))}
        </div>

        <div className="al-body">
          {loading ? (
            <div style={{ textAlign: "center", padding: 60, color: "#8C6C52" }}>Loading auctions…</div>
          ) : auctions.length === 0 ? (
            <div className="al-empty">
              <div className="al-empty-title">No auctions found</div>
              <p>Check back soon for new listings</p>
            </div>
          ) : (
            <div className="al-grid">
              {auctions.map((a) => {
                const sc = statusColors[a.status] || statusColors.active;
                return (
                  <div key={a._id} className="al-card">
                    {a.product?.images?.[0] ? (
                      <img src={a.product.images[0]} alt={a.title} className="al-img" />
                    ) : (
                      <div className="al-img">
                        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#B08060" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                          <rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/>
                        </svg>
                      </div>
                    )}
                    <div className="al-card-body">
                      <div className="al-card-top">
                        <div className="al-card-title">{a.title}</div>
                        <span className="al-status" style={{ background: sc.bg, color: sc.color }}>
                          {a.status === "active" && <span className="al-live-dot" />}
                          {a.status === "awaiting_meeting" ? "Meeting" : a.status}
                        </span>
                      </div>
                      <div className="al-grade">
                        {a.product?.grade && `Grade ${a.product.grade}`}
                        {a.product?.cinnamonType && ` · ${a.product.cinnamonType}`}
                      </div>

                      <div className="al-bid-section">
                        <div className="al-bid-label">Current highest bid</div>
                        <div className="al-bid-amount">LKR {a.currentHighestBid?.toLocaleString()}</div>
                        {a.status === "active" && (
                          <div className="al-timer-row">
                            <span className="al-timer-label">Time left</span>
                            <CountdownTimer endTime={a.endTime} />
                          </div>
                        )}
                      </div>

                      <div className="al-seller-row">
                        <div>
                          <div className="al-seller-name">{a.seller?.fullName}</div>
                          {a.seller?.isVerified && (
                            <span className="al-verified">
                              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                              Verified
                            </span>
                          )}
                        </div>
                        <span style={{ fontSize: 13, color: "#8C6C52" }}>
                          Trust {a.seller?.trustScore ?? "—"}
                        </span>
                      </div>

                      <Link to={`/auction/${a._id}`} className="al-btn">
                        {a.status === "active" ? "Place bid" : "View details"}
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
