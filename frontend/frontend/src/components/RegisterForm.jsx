import React, { useState } from "react";
import "../styles/RegisterForm.css";
// import instaBanner from "../assets/images/insta_banner.jpg"; // добавь любое изображение в папку assets/images
import insta from "../assets/icons/insta.png";
function RegisterForm() {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    age: "",
    gender: "",
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
  };

  return (
    <div className="register-container">
      <div className="register-card">
        <img src={insta} alt="banner" className="register-banner" />
        <h2 className="register-title">Создайте аккаунт</h2>
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
            placeholder="Электронная почта"
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
