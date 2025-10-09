import React, { useState } from "react";
import "../styles/ResetPassword.css"; 

function ResetPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email.trim()) {
      setMessage("❌ Введите корректный email.");
      return;
    }

    try {
      const res = await fetch("http://localhost:8000/api/password-reset/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      let data = {};
      try {
        data = await res.json();
      } catch (err) {
        data = {};
      }

      if (res.ok) {
        setMessage("📨 Письмо для сброса отправлено на вашу почту.");
        setEmail("");
      } else {
        setMessage(data.error || "Ошибка при сбросе пароля.");
      }
    } catch (err) {
      setMessage("Ошибка соединения с сервером.");
    }
  };

  return (
    <div className="reset-container">
      <div className="reset-card">
        <h2>Сброс пароля</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Введите ваш email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <button type="submit">Сбросить пароль</button>
          {message && <p className="reset-message">{message}</p>}
        </form>
      </div>
    </div>
  );
}

export default ResetPassword;
