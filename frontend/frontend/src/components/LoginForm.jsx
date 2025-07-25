import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { saveToken } from "../utils/auth";
import { useUser } from "../context/UserContext";

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
      alert("Ошибка входа: " + (data.detail || "Неизвестная ошибка"));
    }
  };

  return (
    <form onSubmit={handleLogin}>
      <h2>Вход</h2>
      <input type="text" placeholder="Имя пользователя" value={username} onChange={(e) => setUsername(e.target.value)} required />
      <br /><br />
      <input type="password" placeholder="Пароль" value={password} onChange={(e) => setPassword(e.target.value)} required />
      <br /><br />
      <button type="submit">Войти</button>
    </form>
  );
}

export default LoginForm;