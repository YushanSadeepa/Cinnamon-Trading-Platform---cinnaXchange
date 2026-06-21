import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";

const GRADES = ["Alba", "C5", "C4", "C3", "M5", "H1", "Hamburg"];
const TYPES = ["Ceylon True Cinnamon", "Cassia", "Korintje", "Saigon"];

export default function CreateListing() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    title: "", cinnamonType: "", grade: "", quantity: "", price: "",
    dryingDays: "", description: "", location: "", latitude: "", longitude: "",
    isBuyNow: false, isAuction: false,
  });
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const handleSubmit = async () => {
    setError("");
    if (!form.title || !form.grade || !form.quantity || !form.price || !form.location) {
      return setError("Please fill in all required fields");
    }
    setLoading(true);
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => fd.append(k, v));
      images.forEach((img) => fd.append("images", img));
      await api.post("/products", fd, { headers: { "Content-Type": "multipart/form-data" } });
      navigate("/my-products");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create listing");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&family=Inter:wght@300;400;500;600&display=swap');
        .cl-app { min-height:100vh; background:#FBF6EF; font-family:'Inter',sans-serif; }
        .cl-header { background:#3D1C02; padding:24px 36px; }
        .cl-title { font-family:'Playfair Display',serif; font-size:26px; font-weight:700; color:#F7F0E6; }
        .cl-sub { font-size:13px; color:rgba(247,240,230,0.6); margin-top:4px; }
        .cl-body { padding:28px 36px; max-width:760px; }
        .cl-card { background:#fff; border:1px solid #EBDFCD; border-radius:14px; padding:24px; margin-bottom:20px; }
        .cl-card-title { font-family:'Playfair Display',serif; font-size:16px; font-weight:700; color:#3D1C02; margin-bottom:18px; }
        .cl-grid { display:grid; grid-template-columns:1fr 1fr; gap:16px; }
        .cl-field { display:flex; flex-direction:column; gap:7px; }
        .cl-field.full { grid-column:1/-1; }
        .cl-label { font-size:12px; font-weight:600; text-transform:uppercase; letter-spacing:0.07em; color:#6B4C35; }
        .cl-label span { color:#A32D2D; }
        .cl-input,.cl-select,.cl-textarea { width:100%; padding:0 14px; border:1.5px solid #E0CDB8; border-radius:9px; font-family:'Inter',sans-serif; font-size:14px; color:#3D1C02; outline:none; background:#fff; box-sizing:border-box; }
        .cl-input { height:44px; }
        .cl-select { height:44px; }
        .cl-textarea { height:100px; padding:12px 14px; resize:none; }
        .cl-input:focus,.cl-select:focus,.cl-textarea:focus { border-color:#C8722A; box-shadow:0 0 0 3px rgba(200,114,42,0.1); }
        .cl-toggle-row { display:flex; gap:12px; }
        .cl-toggle { flex:1; border:1.5px solid #E0CDB8; border-radius:10px; padding:14px; cursor:pointer; transition:all 0.15s; text-align:center; }
        .cl-toggle.on { border-color:#C8722A; background:#FEF6EE; }
        .cl-toggle-title { font-size:13px; font-weight:600; color:#3D1C02; margin-bottom:3px; }
        .cl-toggle-desc { font-size:11px; color:#8C6C52; }
        .cl-img-drop { border:2px dashed #E0CDB8; border-radius:10px; padding:24px; text-align:center; cursor:pointer; transition:border-color 0.15s; }
        .cl-img-drop:hover { border-color:#C8722A; }
        .cl-img-drop-text { font-size:13px; color:#8C6C52; margin-top:8px; }
        .cl-img-previews { display:flex; gap:8px; flex-wrap:wrap; margin-top:12px; }
        .cl-img-preview { width:72px; height:72px; border-radius:8px; object-fit:cover; border:1px solid #EBDFCD; }
        .cl-map-hint { background:#E6F1FB; border:1px solid #B8D4F0; border-radius:9px; padding:12px 14px; font-size:13px; color:#185FA5; margin-bottom:14px; display:flex; gap:8px; align-items:flex-start; }
        .cl-coords-row { display:grid; grid-template-columns:1fr 1fr; gap:12px; margin-top:12px; }
        .cl-error { background:#FEF2EC; border:1px solid #F5C4B3; border-radius:8px; padding:10px 14px; font-size:13px; color:#993C1D; margin-bottom:16px; }
        .cl-btn { width:100%; height:48px; background:#3D1C02; color:#F7F0E6; border:none; border-radius:10px; font-size:15px; font-weight:600; cursor:pointer; transition:background 0.2s; }
        .cl-btn:hover:not(:disabled) { background:#5A2A04; }
        .cl-btn:disabled { opacity:0.6; cursor:not-allowed; }
      `}</style>

      <div className="cl-app">
        <div className="cl-header">
          <h1 className="cl-title">Create listing</h1>
          <p className="cl-sub">Add your cinnamon to the marketplace</p>
        </div>

        <div className="cl-body">
          {error && <div className="cl-error">{error}</div>}

          {/* Basic details */}
          <div className="cl-card">
            <div className="cl-card-title">Product details</div>
            <div className="cl-grid">
              <div className="cl-field full">
                <label className="cl-label">Title <span>*</span></label>
                <input className="cl-input" placeholder="e.g. Premium Alba Cinnamon Quills" value={form.title} onChange={(e) => set("title", e.target.value)} />
              </div>
              <div className="cl-field">
                <label className="cl-label">Cinnamon type <span>*</span></label>
                <select className="cl-select" value={form.cinnamonType} onChange={(e) => set("cinnamonType", e.target.value)}>
                  <option value="">Select type…</option>
                  {TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
              <div className="cl-field">
                <label className="cl-label">Grade <span>*</span></label>
                <select className="cl-select" value={form.grade} onChange={(e) => set("grade", e.target.value)}>
                  <option value="">Select grade…</option>
                  {GRADES.map((g) => <option key={g} value={g}>{g}</option>)}
                </select>
              </div>
              <div className="cl-field">
                <label className="cl-label">Quantity (kg) <span>*</span></label>
                <input className="cl-input" type="number" min="0" placeholder="0" value={form.quantity} onChange={(e) => set("quantity", e.target.value)} />
              </div>
              <div className="cl-field">
                <label className="cl-label">Price (LKR/kg) <span>*</span></label>
                <input className="cl-input" type="number" min="0" placeholder="0" value={form.price} onChange={(e) => set("price", e.target.value)} />
              </div>
              <div className="cl-field">
                <label className="cl-label">Drying days</label>
                <input className="cl-input" type="number" min="0" placeholder="0" value={form.dryingDays} onChange={(e) => set("dryingDays", e.target.value)} />
              </div>
              <div className="cl-field full">
                <label className="cl-label">Description</label>
                <textarea className="cl-textarea" placeholder="Describe your product quality, harvest method, certifications…" value={form.description} onChange={(e) => set("description", e.target.value)} />
              </div>
            </div>
          </div>

          {/* Listing type */}
          <div className="cl-card">
            <div className="cl-card-title">Listing type</div>
            <div className="cl-toggle-row">
              <div className={`cl-toggle${form.isBuyNow ? " on" : ""}`} onClick={() => set("isBuyNow", !form.isBuyNow)}>
                <div className="cl-toggle-title">Buy Now</div>
                <div className="cl-toggle-desc">Buyers can purchase directly at the listed price</div>
              </div>
              <div className={`cl-toggle${form.isAuction ? " on" : ""}`} onClick={() => set("isAuction", !form.isAuction)}>
                <div className="cl-toggle-title">Auction</div>
                <div className="cl-toggle-desc">Buyers bid competitively — highest bid wins</div>
              </div>
            </div>
          </div>

          {/* Images */}
          <div className="cl-card">
            <div className="cl-card-title">Product images</div>
            <label htmlFor="cl-img-input">
              <div className="cl-img-drop">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#B08060" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/>
                </svg>
                <div className="cl-img-drop-text">Click to upload images (JPG, PNG)</div>
              </div>
            </label>
            <input id="cl-img-input" type="file" multiple accept="image/*" style={{ display: "none" }} onChange={(e) => setImages(Array.from(e.target.files))} />
            {images.length > 0 && (
              <div className="cl-img-previews">
                {images.map((img, i) => (
                  <img key={i} src={URL.createObjectURL(img)} className="cl-img-preview" alt="" />
                ))}
              </div>
            )}
          </div>

          {/* Location */}
          <div className="cl-card">
            <div className="cl-card-title">Location</div>
            <div className="cl-map-hint">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, marginTop: 1 }}>
                <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
              </svg>
              Enter your farm or warehouse address and coordinates so buyers can find your location on the map.
            </div>
            <div className="cl-field" style={{ marginBottom: 12 }}>
              <label className="cl-label">Location name <span>*</span></label>
              <input className="cl-input" placeholder="e.g. Matale, Central Province" value={form.location} onChange={(e) => set("location", e.target.value)} />
            </div>
            <div className="cl-coords-row">
              <div className="cl-field">
                <label className="cl-label">Latitude</label>
                <input className="cl-input" type="number" step="any" placeholder="e.g. 7.4675" value={form.latitude} onChange={(e) => set("latitude", e.target.value)} />
              </div>
              <div className="cl-field">
                <label className="cl-label">Longitude</label>
                <input className="cl-input" type="number" step="any" placeholder="e.g. 80.7718" value={form.longitude} onChange={(e) => set("longitude", e.target.value)} />
              </div>
            </div>
            <p style={{ fontSize: 12, color: "#8C6C52", marginTop: 8 }}>
              Tip: Find your coordinates at{" "}
              <a href="https://maps.google.com" target="_blank" rel="noreferrer" style={{ color: "#C8722A" }}>maps.google.com</a>
              {" "}— right-click your location and copy the numbers shown.
            </p>
          </div>

          <button className="cl-btn" onClick={handleSubmit} disabled={loading}>
            {loading ? "Creating listing…" : "Create listing"}
          </button>
        </div>
      </div>
    </>
  );
}
