// LoginForm.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../context/UserContext"; // ✅ импорт


function getCookie(name) {
  let cookieValue = null;
  if (document.cookie && document.cookie !== "") {
    const cookies = document.cookie.split(";");
    for (let cookie of cookies) {
      cookie = cookie.trim();
      if (cookie.startsWith(name + "=")) {
        cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
        break;
      }
    }
  }
  return cookieValue;
}

function LoginForm() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const { setUser } = useUser(); // ✅ достаём setUser
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    const csrftoken = getCookie("csrftoken");

    const response = await fetch("http://localhost:8000/api/login/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-CSRFToken": csrftoken,
      },
      credentials: "include",
      body: JSON.stringify({ username, password }),
    });

    const data = await response.json();

    if (response.ok) {
      alert("✅ Вход выполнен");

      // 🔥 Загрузим текущего пользователя и обновим контекст
      const userResponse = await fetch("http://localhost:8000/api/current_user/", {
        credentials: "include",
      });

      if (userResponse.ok) {
        const userData = await userResponse.json();
        setUser(userData); // ✅ обновляем глобального пользователя
        navigate(`/profile/${userData.username}`); // 🔄 сразу перейти на профиль
      }
    } else {
      alert("❌ Ошибка входа: " + (data.detail || data.error || "неизвестная ошибка"));
    }
  };

  return (
    <form onSubmit={handleLogin}>
      <h2>Вход</h2>
      <input
        type="text"
        placeholder="Имя пользователя"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        required
      /><br /><br />
      <input
        type="password"
        placeholder="Пароль"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      /><br /><br />
      <button type="submit">Войти</button>
    </form>
  );
}

export default LoginForm;
