import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import api from "../services/api";
import { loginSuccess } from "../redux/authSlice";

export default function Profile() {
  const { user, token } = useSelector((s) => s.auth);
  const dispatch = useDispatch();

  const [form, setForm] = useState({
    fullName: "",
    mobile: "",
    locationLabel: "",
    latitude: "",
    longitude: "",
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    api.get("/users/me")
      .then((r) => {
        const u = r.data;
        setForm({
          fullName: u.fullName || "",
          mobile: u.mobile || "",
          locationLabel: u.location?.label || "",
          latitude: u.location?.lat || "",
          longitude: u.location?.lng || "",
        });
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const save = async () => {
    setError(""); setSuccess("");
    if (!form.fullName.trim()) return setError("Name is required");
    setSaving(true);
    try {
      const payload = {
        fullName: form.fullName,
        mobile: form.mobile,
      };
      // Only send location if seller and values provided
      if (user?.role === "seller" && form.locationLabel) {
        payload.location = {
          label: form.locationLabel,
          lat: form.latitude ? Number(form.latitude) : undefined,
          lng: form.longitude ? Number(form.longitude) : undefined,
        };
      }
      const res = await api.put("/users/me", payload);
      // Update Redux store so Navbar name updates immediately
      dispatch(loginSuccess({ user: res.data.user, token }));
      setSuccess("Profile updated successfully");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to save changes");
    } finally {
      setSaving(false);
    }
  };

  const initials = (form.fullName || "?")
    .split(" ").map((n) => n[0]).slice(0, 2).join("").toUpperCase();

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&family=Inter:wght@300;400;500;600&display=swap');
        .pf-app{min-height:100vh;background:#FBF6EF;font-family:'Inter',sans-serif;}
        .pf-header{background:#3D1C02;padding:28px 36px;display:flex;align-items:center;gap:18px;}
        .pf-avatar{width:56px;height:56px;border-radius:50%;background:rgba(200,114,42,0.2);border:2px solid rgba(200,114,42,0.4);display:flex;align-items:center;justify-content:center;font-size:20px;font-weight:700;color:#D4A853;flex-shrink:0;}
        .pf-header-text{}
        .pf-title{font-family:'Playfair Display',serif;font-size:24px;font-weight:700;color:#F7F0E6;}
        .pf-sub{font-size:13px;color:rgba(247,240,230,0.6);margin-top:4px;}
        .pf-body{padding:28px 36px;display:grid;grid-template-columns:1fr 300px;gap:24px;max-width:900px;}
        @media(max-width:750px){.pf-body{grid-template-columns:1fr;}}
        .pf-card{background:#fff;border:1px solid #EBDFCD;border-radius:14px;padding:24px;margin-bottom:18px;}
        .pf-card-title{font-family:'Playfair Display',serif;font-size:17px;font-weight:700;color:#3D1C02;margin-bottom:18px;}
        .pf-field{margin-bottom:16px;}
        .pf-label{display:block;font-size:12px;font-weight:600;text-transform:uppercase;letter-spacing:0.07em;color:#6B4C35;margin-bottom:7px;}
        .pf-label span{color:#A32D2D;}
        .pf-input{width:100%;height:44px;padding:0 14px;border:1.5px solid #E0CDB8;border-radius:9px;font-family:'Inter',sans-serif;font-size:14px;color:#3D1C02;outline:none;background:#fff;box-sizing:border-box;}
        .pf-input:focus{border-color:#C8722A;box-shadow:0 0 0 3px rgba(200,114,42,0.1);}
        .pf-input:disabled{background:#FBF6EF;color:#8C6C52;}
        .pf-coords{display:grid;grid-template-columns:1fr 1fr;gap:12px;}
        .pf-error{background:#FEF2EC;border:1px solid #F5C4B3;border-radius:8px;padding:10px 14px;font-size:13px;color:#993C1D;margin-bottom:14px;}
        .pf-success{background:#EAF3DE;border:1px solid #B8D4A0;border-radius:8px;padding:10px 14px;font-size:13px;color:#27500A;margin-bottom:14px;display:flex;align-items:center;gap:7px;}
        .pf-btn{width:100%;height:46px;background:#3D1C02;color:#F7F0E6;border:none;border-radius:10px;font-size:14px;font-weight:600;cursor:pointer;transition:background 0.2s;}
        .pf-btn:hover:not(:disabled){background:#5A2A04;}
        .pf-btn:disabled{opacity:0.6;cursor:not-allowed;}
        .pf-info-row{display:flex;justify-content:space-between;padding:11px 0;border-bottom:1px solid #F3E9D8;font-size:14px;}
        .pf-info-row:last-child{border-bottom:none;}
        .pf-info-label{color:#8C6C52;font-weight:500;}
        .pf-info-val{color:#3D1C02;font-weight:500;}
        .pf-badge{display:inline-flex;align-items:center;gap:5px;padding:3px 10px;border-radius:12px;font-size:11px;font-weight:600;}
        .pf-badge-verified{background:#EAF3DE;color:#27500A;}
        .pf-badge-pending{background:#FAEEDA;color:#633806;}
        .pf-badge-role{background:#E6F1FB;color:#185FA5;text-transform:capitalize;}
        .pf-map-tip{background:#E6F1FB;border:1px solid #B8D4F0;border-radius:9px;padding:12px 14px;font-size:12px;color:#185FA5;margin-bottom:14px;display:flex;gap:8px;align-items:flex-start;line-height:1.5;}
      `}</style>

      <div className="pf-app">
        <div className="pf-header">
          <div className="pf-avatar">{initials}</div>
          <div className="pf-header-text">
            <div className="pf-title">{loading ? "Profile" : form.fullName}</div>
            <div className="pf-sub">Manage your account details</div>
          </div>
        </div>

        <div className="pf-body">
          {/* Left: edit form */}
          <div>
            {loading ? (
              <div style={{ color: "#8C6C52", padding: 20 }}>Loading…</div>
            ) : (
              <div className="pf-card">
                <div className="pf-card-title">Personal information</div>

                {error && <div className="pf-error">{error}</div>}
                {success && (
                  <div className="pf-success">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                    {success}
                  </div>
                )}

                <div className="pf-field">
                  <label className="pf-label">Full name <span>*</span></label>
                  <input className="pf-input" value={form.fullName} onChange={(e) => set("fullName", e.target.value)} />
                </div>
                <div className="pf-field">
                  <label className="pf-label">Email</label>
                  <input className="pf-input" value={user?.email || ""} disabled />
                </div>
                <div className="pf-field">
                  <label className="pf-label">Mobile number</label>
                  <input className="pf-input" placeholder="+94 7X XXX XXXX" value={form.mobile} onChange={(e) => set("mobile", e.target.value)} />
                </div>

                {user?.role === "seller" && (
                  <>
                    <div style={{ height: 1, background: "#F3E9D8", margin: "18px 0" }} />
                    <div className="pf-card-title" style={{ fontSize: 15, marginBottom: 14 }}>Seller location</div>
                    <div className="pf-map-tip">
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, marginTop: 1 }}><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                      Your location is shown on buyer maps and in your seller profile. Right-click on{" "}
                      <a href="https://maps.google.com" target="_blank" rel="noreferrer" style={{ color: "#185FA5" }}>maps.google.com</a>
                      {" "}to find your coordinates.
                    </div>
                    <div className="pf-field">
                      <label className="pf-label">Location name</label>
                      <input className="pf-input" placeholder="e.g. Matale, Central Province" value={form.locationLabel} onChange={(e) => set("locationLabel", e.target.value)} />
                    </div>
                    <div className="pf-coords">
                      <div className="pf-field">
                        <label className="pf-label">Latitude</label>
                        <input className="pf-input" type="number" step="any" placeholder="7.4675" value={form.latitude} onChange={(e) => set("latitude", e.target.value)} />
                      </div>
                      <div className="pf-field">
                        <label className="pf-label">Longitude</label>
                        <input className="pf-input" type="number" step="any" placeholder="80.7718" value={form.longitude} onChange={(e) => set("longitude", e.target.value)} />
                      </div>
                    </div>
                  </>
                )}

                <button className="pf-btn" onClick={save} disabled={saving}>
                  {saving ? "Saving…" : "Save changes"}
                </button>
              </div>
            )}
          </div>

          {/* Right: account summary */}
          <div>
            <div className="pf-card">
              <div className="pf-card-title">Account summary</div>
              <div className="pf-info-row">
                <span className="pf-info-label">Role</span>
                <span className="pf-badge pf-badge-role">{user?.role}</span>
              </div>
              <div className="pf-info-row">
                <span className="pf-info-label">Verification</span>
                {user?.isVerified
                  ? <span className="pf-badge pf-badge-verified">✓ Verified</span>
                  : <span className="pf-badge pf-badge-pending">Pending</span>
                }
              </div>
              <div className="pf-info-row">
                <span className="pf-info-label">Trust score</span>
                <span className="pf-info-val" style={{ color: "#C8722A", fontWeight: 700 }}>{user?.trustScore ?? 0}</span>
              </div>
              <div className="pf-info-row">
                <span className="pf-info-label">Member since</span>
                <span className="pf-info-val">
                  {user?.createdAt
                    ? new Date(user.createdAt).toLocaleDateString("en-LK", { month: "long", year: "numeric" })
                    : "—"}
                </span>
              </div>
              {user?.ratings?.count > 0 && (
                <div className="pf-info-row">
                  <span className="pf-info-label">Rating</span>
                  <span className="pf-info-val">⭐ {user.ratings.average?.toFixed(1)} ({user.ratings.count})</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
