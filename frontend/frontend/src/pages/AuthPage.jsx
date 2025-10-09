import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { saveToken } from "../utils/auth";
import { useUser } from "../context/UserContext";
import "../styles/AuthPage.css";

import banner from "../assets/icons/insta.png";
export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const { setUser } = useUser();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    age: "",
    gender: "",
  });
  const [message, setMessage] = useState("");

  const handleChange = (e) =>
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    if (isLogin) {
      const response = await fetch("http://localhost:8000/api/token/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: formData.username,
          password: formData.password,
        }),
      });

      const data = await response.json();
      if (response.ok) {
        saveToken(data.access);
        const userResponse = await fetch(
          "http://localhost:8000/api/current_user/",
          { headers: { Authorization: `Bearer ${data.access}` } }
        );
        if (userResponse.ok) {
          const userData = await userResponse.json();
          setUser(userData);
          navigate(`/profile/${userData.username}`);
        }
      } else {
        setMessage(`Ошибка входа: ${data.detail || "Неизвестная ошибка"}`);
      }
    } else {
      try {
        const response = await fetch("http://localhost:8000/api/register/", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });
        const data = await response.json();

        if (response.ok) {
          setMessage("Регистрация прошла успешно!");
          setFormData({
            username: "",
            email: "",
            password: "",
            age: "",
            gender: "",
          });
        } else {
          setMessage(`Ошибка: ${data.error || JSON.stringify(data)}`);
        }
      } catch (error) {
        setMessage(`Сетевая ошибка: ${error.message}`);
      }
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-logo">
          <img src={banner} alt="banner" className="auth-banner" />
          <h1 className="app-title">Pikta</h1>
        </div>

        <div className="auth-tabs">
          <button
            className={isLogin ? "active" : ""}
            onClick={() => setIsLogin(true)}
          >
            Вход
          </button>
          <button
            className={!isLogin ? "active" : ""}
            onClick={() => setIsLogin(false)}
          >
            Регистрация
          </button>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          <input
            type="text"
            name="username"
            placeholder="Имя пользователя"
            value={formData.username}
            onChange={handleChange}
            required
          />
          {!isLogin && (
            <>
              <input
                type="email"
                name="email"
                placeholder="Электронная почта"
                value={formData.email}
                onChange={handleChange}
                required
              />
              <input
                type="number"
                name="age"
                placeholder="Возраст"
                value={formData.age}
                onChange={handleChange}
                min="10"
                max="100"
                required
              />
              <select
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                required
              >
                <option value="">Выберите пол</option>
                <option value="male">Мужской</option>
                <option value="female">Женский</option>
                <option value="other">Другое</option>
              </select>
            </>
          )}
          <input
            type="password"
            name="password"
            placeholder="Пароль"
            value={formData.password}
            onChange={handleChange}
            required
          />
          <button type="submit">{isLogin ? "Войти" : "Зарегистрироваться"}</button>
        </form>

        {isLogin && (
          <p className="auth-link">
            <a href="/reset-password">Забыли пароль?</a>
          </p>
        )}
        {message && <p className="auth-message">{message}</p>}
      </div>
    </div>
  );
}
