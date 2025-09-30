import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "../styles/ResetPassword.css"; // можно использовать те же стили

function ResetPasswordConfirm() {
  const { uid, token } = useParams();
  const navigate = useNavigate();

  const [password, setPassword] = useState("");
  const [password2, setPassword2] = useState("");
  const [message, setMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showPassword2, setShowPassword2] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== password2) {
      setMessage("❌ Пароли не совпадают.");
      return;
    }

    try {
      const res = await fetch(
        `http://localhost:8000/api/password-reset-confirm/${uid}/${token}/`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ password }),
        }
      );

      const data = await res.json();

      if (res.ok) {
        setMessage("✅ Пароль успешно изменён! Перенаправляем на вход...");
        setTimeout(() => navigate("/login"), 2000);
      } else {
        setMessage(data.error || "❌ Ошибка при сбросе пароля.");
      }
    } catch (err) {
      setMessage("⚠️ Ошибка соединения с сервером.");
    }
  };

  return (
    <div className="reset-container">
      <div className="reset-card">
        <h2>Новый пароль</h2>
        <form onSubmit={handleSubmit}>
          <div className="password-input">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Введите новый пароль"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <span
              className="toggle-visibility"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? "🙈" : "👁️"}
            </span>
          </div>

          <div className="password-input">
            <input
              type={showPassword2 ? "text" : "password"}
              placeholder="Повторите новый пароль"
              value={password2}
              onChange={(e) => setPassword2(e.target.value)}
              required
            />
            <span
              className="toggle-visibility"
              onClick={() => setShowPassword2(!showPassword2)}
            >
              {showPassword2 ? "🙈" : "👁️"}
            </span>
          </div>

          <button type="submit">Сохранить</button>
          {message && <p className="reset-message">{message}</p>}
        </form>
      </div>
    </div>
  );
}

export default ResetPasswordConfirm;
