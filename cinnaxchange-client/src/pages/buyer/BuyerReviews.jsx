import { useEffect, useState } from "react";
import api from "../../services/api";

function StarPicker({ value, onChange }) {
  const [hover, setHover] = useState(0);
  return (
    <span style={{ display: "inline-flex", gap: 4, cursor: "pointer" }}>
      {[1,2,3,4,5].map((s) => (
        <svg
          key={s}
          width="24" height="24" viewBox="0 0 24 24"
          fill={s <= (hover || value) ? "#C8722A" : "none"}
          stroke="#C8722A" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"
          onMouseEnter={() => setHover(s)}
          onMouseLeave={() => setHover(0)}
          onClick={() => onChange(s)}
          style={{ transition: "fill 0.1s" }}
        >
          <polygon points="12 2 15.1 8.3 22 9.3 17 14.1 18.2 21 12 17.8 5.8 21 7 14.1 2 9.3 8.9 8.3"/>
        </svg>
      ))}
    </span>
  );
}

export default function BuyerReviews() {
  const [wonAuctions, setWonAuctions] = useState([]);
  const [myReviews, setMyReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ auctionId: "", rating: 0, comment: "" });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    Promise.all([
      api.get("/auctions/won"),
      api.get("/reviews/my-reviews"),
    ]).then(([w, r]) => {
      setWonAuctions(w.data);
      setMyReviews(r.data);
    }).catch(console.error).finally(() => setLoading(false));
  }, []);

  const reviewedIds = new Set(myReviews.map((r) => r.auction?._id));
  const reviewable = wonAuctions.filter((a) => a.status === "completed" && !reviewedIds.has(a._id));

  const submit = async () => {
    if (!form.auctionId) return setError("Select an auction");
    if (form.rating === 0) return setError("Please select a rating");
    setError(""); setSubmitting(true);
    try {
      await api.post("/reviews", form);
      setSuccess("Review submitted!");
      setForm({ auctionId: "", rating: 0, comment: "" });
      const r = await api.get("/reviews/my-reviews");
      setMyReviews(r.data);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to submit");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&family=Inter:wght@300;400;500;600&display=swap');
        .br-app { min-height:100vh; background:#FBF6EF; font-family:'Inter',sans-serif; }
        .br-header { background:#3D1C02; padding:24px 36px; }
        .br-title { font-family:'Playfair Display',serif; font-size:26px; font-weight:700; color:#F7F0E6; }
        .br-sub { font-size:13px; color:rgba(247,240,230,0.6); margin-top:4px; }
        .br-body { padding:28px 36px; display:grid; grid-template-columns:1fr 1fr; gap:24px; max-width:1000px; }
        @media(max-width:700px){.br-body{grid-template-columns:1fr;}}
        .br-card { background:#fff; border:1px solid #EBDFCD; border-radius:14px; padding:22px; }
        .br-card-title { font-family:'Playfair Display',serif; font-size:18px; font-weight:700; color:#3D1C02; margin-bottom:18px; }
        .br-label { font-size:12px; font-weight:600; text-transform:uppercase; letter-spacing:0.07em; color:#6B4C35; margin-bottom:7px; display:block; }
        .br-select { width:100%; height:44px; padding:0 14px; border:1.5px solid #E0CDB8; border-radius:9px; background:#fff; font-family:'Inter',sans-serif; font-size:14px; color:#3D1C02; outline:none; margin-bottom:16px; }
        .br-select:focus { border-color:#C8722A; box-shadow:0 0 0 3px rgba(200,114,42,0.1); }
        .br-rating-row { margin-bottom:16px; }
        .br-textarea { width:100%; height:100px; padding:12px; border:1.5px solid #E0CDB8; border-radius:9px; font-family:'Inter',sans-serif; font-size:14px; color:#3D1C02; outline:none; resize:none; margin-bottom:16px; box-sizing:border-box; }
        .br-textarea:focus { border-color:#C8722A; box-shadow:0 0 0 3px rgba(200,114,42,0.1); }
        .br-btn { width:100%; height:44px; background:#3D1C02; color:#F7F0E6; border:none; border-radius:9px; font-size:14px; font-weight:600; cursor:pointer; }
        .br-btn:hover:not(:disabled) { background:#5A2A04; }
        .br-btn:disabled { opacity:0.6; cursor:not-allowed; }
        .br-error { background:#FEF2EC; border:1px solid #F5C4B3; border-radius:8px; padding:10px 14px; font-size:13px; color:#993C1D; margin-bottom:12px; }
        .br-success { background:#EAF3DE; border:1px solid #B8D4A0; border-radius:8px; padding:10px 14px; font-size:13px; color:#27500A; margin-bottom:12px; }
        .br-review-item { padding:14px 0; border-bottom:1px solid #F3E9D8; }
        .br-review-item:last-child { border-bottom:none; }
        .br-review-top { display:flex; justify-content:space-between; align-items:center; margin-bottom:4px; }
        .br-review-auction { font-size:13px; font-weight:600; color:#3D1C02; }
        .br-review-date { font-size:11px; color:#B08060; }
        .br-review-stars { display:inline-flex; gap:2px; margin-bottom:5px; }
        .br-review-comment { font-size:13px; color:#6B4C35; line-height:1.6; }
        .br-empty { font-size:13px; color:#8C6C52; text-align:center; padding:24px 0; }
      `}</style>

      <div className="br-app">
        <div className="br-header">
          <h1 className="br-title">Ratings & Reviews</h1>
          <p className="br-sub">Share your experience with sellers</p>
        </div>

        <div className="br-body">
          {/* Submit form */}
          <div className="br-card">
            <div className="br-card-title">Leave a review</div>
            {loading ? <p style={{ color: "#8C6C52", fontSize: 13 }}>Loading…</p> : reviewable.length === 0 ? (
              <p style={{ color: "#8C6C52", fontSize: 13, lineHeight: 1.6 }}>
                Reviews are only available after a seller confirms a completed transaction.
                Complete an auction transaction to leave feedback.
              </p>
            ) : (
              <>
                {error && <div className="br-error">{error}</div>}
                {success && <div className="br-success">{success}</div>}
                <label className="br-label">Auction</label>
                <select
                  className="br-select"
                  value={form.auctionId}
                  onChange={(e) => setForm({ ...form, auctionId: e.target.value })}
                >
                  <option value="">Select a completed auction…</option>
                  {reviewable.map((a) => (
                    <option key={a._id} value={a._id}>{a.title}</option>
                  ))}
                </select>
                <label className="br-label">Rating</label>
                <div className="br-rating-row">
                  <StarPicker value={form.rating} onChange={(r) => setForm({ ...form, rating: r })} />
                </div>
                <label className="br-label">Comment (optional)</label>
                <textarea
                  className="br-textarea"
                  placeholder="Describe your experience with this seller…"
                  value={form.comment}
                  onChange={(e) => setForm({ ...form, comment: e.target.value })}
                />
                <button className="br-btn" onClick={submit} disabled={submitting}>
                  {submitting ? "Submitting…" : "Submit review"}
                </button>
              </>
            )}
          </div>

          {/* Past reviews */}
          <div className="br-card">
            <div className="br-card-title">My reviews ({myReviews.length})</div>
            {myReviews.length === 0 ? (
              <div className="br-empty">You haven't submitted any reviews yet</div>
            ) : (
              myReviews.map((r) => (
                <div key={r._id} className="br-review-item">
                  <div className="br-review-top">
                    <span className="br-review-auction">{r.auction?.title}</span>
                    <span className="br-review-date">{new Date(r.createdAt).toLocaleDateString("en-LK", { day: "numeric", month: "short", year: "numeric" })}</span>
                  </div>
                  <div className="br-review-stars">
                    {[1,2,3,4,5].map((s) => (
                      <svg key={s} width="14" height="14" viewBox="0 0 24 24"
                        fill={s <= r.rating ? "#C8722A" : "none"}
                        stroke="#C8722A" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                        <polygon points="12 2 15.1 8.3 22 9.3 17 14.1 18.2 21 12 17.8 5.8 21 7 14.1 2 9.3 8.9 8.3"/>
                      </svg>
                    ))}
                  </div>
                  <div style={{ fontSize: 12, color: "#8C6C52", marginBottom: 4 }}>
                    Seller: {r.seller?.fullName}
                  </div>
                  {r.comment && <div className="br-review-comment">{r.comment}</div>}
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </>
  );
}
