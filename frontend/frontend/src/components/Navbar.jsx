import { NavLink } from "react-router-dom";
import { useEffect, useState } from "react";
import { authFetch } from "../utils/auth";
import "../styles/Navbar.css";

// импорт иконок
import homeIcon from "../assets/icons/home.png";
import exploreIcon from "../assets/icons/explore.png";
import messagesIcon from "../assets/icons/messages.png";
import registerIcon from "../assets/icons/register.png";
import loginIcon from "../assets/icons/login.png";
import createIcon from "../assets/icons/create.png";
import profileIcon from "../assets/icons/profile.png";
import notificationsIcon from "../assets/icons/notifications.png";

export default function Navbar() {
  const [currentUser, setCurrentUser] = useState(null);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    authFetch("http://localhost:8000/api/current_user/")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => setCurrentUser(data))
      .catch(() => setCurrentUser(null));
  }, []);

  // подгружаем непрочитанные уведомления
  useEffect(() => {
    if (!currentUser) return;

    const fetchUnreadCount = async () => {
      try {
        const res = await authFetch("http://localhost:8000/api/notifications/");
        if (!res.ok) return;

        const data = await res.json();
        const count = data.filter((n) => !n.is_read).length;
        setUnreadCount(count);
      } catch (err) {
        console.error("Ошибка загрузки количества уведомлений:", err);
      }
    };

    fetchUnreadCount();
    const interval = setInterval(fetchUnreadCount, 10000); // обновляем каждые 10 сек
    return () => clearInterval(interval);
  }, [currentUser]);

  // Функция для NavLink
  const linkClass = ({ isActive }) =>
    isActive ? "nav-item active" : "nav-item";

  return (
    <aside className="sidebar">
      <div className="sidebar-logo">Pikta</div>

      <nav className="sidebar-nav">
        <NavLink to="/" end className={linkClass}>
          <img src={homeIcon} alt="Home" className="nav-icon" />
          <span className="nav-text">Home</span>
        </NavLink>

        <NavLink to="/search" className={linkClass}>
          <img src={exploreIcon} alt="Explore" className="nav-icon" />
          <span className="nav-text">Explore</span>
        </NavLink>

        {/* 🔔 Уведомления с бейджем */}
        <NavLink to="/notifications" className={linkClass}>
          <div className="nav-icon-wrapper">
            <img
              src={notificationsIcon}
              alt="notifications"
              className="nav-icon"
            />
            {unreadCount > 0 && (
              <span className="badge">{unreadCount}</span>
            )}
          </div>
          <span className="nav-text">Notifications</span>
        </NavLink>

        <NavLink to="/chat" className={linkClass}>
          <img src={messagesIcon} alt="Messages" className="nav-icon" />
          <span className="nav-text">Chat</span>
        </NavLink>

        <NavLink to="/register" className={linkClass}>
          <img src={registerIcon} alt="Регистрация" className="nav-icon" />
          <span className="nav-text">Регистрация</span>
        </NavLink>

        <NavLink to="/login" className={linkClass}>
          <img src={loginIcon} alt="Вход" className="nav-icon" />
          <span className="nav-text">Вход</span>
        </NavLink>

        {currentUser && (
          <>
            <NavLink to="/create-post" className={linkClass}>
              <img src={createIcon} alt="Create Post" className="nav-icon" />
              <span className="nav-text">Create Post</span>
            </NavLink>

            {/* Профиль */}
            {/* <NavLink
              to={`/profile/${currentUser.username}`}
              className={linkClass}
            >
              <img src={profileIcon} alt="Profile" className="nav-icon" />
              <span className="nav-text">Profile</span>
            </NavLink> */}
          </>
        )}
      </nav>
    </aside>
  );
}
