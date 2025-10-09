import { useEffect, useState } from "react";
import { authFetch } from "../utils/auth";
import "../styles/SharePostModal.css";

export default function SharePostModal({ postId, postImage, onClose }) {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [successMessage, setSuccessMessage] = useState(""); 

  useEffect(() => {
    authFetch("http://localhost:8000/api/users/")
      .then((res) => res.json())
      .then((data) => setUsers(data))
      .catch((err) => console.error("Ошибка при загрузке пользователей:", err))
      .finally(() => setLoading(false));
  }, []);

  const handleSend = async (username) => {
    try {
      const response = await authFetch("http://localhost:8000/api/share_post/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          post_id: postId,
          target_username: username,
        }),
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.detail || "Ошибка при отправке поста");
      }

      setSuccessMessage(`Пост отправлен пользователю ${username}!`);


      setTimeout(() => {
        setSuccessMessage("");
        onClose();
      }, 2000);
    } catch (err) {
      console.error(err);
      setSuccessMessage(` ${err.message}`);
      setTimeout(() => setSuccessMessage(""), 3000);
    }
  };

  if (loading) return null;

  return (
    <div className="modal-backdrop">
      <div className="modal-content">
        <h2>Отправить пост</h2>

        {successMessage && (
          <div className="success-message">{successMessage}</div>
        )}

        {postImage && (
          <div className="post-preview">
            <img
              src={
                postImage.startsWith("http")
                  ? postImage
                  : `http://localhost:8000${postImage}`
              }
              alt="Предпросмотр поста"
              className="post-preview-image"
            />
          </div>
        )}

        <div className="user-list">
          {users.map((u) => (
            <div
              key={u.id}
              className="user-item"
              onClick={() => handleSend(u.username)}
            >
              <img
                src={
                  u.avatar
                    ? `http://localhost:8000${u.avatar}`
                    : "/default-avatar.png"
                }
                alt={u.username}
                className="user-avatar"
              />
              <span>{u.username}</span>
            </div>
          ))}
        </div>

        <button className="close-btn" onClick={onClose}>
          X
        </button>
      </div>
    </div>
  );
}
