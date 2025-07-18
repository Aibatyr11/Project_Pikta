import { useEffect, useState } from "react";

export default function PrivacyModal() {
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://localhost:8000/api/privacy-policy/", {
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => {
        setShow(!data.accepted);  // если не принял → показать
      })
      .catch(() => setShow(false))
      .finally(() => setLoading(false));
  }, []);

  

  function getCookie(name) {
  let cookieValue = null;
  if (document.cookie && document.cookie !== "") {
    const cookies = document.cookie.split(";");
    for (let cookie of cookies) {
      cookie = cookie.trim();
      if (cookie.startsWith(name + "=")) {
        cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
        break;
      }
    }
  }
  return cookieValue;
}

const acceptPolicy = () => {
  const csrftoken = getCookie("csrftoken");

  fetch("http://localhost:8000/api/privacy-policy/", {
    method: "POST",
    credentials: "include",
    headers: {
      "X-CSRFToken": csrftoken,
    },
  }).then(() => setShow(false));
};


  if (loading || !show) return null;

  return (
    <div className="modal-backdrop">
      <div className="modal-content">
        <h2>Политика конфиденциальности</h2>
        <p>Ваш текст политики здесь...</p>
        <button onClick={acceptPolicy}>Принять</button>
      </div>
    </div>
  );
}
