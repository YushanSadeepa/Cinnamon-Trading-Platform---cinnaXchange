import { useState } from "react";
import { useSelector } from "react-redux";
import api from "../../services/api";

function FileUploadBox({ label, hint, name, file, onChange }) {
  return (
    <div style={{ marginBottom: 18 }}>
      <div style={{ fontSize: 12, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.07em", color: "#6B4C35", marginBottom: 7 }}>
        {label} <span style={{ color: "#A32D2D" }}>*</span>
      </div>
      <label htmlFor={`kyc-${name}`}>
        <div style={{
          border: `2px dashed ${file ? "#C8722A" : "#E0CDB8"}`,
          borderRadius: 10, padding: "20px 16px", textAlign: "center",
          cursor: "pointer", transition: "border-color 0.15s",
          background: file ? "#FEF6EE" : "#fff",
        }}>
          {file ? (
            <div>
              <img
                src={URL.createObjectURL(file)}
                alt={label}
                style={{ width: "100%", maxHeight: 140, objectFit: "cover", borderRadius: 7, marginBottom: 8 }}
              />
              <div style={{ fontSize: 12, color: "#C8722A", fontWeight: 600 }}>
                ✓ {file.name}
              </div>
            </div>
          ) : (
            <>
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#B08060" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/>
              </svg>
              <div style={{ fontSize: 13, color: "#8C6C52", marginTop: 8 }}>{hint}</div>
              <div style={{ fontSize: 11, color: "#B08060", marginTop: 4 }}>JPG, PNG · Max 10MB</div>
            </>
          )}
        </div>
      </label>
      <input
        id={`kyc-${name}`}
        type="file"
        accept="image/*"
        style={{ display: "none" }}
        onChange={(e) => onChange(e.target.files[0])}
      />
    </div>
  );
}

export default function KYCSubmit() {
  const { user } = useSelector((s) => s.auth);
  const [files, setFiles] = useState({ nicFront: null, nicBack: null, selfie: null });
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const setFile = (field) => (file) => setFiles((f) => ({ ...f, [field]: file }));

  const alreadyVerified = user?.isVerified;
  const alreadyPending = user?.verification?.status === "pending";

  const submit = async () => {
    setError("");
    if (!files.nicFront || !files.nicBack || !files.selfie) {
      return setError("Please upload all three documents");
    }
    setSubmitting(true);
    try {
      const fd = new FormData();
      fd.append("nicFront", files.nicFront);
      fd.append("nicBack", files.nicBack);
      fd.append("selfie", files.selfie);
      await api.post("/users/submit-verification", fd, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setSuccess(true);
    } catch (err) {
      setError(err.response?.data?.message || "Submission failed. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&family=Inter:wght@300;400;500;600&display=swap');
        .kyc-app{min-height:100vh;background:#FBF6EF;font-family:'Inter',sans-serif;}
        .kyc-header{background:#3D1C02;padding:24px 36px;}
        .kyc-title{font-family:'Playfair Display',serif;font-size:26px;font-weight:700;color:#F7F0E6;}
        .kyc-sub{font-size:13px;color:rgba(247,240,230,0.6);margin-top:4px;}
        .kyc-body{padding:28px 36px;display:grid;grid-template-columns:1fr 340px;gap:24px;max-width:1000px;}
        @media(max-width:750px){.kyc-body{grid-template-columns:1fr;}}
        .kyc-card{background:#fff;border:1px solid #EBDFCD;border-radius:14px;padding:24px;}
        .kyc-card-title{font-family:'Playfair Display',serif;font-size:17px;font-weight:700;color:#3D1C02;margin-bottom:4px;}
        .kyc-card-sub{font-size:13px;color:#8C6C52;margin-bottom:20px;line-height:1.6;}
        .kyc-error{background:#FEF2EC;border:1px solid #F5C4B3;border-radius:8px;padding:10px 14px;font-size:13px;color:#993C1D;margin-bottom:16px;}
        .kyc-success{background:#EAF3DE;border:1px solid #B8D4A0;border-radius:8px;padding:16px;font-size:14px;color:#27500A;margin-bottom:16px;text-align:center;}
        .kyc-btn{width:100%;height:48px;background:#3D1C02;color:#F7F0E6;border:none;border-radius:10px;font-size:15px;font-weight:600;cursor:pointer;transition:background 0.2s;}
        .kyc-btn:hover:not(:disabled){background:#5A2A04;}
        .kyc-btn:disabled{opacity:0.6;cursor:not-allowed;}
        .kyc-info-card{background:#fff;border:1px solid #EBDFCD;border-radius:14px;padding:22px;margin-bottom:16px;}
        .kyc-info-title{font-size:14px;font-weight:600;color:#3D1C02;margin-bottom:12px;}
        .kyc-info-item{display:flex;gap:10px;align-items:flex-start;margin-bottom:12px;}
        .kyc-info-icon{width:28px;height:28px;border-radius:7px;background:#FBF6EF;display:flex;align-items:center;justify-content:center;flex-shrink:0;}
        .kyc-info-text{font-size:13px;color:#6B4C35;line-height:1.5;}
        .kyc-status-badge{display:inline-flex;align-items:center;gap:6px;padding:8px 16px;border-radius:10px;font-size:13px;font-weight:600;margin-bottom:16px;}
        .kyc-status-verified{background:#EAF3DE;color:#27500A;}
        .kyc-status-pending{background:#FAEEDA;color:#633806;}
      `}</style>

      <div className="kyc-app">
        <div className="kyc-header">
          <h1 className="kyc-title">Identity verification</h1>
          <p className="kyc-sub">Upload your NIC documents to become a verified seller</p>
        </div>

        <div className="kyc-body">
          {/* Left: form */}
          <div>
            <div className="kyc-card">
              <div className="kyc-card-title">KYC document upload</div>
              <div className="kyc-card-sub">
                Upload clear photos of your National Identity Card (front and back) and a selfie holding the card. All documents are reviewed by our admin team within 24–48 hours.
              </div>

              {alreadyVerified && (
                <div className="kyc-status-badge kyc-status-verified">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                  Your account is already verified
                </div>
              )}

              {!alreadyVerified && alreadyPending && !success && (
                <div className="kyc-status-badge kyc-status-pending">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                  Verification pending review
                </div>
              )}

              {success ? (
                <div className="kyc-success">
                  <div style={{ fontSize: 28, marginBottom: 8 }}>✅</div>
                  <div style={{ fontWeight: 600, marginBottom: 4 }}>Documents submitted successfully</div>
                  <div style={{ fontSize: 13 }}>Our team will review your documents within 24–48 hours. You'll receive a notification when approved.</div>
                </div>
              ) : (
                <>
                  {error && <div className="kyc-error">{error}</div>}

                  <FileUploadBox
                    label="NIC Front"
                    hint="Photo of the front of your National ID Card"
                    name="nicFront"
                    file={files.nicFront}
                    onChange={setFile("nicFront")}
                  />
                  <FileUploadBox
                    label="NIC Back"
                    hint="Photo of the back of your National ID Card"
                    name="nicBack"
                    file={files.nicBack}
                    onChange={setFile("nicBack")}
                  />
                  <FileUploadBox
                    label="Selfie with NIC"
                    hint="Clear selfie holding your NIC next to your face"
                    name="selfie"
                    file={files.selfie}
                    onChange={setFile("selfie")}
                  />

                  <button
                    className="kyc-btn"
                    onClick={submit}
                    disabled={submitting || alreadyVerified}
                  >
                    {submitting ? "Uploading documents…" : alreadyVerified ? "Already verified" : "Submit for verification"}
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Right: info panel */}
          <div>
            <div className="kyc-info-card">
              <div className="kyc-info-title">Why verify?</div>
              {[
                { icon: "🛡️", text: "Verified badge shown on all your listings and your seller profile" },
                { icon: "⭐", text: "+30 points added to your trust score immediately on approval" },
                { icon: "🤝", text: "Buyers are more likely to bid on listings from verified sellers" },
                { icon: "📋", text: "Required for selling above LKR 500,000 in a single auction" },
              ].map((item, i) => (
                <div key={i} className="kyc-info-item">
                  <div className="kyc-info-icon">{item.icon}</div>
                  <div className="kyc-info-text">{item.text}</div>
                </div>
              ))}
            </div>

            <div className="kyc-info-card">
              <div className="kyc-info-title">Document requirements</div>
              {[
                { icon: "📷", text: "Photos must be clear and all text must be readable" },
                { icon: "🖼️", text: "Accepted formats: JPG, PNG — max 10MB each" },
                { icon: "🔒", text: "Documents are stored securely and only seen by admins" },
                { icon: "⚡", text: "Approval typically takes 24–48 hours" },
              ].map((item, i) => (
                <div key={i} className="kyc-info-item">
                  <div className="kyc-info-icon">{item.icon}</div>
                  <div className="kyc-info-text">{item.text}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
