import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import '../App.css';

export default function Navbar() {
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    fetch("http://localhost:8000/api/current_user/", {
      credentials: "include",
    })
      .then((res) => res.ok ? res.json() : null)
      .then((data) => setCurrentUser(data));
  }, []);

  return (
    <nav className="navbar" >
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
