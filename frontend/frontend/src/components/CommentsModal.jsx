// frontend/src/components/CommentsModal.jsx
import React, { useEffect, useState } from "react";
import { getComments, addComment } from "../api";
import "../styles/CommentsModal.css";

function CommentsModal({ isOpen, onClose, postId }) {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadComments = async () => {
    try {
      setLoading(true);
      const data = await getComments(postId);
      setComments(data);
    } catch (err) {
      setError(err.message || "Ошибка загрузки комментариев");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen && postId) {
      loadComments();
    }
  }, [isOpen, postId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    try {
      const comment = await addComment(postId, newComment);
      setComments((prev) => [...prev, comment]);
      setNewComment("");
    } catch (err) {
      console.error("Ошибка при добавлении комментария:", err);
      setError(err.message || "Ошибка при добавлении комментария");
    }
  };

  if (!isOpen || !postId) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        {/* Кнопка закрытия */}
        <button className="modal-close" onClick={onClose}>
          ✖ Закрыть
        </button>

        <h2>Комментарии</h2>

        {loading ? (
          <p className="comments-info">Загрузка...</p>
        ) : error ? (
          <p className="comments-info" style={{ color: "red" }}>
            {error}
          </p>
        ) : comments.length > 0 ? (
          <div className="comments-list">
            {comments.map((c) => (
              <div key={c.id} className="comment-card">
                <strong>{c.user?.username || "Аноним"}:</strong> {c.content}
              </div>
            ))}
          </div>
        ) : (
          <p className="no-comments">Комментариев пока нет</p>
        )}

        <form onSubmit={handleSubmit} className="comment-form">
          <input
            type="text"
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Напишите комментарий..."
          />
          <button type="submit">Отправить</button>
        </form>
      </div>
    </div>
  );
}

export default CommentsModal;
