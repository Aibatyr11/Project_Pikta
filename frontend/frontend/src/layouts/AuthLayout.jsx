import React from "react";
import insta from "../assets/icons/insta.png";
import "../styles/AuthLayout.css";

export default function AuthLayout({ children }) {
  return (
    <div className="auth-page">
      <div className="auth-header">
        <img src={insta} alt="Pikta logo" />
        <h1 className="app-title">Pikta</h1>
      </div>

      <div className="auth-card">{children}</div>
    </div>
  );
}
