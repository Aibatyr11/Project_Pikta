import { useEffect, useState } from "react";
import { authFetch } from "../utils/auth";
import "../styles/PrivacyModal.css";

export default function PrivacyModal({ onAccept }) {
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    authFetch("http://localhost:8000/api/privacy-policy/")
      .then((res) => {
        if (!res || res.status === 401 || res.status === 403) {
          setShow(false);
          return null;
        }
        return res.json();
      })
      .then((data) => {
        if (data && !data.accepted) {
          setShow(true);
        }
      })
      .catch(() => {
        setShow(false);
      })
      .finally(() => setLoading(false));
  }, []);

  const handleAccept = () => {
    authFetch("http://localhost:8000/api/privacy-policy/", {
      method: "POST",
    })
      .then((res) => {
        if (!res.ok) throw new Error("Ошибка при отправке согласия");
        setShow(false);
        if (typeof onAccept === "function") onAccept();
      })
      .catch((err) => alert(err.message));
  };

  if (loading || !show) return null;

  return (
    <div className="modal-backdrop">
      <div
        className="modal-content"
        role="dialog"
        aria-modal="true"
        aria-labelledby="privacy-title"
      >
        <h2 id="privacy-title" className="modal-title">
          Политика конфиденциальности
        </h2>

        <div className="modal-body">
          <p className="modal-text">
            Мы используем ваши данные для работы сервиса, уведомлений и
            улучшения функционала. Никаких посторонних рассылок — только то,
            что нужно для работы приложения.
          </p>
        </div>

        <div className="modal-footer">
          <button className="accept-btn" onClick={handleAccept}>
            Принять
          </button>
        </div>
      </div>
    </div>
  );
}
