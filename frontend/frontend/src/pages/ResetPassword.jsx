import React, { useState } from "react";

function ResetPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    // Фейковый сброс пароля
    if (email.trim()) {
      setMessage("📨 Пароль сброшен. Проверьте вашу почту.");
      setEmail("");
    } else {
      setMessage("❌ Введите корректный email.");
    }
  };

  return (
    <div className="center-container" style={{ marginTop: "100px", textAlign: "center" }}>
      <h2>Сброс пароля</h2>
      <form onSubmit={handleSubmit} style={{ maxWidth: "400px", margin: "0 auto" }}>
        <input
          type="email"
          placeholder="Введите ваш email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          style={{ padding: "10px", width: "100%", borderRadius: "8px" }}
        />
        <br /><br />
        <button
          type="submit"
          style={{
            background: "#00aaff",
            color: "white",
            padding: "10px",
            borderRadius: "10px",
            width: "100%",
          }}
        >
          Сбросить пароль
        </button>
        {message && <p style={{ marginTop: "1rem" }}>{message}</p>}
      </form>
    </div>
  );
}

export default ResetPassword;
