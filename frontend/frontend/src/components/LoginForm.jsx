import React, { useState } from "react";

function LoginForm() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();

    const response = await fetch("http://localhost:8000/api/login/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include", // важно для куки, если используешь сессии
      body: JSON.stringify({ username, password }),
    });

    const data = await response.json();

    if (response.ok) {
      alert("✅ Вход выполнен");
      console.log(data);
    } else {
      alert("❌ Ошибка входа: " + (data.detail || "неизвестная ошибка"));
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
