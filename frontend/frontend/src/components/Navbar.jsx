import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { getToken } from "../utils/auth"; // ✅ правильно
import '../App.css';

export default function Navbar() {
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const token = getToken();
    if (!token) return;

    fetch("http://localhost:8000/api/current_user/", {
      headers: {
        Authorization: `Bearer ${token}`, // ✅ исправлено
      },
    })
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => setCurrentUser(data))
      .catch(() => setCurrentUser(null));
  }, []);

  return (
    <nav className="navbar">
      <Link to="/">🏠 Главная</Link>
      <Link to="/register">📝 Регистрация</Link>
      <Link to="/login">🔑 Вход</Link>

      {currentUser && (
        <>
          <Link to="/create-post">➕ Создать пост</Link>
          <Link to={`/profile/${currentUser.username}`}>👤 Профиль</Link>
        </>
      )}
    </nav>
  );
}
