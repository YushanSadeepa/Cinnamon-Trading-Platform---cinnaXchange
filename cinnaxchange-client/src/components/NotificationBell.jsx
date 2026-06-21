import { useEffect, useState, useRef } from "react";
import api from "../services/api";
import socket from "../services/socket";
import { useSelector } from "react-redux";

export default function NotificationBell() {
  const { user } = useSelector((s) => s.auth);
  const [notifications, setNotifications] = useState([]);
  const [unread, setUnread] = useState(0);
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  const fetchNotifications = async () => {
    try {
      const [nRes, uRes] = await Promise.all([
        api.get("/notifications"),
        api.get("/notifications/unread-count"),
      ]);
      setNotifications(nRes.data);
      setUnread(uRes.data.count);
    } catch {/* silent */}
  };

  useEffect(() => {
    fetchNotifications();
    // Join personal room for real-time push
    if (user?._id) socket.emit("join_user_room", user._id);
    // Listen for real-time notification events
    socket.on("notification", () => {
      setUnread((n) => n + 1);
      fetchNotifications();
    });
    return () => socket.off("notification");
  }, [user?._id]);

  // Close on outside click
  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const markAllRead = async () => {
    await api.put("/notifications/mark-all-read");
    setUnread(0);
    setNotifications((n) => n.map((item) => ({ ...item, read: true })));
  };

  const markRead = async (id) => {
    await api.put(`/notifications/${id}/read`);
    setUnread((n) => Math.max(0, n - 1));
    setNotifications((n) => n.map((item) => item._id === id ? { ...item, read: true } : item));
  };

  return (
    <>
      <style>{`
        .cx-bell-wrap { position: relative; }
        .cx-bell-btn {
          position: relative; background: none; border: none; cursor: pointer;
          width: 38px; height: 38px; border-radius: 50%;
          display: flex; align-items: center; justify-content: center;
          color: #F7F0E6; transition: background 0.15s;
        }
        .cx-bell-btn:hover { background: rgba(200,114,42,0.18); }
        .cx-badge {
          position: absolute; top: 5px; right: 5px;
          width: 16px; height: 16px; border-radius: 50%;
          background: #C8722A; color: #fff;
          font-size: 10px; font-weight: 700;
          display: flex; align-items: center; justify-content: center;
          pointer-events: none;
        }
        .cx-notif-dropdown {
          position: absolute; top: 46px; right: 0; z-index: 100;
          width: 320px; background: #FFFFFF; border: 1px solid #EBDFCD;
          border-radius: 12px; box-shadow: 0 8px 24px rgba(61,28,2,0.12);
          overflow: hidden;
        }
        .cx-notif-header {
          display: flex; justify-content: space-between; align-items: center;
          padding: 14px 16px; border-bottom: 1px solid #EBDFCD;
        }
        .cx-notif-title { font-size: 14px; font-weight: 600; color: #3D1C02; font-family: 'Playfair Display', serif; }
        .cx-mark-all { font-size: 12px; color: #C8722A; background: none; border: none; cursor: pointer; font-weight: 500; }
        .cx-notif-list { max-height: 360px; overflow-y: auto; }
        .cx-notif-item {
          display: flex; gap: 12px; padding: 12px 16px; cursor: pointer;
          border-bottom: 1px solid #F3E9D8; transition: background 0.1s;
        }
        .cx-notif-item:hover { background: #FBF6EF; }
        .cx-notif-item.unread { background: #FEF6EE; }
        .cx-notif-item.unread:hover { background: #FDF0E4; }
        .cx-notif-dot { width: 8px; height: 8px; border-radius: 50%; background: #C8722A; flex-shrink: 0; margin-top: 5px; }
        .cx-notif-dot.read { background: transparent; }
        .cx-notif-body { flex: 1; min-width: 0; }
        .cx-notif-msg-title { font-size: 13px; font-weight: 600; color: #3D1C02; margin-bottom: 2px; }
        .cx-notif-msg { font-size: 12px; color: #6B4C35; line-height: 1.5; }
        .cx-notif-time { font-size: 11px; color: #B08060; margin-top: 4px; }
        .cx-notif-empty { padding: 32px 16px; text-align: center; font-size: 13px; color: #B08060; }
      `}</style>

      <div className="cx-bell-wrap" ref={ref}>
        <button className="cx-bell-btn" onClick={() => setOpen((o) => !o)} aria-label="Notifications">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/>
          </svg>
          {unread > 0 && <span className="cx-badge">{unread > 9 ? "9+" : unread}</span>}
        </button>

        {open && (
          <div className="cx-notif-dropdown">
            <div className="cx-notif-header">
              <span className="cx-notif-title">Notifications</span>
              {unread > 0 && <button className="cx-mark-all" onClick={markAllRead}>Mark all read</button>}
            </div>
            <div className="cx-notif-list">
              {notifications.length === 0 ? (
                <div className="cx-notif-empty">No notifications yet</div>
              ) : (
                notifications.map((n) => (
                  <div
                    key={n._id}
                    className={`cx-notif-item${n.read ? "" : " unread"}`}
                    onClick={() => !n.read && markRead(n._id)}
                  >
                    <div className={`cx-notif-dot${n.read ? " read" : ""}`} />
                    <div className="cx-notif-body">
                      <div className="cx-notif-msg-title">{n.title}</div>
                      <div className="cx-notif-msg">{n.message}</div>
                      <div className="cx-notif-time">
                        {new Date(n.createdAt).toLocaleDateString("en-LK", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </div>
    </>
  );
}