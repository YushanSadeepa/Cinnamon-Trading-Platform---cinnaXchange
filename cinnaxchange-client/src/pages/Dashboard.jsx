import { useSelector, useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../services/api";
import { logout } from "../redux/authSlice";

export default function Dashboard() {
  const { user } = useSelector((state) => state.auth);
  const role = user?.role; // Get user role
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [stats, setStats] = useState({
    // Buyer stats
    productsPurchased: 0,
    activeBids: 0,
    wonAuctions: 0,
    // Seller stats
    activeListings: 0,
    activeAuctions: 0,
    totalSales: 0,
    // Common
    trustScore: 0,
    // Admin stats
    totalUsers: 0,
    totalListings: 0,
    totalAuctions: 0,
    totalComplaints: 0,
  });

  useEffect(() => {
    if (user?._id) {
      loadDashboardData();
    }
  }, [user]);

  const loadDashboardData = async () => {
    try {
      // Get seller products
      const productsRes = await api.get("/products/my-products");

      // Get trust score
      const trustRes = await api.get(`/users/trust/${user._id}`);

      // Get user's purchases (for buyer)
      const purchasesRes = await api.get("/purchases/my-purchases");

      // Get user's bids (for buyer)
      const bidsRes = await api.get("/bids/my-bids");

      // Get user's won auctions (for buyer)
      const wonAuctionsRes = await api.get("/auctions/won");

      // Get total sales (for seller)
      const salesRes = await api.get("/sales/my-sales");

      // Admin stats (only if admin)
      let adminStats = {};
      if (role === "admin") {
        const usersRes = await api.get("/admin/users");
        const listingsRes = await api.get("/admin/listings");
        const auctionsRes = await api.get("/admin/auctions");
        const complaintsRes = await api.get("/admin/complaints");

        adminStats = {
          totalUsers: usersRes.data.length,
          totalListings: listingsRes.data.length,
          totalAuctions: auctionsRes.data.length,
          totalComplaints: complaintsRes.data.length,
        };
      }

      setStats({
        // Buyer stats
        productsPurchased: purchasesRes.data.length || 0,
        activeBids: bidsRes.data.filter((bid) => bid.status === "active").length || 0,
        wonAuctions: wonAuctionsRes.data.length || 0,
        // Seller stats
        activeListings: productsRes.data.filter((p) => p.isBuyNow && p.status === "active").length || 0,
        activeAuctions: productsRes.data.filter((p) => p.isAuction && p.status === "active").length || 0,
        totalSales: salesRes.data?.totalSales || 0,
        // Common
        trustScore: trustRes.data.trustScore || 0,
        // Admin stats
        ...adminStats,
      });
    } catch (error) {
      console.error("Dashboard Error:", error);
    }
  };

  const initials = (user?.fullName || "?")
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  const handleLogout = () => {
    dispatch(logout());
    // Clear the bfcache auth snapshot immediately so a back-button
    // press right after logout cannot show this page from cache.
    sessionStorage.setItem("cx-auth-snapshot", "false");
    // Hard navigation (not client-side route push) intentionally clears
    // React's in-memory tree and helps prevent this page from being
    // restorable via the browser back button.
    window.location.replace("/login");
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600;700&family=Inter:wght@300;400;500;600&display=swap');

        .cx-app {
          min-height: 100vh;
          background: #FBF6EF;
          font-family: 'Inter', sans-serif;
          color: #3D1C02;
        }

        /* ── NAVBAR ── */
        .cx-navbar {
          background: #3D1C02;
          padding: 14px 28px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          position: sticky;
          top: 0;
          z-index: 20;
        }
        .cx-nav-brand { display: flex; align-items: center; gap: 10px; }
        .cx-nav-brand-name {
          font-family: 'Playfair Display', serif;
          font-size: 19px;
          font-weight: 700;
          color: #F7F0E6;
          letter-spacing: 0.02em;
        }
        .cx-nav-right { display: flex; align-items: center; gap: 14px; }
        .cx-nav-user-text { text-align: right; }
        .cx-nav-user-name { font-size: 14px; font-weight: 500; color: #F7F0E6; line-height: 1.3; }
        .cx-nav-user-role {
          font-size: 11px; color: #C8722A; text-transform: capitalize;
          letter-spacing: 0.04em; line-height: 1.3;
        }
        .cx-nav-avatar {
          width: 38px; height: 38px; border-radius: 50%;
          background: rgba(200,114,42,0.18); border: 1px solid rgba(200,114,42,0.35);
          display: flex; align-items: center; justify-content: center;
          font-size: 13px; font-weight: 600; color: #D4A853;
          flex-shrink: 0;
        }
        .cx-logout-btn {
          display: flex; align-items: center; gap: 7px;
          background: transparent; border: 1px solid rgba(247,240,230,0.25);
          color: #F7F0E6; padding: 8px 14px; border-radius: 9px;
          font-size: 13px; font-weight: 500; cursor: pointer;
          transition: background 0.15s, border-color 0.15s;
        }
        .cx-logout-btn:hover {
          background: rgba(200,114,42,0.15);
          border-color: rgba(200,114,42,0.4);
          color: #F7F0E6;
        }

        /* ── LAYOUT ── */
        .cx-body { display: flex; }

        /* ── SIDEBAR ── */
        .cx-sidebar {
          width: 240px;
          background: #FFFFFF;
          border-right: 1px solid #EBDFCD;
          min-height: calc(100vh - 66px);
          padding: 24px 16px;
          flex-shrink: 0;
        }
        .cx-nav-section-label {
          font-size: 10px; font-weight: 600; letter-spacing: 0.1em;
          text-transform: uppercase; color: #B08060;
          padding: 0 12px; margin-bottom: 8px; margin-top: 20px;
        }
        .cx-nav-section-label:first-child { margin-top: 0; }
        .cx-sidebar ul { list-style: none; margin: 0; padding: 0; }
        .cx-sidebar li { margin-bottom: 2px; }
        .cx-sidebar a {
          display: flex; align-items: center; gap: 10px;
          padding: 10px 12px; border-radius: 9px;
          font-size: 14px; font-weight: 500; color: #6B4C35;
          text-decoration: none; transition: background 0.15s, color 0.15s;
        }
        .cx-sidebar a:hover { background: #FBF1E4; color: #3D1C02; }
        .cx-sidebar a.active {
          background: #FEF6EE; color: #C8722A;
          border: 1px solid rgba(200,114,42,0.25);
        }
        .cx-sidebar a svg { flex-shrink: 0; }

        /* ── MAIN ── */
        .cx-main { flex: 1; padding: 32px 36px; min-width: 0; }

        .cx-main-header {
          display: flex; justify-content: space-between; align-items: flex-start;
          margin-bottom: 28px; flex-wrap: wrap; gap: 16px;
        }
        .cx-main-eyebrow {
          font-size: 11px; font-weight: 600; letter-spacing: 0.1em;
          text-transform: uppercase; color: #C8722A; margin-bottom: 6px;
        }
        .cx-main-title {
          font-family: 'Playfair Display', serif;
          font-size: 28px; font-weight: 700; color: #3D1C02;
        }
        .cx-create-btn {
          display: inline-flex; align-items: center; gap: 8px;
          background: #3D1C02; color: #F7F0E6; border: none;
          padding: 11px 20px; border-radius: 10px;
          font-size: 14px; font-weight: 600; text-decoration: none;
          transition: background 0.2s;
        }
        .cx-create-btn:hover { background: #5A2A04; }

        /* ── STAT CARDS ── */
        .cx-stat-grid {
          display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px;
          margin-bottom: 28px;
        }
        @media (max-width: 900px) { .cx-stat-grid { grid-template-columns: repeat(2, 1fr); } }

        .cx-stat-card {
          background: #FFFFFF; border: 1px solid #EBDFCD; border-radius: 12px;
          padding: 20px 22px; position: relative; overflow: hidden;
        }
        .cx-stat-label {
          font-size: 12px; font-weight: 500; color: #8C6C52; margin-bottom: 10px;
        }
        .cx-stat-value {
          font-family: 'Playfair Display', serif;
          font-size: 30px; font-weight: 700; line-height: 1;
        }
        .cx-stat-icon {
          position: absolute; top: 18px; right: 18px;
          width: 34px; height: 34px; border-radius: 9px;
          display: flex; align-items: center; justify-content: center;
        }

        .cx-v-coral { color: #D85A30; }
        .cx-v-blue  { color: #185FA5; }
        .cx-v-green { color: #3B6D11; }
        .cx-v-amber { color: #854F0B; }
        .cx-v-purple{ color: #534AB7; }
        .cx-v-red   { color: #A32D2D; }

        .cx-bg-coral { background: #FAECE7; }
        .cx-bg-blue  { background: #E6F1FB; }
        .cx-bg-green { background: #EAF3DE; }
        .cx-bg-amber { background: #FAEEDA; }
        .cx-bg-purple{ background: #EEEDFE; }
        .cx-bg-red   { background: #FCEBEB; }

        /* ── ACCOUNT INFO CARD ── */
        .cx-info-card {
          background: #FFFFFF; border: 1px solid #EBDFCD; border-radius: 14px;
          padding: 24px 26px;
        }
        .cx-info-title {
          font-family: 'Playfair Display', serif;
          font-size: 18px; font-weight: 700; color: #3D1C02; margin-bottom: 18px;
        }
        .cx-info-row {
          display: flex; justify-content: space-between; align-items: center;
          padding: 12px 0; border-bottom: 1px solid #F3E9D8;
        }
        .cx-info-row:last-child { border-bottom: none; }
        .cx-info-key {
          font-size: 13px; font-weight: 500; color: #8C6C52;
          display: flex; align-items: center; gap: 8px;
        }
        .cx-info-val { font-size: 14px; font-weight: 500; color: #3D1C02; }

        .cx-badge {
          display: inline-flex; align-items: center; gap: 6px;
          padding: 4px 12px; border-radius: 20px;
          font-size: 12px; font-weight: 600;
        }
        .cx-badge-verified { background: #EAF3DE; color: #27500A; }
        .cx-badge-pending { background: #FAEEDA; color: #633806; }
        .cx-badge-trust { background: #FEF6EE; color: #854F0B; }
      `}</style>

      <div className="cx-app">
        {/* Navbar */}
        <nav className="cx-navbar">
          <div className="cx-nav-brand">
            <svg width="30" height="30" viewBox="0 0 42 42" fill="none">
              <circle cx="21" cy="21" r="21" fill="#C8722A" fillOpacity="0.15" />
              <path d="M21 8C21 8 10 13 10 21C10 27.627 14.925 33 21 33C27.075 33 32 27.627 32 21C32 16 28 11 28 11" stroke="#C8722A" strokeWidth="2" strokeLinecap="round" />
              <path d="M21 33C21 33 17 26 17 21C17 16.5 19.5 13 21 12C22.5 13 25 16.5 25 21C25 26 21 33 21 33Z" fill="#D4A853" fillOpacity="0.6" />
              <circle cx="21" cy="21" r="2.5" fill="#D4A853" />
            </svg>
            <span className="cx-nav-brand-name">CinnaXchange</span>
          </div>

          <div className="cx-nav-right">
            <div className="cx-nav-user-text">
              <div className="cx-nav-user-name">{user?.fullName}</div>
              <div className="cx-nav-user-role">{user?.role}</div>
            </div>
            <div className="cx-nav-avatar">{initials}</div>
            <button
              type="button"
              className="cx-logout-btn"
              onClick={handleLogout}
              aria-label="Log out"
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                <polyline points="16 17 21 12 16 7" />
                <line x1="21" y1="12" x2="9" y2="12" />
              </svg>
              Logout
            </button>
          </div>
        </nav>

        <div className="cx-body">
          {/* Sidebar */}
          <aside className="cx-sidebar">
            <p className="cx-nav-section-label">Overview</p>
            <ul>
              <li>
                <Link to="/dashboard" className="active">
                  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="3" width="7" height="9" rx="1" /><rect x="14" y="3" width="7" height="5" rx="1" /><rect x="14" y="12" width="7" height="9" rx="1" /><rect x="3" y="16" width="7" height="5" rx="1" />
                  </svg>
                  Dashboard
                </Link>
              </li>
            </ul>

            {role === "buyer" && (
              <>
                <p className="cx-nav-section-label">Trading</p>
                <ul>
                  <li>
                    <Link to="/products">
                      <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" /><line x1="3" y1="6" x2="21" y2="6" /><path d="M16 10a4 4 0 0 1-8 0" />
                      </svg>
                      Marketplace
                    </Link>
                  </li>
                  <li>
                    <Link to="/auction">
                      <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                        <path d="m14 4 6 6" /><path d="m4 14 6 6" /><path d="m12.5 5.5-7 7 1 1 7-7z" /><path d="m18.5 11.5-7 7 1 1 7-7z" /><path d="M2 22l3-1 1-3" />
                      </svg>
                      Auctions
                    </Link>
                  </li>
                  <li>
                    <Link to="/purchases">
                      <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="9" cy="21" r="1" /><circle cx="20" cy="21" r="1" /><path d="M1 1h4l2.7 13.4a2 2 0 0 0 2 1.6h9.7a2 2 0 0 0 2-1.6L23 6H6" />
                      </svg>
                      My purchases
                    </Link>
                  </li>
                </ul>
              </>
            )}

            {role === "seller" && (
              <>
                <p className="cx-nav-section-label">Trading</p>
                <ul>
                  <li>
                    <Link to="/my-products">
                      <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="2" y="7" width="20" height="14" rx="2" /><path d="M16 3h-4l-4 4M12 3v4" />
                      </svg>
                      My products
                    </Link>
                  </li>
                  <li>
                    <Link to="/create-product">
                      <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
                      </svg>
                      Create product
                    </Link>
                  </li>
                  <li>
                    <Link to="/my-auctions">
                      <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                        <path d="m14 4 6 6" /><path d="m4 14 6 6" /><path d="m12.5 5.5-7 7 1 1 7-7z" /><path d="m18.5 11.5-7 7 1 1 7-7z" />
                      </svg>
                      My auctions
                    </Link>
                  </li>
                </ul>
              </>
            )}

            {role === "admin" && (
              <>
                <p className="cx-nav-section-label">Administration</p>
                <ul>
                  <li>
                    <Link to="/admin">
                      <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M12 2 4 6v6c0 5 3.5 8.5 8 10 4.5-1.5 8-5 8-10V6z" />
                      </svg>
                      Admin dashboard
                    </Link>
                  </li>
                </ul>
              </>
            )}

            <p className="cx-nav-section-label">Account</p>
            <ul>
              <li>
                <Link to="/ratings">
                  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <polygon points="12 2 15.1 8.3 22 9.3 17 14.1 18.2 21 12 17.8 5.8 21 7 14.1 2 9.3 8.9 8.3" />
                  </svg>
                  Ratings & reviews
                </Link>
              </li>
            </ul>
          </aside>

          {/* Main Content */}
          <main className="cx-main">
            <div className="cx-main-header">
              <div>
                <p className="cx-main-eyebrow">
                  {role === "admin" ? "Platform overview" : "Trading floor"}
                </p>
                <h2 className="cx-main-title">Welcome back, {user?.fullName?.split(" ")[0]}</h2>
              </div>

              {role === "seller" && (
                <Link to="/create-product" className="cx-create-btn">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
                  </svg>
                  Create product
                </Link>
              )}
            </div>

            {/* Role-Based Stats Cards */}
            <div className="cx-stat-grid">
              {role === "buyer" && (
                <>
                  <div className="cx-stat-card">
                    <div className="cx-stat-icon cx-bg-purple">
                      <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#534AB7" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="9" cy="21" r="1" /><circle cx="20" cy="21" r="1" /><path d="M1 1h4l2.7 13.4a2 2 0 0 0 2 1.6h9.7a2 2 0 0 0 2-1.6L23 6H6" />
                      </svg>
                    </div>
                    <p className="cx-stat-label">Products purchased</p>
                    <p className="cx-stat-value cx-v-purple">{stats.productsPurchased}</p>
                  </div>

                  <div className="cx-stat-card">
                    <div className="cx-stat-icon cx-bg-blue">
                      <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#185FA5" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                        <path d="m14 4 6 6" /><path d="m4 14 6 6" /><path d="m12.5 5.5-7 7 1 1 7-7z" />
                      </svg>
                    </div>
                    <p className="cx-stat-label">Active bids</p>
                    <p className="cx-stat-value cx-v-blue">{stats.activeBids}</p>
                  </div>

                  <div className="cx-stat-card">
                    <div className="cx-stat-icon cx-bg-green">
                      <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#3B6D11" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M8.21 13.89 7 23l5-3 5 3-1.21-9.12" /><circle cx="12" cy="8" r="6" />
                      </svg>
                    </div>
                    <p className="cx-stat-label">Won auctions</p>
                    <p className="cx-stat-value cx-v-green">{stats.wonAuctions}</p>
                  </div>

                  <div className="cx-stat-card">
                    <div className="cx-stat-icon cx-bg-amber">
                      <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#854F0B" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M12 2 4 6v6c0 5 3.5 8.5 8 10 4.5-1.5 8-5 8-10V6z" />
                      </svg>
                    </div>
                    <p className="cx-stat-label">Trust score</p>
                    <p className="cx-stat-value cx-v-amber">{stats.trustScore}%</p>
                  </div>
                </>
              )}

              {role === "seller" && (
                <>
                  <div className="cx-stat-card">
                    <div className="cx-stat-icon cx-bg-green">
                      <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#3B6D11" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="2" y="7" width="20" height="14" rx="2" /><path d="M16 3h-4l-4 4M12 3v4" />
                      </svg>
                    </div>
                    <p className="cx-stat-label">Active listings</p>
                    <p className="cx-stat-value cx-v-green">{stats.activeListings}</p>
                  </div>

                  <div className="cx-stat-card">
                    <div className="cx-stat-icon cx-bg-blue">
                      <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#185FA5" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                        <path d="m14 4 6 6" /><path d="m4 14 6 6" /><path d="m12.5 5.5-7 7 1 1 7-7z" />
                      </svg>
                    </div>
                    <p className="cx-stat-label">Active auctions</p>
                    <p className="cx-stat-value cx-v-blue">{stats.activeAuctions}</p>
                  </div>

                  <div className="cx-stat-card">
                    <div className="cx-stat-icon cx-bg-amber">
                      <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#854F0B" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M12 2 4 6v6c0 5 3.5 8.5 8 10 4.5-1.5 8-5 8-10V6z" />
                      </svg>
                    </div>
                    <p className="cx-stat-label">Trust score</p>
                    <p className="cx-stat-value cx-v-amber">{stats.trustScore}%</p>
                  </div>

                  <div className="cx-stat-card">
                    <div className="cx-stat-icon cx-bg-purple">
                      <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#534AB7" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="12" y1="1" x2="12" y2="23" /><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                      </svg>
                    </div>
                    <p className="cx-stat-label">Total sales</p>
                    <p className="cx-stat-value cx-v-purple">LKR {stats.totalSales.toLocaleString()}</p>
                  </div>
                </>
              )}

              {role === "admin" && (
                <>
                  <div className="cx-stat-card">
                    <div className="cx-stat-icon cx-bg-blue">
                      <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#185FA5" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" />
                      </svg>
                    </div>
                    <p className="cx-stat-label">Total users</p>
                    <p className="cx-stat-value cx-v-blue">{stats.totalUsers}</p>
                  </div>

                  <div className="cx-stat-card">
                    <div className="cx-stat-icon cx-bg-green">
                      <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#3B6D11" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="2" y="7" width="20" height="14" rx="2" /><path d="M16 3h-4l-4 4M12 3v4" />
                      </svg>
                    </div>
                    <p className="cx-stat-label">Total listings</p>
                    <p className="cx-stat-value cx-v-green">{stats.totalListings}</p>
                  </div>

                  <div className="cx-stat-card">
                    <div className="cx-stat-icon cx-bg-purple">
                      <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#534AB7" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                        <path d="m14 4 6 6" /><path d="m4 14 6 6" /><path d="m12.5 5.5-7 7 1 1 7-7z" />
                      </svg>
                    </div>
                    <p className="cx-stat-label">Total auctions</p>
                    <p className="cx-stat-value cx-v-purple">{stats.totalAuctions}</p>
                  </div>

                  <div className="cx-stat-card">
                    <div className="cx-stat-icon cx-bg-red">
                      <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#A32D2D" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" /><line x1="12" y1="9" x2="12" y2="13" /><line x1="12" y1="17" x2="12.01" y2="17" />
                      </svg>
                    </div>
                    <p className="cx-stat-label">Total complaints</p>
                    <p className="cx-stat-value cx-v-red">{stats.totalComplaints}</p>
                  </div>
                </>
              )}
            </div>

            {/* Account Info */}
            <div className="cx-info-card">
              <h3 className="cx-info-title">Account information</h3>

              <div className="cx-info-row">
                <span className="cx-info-key">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#B08060" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="8" r="4" /><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
                  </svg>
                  Name
                </span>
                <span className="cx-info-val">{user?.fullName}</span>
              </div>

              <div className="cx-info-row">
                <span className="cx-info-key">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#B08060" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="2" y="4" width="20" height="16" rx="2" /><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                  </svg>
                  Email
                </span>
                <span className="cx-info-val">{user?.email}</span>
              </div>

              <div className="cx-info-row">
                <span className="cx-info-key">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#B08060" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" /><line x1="3" y1="6" x2="21" y2="6" /><path d="M16 10a4 4 0 0 1-8 0" />
                  </svg>
                  Role
                </span>
                <span className="cx-info-val" style={{ textTransform: "capitalize" }}>{user?.role}</span>
              </div>

              <div className="cx-info-row">
                <span className="cx-info-key">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#B08060" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="11" width="18" height="11" rx="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" />
                  </svg>
                  Verification
                </span>
                {user?.isVerified ? (
                  <span className="cx-badge cx-badge-verified">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#27500A" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                    Verified
                  </span>
                ) : (
                  <span className="cx-badge cx-badge-pending">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#633806" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
                    </svg>
                    Pending verification
                  </span>
                )}
              </div>

              <div className="cx-info-row">
                <span className="cx-info-key">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#B08060" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 2 4 6v6c0 5 3.5 8.5 8 10 4.5-1.5 8-5 8-10V6z" />
                  </svg>
                  Trust score
                </span>
                <span className="cx-badge cx-badge-trust">{stats.trustScore}%</span>
              </div>
            </div>
          </main>
        </div>
      </div>
    </>
  );
}