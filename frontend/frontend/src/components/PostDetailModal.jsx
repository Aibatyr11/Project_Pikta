import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { createPortal } from "react-dom";
import { authFetch } from "../utils/auth";
import { getComments } from "../api";
import "../styles/PostDetailModal.css";

function PostDetailModal({ postId, isOpen, onClose }) {
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");

  useEffect(() => {
    if (!isOpen || !postId) return;

    setPost(null);
    authFetch(`http://localhost:8000/api/posts/${postId}/`)
      .then((res) => res.json())
      .then((data) => setPost(data))
      .catch((err) => console.error("Ошибка загрузки поста:", err));

    getComments(postId)
      .then(setComments)
      .catch((err) => console.error("Ошибка загрузки комментариев:", err));
  }, [isOpen, postId]);

  if (!isOpen) return null;

  if (!post)
    return createPortal(
      <div className="modal-overlay">
        <div className="modal-content center">
          <p>Загрузка...</p>
        </div>
      </div>,
      document.body
    );

  const toggleLike = () => {
    const method = post.is_liked ? "DELETE" : "POST";
    authFetch(
      `http://localhost:8000/api/posts/${post.id}/${post.is_liked ? "unlike" : "like"}/`,
      { method }
    )
      .then(() => {
        setPost((prev) => ({
          ...prev,
          is_liked: !prev.is_liked,
          likes_count: prev.likes_count + (prev.is_liked ? -1 : 1),
        }));
      })
      .catch((err) => console.error("Ошибка лайка:", err));
  };

  const handleAddComment = (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    authFetch(`http://localhost:8000/api/posts/${post.id}/comments/`, {
      method: "POST",
      body: JSON.stringify({ content: newComment }),
    })
      .then((res) => res.json())
      .then((comment) => {
        setComments((prev) => [...prev, comment]);
        setNewComment("");
      })
      .catch((err) => console.error("Ошибка добавления комментария:", err));
  };

  const modal = (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-box" onClick={(e) => e.stopPropagation()}>
        <button className="close-btn" onClick={onClose}>X</button>
        <div className="modal-left">
          <img src={post.image} alt="post" />
        </div>

        <div className="modal-right">
          <div className="post-header">
            {post.user?.avatar && (
              <Link to={`/profile/${post.user.username}`}>
                <img src={post.user.avatar} alt="avatar" className="avatar" />
              </Link>
            )}
            <Link to={`/profile/${post.user.username}`}>
              <strong>@{post.user.username}</strong>
            </Link>
          </div>

          {post.caption && <p className="caption">{post.caption}</p>}

          <div className="comments-list">
            {comments.length === 0 ? (
              <p className="no-comments">Пока нет комментариев</p>
            ) : (
              comments.map((c) => (
                <div key={c.id} className="comment">
                  <strong>@{c.user?.username}</strong> {c.content}
                </div>
              ))
            )}
          </div>

          <div className="post-footer">
            <button className="like-btn" onClick={toggleLike}>
              {post.is_liked ? "❤️" : "🤍"} {post.likes_count}
            </button>

            <form onSubmit={handleAddComment} className="comment-form">
              <input
                type="text"
                placeholder="Добавить комментарий..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
              />
              <button type="submit">Отправить</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );

  return createPortal(modal, document.body);
}

export default PostDetailModal;
