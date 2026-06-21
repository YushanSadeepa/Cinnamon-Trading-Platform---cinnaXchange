import { useEffect, useState } from "react";
import api from "../../services/api";

export default function CompletedSales() {
  const [sales, setSales] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/auctions/completed-sales").then((r) => setSales(r.data)).catch(console.error).finally(() => setLoading(false));
  }, []);

  const total = sales.reduce((sum, s) => sum + (s.winningBid || 0), 0);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&family=Inter:wght@300;400;500;600&display=swap');
        .cs-app{min-height:100vh;background:#FBF6EF;font-family:'Inter',sans-serif;}
        .cs-header{background:#3D1C02;padding:24px 36px;}
        .cs-title{font-family:'Playfair Display',serif;font-size:26px;font-weight:700;color:#F7F0E6;}
        .cs-sub{font-size:13px;color:rgba(247,240,230,0.6);margin-top:4px;}
        .cs-body{padding:28px 36px;max-width:900px;}
        .cs-summary{display:grid;grid-template-columns:repeat(3,1fr);gap:14px;margin-bottom:24px;}
        .cs-stat{background:#fff;border:1px solid #EBDFCD;border-radius:12px;padding:18px;}
        .cs-stat-val{font-family:'Playfair Display',serif;font-size:26px;font-weight:700;color:#3D1C02;}
        .cs-stat-label{font-size:12px;color:#8C6C52;margin-top:4px;}
        .cs-card{background:#fff;border:1px solid #EBDFCD;border-radius:12px;padding:18px;margin-bottom:12px;display:flex;gap:14px;align-items:center;}
        .cs-img{width:60px;height:60px;border-radius:8px;object-fit:cover;background:#F3E9D8;flex-shrink:0;display:flex;align-items:center;justify-content:center;}
        .cs-content{flex:1;}
        .cs-row{display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:8px;}
        .cs-auction-title{font-size:14px;font-weight:600;color:#3D1C02;}
        .cs-amount{font-family:'Playfair Display',serif;font-size:18px;font-weight:700;color:#C8722A;}
        .cs-meta{display:flex;gap:16px;margin-top:6px;flex-wrap:wrap;}
        .cs-meta-item{font-size:12px;color:#8C6C52;}
        .cs-empty{text-align:center;padding:60px;color:#8C6C52;}
        .cs-empty-title{font-family:'Playfair Display',serif;font-size:20px;color:#3D1C02;margin-bottom:8px;}
      `}</style>

      <div className="cs-app">
        <div className="cs-header">
          <h1 className="cs-title">Completed sales</h1>
          <p className="cs-sub">Your confirmed transactions</p>
        </div>
        <div className="cs-body">
          <div className="cs-summary">
            <div className="cs-stat"><div className="cs-stat-val">{sales.length}</div><div className="cs-stat-label">Completed sales</div></div>
            <div className="cs-stat"><div className="cs-stat-val">LKR {total.toLocaleString()}</div><div className="cs-stat-label">Total revenue</div></div>
            <div className="cs-stat"><div className="cs-stat-val">{sales.length > 0 ? Math.round(total / sales.length).toLocaleString() : 0}</div><div className="cs-stat-label">Avg sale (LKR)</div></div>
          </div>

          {loading ? <p style={{ color: "#8C6C52" }}>Loading…</p>
            : sales.length === 0 ? (
              <div className="cs-empty"><div className="cs-empty-title">No completed sales yet</div><p>Confirm meetings to move auctions to completed</p></div>
            ) : sales.map((s) => (
              <div key={s._id} className="cs-card">
                {s.product?.images?.[0]
                  ? <img src={s.product.images[0]} alt="" className="cs-img" />
                  : <div className="cs-img"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#B08060" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg></div>
                }
                <div className="cs-content">
                  <div className="cs-row">
                    <span className="cs-auction-title">{s.title}</span>
                    <span className="cs-amount">LKR {s.winningBid?.toLocaleString()}</span>
                  </div>
                  <div className="cs-meta">
                    <span className="cs-meta-item">Buyer: {s.winner?.fullName}</span>
                    <span className="cs-meta-item">Grade: {s.product?.grade}</span>
                    <span className="cs-meta-item">Completed: {s.completedAt ? new Date(s.completedAt).toLocaleDateString("en-LK", { day: "numeric", month: "short", year: "numeric" }) : "—"}</span>
                  </div>
                </div>
              </div>
            ))
          }
        </div>
      </div>
    </>
  );
}
