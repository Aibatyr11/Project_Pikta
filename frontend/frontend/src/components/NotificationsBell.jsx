import { useEffect, useState } from "react";
import notificationsIcon from "../assets/icons/notifications.png";

export default function NotificationsBell({ currentUser }) {
  console.log("🔎 NotificationsBell currentUser =", currentUser);

  const [notifications, setNotifications] = useState([]);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!currentUser) return;

    const fetchNotifications = async () => {
      try {
        const token =
          localStorage.getItem("access") ||
          localStorage.getItem("accessToken") ||
          localStorage.getItem("access_token") ||
          localStorage.getItem("token");

        if (!token) {
          console.error("NotificationsBell: нет access token");
          return;
        }

        const res = await fetch("http://127.0.0.1:8000/api/notifications/", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) throw new Error("Ошибка API");

        const data = await res.json();
        console.log("📩 Fetched notifications:", data);
        setNotifications(data);
      } catch (err) {
        console.error("Ошибка загрузки уведомлений:", err);
      }
    };

    // первый вызов
    fetchNotifications();

    // обновление каждые 10 секунд
    const interval = setInterval(fetchNotifications, 10000);

    return () => clearInterval(interval);
  }, [currentUser]);

  const unreadCount = notifications.filter((n) => !n.is_read).length;

  return (
    <div style={{ position: "relative" }}>
      {/* колокольчик */}
      <img
        src={notificationsIcon}
        alt="Notifications"
        style={{ width: 28, height: 28, cursor: "pointer" }}
        onClick={() => setOpen((o) => !o)}
      />

      {/* кружок с количеством */}
      {unreadCount > 0 && (
        <div
          style={{
            position: "absolute",
            top: -4,
            right: -4,
            background: "red",
            borderRadius: 12,
            color: "white",
            padding: "2px 6px",
            fontSize: 12,
          }}
        >
          {unreadCount}
        </div>
      )}

      {/* выпадающий список */}
      {open && (
        <div
          style={{
            position: "absolute",
            top: 36,
            width: 320,
            maxHeight: 400,
            overflow: "auto",
            background: "#fff",
            color: "#000",
            boxShadow: "0 6px 18px rgba(0,0,0,0.1)",
            borderRadius: 8,
            padding: 8,
            zIndex: 1000,
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 8,
            }}
          >
            <strong>Notifications</strong>
          </div>
          <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
            {notifications.map((n, idx) => (
              <li
                key={n._id || n.id || idx}
                style={{
                  padding: 8,
                  borderBottom: "1px solid #eee",
                  background: n.is_read ? "transparent" : "#f6f8ff",
                }}
              >
                <div style={{ fontSize: 13 }}>
                  <b>{n.actor}</b> — {n.description || n.verb}
                </div>
                <div style={{ fontSize: 11, color: "#666" }}>
                  {new Date(n.created_at).toLocaleString()}
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
