import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";

export default function CreateAuction() {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState({ productId: "", title: "", startingPrice: "", startTime: "", endTime: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    api.get("/products/my-products").then((r) => setProducts(r.data)).catch(console.error);
  }, []);

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const submit = async () => {
    setError("");
    if (!form.productId || !form.title || !form.startingPrice || !form.startTime || !form.endTime) {
      return setError("Please fill in all fields");
    }
    if (new Date(form.endTime) <= new Date(form.startTime)) {
      return setError("End time must be after start time");
    }
    setLoading(true);
    try {
      await api.post("/auctions", form);
      navigate("/my-auctions");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create auction");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&family=Inter:wght@300;400;500;600&display=swap');
        .ca-app { min-height:100vh; background:#FBF6EF; font-family:'Inter',sans-serif; }
        .ca-header { background:#3D1C02; padding:24px 36px; }
        .ca-title { font-family:'Playfair Display',serif; font-size:26px; font-weight:700; color:#F7F0E6; }
        .ca-sub { font-size:13px; color:rgba(247,240,230,0.6); margin-top:4px; }
        .ca-body { padding:28px 36px; max-width:640px; }
        .ca-card { background:#fff; border:1px solid #EBDFCD; border-radius:14px; padding:24px; }
        .ca-card-title { font-family:'Playfair Display',serif; font-size:17px; font-weight:700; color:#3D1C02; margin-bottom:20px; }
        .ca-field { margin-bottom:18px; }
        .ca-label { display:block; font-size:12px; font-weight:600; text-transform:uppercase; letter-spacing:0.07em; color:#6B4C35; margin-bottom:7px; }
        .ca-label span { color:#A32D2D; }
        .ca-input,.ca-select { width:100%; height:44px; padding:0 14px; border:1.5px solid #E0CDB8; border-radius:9px; font-family:'Inter',sans-serif; font-size:14px; color:#3D1C02; outline:none; background:#fff; box-sizing:border-box; }
        .ca-input:focus,.ca-select:focus { border-color:#C8722A; box-shadow:0 0 0 3px rgba(200,114,42,0.1); }
        .ca-grid { display:grid; grid-template-columns:1fr 1fr; gap:16px; }
        .ca-error { background:#FEF2EC; border:1px solid #F5C4B3; border-radius:8px; padding:10px 14px; font-size:13px; color:#993C1D; margin-bottom:16px; }
        .ca-btn { width:100%; height:48px; background:#3D1C02; color:#F7F0E6; border:none; border-radius:10px; font-size:15px; font-weight:600; cursor:pointer; margin-top:4px; }
        .ca-btn:hover:not(:disabled) { background:#5A2A04; }
        .ca-btn:disabled { opacity:0.6; cursor:not-allowed; }
      `}</style>

      <div className="ca-app">
        <div className="ca-header">
          <h1 className="ca-title">Create auction</h1>
          <p className="ca-sub">Set up a live bidding auction for your cinnamon</p>
        </div>
        <div className="ca-body">
          {error && <div className="ca-error">{error}</div>}
          <div className="ca-card">
            <div className="ca-card-title">Auction details</div>
            <div className="ca-field">
              <label className="ca-label">Product <span>*</span></label>
              <select className="ca-select" value={form.productId} onChange={(e) => set("productId", e.target.value)}>
                <option value="">Select a product…</option>
                {products.map((p) => <option key={p._id} value={p._id}>{p.title} — Grade {p.grade}</option>)}
              </select>
            </div>
            <div className="ca-field">
              <label className="ca-label">Auction title <span>*</span></label>
              <input className="ca-input" placeholder="e.g. Alba Cinnamon Live Auction" value={form.title} onChange={(e) => set("title", e.target.value)} />
            </div>
            <div className="ca-field">
              <label className="ca-label">Starting price (LKR) <span>*</span></label>
              <input className="ca-input" type="number" min="1" placeholder="0" value={form.startingPrice} onChange={(e) => set("startingPrice", e.target.value)} />
            </div>
            <div className="ca-grid">
              <div className="ca-field">
                <label className="ca-label">Start time <span>*</span></label>
                <input className="ca-input" type="datetime-local" value={form.startTime} onChange={(e) => set("startTime", e.target.value)} />
              </div>
              <div className="ca-field">
                <label className="ca-label">End time <span>*</span></label>
                <input className="ca-input" type="datetime-local" value={form.endTime} onChange={(e) => set("endTime", e.target.value)} />
              </div>
            </div>
            <button className="ca-btn" onClick={submit} disabled={loading}>
              {loading ? "Creating…" : "Create auction"}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
