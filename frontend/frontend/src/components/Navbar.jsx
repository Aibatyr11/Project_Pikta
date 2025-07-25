import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { authFetch } from "../utils/auth"; // заменили getToken → authFetch
import '../App.css';

export default function Navbar() {
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    authFetch("http://localhost:8000/api/current_user/")
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
