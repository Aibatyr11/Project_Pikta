// src/components/Topbar.jsx
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { authFetch } from "../utils/auth";
import "../App.css";

export default function Topbar() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    authFetch("http://localhost:8000/api/current_user/") // эндпоинт для текущего юзера
      .then((res) => {
        if (!res.ok) throw new Error("Ошибка загрузки пользователя");
        return res.json();
      })
      .then((data) => setUser(data))
      .catch((err) => console.error("Ошибка загрузки профиля:", err));
  }, []);

  return (
    <header className="topbar">
      <div className="topbar-left">
        <span className="logo">Pikta</span>
      </div>

      <div className="topbar-center">
        <input type="text" placeholder="Search..." className="search-input" />
      </div>

      <div className="topbar-right">
        {user ? (
          <Link to={`/profile/${user.username}`}>
            <img
                src={
                user?.avatar
                  ? user.avatar.startsWith("http")
                    ? user.avatar
                    : `http://localhost:8000${user.avatar}`
                  : "https://via.placeholder.com/40"
              }
              alt="avatar"
              className="topbar-avatar"
            />
          </Link>
        ) : (
          <img
            src="https://via.placeholder.com/40"
            alt="avatar"
            className="topbar-avatar"
          />
        )}
      </div>
    </header>
  );
}
