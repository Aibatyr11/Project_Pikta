import { useEffect, useState } from "react";

export default function PrivacyModal({ onAccept }) {
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const access = localStorage.getItem("accessToken");
    if (!access) {
      setShow(false);
      setLoading(false);
      return;
    }

    fetch("http://localhost:8000/api/privacy-policy/", {
      headers: {
        Authorization: `Bearer ${access}`,
      },
    })
      .then((res) => {
        if (res.status === 403) {
          setShow(false);
          return null;
        }
        return res.json();
      })
      .then((data) => {
        if (data && !data.accepted) setShow(true);
      })
      .catch(() => setShow(false))
      .finally(() => setLoading(false));
  }, []);

  const handleAccept = () => {
    const access = localStorage.getItem("accessToken");
    if (!access) return;

    fetch("http://localhost:8000/api/privacy-policy/", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${access}`,
      },
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
