import { useEffect, useState } from "react";
import { authFetch } from "../utils/auth";

export default function PrivacyModal({ onAccept }) {
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    authFetch("http://localhost:8000/api/privacy-policy/")
      .then((res) => {
        // Проверка, если токен недействителен или отсутствует
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
        onAccept();
      })
      .catch((err) => alert(err.message));
  };

  if (loading || !show) return null;

  return (
    <div className="modal-backdrop">
      <div className="modal-content">
        <h2>Политика конфиденциальности</h2>
        <p>Ваш текст политики здесь...</p>
        <button onClick={handleAccept}>Принять</button>
      </div>
    </div>
  );
}
