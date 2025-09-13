import React, { useState } from "react";
import "../styles/RegisterForm.css";

function RegisterForm() {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    try {
      const response = await fetch("http://localhost:8000/api/register/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await response.json();

      if (response.ok) {
        setMessage("✅ Регистрация прошла успешно!");
        setFormData({ username: "", email: "", password: "" });
      } else {
        setMessage(`❌ Ошибка: ${data.error || JSON.stringify(data)}`);
      }
    } catch (error) {
      setMessage(`⚠️ Сетевая ошибка: ${error.message}`);
    }
  };

  return (
    <div className="register-container">
      <div className="register-card">
        <h2 className="register-title">Регистрация</h2>
        <form onSubmit={handleSubmit} className="register-form">
          <input
            type="text"
            name="username"
            placeholder="Имя пользователя"
            value={formData.username}
            onChange={handleChange}
            required
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Пароль"
            value={formData.password}
            onChange={handleChange}
            required
          />
          <button type="submit" className="register-btn">
            Зарегистрироваться
          </button>
        </form>
        {message && <p className="register-message">{message}</p>}
      </div>
    </div>
  );
}

export default RegisterForm;
