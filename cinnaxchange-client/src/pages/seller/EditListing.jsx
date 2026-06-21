import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../services/api";

const GRADES = ["Alba", "C5", "C4", "C3", "M5", "H1", "Hamburg"];
const TYPES = ["Ceylon True Cinnamon", "Cassia", "Korintje", "Saigon"];

export default function EditListing() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    title: "", cinnamonType: "", grade: "", quantity: "", price: "",
    dryingDays: "", description: "", location: "", latitude: "", longitude: "",
    isBuyNow: false, isAuction: false,
  });
  const [existingImages, setExistingImages] = useState([]);
  const [newImages, setNewImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    api.get(`/products/${id}`)
      .then((r) => {
        const p = r.data;
        setForm({
          title: p.title || "",
          cinnamonType: p.cinnamonType || "",
          grade: p.grade || "",
          quantity: p.quantity || "",
          price: p.price || "",
          dryingDays: p.dryingDays || "",
          description: p.description || "",
          location: p.location || "",
          latitude: p.latitude || "",
          longitude: p.longitude || "",
          isBuyNow: p.isBuyNow || false,
          isAuction: p.isAuction || false,
        });
        setExistingImages(p.images || []);
      })
      .catch(() => navigate("/my-products"))
      .finally(() => setLoading(false));
  }, [id]);

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const handleSubmit = async () => {
    setError("");
    if (!form.title || !form.grade || !form.quantity || !form.price || !form.location) {
      return setError("Please fill in all required fields");
    }
    setSaving(true);
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => fd.append(k, v));
      // If no new images are selected, keep existing ones
      if (newImages.length > 0) {
        newImages.forEach((img) => fd.append("images", img));
      }
      await api.put(`/products/${id}`, fd, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      navigate("/my-products");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update listing");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div style={{ padding: 60, textAlign: "center", color: "#8C6C52", fontFamily: "Inter, sans-serif" }}>
        Loading listing…
      </div>
    );
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&family=Inter:wght@300;400;500;600&display=swap');
        .el-app{min-height:100vh;background:#FBF6EF;font-family:'Inter',sans-serif;}
        .el-header{background:#3D1C02;padding:24px 36px;}
        .el-title{font-family:'Playfair Display',serif;font-size:26px;font-weight:700;color:#F7F0E6;}
        .el-sub{font-size:13px;color:rgba(247,240,230,0.6);margin-top:4px;}
        .el-body{padding:28px 36px;max-width:760px;}
        .el-card{background:#fff;border:1px solid #EBDFCD;border-radius:14px;padding:24px;margin-bottom:20px;}
        .el-card-title{font-family:'Playfair Display',serif;font-size:16px;font-weight:700;color:#3D1C02;margin-bottom:18px;}
        .el-grid{display:grid;grid-template-columns:1fr 1fr;gap:16px;}
        .el-field{display:flex;flex-direction:column;gap:7px;}
        .el-field.full{grid-column:1/-1;}
        .el-label{font-size:12px;font-weight:600;text-transform:uppercase;letter-spacing:0.07em;color:#6B4C35;}
        .el-label span{color:#A32D2D;}
        .el-input,.el-select,.el-textarea{width:100%;padding:0 14px;border:1.5px solid #E0CDB8;border-radius:9px;font-family:'Inter',sans-serif;font-size:14px;color:#3D1C02;outline:none;background:#fff;box-sizing:border-box;}
        .el-input{height:44px;}
        .el-select{height:44px;}
        .el-textarea{height:100px;padding:12px 14px;resize:none;}
        .el-input:focus,.el-select:focus,.el-textarea:focus{border-color:#C8722A;box-shadow:0 0 0 3px rgba(200,114,42,0.1);}
        .el-toggle-row{display:flex;gap:12px;}
        .el-toggle{flex:1;border:1.5px solid #E0CDB8;border-radius:10px;padding:14px;cursor:pointer;transition:all 0.15s;text-align:center;}
        .el-toggle.on{border-color:#C8722A;background:#FEF6EE;}
        .el-toggle-title{font-size:13px;font-weight:600;color:#3D1C02;margin-bottom:3px;}
        .el-toggle-desc{font-size:11px;color:#8C6C52;}
        .el-existing-imgs{display:flex;gap:8px;flex-wrap:wrap;margin-bottom:12px;}
        .el-existing-img{width:72px;height:72px;border-radius:8px;object-fit:cover;border:1px solid #EBDFCD;position:relative;}
        .el-img-drop{border:2px dashed #E0CDB8;border-radius:10px;padding:20px;text-align:center;cursor:pointer;}
        .el-img-drop:hover{border-color:#C8722A;}
        .el-img-drop-text{font-size:13px;color:#8C6C52;margin-top:8px;}
        .el-new-previews{display:flex;gap:8px;flex-wrap:wrap;margin-top:10px;}
        .el-new-preview{width:60px;height:60px;border-radius:7px;object-fit:cover;border:2px solid #C8722A;}
        .el-coords-row{display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-top:12px;}
        .el-error{background:#FEF2EC;border:1px solid #F5C4B3;border-radius:8px;padding:10px 14px;font-size:13px;color:#993C1D;margin-bottom:16px;}
        .el-btn-row{display:flex;gap:12px;}
        .el-btn{flex:1;height:48px;background:#3D1C02;color:#F7F0E6;border:none;border-radius:10px;font-size:15px;font-weight:600;cursor:pointer;}
        .el-btn:hover:not(:disabled){background:#5A2A04;}
        .el-btn:disabled{opacity:0.6;cursor:not-allowed;}
        .el-btn-cancel{flex:1;height:48px;background:#FBF6EF;color:#3D1C02;border:1.5px solid #EBDFCD;border-radius:10px;font-size:15px;font-weight:600;cursor:pointer;}
        .el-btn-cancel:hover{border-color:#C8722A;color:#C8722A;}
        .el-img-note{font-size:12px;color:#8C6C52;margin-bottom:10px;}
      `}</style>

      <div className="el-app">
        <div className="el-header">
          <h1 className="el-title">Edit listing</h1>
          <p className="el-sub">Update your product details</p>
        </div>

        <div className="el-body">
          {error && <div className="el-error">{error}</div>}

          {/* Basic details */}
          <div className="el-card">
            <div className="el-card-title">Product details</div>
            <div className="el-grid">
              <div className="el-field full">
                <label className="el-label">Title <span>*</span></label>
                <input className="el-input" value={form.title} onChange={(e) => set("title", e.target.value)} />
              </div>
              <div className="el-field">
                <label className="el-label">Cinnamon type <span>*</span></label>
                <select className="el-select" value={form.cinnamonType} onChange={(e) => set("cinnamonType", e.target.value)}>
                  <option value="">Select type…</option>
                  {TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
              <div className="el-field">
                <label className="el-label">Grade <span>*</span></label>
                <select className="el-select" value={form.grade} onChange={(e) => set("grade", e.target.value)}>
                  <option value="">Select grade…</option>
                  {GRADES.map((g) => <option key={g} value={g}>{g}</option>)}
                </select>
              </div>
              <div className="el-field">
                <label className="el-label">Quantity (kg) <span>*</span></label>
                <input className="el-input" type="number" min="0" value={form.quantity} onChange={(e) => set("quantity", e.target.value)} />
              </div>
              <div className="el-field">
                <label className="el-label">Price (LKR/kg) <span>*</span></label>
                <input className="el-input" type="number" min="0" value={form.price} onChange={(e) => set("price", e.target.value)} />
              </div>
              <div className="el-field">
                <label className="el-label">Drying days</label>
                <input className="el-input" type="number" min="0" value={form.dryingDays} onChange={(e) => set("dryingDays", e.target.value)} />
              </div>
              <div className="el-field full">
                <label className="el-label">Description</label>
                <textarea className="el-textarea" value={form.description} onChange={(e) => set("description", e.target.value)} />
              </div>
            </div>
          </div>

          {/* Listing type */}
          <div className="el-card">
            <div className="el-card-title">Listing type</div>
            <div className="el-toggle-row">
              <div className={`el-toggle${form.isBuyNow ? " on" : ""}`} onClick={() => set("isBuyNow", !form.isBuyNow)}>
                <div className="el-toggle-title">Buy Now</div>
                <div className="el-toggle-desc">Buyers can purchase directly</div>
              </div>
              <div className={`el-toggle${form.isAuction ? " on" : ""}`} onClick={() => set("isAuction", !form.isAuction)}>
                <div className="el-toggle-title">Auction</div>
                <div className="el-toggle-desc">Buyers bid competitively</div>
              </div>
            </div>
          </div>

          {/* Images */}
          <div className="el-card">
            <div className="el-card-title">Product images</div>
            {existingImages.length > 0 && (
              <>
                <p className="el-img-note">Current images (upload new ones below to replace)</p>
                <div className="el-existing-imgs">
                  {existingImages.map((url, i) => (
                    <img key={i} src={url} alt="" className="el-existing-img" />
                  ))}
                </div>
              </>
            )}
            <label htmlFor="el-img-input">
              <div className="el-img-drop">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#B08060" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/>
                </svg>
                <div className="el-img-drop-text">
                  {newImages.length > 0 ? `${newImages.length} new image(s) selected` : "Click to upload new images"}
                </div>
              </div>
            </label>
            <input id="el-img-input" type="file" multiple accept="image/*" style={{ display: "none" }} onChange={(e) => setNewImages(Array.from(e.target.files))} />
            {newImages.length > 0 && (
              <div className="el-new-previews">
                {newImages.map((img, i) => (
                  <img key={i} src={URL.createObjectURL(img)} className="el-new-preview" alt="" />
                ))}
              </div>
            )}
          </div>

          {/* Location */}
          <div className="el-card">
            <div className="el-card-title">Location</div>
            <div className="el-field" style={{ marginBottom: 12 }}>
              <label className="el-label">Location name <span>*</span></label>
              <input className="el-input" value={form.location} onChange={(e) => set("location", e.target.value)} />
            </div>
            <div className="el-coords-row">
              <div className="el-field">
                <label className="el-label">Latitude</label>
                <input className="el-input" type="number" step="any" value={form.latitude} onChange={(e) => set("latitude", e.target.value)} />
              </div>
              <div className="el-field">
                <label className="el-label">Longitude</label>
                <input className="el-input" type="number" step="any" value={form.longitude} onChange={(e) => set("longitude", e.target.value)} />
              </div>
            </div>
          </div>

          <div className="el-btn-row">
            <button className="el-btn-cancel" onClick={() => navigate("/my-products")}>Cancel</button>
            <button className="el-btn" onClick={handleSubmit} disabled={saving}>
              {saving ? "Saving…" : "Save changes"}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
