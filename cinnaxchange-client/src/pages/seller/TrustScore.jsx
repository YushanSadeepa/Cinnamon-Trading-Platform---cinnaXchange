import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import api from "../../services/api";

export default function TrustScore() {
  const { user } = useSelector((s) => s.auth);
  const [data, setData] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.get(`/users/trust/${user._id}`),
      api.get(`/reviews/seller/${user._id}`),
    ]).then(([t, r]) => { setData(t.data); setReviews(r.data); })
      .catch(console.error).finally(() => setLoading(false));
  }, [user._id]);

  const breakdown = [
    { label: "Identity verified (KYC)", max: 30, earned: data?.isVerified ? 30 : 0, color: "#3B6D11" },
    { label: "Completed sales (×5 each, max 40)", max: 40, earned: Math.min((data?.completedSales || 0) * 5, 40), color: "#185FA5" },
    { label: "Average rating (×4, max 20)", max: 20, earned: Math.min(Math.round((data?.ratings?.average || 0) * 4), 20), color: "#C8722A" },
    { label: "Complaints penalty (×5 each)", max: 20, earned: Math.min((data?.totalComplaints || 0) * 5, 20), color: "#A32D2D", penalty: true },
  ];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&family=Inter:wght@300;400;500;600&display=swap');
        .ts-app{min-height:100vh;background:#FBF6EF;font-family:'Inter',sans-serif;}
        .ts-header{background:#3D1C02;padding:24px 36px;}
        .ts-title{font-family:'Playfair Display',serif;font-size:26px;font-weight:700;color:#F7F0E6;}
        .ts-sub{font-size:13px;color:rgba(247,240,230,0.6);margin-top:4px;}
        .ts-body{padding:28px 36px;display:grid;grid-template-columns:1fr 1fr;gap:24px;max-width:900px;}
        @media(max-width:700px){.ts-body{grid-template-columns:1fr;}}
        .ts-card{background:#fff;border:1px solid #EBDFCD;border-radius:14px;padding:24px;margin-bottom:20px;}
        .ts-card-title{font-family:'Playfair Display',serif;font-size:17px;font-weight:700;color:#3D1C02;margin-bottom:18px;}
        .ts-score-big{font-family:'Playfair Display',serif;font-size:64px;font-weight:700;color:#C8722A;line-height:1;margin-bottom:6px;}
        .ts-score-sub{font-size:13px;color:#8C6C52;}
        .ts-bar-wrap{margin-bottom:16px;}
        .ts-bar-header{display:flex;justify-content:space-between;align-items:center;margin-bottom:6px;font-size:13px;}
        .ts-bar-label{color:#6B4C35;font-weight:500;}
        .ts-bar-vals{font-weight:600;color:#3D1C02;}
        .ts-track{height:10px;background:#F3E9D8;border-radius:5px;overflow:hidden;}
        .ts-fill{height:100%;border-radius:5px;transition:width 0.6s;}
        .ts-breakdown-item{display:flex;justify-content:space-between;align-items:center;padding:10px 0;border-bottom:1px solid #F3E9D8;}
        .ts-breakdown-item:last-child{border-bottom:none;}
        .ts-bitem-label{font-size:13px;color:#6B4C35;}
        .ts-bitem-pts{font-size:14px;font-weight:700;}
        .ts-review-item{padding:12px 0;border-bottom:1px solid #F3E9D8;}
        .ts-review-item:last-child{border-bottom:none;}
        .ts-reviewer{font-size:13px;font-weight:600;color:#3D1C02;}
        .ts-review-comment{font-size:13px;color:#6B4C35;margin-top:4px;line-height:1.5;}
        .ts-stars{display:inline-flex;gap:2px;margin-top:4px;}
      `}</style>

      <div className="ts-app">
        <div className="ts-header">
          <h1 className="ts-title">Trust score</h1>
          <p className="ts-sub">How buyers see your credibility</p>
        </div>
        {loading ? <p style={{ color: "#8C6C52", padding: 36 }}>Loading…</p> : (
          <div className="ts-body">
            <div>
              <div className="ts-card">
                <div className="ts-card-title">Your score</div>
                <div className="ts-score-big">{data?.trustScore ?? 0}</div>
                <div className="ts-score-sub">out of 100</div>
                <div style={{ marginTop: 16 }}>
                  <div className="ts-track" style={{ height: 14, borderRadius: 7 }}>
                    <div className="ts-fill" style={{ width: `${data?.trustScore ?? 0}%`, background: "linear-gradient(90deg,#C8722A,#D4A853)" }} />
                  </div>
                </div>
              </div>

              <div className="ts-card">
                <div className="ts-card-title">Score breakdown</div>
                {breakdown.map((b) => (
                  <div key={b.label} className="ts-breakdown-item">
                    <span className="ts-bitem-label">{b.label}</span>
                    <span className="ts-bitem-pts" style={{ color: b.penalty ? "#A32D2D" : b.color }}>
                      {b.penalty ? `-${b.earned}` : `+${b.earned}`} / {b.max}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <div className="ts-card">
                <div className="ts-card-title">How to improve</div>
                {!data?.isVerified && <p style={{ fontSize: 13, color: "#6B4C35", marginBottom: 10, lineHeight: 1.6 }}>📋 <strong>Submit KYC verification</strong> to earn +30 points instantly.</p>}
                <p style={{ fontSize: 13, color: "#6B4C35", marginBottom: 10, lineHeight: 1.6 }}>✅ <strong>Complete more sales</strong> — each completed transaction adds +5 points (up to 40).</p>
                <p style={{ fontSize: 13, color: "#6B4C35", marginBottom: 10, lineHeight: 1.6 }}>⭐ <strong>Earn good reviews</strong> — higher ratings add up to +20 points.</p>
                <p style={{ fontSize: 13, color: "#6B4C35", lineHeight: 1.6 }}>⚠️ <strong>Avoid complaints</strong> — each upheld complaint deducts -5 points.</p>
              </div>

              <div className="ts-card">
                <div className="ts-card-title">Recent reviews ({reviews.length})</div>
                {reviews.length === 0 ? (
                  <p style={{ fontSize: 13, color: "#8C6C52", textAlign: "center", padding: "12px 0" }}>No reviews yet</p>
                ) : reviews.slice(0, 6).map((r) => (
                  <div key={r._id} className="ts-review-item">
                    <div className="ts-reviewer">{r.reviewer?.fullName}</div>
                    <div className="ts-stars">
                      {[1,2,3,4,5].map((s) => (
                        <svg key={s} width="13" height="13" viewBox="0 0 24 24"
                          fill={s <= r.rating ? "#C8722A" : "none"} stroke="#C8722A"
                          strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                          <polygon points="12 2 15.1 8.3 22 9.3 17 14.1 18.2 21 12 17.8 5.8 21 7 14.1 2 9.3 8.9 8.3"/>
                        </svg>
                      ))}
                    </div>
                    {r.comment && <div className="ts-review-comment">{r.comment}</div>}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
