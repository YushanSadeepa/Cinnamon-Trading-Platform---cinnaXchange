import { useState } from "react";
import api from "../services/api";
import { useNavigate } from "react-router-dom";

export default function Register() {
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    password: "",
    role: "buyer",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await api.post("/auth/register", form);
      navigate("/login");
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed. Please try again.");
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
          position: absolute; inset: 0; pointer-events: none;
          background:
            repeating-linear-gradient(168deg, transparent, transparent 18px, rgba(200,114,42,0.07) 18px, rgba(200,114,42,0.07) 19px),
            repeating-linear-gradient(12deg, transparent, transparent 28px, rgba(255,255,255,0.025) 28px, rgba(255,255,255,0.025) 29px);
        }
        .cx-quill { position: absolute; border-radius: 50%; opacity: 0.08; }
        .cx-quill-1 { width: 340px; height: 340px; background: radial-gradient(circle, #C8722A 0%, transparent 70%); top: -80px; right: -80px; }
        .cx-quill-2 { width: 240px; height: 240px; background: radial-gradient(circle, #D4A853 0%, transparent 70%); bottom: 60px; left: -60px; }

        .cx-left-top { position: relative; z-index: 1; }

        .cx-brand-mark { display: flex; align-items: center; gap: 12px; margin-bottom: 56px; }
        .cx-brand-name {
          font-family: 'Playfair Display', serif; font-size: 22px;
          font-weight: 700; color: #F7F0E6; letter-spacing: 0.02em;
        }

        .cx-tagline-eyebrow {
          font-size: 11px; font-weight: 600; letter-spacing: 0.14em;
          text-transform: uppercase; color: #C8722A; margin-bottom: 16px;
        }
        .cx-tagline-headline {
          font-family: 'Playfair Display', serif; font-size: 36px;
          font-weight: 700; line-height: 1.22; color: #F7F0E6; margin-bottom: 20px;
        }
        .cx-tagline-headline em { color: #D4A853; font-style: normal; }
        .cx-tagline-body {
          font-size: 14px; font-weight: 300; line-height: 1.7;
          color: rgba(247,240,230,0.6); max-width: 320px; margin-bottom: 36px;
        }

        .cx-steps { display: flex; flex-direction: column; gap: 16px; }
        .cx-step { display: flex; align-items: flex-start; gap: 14px; }
        .cx-step-num {
          flex-shrink: 0; width: 28px; height: 28px; border-radius: 50%;
          background: rgba(200,114,42,0.18); border: 1px solid rgba(200,114,42,0.35);
          display: flex; align-items: center; justify-content: center;
          font-size: 12px; font-weight: 600; color: #C8722A;
        }
        .cx-step-text { padding-top: 4px; }
        .cx-step-title { font-size: 13px; font-weight: 500; color: #F7F0E6; margin-bottom: 2px; }
        .cx-step-desc { font-size: 12px; color: rgba(247,240,230,0.45); line-height: 1.5; }

        .cx-left-bottom {
          position: relative; z-index: 1;
          border-top: 1px solid rgba(255,255,255,0.1); padding-top: 24px;
        }
        .cx-pill-label { font-size: 11px; color: rgba(247,240,230,0.35); margin-bottom: 10px; letter-spacing: 0.06em; text-transform: uppercase; }
        .cx-grade-pills { display: flex; gap: 8px; flex-wrap: wrap; }
        .cx-pill {
          font-size: 11px; font-weight: 500; padding: 5px 12px; border-radius: 20px;
          background: rgba(200,114,42,0.15); color: #C8722A;
          border: 1px solid rgba(200,114,42,0.25); letter-spacing: 0.06em;
        }

        /* ── RIGHT PANEL ── */
        .cx-right {
          flex: 0 0 100%; display: flex; align-items: center;
          justify-content: center; padding: 40px 24px; background: #FBF6EF;
        }
        @media (min-width: 900px) { .cx-right { flex: 0 0 480px; } }

        .cx-form-wrap {
          width: 100%; max-width: 380px;
          animation: cx-fadein 0.5s ease both;
        }
        @keyframes cx-fadein {
          from { opacity: 0; transform: translateY(12px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        .cx-mobile-brand {
          display: flex; align-items: center; gap: 10px; margin-bottom: 36px;
        }
        @media (min-width: 900px) { .cx-mobile-brand { display: none; } }

        .cx-form-heading {
          font-family: 'Playfair Display', serif; font-size: 26px;
          font-weight: 700; color: #3D1C02; margin-bottom: 4px;
        }
        .cx-form-subheading { font-size: 14px; color: #8C6C52; margin-bottom: 28px; }

        .cx-field { margin-bottom: 16px; }
        .cx-label {
          display: block; font-size: 11px; font-weight: 600;
          letter-spacing: 0.07em; text-transform: uppercase;
          color: #6B4C35; margin-bottom: 7px;
        }
        .cx-input-wrap { position: relative; }
        .cx-input-icon {
          position: absolute; left: 14px; top: 50%; transform: translateY(-50%);
          color: #B08060; font-size: 15px; pointer-events: none;
        }
        .cx-input {
          width: 100%; height: 46px; padding: 0 44px 0 40px;
          border: 1.5px solid #E0CDB8; border-radius: 10px;
          background: #FFFFFF; font-family: 'Inter', sans-serif;
          font-size: 14px; color: #3D1C02; outline: none;
          transition: border-color 0.2s, box-shadow 0.2s; box-sizing: border-box;
        }
        .cx-input::placeholder { color: #C4A88A; }
        .cx-input:focus {
          border-color: #C8722A;
          box-shadow: 0 0 0 3px rgba(200,114,42,0.12);
        }
        .cx-toggle-pw {
          position: absolute; right: 13px; top: 50%; transform: translateY(-50%);
          background: none; border: none; cursor: pointer; color: #B08060;
          display: flex; align-items: center; padding: 4px;
        }
        .cx-toggle-pw:hover { color: #C8722A; }

        /* Role selector */
        .cx-role-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
        .cx-role-card {
          border: 1.5px solid #E0CDB8; border-radius: 10px;
          background: #FFFFFF; padding: 14px 16px; cursor: pointer;
          transition: border-color 0.2s, box-shadow 0.2s;
          display: flex; flex-direction: column; gap: 4px;
          position: relative;
        }
        .cx-role-card:hover { border-color: #C8722A; }
        .cx-role-card.active {
          border-color: #C8722A;
          background: #FEF6EE;
          box-shadow: 0 0 0 3px rgba(200,114,42,0.1);
        }
        .cx-role-dot {
          position: absolute; top: 12px; right: 12px;
          width: 16px; height: 16px; border-radius: 50%;
          border: 1.5px solid #E0CDB8; background: #fff;
          transition: background 0.2s, border-color 0.2s;
        }
        .cx-role-card.active .cx-role-dot {
          background: #C8722A; border-color: #C8722A;
        }
        .cx-role-icon { font-size: 20px; margin-bottom: 4px; }
        .cx-role-title { font-size: 13px; font-weight: 600; color: #3D1C02; }
        .cx-role-desc { font-size: 11px; color: #8C6C52; line-height: 1.4; }

        .cx-error {
          display: flex; align-items: center; gap: 8px;
          background: #FEF2EC; border: 1px solid #F5C4B3; border-radius: 8px;
          padding: 10px 14px; font-size: 13px; color: #993C1D; margin-bottom: 18px;
        }

        .cx-submit {
          width: 100%; height: 48px; background: #3D1C02; color: #F7F0E6;
          border: none; border-radius: 10px; font-family: 'Inter', sans-serif;
          font-size: 14px; font-weight: 600; cursor: pointer; letter-spacing: 0.04em;
          transition: background 0.2s, transform 0.1s;
          display: flex; align-items: center; justify-content: center;
          gap: 10px; margin-bottom: 22px; margin-top: 6px;
        }
        .cx-submit:hover:not(:disabled) { background: #5A2A04; }
        .cx-submit:active:not(:disabled) { transform: scale(0.985); }
        .cx-submit:disabled { opacity: 0.6; cursor: not-allowed; }

        .cx-spinner {
          width: 17px; height: 17px;
          border: 2px solid rgba(247,240,230,0.3);
          border-top-color: #F7F0E6; border-radius: 50%;
          animation: cx-spin 0.7s linear infinite; flex-shrink: 0;
        }
        @keyframes cx-spin { to { transform: rotate(360deg); } }

        .cx-divider {
          display: flex; align-items: center; gap: 12px; margin-bottom: 18px;
        }
        .cx-divider-line { flex: 1; height: 1px; background: #E0CDB8; }
        .cx-divider-text { font-size: 12px; color: #B08060; font-weight: 500; }

        .cx-login { text-align: center; font-size: 14px; color: #8C6C52; }
        .cx-login a { color: #C8722A; font-weight: 600; text-decoration: none; }
        .cx-login a:hover { text-decoration: underline; }

        .cx-footer-note {
          display: flex; align-items: center; justify-content: center;
          gap: 6px; margin-top: 28px; font-size: 12px; color: #B08060;
        }
      `}</style>

      <div className="cx-root">
        {/* ── LEFT PANEL ── */}
        <div className="cx-left">
          <div className="cx-bark-layer" />
          <div className="cx-quill cx-quill-1" />
          <div className="cx-quill cx-quill-2" />

          <div className="cx-left-top">
            <div className="cx-brand-mark">
              <svg width="42" height="42" viewBox="0 0 42 42" fill="none">
                <circle cx="21" cy="21" r="21" fill="#C8722A" fillOpacity="0.15"/>
                <path d="M21 8C21 8 10 13 10 21C10 27.627 14.925 33 21 33C27.075 33 32 27.627 32 21C32 16 28 11 28 11" stroke="#C8722A" strokeWidth="2" strokeLinecap="round"/>
                <path d="M21 33C21 33 17 26 17 21C17 16.5 19.5 13 21 12C22.5 13 25 16.5 25 21C25 26 21 33 21 33Z" fill="#D4A853" fillOpacity="0.6"/>
                <circle cx="21" cy="21" r="2.5" fill="#D4A853"/>
              </svg>
              <span className="cx-brand-name">CinnaXchange</span>
            </div>

            <p className="cx-tagline-eyebrow">Join the Exchange</p>
            <h1 className="cx-tagline-headline">
              Your gateway to<br /><em>Ceylon's finest</em><br />cinnamon market.
            </h1>
            <p className="cx-tagline-body">
              Register as a verified trader and access live auctions,
              real-time pricing, and direct connections across Sri Lanka's
              cinnamon provinces.
            </p>

            <div className="cx-steps">
              {[
                { n: "1", title: "Create your account", desc: "Fill in your details and choose your trader role." },
                { n: "2", title: "Complete KYC verification", desc: "Submit your NIC to verify your identity." },
                { n: "3", title: "Start trading", desc: "Bid on auctions or list your cinnamon grades live." },
              ].map((s) => (
                <div className="cx-step" key={s.n}>
                  <div className="cx-step-num">{s.n}</div>
                  <div className="cx-step-text">
                    <div className="cx-step-title">{s.title}</div>
                    <div className="cx-step-desc">{s.desc}</div>
                  </div>
                </div>
              ))}
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

        {/* ── RIGHT PANEL ── */}
        <div className="cx-right">
          <div className="cx-form-wrap">
            {/* Mobile-only brand */}
            <div className="cx-mobile-brand">
              <svg width="30" height="30" viewBox="0 0 42 42" fill="none">
                <circle cx="21" cy="21" r="21" fill="#C8722A" fillOpacity="0.15"/>
                <path d="M21 8C21 8 10 13 10 21C10 27.627 14.925 33 21 33C27.075 33 32 27.627 32 21C32 16 28 11 28 11" stroke="#C8722A" strokeWidth="2" strokeLinecap="round"/>
                <path d="M21 33C21 33 17 26 17 21C17 16.5 19.5 13 21 12C22.5 13 25 16.5 25 21C25 26 21 33 21 33Z" fill="#D4A853" fillOpacity="0.6"/>
              </svg>
              <span style={{ fontFamily: "'Playfair Display', serif", fontWeight: 700, fontSize: 18, color: "#3D1C02" }}>
                CinnaXchange
              </span>
            </div>

            <h2 className="cx-form-heading">Create your account</h2>
            <p className="cx-form-subheading">Join Sri Lanka's cinnamon trading platform</p>

            {error && (
              <div className="cx-error">
                <svg width="15" height="15" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                  <circle cx="8" cy="8" r="7.5" stroke="#993C1D"/>
                  <path d="M8 4.5V8.5M8 11H8.01" stroke="#993C1D" strokeWidth="1.5" strokeLinecap="round"/>
                </svg>
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              {/* Full Name */}
              <div className="cx-field">
                <label className="cx-label" htmlFor="cx-fullName">Full name</label>
                <div className="cx-input-wrap">
                  <span className="cx-input-icon" aria-hidden="true">
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/>
                    </svg>
                  </span>
                  <input
                    id="cx-fullName"
                    name="fullName"
                    type="text"
                    className="cx-input"
                    placeholder="Kavindu Perera"
                    value={form.fullName}
                    onChange={handleChange}
                    required
                    autoComplete="name"
                  />
                </div>
              </div>

              {/* Email */}
              <div className="cx-field">
                <label className="cx-label" htmlFor="cx-email">Email address</label>
                <div className="cx-input-wrap">
                  <span className="cx-input-icon" aria-hidden="true">
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
                    </svg>
                  </span>
                  <input
                    id="cx-email"
                    name="email"
                    type="email"
                    className="cx-input"
                    placeholder="you@example.com"
                    value={form.email}
                    onChange={handleChange}
                    required
                    autoComplete="email"
                  />
                </div>
              </div>

              {/* Password */}
              <div className="cx-field">
                <label className="cx-label" htmlFor="cx-password">Password</label>
                <div className="cx-input-wrap">
                  <span className="cx-input-icon" aria-hidden="true">
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                    </svg>
                  </span>
                  <input
                    id="cx-password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    className="cx-input"
                    placeholder="Min. 8 characters"
                    value={form.password}
                    onChange={handleChange}
                    required
                    minLength={8}
                    autoComplete="new-password"
                  />
                  <button
                    type="button"
                    className="cx-toggle-pw"
                    onClick={() => setShowPassword((v) => !v)}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? (
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/>
                        <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/>
                        <line x1="1" y1="1" x2="23" y2="23"/>
                      </svg>
                    ) : (
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                        <circle cx="12" cy="12" r="3"/>
                      </svg>
                    )}
                  </button>
                </div>
              </div>

              {/* Role selector */}
              <div className="cx-field">
                <label className="cx-label">I am joining as a</label>
                <div className="cx-role-grid">
                  {[
                    {
                      value: "buyer",
                      icon: (
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#C8722A" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/>
                          <line x1="3" y1="6" x2="21" y2="6"/>
                          <path d="M16 10a4 4 0 0 1-8 0"/>
                        </svg>
                      ),
                      title: "Buyer",
                      desc: "Source & bid on cinnamon grades",
                    },
                    {
                      value: "seller",
                      icon: (
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#C8722A" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M12 2a10 10 0 1 0 0 20A10 10 0 0 0 12 2z"/>
                          <path d="M12 6v6l4 2"/>
                        </svg>
                      ),
                      title: "Seller",
                      desc: "List & auction your harvest",
                    },
                  ].map((r) => (
                    <div
                      key={r.value}
                      className={`cx-role-card${form.role === r.value ? " active" : ""}`}
                      onClick={() => setForm({ ...form, role: r.value })}
                      role="radio"
                      aria-checked={form.role === r.value}
                      tabIndex={0}
                      onKeyDown={(e) => e.key === "Enter" && setForm({ ...form, role: r.value })}
                    >
                      <div className="cx-role-dot" />
                      <div className="cx-role-icon">{r.icon}</div>
                      <div className="cx-role-title">{r.title}</div>
                      <div className="cx-role-desc">{r.desc}</div>
                    </div>
                  ))}
                </div>
                {/* Hidden native select for form submission compatibility */}
                <select name="role" value={form.role} onChange={handleChange} style={{ display: "none" }} aria-hidden="true">
                  <option value="buyer">Buyer</option>
                  <option value="seller">Seller</option>
                </select>
              </div>

              <button type="submit" className="cx-submit" disabled={loading}>
                {loading ? (
                  <>
                    <span className="cx-spinner" />
                    Creating account…
                  </>
                ) : (
                  "Create trader account"
                )}
              </button>
            </form>

            <div className="cx-divider">
              <div className="cx-divider-line" />
              <span className="cx-divider-text">Already have an account?</span>
              <div className="cx-divider-line" />
            </div>

            <p className="cx-login">
              <a href="/login">Sign in to CinnaXchange</a>
            </p>

            <div className="cx-footer-note">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
              </svg>
              KYC verified · Secured connection
            </div>
          </div>
        </div>
      </div>
    </>
  );
}