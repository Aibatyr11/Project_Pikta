import { Link, NavLink } from "react-router-dom";
import { useEffect, useState } from "react";
import { authFetch } from "../utils/auth";
import "../styles/Topbar.css";
import banner from "../assets/icons/insta.png";
export default function Topbar() {
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    authFetch("http://localhost:8000/api/current_user/")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => setCurrentUser(data))
      .catch(() => setCurrentUser(null));
  }, []);

  const getAvatarUrl = (avatar) => {
    if (!avatar) return "/default-avatar.png";
    return avatar.startsWith("http")
      ? avatar
      : `http://localhost:8000${avatar}`;
  };

  return (
    <header className="topbar">
      <div className="topbar-left">
        <Link to="/" className="topbar-logo">
          <img src={banner} alt="banner" className="topbar-logo" />
        </Link>
      </div>

      {/* 
      <div className="topbar-center">
        <input
          type="text"
          className="search-input"
          placeholder="Поиск..."
        />
      </div> */}

      <div className="topbar-right">
        {!currentUser ? (
          <>
            <NavLink to="/login" className="link-btn">
              Вход
            </NavLink>
            <NavLink to="/register" className="link-btn">
              Регистрация
            </NavLink>
          </>
        ) : (
          <>
           
            <NavLink to={`/profile/${currentUser.username}`} className="profile-link">
              <p className="username">{currentUser.username}</p>
              <img
                src={getAvatarUrl(currentUser.avatar)}
                alt="avatar"
                className="topbar-avatar"
              />
            </NavLink>

          </>
        )}
      </div>
    </header>
  );
}
