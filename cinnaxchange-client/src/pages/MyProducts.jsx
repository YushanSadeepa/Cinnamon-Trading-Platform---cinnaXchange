import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";

const gradeBg = {
  Alba:"#FAEEDA",C5:"#EAF3DE",C4:"#E6F1FB",C3:"#EEEDFE",
  M5:"#FEF6EE",H1:"#FAECE7",Hamburg:"#F3E9D8",
};
const gradeColor = {
  Alba:"#854F0B",C5:"#3B6D11",C4:"#185FA5",C3:"#534AB7",
  M5:"#C8722A",H1:"#993C1D",Hamburg:"#6B4C35",
};

export default function MyProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(null);

  const load = () => {
    setLoading(true);
    api.get("/products/my-products")
      .then((r) => setProducts(r.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const deleteProduct = async (id) => {
    if (!window.confirm("Delete this listing?")) return;
    setDeleting(id);
    try {
      await api.delete(`/products/${id}`);
      load();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to delete");
    } finally {
      setDeleting(null);
    }
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&family=Inter:wght@300;400;500;600&display=swap');
        .mp-app{min-height:100vh;background:#FBF6EF;font-family:'Inter',sans-serif;}
        .mp-header{background:#3D1C02;padding:22px 36px;display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:12px;}
        .mp-title{font-family:'Playfair Display',serif;font-size:24px;font-weight:700;color:#F7F0E6;}
        .mp-sub{font-size:13px;color:rgba(247,240,230,0.6);margin-top:3px;}
        .mp-new-btn{display:inline-flex;align-items:center;gap:7px;height:38px;padding:0 16px;background:#C8722A;color:#F7F0E6;border:none;border-radius:9px;font-size:13px;font-weight:600;text-decoration:none;}
        .mp-new-btn:hover{background:#A85C20;}
        .mp-body{padding:28px 36px;}
        .mp-summary{display:flex;gap:14px;margin-bottom:24px;flex-wrap:wrap;}
        .mp-stat{background:#fff;border:1px solid #EBDFCD;border-radius:11px;padding:14px 18px;min-width:120px;}
        .mp-stat-val{font-family:'Playfair Display',serif;font-size:22px;font-weight:700;color:#3D1C02;}
        .mp-stat-label{font-size:12px;color:#8C6C52;margin-top:2px;}
        .mp-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(280px,1fr));gap:18px;}
        .mp-card{background:#fff;border:1px solid #EBDFCD;border-radius:13px;overflow:hidden;transition:box-shadow 0.2s;}
        .mp-card:hover{box-shadow:0 4px 18px rgba(61,28,2,0.1);}
        .mp-img{width:100%;height:160px;object-fit:cover;background:#F3E9D8;display:flex;align-items:center;justify-content:center;}
        .mp-card-body{padding:14px;}
        .mp-card-top{display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:6px;}
        .mp-card-title{font-size:14px;font-weight:600;color:#3D1C02;line-height:1.3;flex:1;min-width:0;margin-right:8px;}
        .mp-grade{font-size:11px;font-weight:600;padding:3px 9px;border-radius:12px;flex-shrink:0;}
        .mp-type{font-size:12px;color:#8C6C52;margin-bottom:8px;}
        .mp-meta{display:flex;flex-direction:column;gap:4px;margin-bottom:10px;}
        .mp-meta-row{display:flex;justify-content:space-between;font-size:13px;}
        .mp-meta-label{color:#8C6C52;}
        .mp-meta-val{font-weight:500;color:#3D1C02;}
        .mp-price{font-family:'Playfair Display',serif;font-size:18px;font-weight:700;color:#C8722A;margin-bottom:10px;}
        .mp-tags{display:flex;gap:6px;margin-bottom:12px;flex-wrap:wrap;}
        .mp-tag{font-size:11px;font-weight:600;padding:3px 10px;border-radius:10px;}
        .mp-tag-buynow{background:#EAF3DE;color:#3B6D11;}
        .mp-tag-auction{background:#E6F1FB;color:#185FA5;}
        .mp-tag-active{background:#FAEEDA;color:#854F0B;}
        .mp-actions{display:flex;gap:8px;}
        .mp-btn{flex:1;height:34px;border-radius:8px;font-size:13px;font-weight:600;cursor:pointer;border:none;display:flex;align-items:center;justify-content:center;gap:6px;text-decoration:none;}
        .mp-btn-delete{background:#FEF2EC;color:#993C1D;border:1px solid #F5C4B3;}
        .mp-btn-delete:hover{background:#F5C4B3;}
        .mp-btn-delete:disabled{opacity:0.5;cursor:not-allowed;}
        .mp-btn-auction{background:#FBF6EF;color:#3D1C02;border:1.5px solid #EBDFCD;}
        .mp-btn-auction:hover{border-color:#C8722A;color:#C8722A;}
        .mp-location{font-size:12px;color:#8C6C52;display:flex;align-items:center;gap:4px;margin-bottom:10px;}
        .mp-empty{text-align:center;padding:60px;color:#8C6C52;}
        .mp-empty-title{font-family:'Playfair Display',serif;font-size:20px;color:#3D1C02;margin-bottom:8px;}
      `}</style>

      <div className="mp-app">
        <div className="mp-header">
          <div>
            <h1 className="mp-title">My listings</h1>
            <p className="mp-sub">Manage your cinnamon products</p>
          </div>
          <Link to="/create-listing" className="mp-new-btn">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
            </svg>
            New listing
          </Link>
        </div>

        <div className="mp-body">
          {/* Summary */}
          {!loading && products.length > 0 && (
            <div className="mp-summary">
              <div className="mp-stat">
                <div className="mp-stat-val">{products.length}</div>
                <div className="mp-stat-label">Total listings</div>
              </div>
              <div className="mp-stat">
                <div className="mp-stat-val">{products.filter((p) => p.status === "active").length}</div>
                <div className="mp-stat-label">Active</div>
              </div>
              <div className="mp-stat">
                <div className="mp-stat-val">{products.filter((p) => p.isBuyNow).length}</div>
                <div className="mp-stat-label">Buy Now</div>
              </div>
              <div className="mp-stat">
                <div className="mp-stat-val">{products.filter((p) => p.isAuction).length}</div>
                <div className="mp-stat-label">Auction</div>
              </div>
            </div>
          )}

          {loading ? (
            <div className="mp-grid">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="mp-card">
                  <div style={{ height: 160, background: "linear-gradient(90deg,#F3E9D8 25%,#EBDFCD 50%,#F3E9D8 75%)", backgroundSize: "200% 100%", animation: "shimmer 1.4s infinite" }} />
                  <div style={{ padding: 14 }}>
                    <div style={{ height: 16, background: "#F3E9D8", borderRadius: 6, marginBottom: 10, width: "70%" }} />
                    <div style={{ height: 12, background: "#F3E9D8", borderRadius: 6, width: "50%" }} />
                  </div>
                </div>
              ))}
            </div>
          ) : products.length === 0 ? (
            <div className="mp-empty">
              <div className="mp-empty-title">No listings yet</div>
              <p style={{ marginBottom: 16 }}>Create your first product listing to start selling</p>
              <Link to="/create-listing" style={{ color: "#C8722A", fontWeight: 600 }}>Create listing →</Link>
            </div>
          ) : (
            <div className="mp-grid">
              {products.map((p) => (
                <div key={p._id} className="mp-card">
                  {p.images?.[0] ? (
                    <img src={p.images[0]} alt={p.title} className="mp-img" />
                  ) : (
                    <div className="mp-img">
                      <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#B08060" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/>
                      </svg>
                    </div>
                  )}
                  <div className="mp-card-body">
                    <div className="mp-card-top">
                      <div className="mp-card-title">{p.title}</div>
                      {p.grade && (
                        <span className="mp-grade" style={{ background: gradeBg[p.grade] || "#F3E9D8", color: gradeColor[p.grade] || "#6B4C35" }}>
                          {p.grade}
                        </span>
                      )}
                    </div>
                    <div className="mp-type">{p.cinnamonType}</div>

                    <div className="mp-meta">
                      <div className="mp-meta-row">
                        <span className="mp-meta-label">Quantity</span>
                        <span className="mp-meta-val">{p.quantity} kg</span>
                      </div>
                      {p.dryingDays > 0 && (
                        <div className="mp-meta-row">
                          <span className="mp-meta-label">Drying days</span>
                          <span className="mp-meta-val">{p.dryingDays}</span>
                        </div>
                      )}
                    </div>

                    <div className="mp-price">LKR {p.price?.toLocaleString()}<span style={{ fontSize: 12, fontFamily: "Inter", fontWeight: 400, color: "#8C6C52" }}>/kg</span></div>

                    {p.location && (
                      <div className="mp-location">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>
                        </svg>
                        {p.location}
                      </div>
                    )}

                    <div className="mp-tags">
                      {p.isBuyNow && <span className="mp-tag mp-tag-buynow">Buy Now</span>}
                      {p.isAuction && <span className="mp-tag mp-tag-auction">Auction</span>}
                      <span className="mp-tag mp-tag-active">{p.status}</span>
                    </div>

                    <div className="mp-actions">
                      {p.isAuction && (
                        <Link to="/create-auction" className="mp-btn mp-btn-auction">
                          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                            <path d="m14 4 6 6"/><path d="m4 14 6 6"/><path d="m12.5 5.5-7 7 1 1 7-7z"/>
                          </svg>
                          Auction
                        </Link>
                      )}
                      <Link
                        to={`/edit-listing/${p._id}`}
                        className="mp-btn mp-btn-auction"
                      >
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                        </svg>
                        Edit
                      </Link>
                      <button
                        className="mp-btn mp-btn-delete"
                        onClick={() => deleteProduct(p._id)}
                        disabled={deleting === p._id}
                      >
                        {deleting === p._id ? (
                          "Deleting…"
                        ) : (
                          <>
                            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                              <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v6M14 11v6"/><path d="M9 6V4h6v2"/>
                            </svg>
                            Delete
                          </>
                        )}
                      </button>
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
