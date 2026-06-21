import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../services/api";

export default function WonAuctions() {
  const [auctions, setAuctions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/auctions/won")
      .then((r) => setAuctions(r.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const openDirections = (lat, lng) => {
    window.open(`https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`, "_blank");
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&family=Inter:wght@300;400;500;600&display=swap');
        .wa-app { min-height:100vh; background:#FBF6EF; font-family:'Inter',sans-serif; }
        .wa-header { background:#3D1C02; padding:24px 36px; }
        .wa-title { font-family:'Playfair Display',serif; font-size:26px; font-weight:700; color:#F7F0E6; }
        .wa-sub { font-size:13px; color:rgba(247,240,230,0.6); margin-top:4px; }
        .wa-body { padding:28px 36px; max-width:900px; }
        .wa-card { background:#fff; border:1px solid #EBDFCD; border-radius:14px; overflow:hidden; margin-bottom:20px; }
        .wa-card-top { display:flex; gap:16px; padding:20px; }
        .wa-img { width:80px; height:80px; border-radius:8px; object-fit:cover; background:#F3E9D8; flex-shrink:0; display:flex; align-items:center; justify-content:center; }
        .wa-content { flex:1; }
        .wa-auction-title { font-family:'Playfair Display',serif; font-size:17px; font-weight:700; color:#3D1C02; margin-bottom:6px; }
        .wa-winning-bid { font-size:22px; font-weight:700; color:#C8722A; font-family:'Playfair Display',serif; margin-bottom:8px; }
        .wa-status { display:inline-flex; align-items:center; gap:6px; font-size:12px; font-weight:600; padding:4px 12px; border-radius:12px; margin-bottom:10px; }
        .wa-status-awaiting { background:#E6F1FB; color:#185FA5; }
        .wa-status-completed { background:#EAF3DE; color:#3B6D11; }
        .wa-meta { display:flex; gap:20px; flex-wrap:wrap; }
        .wa-meta-item { font-size:13px; color:#6B4C35; display:flex; align-items:center; gap:5px; }
        .wa-divider { height:1px; background:#F3E9D8; }
        .wa-contact-section { padding:16px 20px; background:#FBF6EF; }
        .wa-contact-title { font-size:13px; font-weight:600; color:#6B4C35; text-transform:uppercase; letter-spacing:0.07em; margin-bottom:12px; }
        .wa-contact-grid { display:grid; grid-template-columns:1fr 1fr; gap:10px; }
        .wa-contact-card { background:#fff; border:1px solid #EBDFCD; border-radius:10px; padding:12px; }
        .wa-contact-label { font-size:11px; color:#8C6C52; font-weight:600; text-transform:uppercase; letter-spacing:0.06em; margin-bottom:4px; }
        .wa-contact-val { font-size:14px; font-weight:600; color:#3D1C02; }
        .wa-actions { padding:16px 20px; display:flex; gap:10px; flex-wrap:wrap; }
        .wa-btn { display:inline-flex; align-items:center; gap:7px; height:38px; padding:0 16px; border-radius:9px; font-size:13px; font-weight:600; cursor:pointer; text-decoration:none; border:none; }
        .wa-btn-primary { background:#3D1C02; color:#F7F0E6; }
        .wa-btn-primary:hover { background:#5A2A04; }
        .wa-btn-secondary { background:#FBF6EF; color:#3D1C02; border:1.5px solid #EBDFCD; }
        .wa-btn-secondary:hover { border-color:#C8722A; color:#C8722A; }
        .wa-btn-map { background:#E6F1FB; color:#185FA5; border:1.5px solid #B8D4F0; }
        .wa-btn-map:hover { background:#D0E8FB; }
        .wa-review-done { display:inline-flex; align-items:center; gap:5px; font-size:12px; color:#3B6D11; background:#EAF3DE; padding:4px 12px; border-radius:20px; }
        .wa-empty { text-align:center; padding:60px; color:#8C6C52; }
        .wa-empty-title { font-family:'Playfair Display',serif; font-size:20px; color:#3D1C02; margin-bottom:8px; }
      `}</style>

      <div className="wa-app">
        <div className="wa-header">
          <h1 className="wa-title">Won Auctions</h1>
          <p className="wa-sub">Your successful bids and pending meetings</p>
        </div>

        <div className="wa-body">
          {loading ? (
            <p style={{ color: "#8C6C52", padding: 20 }}>Loading…</p>
          ) : auctions.length === 0 ? (
            <div className="wa-empty">
              <div className="wa-empty-title">No won auctions yet</div>
              <p>Win an auction to see seller contact details here</p>
              <Link to="/auctions" style={{ color: "#C8722A", fontWeight: 600 }}>Browse live auctions →</Link>
            </div>
          ) : (
            auctions.map((a) => (
              <div key={a._id} className="wa-card">
                <div className="wa-card-top">
                  {a.product?.images?.[0] ? (
                    <img src={a.product.images[0]} alt="" className="wa-img" />
                  ) : (
                    <div className="wa-img">
                      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#B08060" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/>
                      </svg>
                    </div>
                  )}
                  <div className="wa-content">
                    <div className="wa-auction-title">{a.title}</div>
                    <div className="wa-winning-bid">LKR {a.winningBid?.toLocaleString()}</div>
                    <span className={`wa-status ${a.status === "completed" ? "wa-status-completed" : "wa-status-awaiting"}`}>
                      {a.status === "completed" ? (
                        <><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>Completed</>
                      ) : (
                        <><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>Awaiting meeting</>
                      )}
                    </span>
                    <div className="wa-meta">
                      <span className="wa-meta-item">
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 3h-4l-4 4M12 3v4"/></svg>
                        Grade {a.product?.grade}
                      </span>
                      {a.product?.location && (
                        <span className="wa-meta-item">
                          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
                          {a.product.location}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Seller contact — revealed after winning */}
                <div className="wa-divider" />
                <div className="wa-contact-section">
                  <div className="wa-contact-title">Seller contact details</div>
                  <div className="wa-contact-grid">
                    <div className="wa-contact-card">
                      <div className="wa-contact-label">Name</div>
                      <div className="wa-contact-val">{a.seller?.fullName}</div>
                    </div>
                    <div className="wa-contact-card">
                      <div className="wa-contact-label">Mobile</div>
                      <div className="wa-contact-val">{a.seller?.mobile || "Not provided"}</div>
                    </div>
                    {a.seller?.location?.label && (
                      <div className="wa-contact-card" style={{ gridColumn: "1 / -1" }}>
                        <div className="wa-contact-label">Location</div>
                        <div className="wa-contact-val">{a.seller.location.label}</div>
                      </div>
                    )}
                  </div>
                </div>

                <div className="wa-divider" />
                <div className="wa-actions">
                  {a.seller?.location?.lat && (
                    <button
                      className="wa-btn wa-btn-map"
                      onClick={() => openDirections(a.seller.location.lat, a.seller.location.lng)}
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
                      Get directions
                    </button>
                  )}
                  <Link to={`/seller/${a.seller?._id}`} className="wa-btn wa-btn-secondary">
                    View seller profile
                  </Link>
                  {a.status === "completed" && (
                    <Link to="/my-reviews" className="wa-btn wa-btn-primary">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.1 8.3 22 9.3 17 14.1 18.2 21 12 17.8 5.8 21 7 14.1 2 9.3 8.9 8.3"/></svg>
                      Leave review
                    </Link>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </>
  );
}
