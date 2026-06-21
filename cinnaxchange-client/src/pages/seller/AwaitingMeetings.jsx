import { useEffect, useState } from "react";
import api from "../../services/api";

export default function AwaitingMeetings() {
  const [auctions, setAuctions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [completing, setCompleting] = useState(null);

  const load = () =>
    api.get("/auctions/awaiting-meeting")
      .then((r) => setAuctions(r.data))
      .catch(console.error)
      .finally(() => setLoading(false));

  useEffect(() => { load(); }, []);

  const markComplete = async (id) => {
    if (!window.confirm("Confirm that the physical transaction has been completed?")) return;
    setCompleting(id);
    try {
      await api.post(`/auctions/${id}/complete`);
      load();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to complete");
    } finally {
      setCompleting(null);
    }
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&family=Inter:wght@300;400;500;600&display=swap');
        .am-app{min-height:100vh;background:#FBF6EF;font-family:'Inter',sans-serif;}
        .am-header{background:#3D1C02;padding:24px 36px;}
        .am-title{font-family:'Playfair Display',serif;font-size:26px;font-weight:700;color:#F7F0E6;}
        .am-sub{font-size:13px;color:rgba(247,240,230,0.6);margin-top:4px;}
        .am-body{padding:28px 36px;max-width:860px;}
        .am-card{background:#fff;border:1px solid #EBDFCD;border-radius:14px;overflow:hidden;margin-bottom:20px;}
        .am-card-top{padding:20px;display:flex;gap:14px;align-items:flex-start;}
        .am-img{width:68px;height:68px;border-radius:8px;object-fit:cover;background:#F3E9D8;flex-shrink:0;display:flex;align-items:center;justify-content:center;}
        .am-content{flex:1;}
        .am-auction-title{font-size:15px;font-weight:600;color:#3D1C02;margin-bottom:4px;}
        .am-winning-bid{font-family:'Playfair Display',serif;font-size:20px;font-weight:700;color:#C8722A;}
        .am-divider{height:1px;background:#F3E9D8;}
        .am-winner-section{padding:16px 20px;background:#FBF6EF;}
        .am-section-label{font-size:11px;font-weight:600;text-transform:uppercase;letter-spacing:0.07em;color:#8C6C52;margin-bottom:10px;}
        .am-contact-grid{display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:14px;}
        .am-contact-item{background:#fff;border:1px solid #EBDFCD;border-radius:9px;padding:12px;}
        .am-contact-label{font-size:11px;color:#8C6C52;margin-bottom:3px;}
        .am-contact-val{font-size:14px;font-weight:600;color:#3D1C02;}
        .am-note{background:#FAEEDA;border:1px solid #E8C88A;border-radius:8px;padding:12px 14px;font-size:13px;color:#633806;margin-bottom:14px;display:flex;gap:8px;align-items:flex-start;}
        .am-complete-btn{display:flex;align-items:center;gap:7px;height:40px;padding:0 18px;background:#3D1C02;color:#F7F0E6;border:none;border-radius:9px;font-size:14px;font-weight:600;cursor:pointer;}
        .am-complete-btn:hover:not(:disabled){background:#5A2A04;}
        .am-complete-btn:disabled{opacity:0.6;cursor:not-allowed;}
        .am-empty{text-align:center;padding:60px;color:#8C6C52;}
        .am-empty-title{font-family:'Playfair Display',serif;font-size:20px;color:#3D1C02;margin-bottom:8px;}
      `}</style>

      <div className="am-app">
        <div className="am-header">
          <h1 className="am-title">Awaiting meetings</h1>
          <p className="am-sub">Auctions waiting for physical transaction confirmation</p>
        </div>
        <div className="am-body">
          {loading ? <p style={{ color: "#8C6C52" }}>Loading…</p>
            : auctions.length === 0 ? (
              <div className="am-empty">
                <div className="am-empty-title">No pending meetings</div>
                <p>Auctions waiting for physical meetings will appear here</p>
              </div>
            ) : auctions.map((a) => (
              <div key={a._id} className="am-card">
                <div className="am-card-top">
                  {a.product?.images?.[0]
                    ? <img src={a.product.images[0]} alt="" className="am-img" />
                    : <div className="am-img"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#B08060" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg></div>
                  }
                  <div className="am-content">
                    <div className="am-auction-title">{a.title}</div>
                    <div className="am-winning-bid">LKR {a.winningBid?.toLocaleString()}</div>
                    <div style={{ fontSize: 13, color: "#8C6C52", marginTop: 4 }}>{a.product?.grade && `Grade ${a.product.grade}`}</div>
                  </div>
                </div>
                <div className="am-divider" />
                <div className="am-winner-section">
                  <div className="am-section-label">Winner contact details</div>
                  <div className="am-contact-grid">
                    <div className="am-contact-item"><div className="am-contact-label">Name</div><div className="am-contact-val">{a.winner?.fullName}</div></div>
                    <div className="am-contact-item"><div className="am-contact-label">Mobile</div><div className="am-contact-val">{a.winner?.mobile || "Not provided"}</div></div>
                    <div className="am-contact-item"><div className="am-contact-label">Email</div><div className="am-contact-val" style={{ fontSize: 13 }}>{a.winner?.email}</div></div>
                    <div className="am-contact-item"><div className="am-contact-label">Quantity</div><div className="am-contact-val">{a.product?.quantity} kg</div></div>
                  </div>
                  <div className="am-note">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, marginTop: 1 }}><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                    After the physical handover is complete, click the button below to confirm. This allows the buyer to leave a review and updates your trust score.
                  </div>
                  <button className="am-complete-btn" disabled={completing === a._id} onClick={() => markComplete(a._id)}>
                    {completing === a._id ? "Confirming…" : (
                      <><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>Confirm transaction completed</>
                    )}
                  </button>
                </div>
              </div>
            ))
          }
        </div>
      </div>
    </>
  );
}
