import { Link, NavLink } from "react-router-dom";
import { useEffect, useState } from "react";
import { authFetch } from "../utils/auth";
import "../Topbar.css";

export default function Topbar() {
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    authFetch("http://localhost:8000/api/current_user/")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => setCurrentUser(data))
      .catch(() => setCurrentUser(null));
  }, []);

  return (
    <header className="topbar">
      {/* Лого слева */}
      <div className="topbar-left">
        <Link to="/" className="topbar-logo">
          Pikta
        </Link>
      </div>

      {/* Поиск по центру */}
      <div className="topbar-center">
        <input
          type="text"
          className="search-input"
          placeholder="Поиск..."
        />
      </div>

      {/* Справа — кнопки и профиль */}
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
            <NavLink to="/create-post" className="link-btn">
              + Пост
            </NavLink>
            <NavLink to={`/profile/${currentUser.username}`}>
              <img
                src={currentUser.avatar || "/default-avatar.png"}
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
