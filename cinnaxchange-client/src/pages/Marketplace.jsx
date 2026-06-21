import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";

const GRADES = ["All", "Alba", "C5", "C4", "C3", "M5", "H1", "Hamburg"];

const gradeBg = {
  Alba: "#FAEEDA", C5: "#EAF3DE", C4: "#E6F1FB", C3: "#EEEDFE",
  M5: "#FEF6EE", H1: "#FAECE7", Hamburg: "#F3E9D8",
};
const gradeColor = {
  Alba: "#854F0B", C5: "#3B6D11", C4: "#185FA5", C3: "#534AB7",
  M5: "#C8722A", H1: "#993C1D", Hamburg: "#6B4C35",
};

export default function Marketplace() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [grade, setGrade] = useState("All");
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchProducts();
  }, [grade]);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (grade !== "All") params.set("grade", grade);
      if (search) params.set("search", search);
      const res = await api.get(`/products?${params}`);
      setProducts(res.data);
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
        .mx-app { min-height:100vh; background:#FBF6EF; font-family:'Inter',sans-serif; }
        .mx-header { background:#3D1C02; padding:20px 36px; }
        .mx-header-row { display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:16px; }
        .mx-title { font-family:'Playfair Display',serif; font-size:26px; font-weight:700; color:#F7F0E6; }
        .mx-subtitle { font-size:13px; color:rgba(247,240,230,0.6); margin-top:4px; }
        .mx-search { height:40px; padding:0 14px 0 38px; border:1.5px solid rgba(200,114,42,0.4); border-radius:9px; background:rgba(255,255,255,0.08); color:#F7F0E6; font-family:'Inter',sans-serif; font-size:14px; width:240px; outline:none; }
        .mx-search::placeholder { color:rgba(247,240,230,0.4); }
        .mx-search:focus { border-color:#C8722A; background:rgba(255,255,255,0.12); }
        .mx-search-wrap { position:relative; }
        .mx-search-ico { position:absolute; left:11px; top:50%; transform:translateY(-50%); color:rgba(247,240,230,0.5); }
        .mx-filters { padding:16px 36px; background:#fff; border-bottom:1px solid #EBDFCD; display:flex; gap:8px; flex-wrap:wrap; }
        .mx-grade-pill { padding:6px 16px; border-radius:20px; border:1.5px solid #E0CDB8; background:#fff; font-size:13px; font-weight:500; color:#6B4C35; cursor:pointer; transition:all 0.15s; }
        .mx-grade-pill.active { background:#3D1C02; color:#F7F0E6; border-color:#3D1C02; }
        .mx-grade-pill:hover:not(.active) { border-color:#C8722A; color:#C8722A; }
        .mx-body { padding:28px 36px; }
        .mx-count { font-size:13px; color:#8C6C52; margin-bottom:20px; }
        .mx-grid { display:grid; grid-template-columns:repeat(auto-fill,minmax(280px,1fr)); gap:20px; }
        .mx-card { background:#fff; border:1px solid #EBDFCD; border-radius:14px; overflow:hidden; transition:box-shadow 0.2s; }
        .mx-card:hover { box-shadow:0 4px 20px rgba(61,28,2,0.1); }
        .mx-img { width:100%; height:180px; object-fit:cover; background:#F3E9D8; display:flex; align-items:center; justify-content:center; }
        .mx-img-placeholder { color:#B08060; }
        .mx-card-body { padding:16px; }
        .mx-card-top { display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:8px; }
        .mx-card-title { font-size:15px; font-weight:600; color:#3D1C02; line-height:1.3; }
        .mx-grade-badge { font-size:11px; font-weight:600; padding:3px 10px; border-radius:12px; flex-shrink:0; }
        .mx-card-type { font-size:12px; color:#8C6C52; margin-bottom:10px; }
        .mx-card-meta { display:flex; flex-direction:column; gap:5px; margin-bottom:12px; }
        .mx-meta-row { display:flex; justify-content:space-between; font-size:13px; }
        .mx-meta-label { color:#8C6C52; }
        .mx-meta-val { font-weight:500; color:#3D1C02; }
        .mx-price { font-family:'Playfair Display',serif; font-size:20px; font-weight:700; color:#C8722A; margin-bottom:12px; }
        .mx-seller-row { display:flex; align-items:center; justify-content:space-between; padding-top:12px; border-top:1px solid #F3E9D8; }
        .mx-seller-name { font-size:13px; font-weight:500; color:#3D1C02; }
        .mx-trust { display:flex; align-items:center; gap:5px; font-size:12px; }
        .mx-trust-bar { width:40px; height:5px; border-radius:3px; background:#EBDFCD; overflow:hidden; }
        .mx-trust-fill { height:100%; background:#C8722A; border-radius:3px; }
        .mx-trust-val { font-size:11px; color:#8C6C52; }
        .mx-verified { display:inline-flex; align-items:center; gap:3px; font-size:11px; color:#3B6D11; background:#EAF3DE; padding:2px 8px; border-radius:10px; }
        .mx-card-actions { display:flex; gap:8px; margin-top:12px; }
        .mx-btn-primary { flex:1; height:36px; background:#3D1C02; color:#F7F0E6; border:none; border-radius:8px; font-size:13px; font-weight:600; cursor:pointer; transition:background 0.2s; }
        .mx-btn-primary:hover { background:#5A2A04; }
        .mx-btn-secondary { height:36px; padding:0 14px; background:#FBF6EF; color:#3D1C02; border:1.5px solid #EBDFCD; border-radius:8px; font-size:13px; font-weight:500; cursor:pointer; white-space:nowrap; text-decoration:none; display:flex; align-items:center; }
        .mx-btn-secondary:hover { border-color:#C8722A; color:#C8722A; }
        .mx-location { font-size:12px; color:#8C6C52; display:flex; align-items:center; gap:4px; margin-top:6px; }
        .mx-empty { text-align:center; padding:60px 20px; color:#8C6C52; }
        .mx-empty-title { font-family:'Playfair Display',serif; font-size:20px; color:#3D1C02; margin-bottom:8px; }
        .mx-skeleton { background:linear-gradient(90deg,#F3E9D8 25%,#EBDFCD 50%,#F3E9D8 75%); background-size:200% 100%; animation:shimmer 1.4s infinite; border-radius:8px; }
        @keyframes shimmer { to { background-position:-200% 0; } }
      `}</style>

      <div className="mx-app">
        <div className="mx-header">
          <div className="mx-header-row">
            <div>
              <h1 className="mx-title">Cinnamon Marketplace</h1>
              <p className="mx-subtitle">Sourced from verified growers across Sri Lanka</p>
            </div>
            <div className="mx-search-wrap">
              <svg className="mx-search-ico" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
              </svg>
              <input
                className="mx-search"
                placeholder="Search listings…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && fetchProducts()}
              />
            </div>
          </div>
        </div>

        <div className="mx-filters">
          {GRADES.map((g) => (
            <button
              key={g}
              className={`mx-grade-pill${grade === g ? " active" : ""}`}
              onClick={() => setGrade(g)}
            >
              {g}
            </button>
          ))}
        </div>

        <div className="mx-body">
          <p className="mx-count">{products.length} listing{products.length !== 1 ? "s" : ""} found</p>

          {loading ? (
            <div className="mx-grid">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="mx-card">
                  <div className="mx-skeleton" style={{ height: 180 }} />
                  <div style={{ padding: 16 }}>
                    <div className="mx-skeleton" style={{ height: 20, marginBottom: 10, width: "70%" }} />
                    <div className="mx-skeleton" style={{ height: 14, marginBottom: 8, width: "50%" }} />
                    <div className="mx-skeleton" style={{ height: 28, marginBottom: 12, width: "40%" }} />
                    <div className="mx-skeleton" style={{ height: 36 }} />
                  </div>
                </div>
              ))}
            </div>
          ) : products.length === 0 ? (
            <div className="mx-empty">
              <div className="mx-empty-title">No listings found</div>
              <p>Try adjusting your search or grade filter</p>
            </div>
          ) : (
            <div className="mx-grid">
              {products.map((p) => (
                <div key={p._id} className="mx-card">
                  {p.images?.[0] ? (
                    <img src={p.images[0]} alt={p.title} className="mx-img" />
                  ) : (
                    <div className="mx-img">
                      <svg className="mx-img-placeholder" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/>
                      </svg>
                    </div>
                  )}
                  <div className="mx-card-body">
                    <div className="mx-card-top">
                      <div className="mx-card-title">{p.title}</div>
                      {p.grade && (
                        <span
                          className="mx-grade-badge"
                          style={{ background: gradeBg[p.grade] || "#F3E9D8", color: gradeColor[p.grade] || "#6B4C35" }}
                        >
                          {p.grade}
                        </span>
                      )}
                    </div>
                    <div className="mx-card-type">{p.cinnamonType}</div>
                    <div className="mx-card-meta">
                      <div className="mx-meta-row">
                        <span className="mx-meta-label">Quantity</span>
                        <span className="mx-meta-val">{p.quantity} kg</span>
                      </div>
                      {p.dryingDays > 0 && (
                        <div className="mx-meta-row">
                          <span className="mx-meta-label">Drying days</span>
                          <span className="mx-meta-val">{p.dryingDays} days</span>
                        </div>
                      )}
                    </div>
                    <div className="mx-price">LKR {p.price?.toLocaleString()}<span style={{ fontSize: 13, fontFamily: "Inter", fontWeight: 400, color: "#8C6C52" }}>/kg</span></div>

                    {p.location && (
                      <div className="mx-location">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>
                        </svg>
                        {p.location}
                      </div>
                    )}

                    <div className="mx-seller-row">
                      <div>
                        <div className="mx-seller-name">{p.seller?.fullName}</div>
                        {p.seller?.isVerified && (
                          <span className="mx-verified">
                            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                            Verified
                          </span>
                        )}
                      </div>
                      {p.seller?.trustScore !== undefined && (
                        <div className="mx-trust">
                          <div className="mx-trust-bar">
                            <div className="mx-trust-fill" style={{ width: `${p.seller.trustScore}%` }} />
                          </div>
                          <span className="mx-trust-val">{p.seller.trustScore}</span>
                        </div>
                      )}
                    </div>

                    <div className="mx-card-actions">
                      {p.isBuyNow && <button className="mx-btn-primary">Buy now</button>}
                      {p.isAuction && <Link to="/auctions" className="mx-btn-primary" style={{ display: "flex", alignItems: "center", justifyContent: "center", textDecoration: "none" }}>View auction</Link>}
                      <Link to={`/seller/${p.seller?._id}`} className="mx-btn-secondary">
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: 5 }}>
                          <circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/>
                        </svg>
                        Seller
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
