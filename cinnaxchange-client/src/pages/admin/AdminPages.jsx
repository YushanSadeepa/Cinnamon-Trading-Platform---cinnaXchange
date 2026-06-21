import { useEffect, useState } from "react";
import api from "../../services/api";

// ─── Shared admin header ───────────────────────────────
function AdminHeader({ title, sub }) {
  return (
    <div style={{ background: "#3D1C02", padding: "24px 36px" }}>
      <h1 style={{ fontFamily: "'Playfair Display',serif", fontSize: 26, fontWeight: 700, color: "#F7F0E6", marginBottom: 4 }}>{title}</h1>
      <p style={{ fontSize: 13, color: "rgba(247,240,230,0.6)" }}>{sub}</p>
    </div>
  );
}

// ─── AdminUsers ────────────────────────────────────────
export function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const load = () => api.get("/admin/users").then((r) => setUsers(r.data)).catch(console.error).finally(() => setLoading(false));
  useEffect(() => { load(); }, []);

  const del = async (id) => {
    if (!window.confirm("Delete this user?")) return;
    await api.delete(`/admin/users/${id}`);
    load();
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&family=Inter:wght@300;400;500;600&display=swap');
        .adm{min-height:100vh;background:#FBF6EF;font-family:'Inter',sans-serif;}
        .adm-body{padding:28px 36px;}
        .adm-table{width:100%;border-collapse:collapse;background:#fff;border-radius:14px;overflow:hidden;border:1px solid #EBDFCD;}
        .adm-th{text-align:left;padding:12px 16px;font-size:11px;font-weight:600;text-transform:uppercase;letter-spacing:0.07em;color:#8C6C52;background:#FBF6EF;border-bottom:1px solid #EBDFCD;}
        .adm-td{padding:13px 16px;font-size:14px;color:#3D1C02;border-bottom:1px solid #F3E9D8;}
        tr:last-child .adm-td{border-bottom:none;}
        .adm-badge{font-size:11px;font-weight:600;padding:3px 10px;border-radius:12px;}
        .adm-role-buyer{background:#E6F1FB;color:#185FA5;}
        .adm-role-seller{background:#FAEEDA;color:#854F0B;}
        .adm-role-admin{background:#EEEDFE;color:#534AB7;}
        .adm-verified{background:#EAF3DE;color:#3B6D11;}
        .adm-unverified{background:#FCEBEB;color:#A32D2D;}
        .adm-btn-del{background:#FEF2EC;color:#993C1D;border:1px solid #F5C4B3;padding:5px 12px;border-radius:7px;font-size:12px;font-weight:600;cursor:pointer;}
        .adm-btn-del:hover{background:#F5C4B3;}
      `}</style>
      <div className="adm">
        <AdminHeader title="User management" sub="View and manage all registered users" />
        <div className="adm-body">
          {loading ? <p style={{ color: "#8C6C52" }}>Loading…</p> : (
            <table className="adm-table">
              <thead>
                <tr>
                  <th className="adm-th">Name</th>
                  <th className="adm-th">Email</th>
                  <th className="adm-th">Role</th>
                  <th className="adm-th">Verified</th>
                  <th className="adm-th">Trust</th>
                  <th className="adm-th">Joined</th>
                  <th className="adm-th"></th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u._id}>
                    <td className="adm-td">{u.fullName}</td>
                    <td className="adm-td">{u.email}</td>
                    <td className="adm-td"><span className={`adm-badge adm-role-${u.role}`}>{u.role}</span></td>
                    <td className="adm-td"><span className={`adm-badge ${u.isVerified ? "adm-verified" : "adm-unverified"}`}>{u.isVerified ? "Verified" : "Unverified"}</span></td>
                    <td className="adm-td">{u.trustScore ?? 0}</td>
                    <td className="adm-td">{new Date(u.createdAt).toLocaleDateString("en-LK", { day: "numeric", month: "short", year: "numeric" })}</td>
                    <td className="adm-td"><button className="adm-btn-del" onClick={() => del(u._id)}>Delete</button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </>
  );
}

// ─── AdminListings ─────────────────────────────────────
export function AdminListings() {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const load = () => api.get("/admin/listings").then((r) => setListings(r.data)).catch(console.error).finally(() => setLoading(false));
  useEffect(() => { load(); }, []);
  const del = async (id) => { if (!window.confirm("Remove this listing?")) return; await api.delete(`/admin/listings/${id}`); load(); };
  return (
    <div className="adm">
      <AdminHeader title="Listing management" sub="Review and remove product listings" />
      <div className="adm-body">
        {loading ? <p style={{ color: "#8C6C52" }}>Loading…</p> : (
          <table className="adm-table">
            <thead>
              <tr>
                <th className="adm-th">Title</th>
                <th className="adm-th">Grade</th>
                <th className="adm-th">Seller</th>
                <th className="adm-th">Price (LKR/kg)</th>
                <th className="adm-th">Status</th>
                <th className="adm-th">Created</th>
                <th className="adm-th"></th>
              </tr>
            </thead>
            <tbody>
              {listings.map((l) => (
                <tr key={l._id}>
                  <td className="adm-td">{l.title}</td>
                  <td className="adm-td">{l.grade}</td>
                  <td className="adm-td">{l.seller?.fullName}</td>
                  <td className="adm-td">{l.price?.toLocaleString()}</td>
                  <td className="adm-td"><span className="adm-badge adm-role-buyer">{l.status}</span></td>
                  <td className="adm-td">{new Date(l.createdAt).toLocaleDateString("en-LK", { day: "numeric", month: "short", year: "numeric" })}</td>
                  <td className="adm-td"><button className="adm-btn-del" onClick={() => del(l._id)}>Remove</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

// ─── AdminAuctions ─────────────────────────────────────
export function AdminAuctions() {
  const [auctions, setAuctions] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => { api.get("/admin/auctions").then((r) => setAuctions(r.data)).catch(console.error).finally(() => setLoading(false)); }, []);
  const statusColors = { active:"#3B6D11", ended:"#854F0B", awaiting_meeting:"#185FA5", completed:"#534AB7", cancelled:"#A32D2D" };
  const statusBg = { active:"#EAF3DE", ended:"#FAEEDA", awaiting_meeting:"#E6F1FB", completed:"#EEEDFE", cancelled:"#FCEBEB" };
  return (
    <div className="adm">
      <AdminHeader title="Auction oversight" sub="Monitor all platform auctions" />
      <div className="adm-body">
        {loading ? <p style={{ color: "#8C6C52" }}>Loading…</p> : (
          <table className="adm-table">
            <thead>
              <tr>
                <th className="adm-th">Title</th>
                <th className="adm-th">Seller</th>
                <th className="adm-th">Highest bid</th>
                <th className="adm-th">Status</th>
                <th className="adm-th">Winner</th>
                <th className="adm-th">Ends</th>
              </tr>
            </thead>
            <tbody>
              {auctions.map((a) => (
                <tr key={a._id}>
                  <td className="adm-td">{a.title}</td>
                  <td className="adm-td">{a.seller?.fullName}</td>
                  <td className="adm-td">LKR {a.currentHighestBid?.toLocaleString()}</td>
                  <td className="adm-td"><span className="adm-badge" style={{ background: statusBg[a.status] || "#F3E9D8", color: statusColors[a.status] || "#6B4C35" }}>{a.status}</span></td>
                  <td className="adm-td">{a.winner?.fullName || "—"}</td>
                  <td className="adm-td">{new Date(a.endTime).toLocaleDateString("en-LK", { day: "numeric", month: "short", year: "numeric" })}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

// ─── AdminComplaints ───────────────────────────────────
export function AdminComplaints() {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [resolving, setResolving] = useState(null);
  const load = () => api.get("/admin/complaints").then((r) => setComplaints(r.data)).catch(console.error).finally(() => setLoading(false));
  useEffect(() => { load(); }, []);

  const resolve = async (id, status) => {
    const resolution = window.prompt(`Enter resolution note for status: "${status}"`);
    if (resolution === null) return;
    setResolving(id);
    try { await api.put(`/admin/complaints/${id}/resolve`, { status, resolution }); load(); }
    catch (err) { alert(err.response?.data?.message || "Failed"); }
    finally { setResolving(null); }
  };

  const statusBg = { open:"#FCEBEB", under_review:"#E6F1FB", resolved:"#EAF3DE", dismissed:"#F3E9D8" };
  const statusColor = { open:"#A32D2D", under_review:"#185FA5", resolved:"#3B6D11", dismissed:"#8C6C52" };

  return (
    <div className="adm">
      <AdminHeader title="Complaints" sub="Review and resolve user complaints" />
      <div className="adm-body">
        {loading ? <p style={{ color: "#8C6C52" }}>Loading…</p>
          : complaints.length === 0 ? <p style={{ color: "#8C6C52" }}>No complaints</p>
          : complaints.map((c) => (
            <div key={c._id} style={{ background: "#fff", border: "1px solid #EBDFCD", borderRadius: 12, padding: 18, marginBottom: 14 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 8, marginBottom: 10 }}>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 600, color: "#3D1C02", marginBottom: 3 }}>
                    {c.reporter?.fullName} → {c.against?.fullName}
                  </div>
                  <div style={{ fontSize: 13, color: "#6B4C35" }}><strong>Reason:</strong> {c.reason}</div>
                  {c.description && <div style={{ fontSize: 13, color: "#6B4C35", marginTop: 4 }}>{c.description}</div>}
                </div>
                <span className="adm-badge" style={{ background: statusBg[c.status], color: statusColor[c.status] }}>{c.status}</span>
              </div>
              {c.status === "open" && (
                <div style={{ display: "flex", gap: 8, marginTop: 10 }}>
                  <button className="adm-btn-del" disabled={resolving === c._id} onClick={() => resolve(c._id, "resolved")}>Resolve</button>
                  <button className="adm-btn-del" style={{ background: "#F3E9D8", color: "#6B4C35", borderColor: "#EBDFCD" }} disabled={resolving === c._id} onClick={() => resolve(c._id, "dismissed")}>Dismiss</button>
                </div>
              )}
              {c.resolution && <div style={{ fontSize: 12, color: "#8C6C52", marginTop: 8 }}>Resolution: {c.resolution}</div>}
            </div>
          ))
        }
      </div>
    </div>
  );
}

// ─── AdminVerification ─────────────────────────────────
export function AdminVerification() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(null);
  const load = () => api.get("/admin/verifications").then((r) => setRequests(r.data)).catch(console.error).finally(() => setLoading(false));
  useEffect(() => { load(); }, []);

  const approve = async (id) => {
    setProcessing(id);
    try { await api.put(`/admin/verifications/${id}/approve`); load(); }
    catch (err) { alert(err.response?.data?.message || "Failed"); }
    finally { setProcessing(null); }
  };

  const reject = async (id) => {
    const reason = window.prompt("Rejection reason:");
    if (!reason) return;
    setProcessing(id);
    try { await api.put(`/admin/verifications/${id}/reject`, { reason }); load(); }
    catch (err) { alert(err.response?.data?.message || "Failed"); }
    finally { setProcessing(null); }
  };

  return (
    <div className="adm">
      <AdminHeader title="Verification requests" sub="Review seller KYC documents" />
      <div className="adm-body">
        {loading ? <p style={{ color: "#8C6C52" }}>Loading…</p>
          : requests.length === 0 ? <p style={{ color: "#8C6C52" }}>No pending verification requests</p>
          : requests.map((u) => (
            <div key={u._id} style={{ background: "#fff", border: "1px solid #EBDFCD", borderRadius: 14, padding: 20, marginBottom: 16 }}>
              <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 10, marginBottom: 14 }}>
                <div>
                  <div style={{ fontSize: 16, fontWeight: 600, color: "#3D1C02", marginBottom: 2 }}>{u.fullName}</div>
                  <div style={{ fontSize: 13, color: "#8C6C52" }}>{u.email}</div>
                  {u.nicNumber && <div style={{ fontSize: 13, color: "#8C6C52" }}>NIC: {u.nicNumber}</div>}
                  {u.verification?.submittedAt && (
                    <div style={{ fontSize: 12, color: "#B08060", marginTop: 4 }}>
                      Submitted: {new Date(u.verification.submittedAt).toLocaleDateString("en-LK", { day: "numeric", month: "short", year: "numeric" })}
                    </div>
                  )}
                </div>
                <div style={{ display: "flex", gap: 8 }}>
                  {u.verification?.nicFront && <a href={u.verification.nicFront} target="_blank" rel="noreferrer" style={{ fontSize: 12, color: "#185FA5" }}>NIC Front</a>}
                  {u.verification?.nicBack && <a href={u.verification.nicBack} target="_blank" rel="noreferrer" style={{ fontSize: 12, color: "#185FA5" }}>NIC Back</a>}
                  {u.verification?.selfie && <a href={u.verification.selfie} target="_blank" rel="noreferrer" style={{ fontSize: 12, color: "#185FA5" }}>Selfie</a>}
                </div>
              </div>
              <div style={{ display: "flex", gap: 10 }}>
                <button disabled={processing === u._id} onClick={() => approve(u._id)}
                  style={{ height: 36, padding: "0 16px", background: "#3D1C02", color: "#F7F0E6", border: "none", borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: "pointer" }}>
                  {processing === u._id ? "Processing…" : "Approve"}
                </button>
                <button disabled={processing === u._id} onClick={() => reject(u._id)}
                  style={{ height: 36, padding: "0 16px", background: "#FEF2EC", color: "#993C1D", border: "1px solid #F5C4B3", borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: "pointer" }}>
                  Reject
                </button>
              </div>
            </div>
          ))
        }
      </div>
    </div>
  );
}
