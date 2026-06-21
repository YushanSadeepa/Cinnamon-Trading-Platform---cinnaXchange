import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../services/api";

const statusConfig = {
  active:           { bg: "#EAF3DE", color: "#3B6D11", label: "Active" },
  ended:            { bg: "#FAEEDA", color: "#854F0B", label: "Ended" },
  awaiting_meeting: { bg: "#E6F1FB", color: "#185FA5", label: "Awaiting meeting" },
  completed:        { bg: "#EEEDFE", color: "#534AB7", label: "Completed" },
  cancelled:        { bg: "#FCEBEB", color: "#A32D2D", label: "Cancelled" },
};

export default function MyBids() {
  const [bids, setBids] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/bids/my-bids")
      .then((r) => setBids(r.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&family=Inter:wght@300;400;500;600&display=swap');
        .mb-app { min-height:100vh; background:#FBF6EF; font-family:'Inter',sans-serif; }
        .mb-header { background:#3D1C02; padding:24px 36px; }
        .mb-title { font-family:'Playfair Display',serif; font-size:26px; font-weight:700; color:#F7F0E6; }
        .mb-sub { font-size:13px; color:rgba(247,240,230,0.6); margin-top:4px; }
        .mb-body { padding:28px 36px; max-width:900px; }
        .mb-card { background:#fff; border:1px solid #EBDFCD; border-radius:12px; padding:20px; margin-bottom:14px; display:flex; gap:16px; align-items:flex-start; }
        .mb-img { width:72px; height:72px; border-radius:8px; object-fit:cover; background:#F3E9D8; flex-shrink:0; display:flex; align-items:center; justify-content:center; }
        .mb-content { flex:1; min-width:0; }
        .mb-top { display:flex; justify-content:space-between; align-items:flex-start; flex-wrap:wrap; gap:8px; margin-bottom:8px; }
        .mb-auction-title { font-size:15px; font-weight:600; color:#3D1C02; }
        .mb-status { font-size:11px; font-weight:600; padding:3px 10px; border-radius:12px; }
        .mb-details { display:flex; gap:24px; flex-wrap:wrap; }
        .mb-detail { display:flex; flex-direction:column; gap:2px; }
        .mb-detail-label { font-size:11px; color:#8C6C52; text-transform:uppercase; letter-spacing:0.06em; font-weight:600; }
        .mb-detail-val { font-size:14px; font-weight:600; color:#3D1C02; }
        .mb-my-bid { color:#C8722A; }
        .mb-winning { color:#3B6D11; }
        .mb-losing { color:#A32D2D; }
        .mb-link { font-size:13px; color:#C8722A; font-weight:500; text-decoration:none; margin-top:10px; display:inline-flex; align-items:center; gap:5px; }
        .mb-link:hover { text-decoration:underline; }
        .mb-empty { text-align:center; padding:60px; color:#8C6C52; }
        .mb-empty-title { font-family:'Playfair Display',serif; font-size:20px; color:#3D1C02; margin-bottom:8px; }
      `}</style>

      <div className="mb-app">
        <div className="mb-header">
          <h1 className="mb-title">My Bids</h1>
          <p className="mb-sub">Track all your auction activity</p>
        </div>

        <div className="mb-body">
          {loading ? (
            <p style={{ color: "#8C6C52", padding: 20 }}>Loading…</p>
          ) : bids.length === 0 ? (
            <div className="mb-empty">
              <div className="mb-empty-title">No bids yet</div>
              <p>Head to the auctions page to start bidding</p>
              <Link to="/auctions" style={{ color: "#C8722A", fontWeight: 600 }}>Browse auctions →</Link>
            </div>
          ) : (
            bids.map((b) => {
              const sc = statusConfig[b.auction?.status] || statusConfig.active;
              const isHighest = b.isWinning;
              const auctionEnded = b.auction?.status !== "active";
              return (
                <div key={b._id} className="mb-card">
                  {b.auction?.product?.images?.[0] ? (
                    <img src={b.auction.product.images[0]} alt="" className="mb-img" />
                  ) : (
                    <div className="mb-img">
                      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#B08060" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/>
                      </svg>
                    </div>
                  )}
                  <div className="mb-content">
                    <div className="mb-top">
                      <span className="mb-auction-title">{b.auction?.title}</span>
                      <span className="mb-status" style={{ background: sc.bg, color: sc.color }}>{sc.label}</span>
                    </div>
                    <div className="mb-details">
                      <div className="mb-detail">
                        <span className="mb-detail-label">Your bid</span>
                        <span className={`mb-detail-val mb-my-bid`}>LKR {b.amount?.toLocaleString()}</span>
                      </div>
                      <div className="mb-detail">
                        <span className="mb-detail-label">Highest bid</span>
                        <span className="mb-detail-val">LKR {b.auction?.currentHighestBid?.toLocaleString()}</span>
                      </div>
                      <div className="mb-detail">
                        <span className="mb-detail-label">Position</span>
                        <span className={`mb-detail-val ${isHighest ? "mb-winning" : "mb-losing"}`}>
                          {isHighest ? (auctionEnded ? "🏆 Winner" : "Highest") : "Outbid"}
                        </span>
                      </div>
                      <div className="mb-detail">
                        <span className="mb-detail-label">Grade</span>
                        <span className="mb-detail-val">{b.auction?.product?.grade || "—"}</span>
                      </div>
                    </div>
                    <Link to={`/auction/${b.auction?._id}`} className="mb-link">
                      View auction
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
                    </Link>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </>
  );
}
