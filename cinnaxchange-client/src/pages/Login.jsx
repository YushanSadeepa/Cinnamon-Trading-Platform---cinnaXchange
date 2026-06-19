import { useState } from "react";
import api from "../services/api";
import { useDispatch } from "react-redux";
import { loginSuccess } from "../redux/authSlice";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await api.post("/auth/login", { email, password });
      dispatch(loginSuccess(res.data));
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700&family=Inter:wght@300;400;500;600&display=swap');

        .cx-root {
          min-height: 100vh;
          display: flex;
          font-family: 'Inter', sans-serif;
          background: #FBF6EF;
        }

        /* ── LEFT PANEL ── */
        .cx-left {
          display: none;
          flex: 1;
          position: relative;
          background: #3D1C02;
          overflow: hidden;
          flex-direction: column;
          justify-content: space-between;
          padding: 48px;
        }

        @media (min-width: 900px) {
          .cx-left { display: flex; }
        }

        .cx-bark-layer {
          position: absolute;
          inset: 0;
          background:
            repeating-linear-gradient(
              168deg,
              transparent,
              transparent 18px,
              rgba(200, 114, 42, 0.07) 18px,
              rgba(200, 114, 42, 0.07) 19px
            ),
            repeating-linear-gradient(
              12deg,
              transparent,
              transparent 28px,
              rgba(255, 255, 255, 0.025) 28px,
              rgba(255, 255, 255, 0.025) 29px
            );
          pointer-events: none;
        }

        .cx-quill {
          position: absolute;
          border-radius: 50%;
          opacity: 0.08;
        }
        .cx-quill-1 {
          width: 340px; height: 340px;
          background: radial-gradient(circle, #C8722A 0%, transparent 70%);
          top: -80px; right: -80px;
        }
        .cx-quill-2 {
          width: 240px; height: 240px;
          background: radial-gradient(circle, #D4A853 0%, transparent 70%);
          bottom: 60px; left: -60px;
        }

        .cx-left-top {
          position: relative;
          z-index: 1;
        }

        .cx-brand-mark {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 64px;
        }

        .cx-logo-icon {
          width: 42px;
          height: 42px;
        }

        .cx-brand-name {
          font-family: 'Playfair Display', serif;
          font-size: 22px;
          font-weight: 700;
          color: #F7F0E6;
          letter-spacing: 0.02em;
        }

        .cx-tagline-block {
          margin-bottom: 48px;
        }

        .cx-tagline-eyebrow {
          font-size: 11px;
          font-weight: 600;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: #C8722A;
          margin-bottom: 16px;
        }

        .cx-tagline-headline {
          font-family: 'Playfair Display', serif;
          font-size: 38px;
          font-weight: 700;
          line-height: 1.2;
          color: #F7F0E6;
          margin-bottom: 20px;
        }

        .cx-tagline-headline em {
          color: #D4A853;
          font-style: normal;
        }

        .cx-tagline-body {
          font-size: 15px;
          font-weight: 300;
          line-height: 1.7;
          color: rgba(247, 240, 230, 0.65);
          max-width: 320px;
        }

        .cx-stats {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1px;
          background: rgba(255,255,255,0.1);
          border-radius: 12px;
          overflow: hidden;
          position: relative;
          z-index: 1;
        }

        .cx-stat {
          background: rgba(61, 28, 2, 0.85);
          padding: 20px 22px;
        }

        .cx-stat-value {
          font-family: 'Playfair Display', serif;
          font-size: 28px;
          font-weight: 600;
          color: #D4A853;
          line-height: 1;
          margin-bottom: 6px;
        }

        .cx-stat-label {
          font-size: 12px;
          font-weight: 400;
          color: rgba(247, 240, 230, 0.5);
          letter-spacing: 0.04em;
        }

        .cx-left-bottom {
          position: relative;
          z-index: 1;
          border-top: 1px solid rgba(255,255,255,0.1);
          padding-top: 24px;
        }

        .cx-grade-pills {
          display: flex;
          gap: 8px;
          flex-wrap: wrap;
        }

        .cx-pill {
          font-size: 11px;
          font-weight: 500;
          padding: 5px 12px;
          border-radius: 20px;
          background: rgba(200, 114, 42, 0.15);
          color: #C8722A;
          border: 1px solid rgba(200, 114, 42, 0.25);
          letter-spacing: 0.06em;
        }

        .cx-pill-label {
          font-size: 11px;
          color: rgba(247, 240, 230, 0.35);
          margin-bottom: 10px;
          letter-spacing: 0.06em;
          text-transform: uppercase;
        }

        /* ── RIGHT PANEL ── */
        .cx-right {
          flex: 0 0 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 32px 24px;
          background: #FBF6EF;
        }

        @media (min-width: 900px) {
          .cx-right {
            flex: 0 0 480px;
          }
        }

        .cx-form-wrap {
          width: 100%;
          max-width: 380px;
          animation: cx-fadein 0.5s ease both;
        }

        @keyframes cx-fadein {
          from { opacity: 0; transform: translateY(12px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        .cx-mobile-brand {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 40px;
        }

        @media (min-width: 900px) {
          .cx-mobile-brand { display: none; }
        }

        .cx-form-heading {
          font-family: 'Playfair Display', serif;
          font-size: 28px;
          font-weight: 700;
          color: #3D1C02;
          margin-bottom: 6px;
        }

        .cx-form-subheading {
          font-size: 14px;
          color: #8C6C52;
          margin-bottom: 36px;
        }

        .cx-field {
          margin-bottom: 20px;
        }

        .cx-label {
          display: block;
          font-size: 12px;
          font-weight: 600;
          letter-spacing: 0.06em;
          text-transform: uppercase;
          color: #6B4C35;
          margin-bottom: 8px;
        }

        .cx-input-wrap {
          position: relative;
        }

        .cx-input-icon {
          position: absolute;
          left: 14px;
          top: 50%;
          transform: translateY(-50%);
          color: #B08060;
          font-size: 16px;
          pointer-events: none;
        }

        .cx-input {
          width: 100%;
          height: 48px;
          padding: 0 44px 0 42px;
          border: 1.5px solid #E0CDB8;
          border-radius: 10px;
          background: #FFFFFF;
          font-family: 'Inter', sans-serif;
          font-size: 15px;
          color: #3D1C02;
          outline: none;
          transition: border-color 0.2s, box-shadow 0.2s;
          box-sizing: border-box;
        }

        .cx-input::placeholder {
          color: #C4A88A;
        }

        .cx-input:focus {
          border-color: #C8722A;
          box-shadow: 0 0 0 3px rgba(200, 114, 42, 0.12);
        }

        .cx-toggle-pw {
          position: absolute;
          right: 14px;
          top: 50%;
          transform: translateY(-50%);
          background: none;
          border: none;
          cursor: pointer;
          color: #B08060;
          font-size: 16px;
          padding: 4px;
          display: flex;
          align-items: center;
        }

        .cx-toggle-pw:hover {
          color: #C8722A;
        }

        .cx-error {
          display: flex;
          align-items: center;
          gap: 8px;
          background: #FEF2EC;
          border: 1px solid #F5C4B3;
          border-radius: 8px;
          padding: 10px 14px;
          font-size: 13px;
          color: #993C1D;
          margin-bottom: 20px;
        }

        .cx-forgot {
          text-align: right;
          margin-top: -10px;
          margin-bottom: 28px;
        }

        .cx-forgot a {
          font-size: 13px;
          color: #C8722A;
          text-decoration: none;
          font-weight: 500;
        }

        .cx-forgot a:hover {
          text-decoration: underline;
        }

        .cx-submit {
          width: 100%;
          height: 50px;
          background: #3D1C02;
          color: #F7F0E6;
          border: none;
          border-radius: 10px;
          font-family: 'Inter', sans-serif;
          font-size: 15px;
          font-weight: 600;
          cursor: pointer;
          letter-spacing: 0.04em;
          transition: background 0.2s, transform 0.1s;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          margin-bottom: 24px;
        }

        .cx-submit:hover:not(:disabled) {
          background: #5A2A04;
        }

        .cx-submit:active:not(:disabled) {
          transform: scale(0.985);
        }

        .cx-submit:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .cx-spinner {
          width: 18px;
          height: 18px;
          border: 2px solid rgba(247,240,230,0.3);
          border-top-color: #F7F0E6;
          border-radius: 50%;
          animation: cx-spin 0.7s linear infinite;
          flex-shrink: 0;
        }

        @keyframes cx-spin {
          to { transform: rotate(360deg); }
        }

        .cx-divider {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 20px;
        }

        .cx-divider-line {
          flex: 1;
          height: 1px;
          background: #E0CDB8;
        }

        .cx-divider-text {
          font-size: 12px;
          color: #B08060;
          font-weight: 500;
        }

        .cx-register {
          text-align: center;
          font-size: 14px;
          color: #8C6C52;
        }

        .cx-register a {
          color: #C8722A;
          font-weight: 600;
          text-decoration: none;
        }

        .cx-register a:hover {
          text-decoration: underline;
        }

        .cx-footer-note {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          margin-top: 32px;
          font-size: 12px;
          color: #B08060;
        }
      `}</style>

      <div className="cx-root">
        {/* LEFT PANEL */}
        <div className="cx-left">
          <div className="cx-bark-layer" />
          <div className="cx-quill cx-quill-1" />
          <div className="cx-quill cx-quill-2" />

          <div className="cx-left-top">
            <div className="cx-brand-mark">
              <svg className="cx-logo-icon" viewBox="0 0 42 42" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="21" cy="21" r="21" fill="#C8722A" fillOpacity="0.15"/>
                <path d="M21 8C21 8 10 13 10 21C10 27.627 14.925 33 21 33C27.075 33 32 27.627 32 21C32 16 28 11 28 11" stroke="#C8722A" strokeWidth="2" strokeLinecap="round"/>
                <path d="M21 33C21 33 17 26 17 21C17 16.5 19.5 13 21 12C22.5 13 25 16.5 25 21C25 26 21 33 21 33Z" fill="#D4A853" fillOpacity="0.6"/>
                <circle cx="21" cy="21" r="2.5" fill="#D4A853"/>
              </svg>
              <span className="cx-brand-name">CinnaXchange</span>
            </div>

            <div className="cx-tagline-block">
              <p className="cx-tagline-eyebrow">Sri Lanka's Spice Exchange</p>
              <h1 className="cx-tagline-headline">
                Trade Ceylon's<br /><em>finest quills</em>,<br />in real time.
              </h1>
              <p className="cx-tagline-body">
                Live auctions, verified grades, and direct connections
                between growers and global buyers — all in one platform.
              </p>
            </div>

            <div className="cx-stats">
              <div className="cx-stat">
                <div className="cx-stat-value">6</div>
                <div className="cx-stat-label">Ceylon grades traded</div>
              </div>
              <div className="cx-stat">
                <div className="cx-stat-value">LKR</div>
                <div className="cx-stat-label">Live pricing in rupees</div>
              </div>
              <div className="cx-stat">
                <div className="cx-stat-value">9</div>
                <div className="cx-stat-label">Provinces tracked</div>
              </div>
              <div className="cx-stat">
                <div className="cx-stat-value">KYC</div>
                <div className="cx-stat-label">Verified traders only</div>
              </div>
            </div>
          </div>

          <div className="cx-left-bottom">
            <p className="cx-pill-label">Traded grades</p>
            <div className="cx-grade-pills">
              {["Alba", "C5", "C4", "C3", "M5", "H1", "Hamburg"].map((g) => (
                <span className="cx-pill" key={g}>{g}</span>
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT PANEL */}
        <div className="cx-right">
          <div className="cx-form-wrap">
            {/* Mobile-only brand */}
            <div className="cx-mobile-brand">
              <svg width="32" height="32" viewBox="0 0 42 42" fill="none">
                <circle cx="21" cy="21" r="21" fill="#C8722A" fillOpacity="0.15"/>
                <path d="M21 8C21 8 10 13 10 21C10 27.627 14.925 33 21 33C27.075 33 32 27.627 32 21C32 16 28 11 28 11" stroke="#C8722A" strokeWidth="2" strokeLinecap="round"/>
                <path d="M21 33C21 33 17 26 17 21C17 16.5 19.5 13 21 12C22.5 13 25 16.5 25 21C25 26 21 33 21 33Z" fill="#D4A853" fillOpacity="0.6"/>
              </svg>
              <span style={{ fontFamily: "'Playfair Display', serif", fontWeight: 700, fontSize: 18, color: "#3D1C02" }}>
                CinnaXchange
              </span>
            </div>

            <h2 className="cx-form-heading">Welcome back</h2>
            <p className="cx-form-subheading">Sign in to access the trading floor</p>

            {error && (
              <div className="cx-error">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                  <circle cx="8" cy="8" r="7.5" stroke="#993C1D"/>
                  <path d="M8 4.5V8.5M8 11H8.01" stroke="#993C1D" strokeWidth="1.5" strokeLinecap="round"/>
                </svg>
                {error}
              </div>
            )}

            <form onSubmit={handleLogin}>
              <div className="cx-field">
                <label className="cx-label" htmlFor="cx-email">Email address</label>
                <div className="cx-input-wrap">
                  <span className="cx-input-icon" aria-hidden="true">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="2" y="4" width="20" height="16" rx="2"/>
                      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
                    </svg>
                  </span>
                  <input
                    id="cx-email"
                    type="email"
                    className="cx-input"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    autoComplete="email"
                  />
                </div>
              </div>

              <div className="cx-field">
                <label className="cx-label" htmlFor="cx-password">Password</label>
                <div className="cx-input-wrap">
                  <span className="cx-input-icon" aria-hidden="true">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="3" y="11" width="18" height="11" rx="2"/>
                      <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                    </svg>
                  </span>
                  <input
                    id="cx-password"
                    type={showPassword ? "text" : "password"}
                    className="cx-input"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    autoComplete="current-password"
                  />
                  <button
                    type="button"
                    className="cx-toggle-pw"
                    onClick={() => setShowPassword((v) => !v)}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? (
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/>
                        <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/>
                        <line x1="1" y1="1" x2="23" y2="23"/>
                      </svg>
                    ) : (
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                        <circle cx="12" cy="12" r="3"/>
                      </svg>
                    )}
                  </button>
                </div>
              </div>

              <div className="cx-forgot">
                <a href="/forgot-password">Forgot password?</a>
              </div>

              <button type="submit" className="cx-submit" disabled={loading}>
                {loading ? (
                  <>
                    <span className="cx-spinner" />
                    Signing in…
                  </>
                ) : (
                  "Sign in to CinnaXchange"
                )}
              </button>
            </form>

            <div className="cx-divider">
              <div className="cx-divider-line" />
              <span className="cx-divider-text">New to the platform?</span>
              <div className="cx-divider-line" />
            </div>

            <p className="cx-register">
              <a href="/register">Create a trader account</a>
            </p>

            <div className="cx-footer-note">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <rect x="3" y="11" width="18" height="11" rx="2"/>
                <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
              </svg>
              KYC verified · Secured connection
            </div>
          </div>
        </div>
      </div>
    </>
  );
}