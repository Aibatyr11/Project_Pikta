import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { saveToken } from "../utils/auth";
import { useUser } from "../context/UserContext";
import "../styles/AuthForm.css"; // общий стиль для форм входа/регистрации

function LoginForm() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const { setUser } = useUser();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    const response = await fetch("http://localhost:8000/api/token/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });

    const data = await response.json();

    if (response.ok) {
      saveToken(data.access);
      const userResponse = await fetch("http://localhost:8000/api/current_user/", {
        headers: { Authorization: `Bearer ${data.access}` },
      });
      if (userResponse.ok) {
        const userData = await userResponse.json();
        setUser(userData);
        navigate(`/profile/${userData.username}`);
      }
    } else {
      alert("❌ Ошибка входа: " + (data.detail || "Неизвестная ошибка"));
    }
  };

  return (
    <div className="auth-page">   {/* 👈 добавил фон-контейнер */}
      <div className="auth-container">
        <h2>Вход</h2>
        <form onSubmit={handleLogin} className="auth-form">
          <input
            type="text"
            placeholder="Имя пользователя"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Пароль"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit">Войти</button>
        </form>
        <p className="auth-link">
          <a href="/reset-password">Забыли пароль?</a>
        </p>
      </div>
    </div>
  );
}

export default LoginForm;
