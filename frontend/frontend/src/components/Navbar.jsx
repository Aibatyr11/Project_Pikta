import { NavLink } from "react-router-dom";
import { useEffect, useState } from "react";
import { authFetch } from "../utils/auth";
import "../styles/Navbar.css";

import homeIcon from "../assets/icons/home.png";
import exploreIcon from "../assets/icons/explore.png";
import messagesIcon from "../assets/icons/messages.png";
import registerIcon from "../assets/icons/register.png";
import createIcon from "../assets/icons/create.png";
import notificationsIcon from "../assets/icons/notifications.png";

export default function Navbar() {
  const [currentUser, setCurrentUser] = useState(null);
  const [unreadCount, setUnreadCount] = useState(0);
  const [sidebarOpen, setSidebarOpen] = useState(false); 

  useEffect(() => {
    authFetch("http://localhost:8000/api/current_user/")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => setCurrentUser(data))
      .catch(() => setCurrentUser(null));
  }, []);

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
        console.error("Ошибка загрузки уведомлений:", err);
      }
    };

    fetchUnreadCount();
    const interval = setInterval(fetchUnreadCount, 10000);
    return () => clearInterval(interval);
  }, [currentUser]);

  const linkClass = ({ isActive }) =>
    isActive ? "nav-item active" : "nav-item";

  return (
    <>
      <button
        className="sidebar-toggle"
        onClick={() => setSidebarOpen((prev) => !prev)}
      >
      </button>
      <aside className={`sidebar ${sidebarOpen ? "open" : ""}`}>
        <div className="sidebar-logo">Pikta</div>

        <nav className="sidebar-nav">
          <NavLink
            to="/"
            end
            className={linkClass}
            onClick={() => setSidebarOpen(false)}
          >
            <img src={homeIcon} alt="Home" className="nav-icon" />
            <span className="nav-text">Home</span>
          </NavLink>

          <NavLink
            to="/search"
            className={linkClass}
            onClick={() => setSidebarOpen(false)}
          >
            <img src={exploreIcon} alt="Explore" className="nav-icon" />
            <span className="nav-text">Explore</span>
          </NavLink>

          <NavLink
            to="/notifications"
            className={linkClass}
            onClick={() => setSidebarOpen(false)}
          >
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

          <NavLink
            to="/chat"
            className={linkClass}
            onClick={() => setSidebarOpen(false)}
          >
            <img src={messagesIcon} alt="Messages" className="nav-icon" />
            <span className="nav-text">Chat</span>
          </NavLink>

          
            <NavLink
              to="/auth"
              className={linkClass}
              onClick={() => setSidebarOpen(false)}
            >
              <img src={registerIcon} alt="Auth" className="nav-icon" />
              <span className="nav-text">Auth</span>
            </NavLink>
          

          {currentUser && (
            <>
              <NavLink
                to="/create-post"
                className={linkClass}
                onClick={() => setSidebarOpen(false)}
              >
                <img src={createIcon} alt="Create Post" className="nav-icon" />
                <span className="nav-text">Create Post</span>
              </NavLink>

              {/* <NavLink
                to={`/profile/${currentUser.username}`}
                className={linkClass}
                onClick={() => setSidebarOpen(false)}
              >
                <img src={profileIcon} alt="Profile" className="nav-icon" />
                <span className="nav-text">Profile</span>
              </NavLink> */}
            </>
          )}
        </nav>
      </aside>
    </>
  );
}
