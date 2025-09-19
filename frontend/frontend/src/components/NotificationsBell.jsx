import { useEffect, useRef, useState } from "react";
import notificationsIcon from "../assets/icons/notifications.png";
import { authFetch } from "../utils/auth"; // оставим твою утилиту

export default function NotificationsBell({ currentUser }) {
  const [notifications, setNotifications] = useState([]);
  const [open, setOpen] = useState(false);
  const wsRef = useRef(null);

  useEffect(() => {
    const username = typeof currentUser === "string" ? currentUser : currentUser?.username;
    if (!username) return;

        const token =
    localStorage.getItem("access") ||
    localStorage.getItem("accessToken") ||
    localStorage.getItem("access_token") ||
    localStorage.getItem("token");
    if (!token) {
      console.error("NotificationsBell: нет access token");
      return;
    }

    // загрузка старых уведомлений
    authFetch("/api/notifications/")
      .then((res) => res.json())
      .then((data) => setNotifications(data))
      .catch((err) => console.error("Ошибка загрузки уведомлений:", err));

    const wsUrl = `ws://127.0.0.1:8000/ws/notifications/${encodeURIComponent(username)}/?token=${encodeURIComponent(token)}`;
    console.log("Notifications WS connect", wsUrl);
    const ws = new WebSocket(wsUrl);

    ws.onopen = () => console.log("Notifications socket open");
    ws.onmessage = (e) => {
      try {
        const data = JSON.parse(e.data);
        if (data.notification) setNotifications((prev) => [data.notification, ...prev]);
      } catch (err) {
        console.error("Ошибка обработки уведомления:", err);
      }
    };
    ws.onerror = (err) => console.error("Notifications WS error", err);
    ws.onclose = (ev) => console.log("Notifications socket closed", ev.code, ev.reason);

    wsRef.current = ws;
    return () => {
      try { ws.close(); } catch (e) {}
      wsRef.current = null;
    };
  }, [currentUser]);

  const unreadCount = notifications.filter((n) => !n.is_read).length;

  return (
    <div style={{ position: "relative" }}>
      <img src={notificationsIcon} alt="Notifications" style={{ width: 28, height: 28, cursor: "pointer" }} onClick={() => setOpen((o) => !o)} />
      {unreadCount > 0 && <div style={{ position: "absolute", top: -4, right: -4, background: "red", borderRadius: 12, color: "white", padding: "2px 6px", fontSize: 12 }}>{unreadCount}</div>}
      {open && (
        <div style={{ position: "absolute", right: 0, top: 36, width: 320, maxHeight: 400, overflow: "auto", background: "#fff", color: "#000", boxShadow: "0 6px 18px rgba(0,0,0,0.1)", borderRadius: 8, padding: 8, zIndex: 1000 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
            <strong>Notifications</strong>
          </div>
          <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
            {notifications.map((n) => (
              <li key={n.id || n.timestamp} style={{ padding: 8, borderBottom: "1px solid #eee", background: n.is_read ? "transparent" : "#f6f8ff" }}>
                <div style={{ fontSize: 13 }}><b>{n.actor}</b> — {n.content}</div>
                <div style={{ fontSize: 11, color: "#666" }}>{new Date(n.timestamp).toLocaleString()}</div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
