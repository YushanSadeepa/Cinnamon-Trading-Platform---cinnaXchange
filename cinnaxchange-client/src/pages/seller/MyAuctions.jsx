import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../services/api";

const statusColors = {
  active: { bg: "#EAF3DE", color: "#3B6D11" },
  ended: { bg: "#FAEEDA", color: "#854F0B" },
  awaiting_meeting: { bg: "#E6F1FB", color: "#185FA5" },
  completed: { bg: "#EEEDFE", color: "#534AB7" },
  cancelled: { bg: "#FCEBEB", color: "#A32D2D" },
};

export default function MyAuctions() {
  const [auctions, setAuctions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cancelling, setCancelling] = useState(null);

  const load = () => {
    api.get("/auctions/my-auctions")
      .then((r) => setAuctions(r.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const cancel = async (id) => {
    if (!window.confirm("Cancel this auction?")) return;
    setCancelling(id);
    try {
      await api.delete(`/auctions/${id}`);
      load();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to cancel");
    } finally {
      setCancelling(null);
    }
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&family=Inter:wght@300;400;500;600&display=swap');
        .ma-app { min-height:100vh; background:#FBF6EF; font-family:'Inter',sans-serif; }
        .ma-header { background:#3D1C02; padding:24px 36px; display:flex; justify-content:space-between; align-items:center; }
        .ma-title { font-family:'Playfair Display',serif; font-size:26px; font-weight:700; color:#F7F0E6; }
        .ma-sub { font-size:13px; color:rgba(247,240,230,0.6); margin-top:4px; }
        .ma-create-btn { display:inline-flex; align-items:center; gap:7px; height:38px; padding:0 16px; background:#C8722A; color:#F7F0E6; border:none; border-radius:9px; font-size:13px; font-weight:600; text-decoration:none; cursor:pointer; }
        .ma-create-btn:hover { background:#A85C20; }
        .ma-body { padding:28px 36px; max-width:900px; }
        .ma-card { background:#fff; border:1px solid #EBDFCD; border-radius:12px; padding:20px; margin-bottom:14px; }
        .ma-top { display:flex; justify-content:space-between; align-items:flex-start; flex-wrap:wrap; gap:10px; margin-bottom:14px; }
        .ma-auction-title { font-size:16px; font-weight:600; color:#3D1C02; }
        .ma-status { font-size:11px; font-weight:600; padding:3px 10px; border-radius:12px; text-transform:capitalize; }
        .ma-details { display:grid; grid-template-columns:repeat(4,1fr); gap:12px; margin-bottom:14px; }
        @media(max-width:700px){.ma-details{grid-template-columns:repeat(2,1fr);}}
        .ma-detail { background:#FBF6EF; border-radius:8px; padding:10px 12px; }
        .ma-dlabel { font-size:11px; color:#8C6C52; font-weight:600; text-transform:uppercase; letter-spacing:0.05em; margin-bottom:3px; }
        .ma-dval { font-size:14px; font-weight:600; color:#3D1C02; }
        .ma-actions { display:flex; gap:8px; }
        .ma-btn { height:34px; padding:0 14px; border-radius:8px; font-size:13px; font-weight:600; cursor:pointer; border:none; }
        .ma-btn-danger { background:#FEF2EC; color:#993C1D; border:1px solid #F5C4B3; }
        .ma-btn-danger:hover { background:#F5C4B3; }
        .ma-btn-view { background:#FBF6EF; color:#3D1C02; border:1.5px solid #EBDFCD; text-decoration:none; display:inline-flex; align-items:center; }
        .ma-btn-view:hover { border-color:#C8722A; color:#C8722A; }
        .ma-winner { background:#EAF3DE; border-radius:8px; padding:10px 12px; font-size:13px; color:#27500A; display:flex; align-items:center; gap:6px; margin-bottom:12px; }
        .ma-empty { text-align:center; padding:60px; color:#8C6C52; }
        .ma-empty-title { font-family:'Playfair Display',serif; font-size:20px; color:#3D1C02; margin-bottom:8px; }
      `}</style>

      <div className="ma-app">
        <div className="ma-header">
          <div>
            <h1 className="ma-title">My Auctions</h1>
            <p className="ma-sub">Manage your live and past auctions</p>
          </div>
          <Link to="/create-auction" className="ma-create-btn">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
            New auction
          </Link>
        </div>

        <div className="ma-body">
          {loading ? (
            <p style={{ color: "#8C6C52" }}>Loading…</p>
          ) : auctions.length === 0 ? (
            <div className="ma-empty">
              <div className="ma-empty-title">No auctions yet</div>
              <p>Create your first auction to start receiving bids</p>
            </div>
          ) : (
            auctions.map((a) => {
              const sc = statusColors[a.status] || statusColors.active;
              return (
                <div key={a._id} className="ma-card">
                  <div className="ma-top">
                    <span className="ma-auction-title">{a.title}</span>
                    <span className="ma-status" style={{ background: sc.bg, color: sc.color }}>
                      {a.status === "awaiting_meeting" ? "Awaiting meeting" : a.status}
                    </span>
                  </div>
                  {a.winner && (
                    <div className="ma-winner">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M8.21 13.89 7 23l5-3 5 3-1.21-9.12"/><circle cx="12" cy="8" r="6"/></svg>
                      Winner: {a.winner?.fullName}
                    </div>
                  )}
                  <div className="ma-details">
                    <div className="ma-detail"><div className="ma-dlabel">Highest bid</div><div className="ma-dval" style={{ color: "#C8722A" }}>LKR {a.currentHighestBid?.toLocaleString()}</div></div>
                    <div className="ma-detail"><div className="ma-dlabel">Product</div><div className="ma-dval">{a.product?.title}</div></div>
                    <div className="ma-detail"><div className="ma-dlabel">Ends</div><div className="ma-dval">{new Date(a.endTime).toLocaleDateString("en-LK", { day: "numeric", month: "short" })}</div></div>
                    <div className="ma-detail"><div className="ma-dlabel">Grade</div><div className="ma-dval">{a.product?.grade || "—"}</div></div>
                  </div>
                  <div className="ma-actions">
                    <Link to={`/auction/${a._id}`} className="ma-btn ma-btn-view">View room</Link>
                    {a.status === "active" && (
                      <button className="ma-btn ma-btn-danger" disabled={cancelling === a._id} onClick={() => cancel(a._id)}>
                        {cancelling === a._id ? "Cancelling…" : "Cancel"}
                      </button>
                    )}
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
