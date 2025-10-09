import { useEffect, useState } from "react";
import "../styles/NotificationsPage.css";

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState([]);
  const [filter, setFilter] = useState("all");
  const [showAll, setShowAll] = useState(false); 

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 10000);
    return () => clearInterval(interval);
  }, []);

  const fetchNotifications = async () => {
    try {
      const token =
        localStorage.getItem("access") ||
        localStorage.getItem("accessToken") ||
        localStorage.getItem("access_token") ||
        localStorage.getItem("token");

      if (!token) return;

      const res = await fetch("http://127.0.0.1:8000/api/notifications/", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) throw new Error("Ошибка API");
      const data = await res.json();
      setNotifications(data);
    } catch (err) {
      console.error("Ошибка загрузки уведомлений:", err);
    }
  };

  const markAllAsRead = async () => {
    try {
      const token =
        localStorage.getItem("access") ||
        localStorage.getItem("accessToken") ||
        localStorage.getItem("access_token") ||
        localStorage.getItem("token");

      if (!token) return;

      await fetch("http://127.0.0.1:8000/api/notifications/mark_all_read/", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });

      setNotifications((prev) =>
        prev.map((n) => ({ ...n, is_read: true }))
      );
    } catch (err) {
      console.error("Ошибка при отметке всех прочитанными:", err);
    }
  };

  const filteredNotifications = notifications.filter((n) => {
    if (filter === "unread") return !n.is_read;
    if (filter === "read") return n.is_read;
    return true;
  });

  const displayedNotifications = showAll
    ? filteredNotifications
    : filteredNotifications.slice(0, 10);

  return (
    <div className="notifications-page">
      <div className="notifications-header">
        <h2 className="notifications-title">Уведомления</h2>

        <div className="notifications-actions">
          <div className="notifications-filters">
            <button
              className={filter === "all" ? "active" : ""}
              onClick={() => setFilter("all")}
            >
              Все
            </button>
            <button
              className={filter === "unread" ? "active" : ""}
              onClick={() => setFilter("unread")}
            >
              Непрочитанные
            </button>
            <button
              className={filter === "read" ? "active" : ""}
              onClick={() => setFilter("read")}
            >
              Прочитанные
            </button>
          </div>

          <button className="mark-read-btn" onClick={markAllAsRead}>
            Отметить всё как прочитанное
          </button>
        </div>
      </div>

      <ul className="notifications-list">
        {displayedNotifications.map((n, idx) => (
          <li
            key={n._id || idx}
            className={`notification-item ${n.is_read ? "" : "unread"}`}
          >
            <div className="notification-text">
              <b>{n.actor}</b> — {n.description || n.verb}
            </div>
            <div className="notification-date">
              {new Date(n.created_at).toLocaleString()}
            </div>
          </li>
        ))}
      </ul>

      {filteredNotifications.length > 10 && (
        <div className="show-more-container">
          <button
            className="show-more-btn"
            onClick={() => setShowAll(!showAll)}
          >
            {showAll ? "Свернуть" : "Показать все"}
          </button>
        </div>
      )}
    </div>
  );
}
