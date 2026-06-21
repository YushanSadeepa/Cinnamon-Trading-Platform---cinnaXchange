import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../../services/api";

function StarRating({ value }) {
  return (
    <span style={{ display: "inline-flex", gap: 2 }}>
      {[1,2,3,4,5].map((s) => (
        <svg key={s} width="14" height="14" viewBox="0 0 24 24"
          fill={s <= Math.round(value) ? "#C8722A" : "none"}
          stroke="#C8722A" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <polygon points="12 2 15.1 8.3 22 9.3 17 14.1 18.2 21 12 17.8 5.8 21 7 14.1 2 9.3 8.9 8.3"/>
        </svg>
      ))}
    </span>
  );
}

export default function SellerProfile() {
  const { id } = useParams();
  const [seller, setSeller] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.get(`/users/seller/${id}`),
      api.get(`/reviews/seller/${id}`),
      api.get(`/products?sellerId=${id}`),
    ]).then(([s, r, p]) => {
      setSeller(s.data);
      setReviews(r.data);
      setProducts(p.data);
    }).catch(console.error).finally(() => setLoading(false));
  }, [id]);

  const openMap = () => {
    if (seller?.location?.lat) {
      window.open(`https://www.google.com/maps?q=${seller.location.lat},${seller.location.lng}`, "_blank");
    }
  };
  const openDirections = () => {
    if (seller?.location?.lat) {
      window.open(`https://www.google.com/maps/dir/?api=1&destination=${seller.location.lat},${seller.location.lng}`, "_blank");
    }
  };

  if (loading) return <div style={{ padding: 60, textAlign: "center", color: "#8C6C52", fontFamily: "Inter, sans-serif" }}>Loading profile…</div>;
  if (!seller) return <div style={{ padding: 60, textAlign: "center", color: "#A32D2D", fontFamily: "Inter, sans-serif" }}>Seller not found</div>;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600;700&family=Inter:wght@300;400;500;600&display=swap');
        .sp-app { min-height:100vh; background:#FBF6EF; font-family:'Inter',sans-serif; }
        .sp-header { background:#3D1C02; padding:28px 36px; display:flex; align-items:center; gap:20px; }
        .sp-avatar { width:56px; height:56px; border-radius:50%; background:rgba(200,114,42,0.2); border:2px solid rgba(200,114,42,0.4); display:flex; align-items:center; justify-content:center; font-size:20px; font-weight:700; color:#D4A853; flex-shrink:0; }
        .sp-name { font-family:'Playfair Display',serif; font-size:24px; font-weight:700; color:#F7F0E6; margin-bottom:4px; }
        .sp-verified { display:inline-flex; align-items:center; gap:4px; font-size:12px; color:#EAF3DE; background:rgba(59,109,17,0.3); padding:3px 10px; border-radius:12px; font-weight:500; }
        .sp-body { padding:28px 36px; display:grid; grid-template-columns:1fr 320px; gap:24px; max-width:1100px; }
        @media(max-width:800px){.sp-body{grid-template-columns:1fr;}}
        .sp-card { background:#fff; border:1px solid #EBDFCD; border-radius:14px; padding:22px; margin-bottom:18px; }
        .sp-section-title { font-family:'Playfair Display',serif; font-size:16px; font-weight:700; color:#3D1C02; margin-bottom:16px; }
        .sp-stat-grid { display:grid; grid-template-columns:repeat(3,1fr); gap:12px; }
        .sp-stat { background:#FBF6EF; border-radius:10px; padding:14px; text-align:center; }
        .sp-stat-val { font-family:'Playfair Display',serif; font-size:24px; font-weight:700; color:#3D1C02; }
        .sp-stat-label { font-size:11px; color:#8C6C52; margin-top:4px; }
        .sp-trust-bar-wrap { margin-top:16px; }
        .sp-trust-label { display:flex; justify-content:space-between; font-size:13px; margin-bottom:6px; color:#6B4C35; font-weight:500; }
        .sp-trust-track { height:8px; background:#EBDFCD; border-radius:4px; overflow:hidden; }
        .sp-trust-fill { height:100%; background:linear-gradient(90deg,#C8722A,#D4A853); border-radius:4px; transition:width 0.6s; }
        .sp-review { padding:14px 0; border-bottom:1px solid #F3E9D8; }
        .sp-review:last-child { border-bottom:none; }
        .sp-review-top { display:flex; justify-content:space-between; align-items:center; margin-bottom:6px; }
        .sp-reviewer { font-size:13px; font-weight:600; color:#3D1C02; }
        .sp-review-date { font-size:11px; color:#B08060; }
        .sp-review-comment { font-size:13px; color:#6B4C35; line-height:1.6; margin-top:6px; }
        .sp-location-card { background:#FBF6EF; border-radius:10px; padding:16px; margin-bottom:14px; }
        .sp-location-label { font-size:11px; text-transform:uppercase; letter-spacing:0.07em; font-weight:600; color:#8C6C52; margin-bottom:6px; }
        .sp-location-name { font-size:14px; font-weight:600; color:#3D1C02; margin-bottom:12px; display:flex; align-items:center; gap:6px; }
        .sp-map-btns { display:flex; gap:8px; }
        .sp-map-btn { flex:1; height:36px; border-radius:8px; font-size:13px; font-weight:600; cursor:pointer; border:none; display:flex; align-items:center; justify-content:center; gap:6px; }
        .sp-map-btn-view { background:#E6F1FB; color:#185FA5; }
        .sp-map-btn-dir { background:#3D1C02; color:#F7F0E6; }
        .sp-map-btn-view:hover { background:#C8E1F8; }
        .sp-map-btn-dir:hover { background:#5A2A04; }
        .sp-no-location { font-size:13px; color:#B08060; text-align:center; padding:16px 0; }
        .sp-product-mini { display:flex; gap:10px; padding:10px 0; border-bottom:1px solid #F3E9D8; align-items:center; }
        .sp-product-mini:last-child { border-bottom:none; }
        .sp-product-img { width:44px; height:44px; border-radius:7px; object-fit:cover; background:#F3E9D8; flex-shrink:0; }
        .sp-product-title { font-size:13px; font-weight:600; color:#3D1C02; }
        .sp-product-price { font-size:12px; color:#C8722A; font-weight:500; }
      `}</style>

      <div className="sp-app">
        <div className="sp-header">
          <div className="sp-avatar">
            {seller.fullName?.split(" ").map((n) => n[0]).slice(0, 2).join("").toUpperCase()}
          </div>
          <div>
            <div className="sp-name">{seller.fullName}</div>
            {seller.isVerified && (
              <span className="sp-verified">
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                KYC Verified
              </span>
            )}
          </div>
        </div>

        <div className="sp-body">
          <div>
            {/* Trust & stats */}
            <div className="sp-card">
              <div className="sp-section-title">Seller overview</div>
              <div className="sp-stat-grid">
                <div className="sp-stat">
                  <div className="sp-stat-val">{seller.trustScore ?? 0}</div>
                  <div className="sp-stat-label">Trust score</div>
                </div>
                <div className="sp-stat">
                  <div className="sp-stat-val">{seller.ratings?.average?.toFixed(1) ?? "—"}</div>
                  <div className="sp-stat-label">Avg rating</div>
                </div>
                <div className="sp-stat">
                  <div className="sp-stat-val">{seller.ratings?.count ?? 0}</div>
                  <div className="sp-stat-label">Reviews</div>
                </div>
              </div>
              <div className="sp-trust-bar-wrap">
                <div className="sp-trust-label">
                  <span>Trust score</span>
                  <span style={{ color: "#C8722A", fontWeight: 600 }}>{seller.trustScore ?? 0}/100</span>
                </div>
                <div className="sp-trust-track">
                  <div className="sp-trust-fill" style={{ width: `${seller.trustScore ?? 0}%` }} />
                </div>
              </div>
            </div>

            {/* Reviews */}
            <div className="sp-card">
              <div className="sp-section-title">Reviews ({reviews.length})</div>
              {reviews.length === 0 ? (
                <p style={{ color: "#8C6C52", fontSize: 13, textAlign: "center", padding: "12px 0" }}>No reviews yet</p>
              ) : (
                reviews.map((r) => (
                  <div key={r._id} className="sp-review">
                    <div className="sp-review-top">
                      <span className="sp-reviewer">{r.reviewer?.fullName}</span>
                      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <StarRating value={r.rating} />
                        <span className="sp-review-date">{new Date(r.createdAt).toLocaleDateString("en-LK", { day: "numeric", month: "short", year: "numeric" })}</span>
                      </div>
                    </div>
                    {r.comment && <div className="sp-review-comment">{r.comment}</div>}
                  </div>
                ))
              )}
            </div>
          </div>

          <div>
            {/* Location card */}
            <div className="sp-card">
              <div className="sp-section-title">Location</div>
              {seller.location?.lat ? (
                <div className="sp-location-card">
                  <div className="sp-location-label">Farm / warehouse location</div>
                  <div className="sp-location-name">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#C8722A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
                    {seller.location.label}
                  </div>
                  <div className="sp-map-btns">
                    <button className="sp-map-btn sp-map-btn-view" onClick={openMap}>
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
                      View map
                    </button>
                    <button className="sp-map-btn sp-map-btn-dir" onClick={openDirections}>
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><polygon points="3 11 22 2 13 21 11 13 3 11"/></svg>
                      Directions
                    </button>
                  </div>
                </div>
              ) : (
                <div className="sp-no-location">Location not provided</div>
              )}
            </div>

            {/* Active listings */}
            {products.length > 0 && (
              <div className="sp-card">
                <div className="sp-section-title">Active listings</div>
                {products.slice(0, 5).map((p) => (
                  <div key={p._id} className="sp-product-mini">
                    {p.images?.[0] ? (
                      <img src={p.images[0]} alt="" className="sp-product-img" />
                    ) : (
                      <div className="sp-product-img" style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#B08060" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
                      </div>
                    )}
                    <div>
                      <div className="sp-product-title">{p.title}</div>
                      <div className="sp-product-price">LKR {p.price?.toLocaleString()}/kg</div>
                    </div>
                  </div>
                ))}
                {products.length > 5 && (
                  <p style={{ fontSize: 13, color: "#C8722A", marginTop: 10, cursor: "pointer" }}>View all {products.length} listings</p>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
