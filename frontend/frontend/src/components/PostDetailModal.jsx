import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { authFetch } from "../utils/auth";
import { getComments } from "../api";
import "../styles/PostDetailModal.css";

function PostDetailModal({ postId, isOpen, onClose }) {
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");

  useEffect(() => {
    if (!isOpen || !postId) return;

    // грузим пост
    authFetch(`http://localhost:8000/api/posts/${postId}/`)
      .then((res) => res.json())
      .then((data) => setPost(data));

    // грузим комментарии
    getComments(postId).then(setComments);
  }, [isOpen, postId]);

  if (!isOpen) return null;
  if (!post) return <div className="modal-overlay">Загрузка...</div>;

  const toggleLike = () => {
    const method = post.is_liked ? "DELETE" : "POST";
    authFetch(
      `http://localhost:8000/api/posts/${post.id}/${post.is_liked ? "unlike" : "like"}/`,
      { method }
    )
      .then((res) => res.json())
      .then(() => {
        setPost((prev) => ({
          ...prev,
          is_liked: !prev.is_liked,
          likes_count: prev.likes_count + (prev.is_liked ? -1 : 1),
        }));
      });
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
      });
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        {/* крестик */}
        <button className="modal-close" onClick={onClose}>
          ✖
        </button>

        {/* левая часть — картинка */}
        <div className="modal-left">
          <img src={post.image} alt="post" />
        </div>

        {/* правая часть — инфо */}
        <div className="modal-right">
          {/* пост сверху */}
          <div className="post-info">
            <div className="modal-header">
              {post.user.avatar && (
                <Link to={`/profile/${post.user.username}`}>
                  <img src={post.user.avatar} alt="avatar" className="avatar" />
                </Link>
              )}
              <Link to={`/profile/${post.user.username}`}>
                <strong>@{post.user.username}</strong>
              </Link>
              <span className="time">
                {new Date(post.created_at).toLocaleString()}
              </span>
            </div>

            {post.caption && <p className="caption">{post.caption}</p>}

            <div className="likes">
              <button onClick={toggleLike}>
                {post.is_liked ? "❤️" : "🤍"} {post.likes_count}
              </button>
            </div>
          </div>

          {/* комментарии (растягиваются) */}
          <div className="comments">
            {comments.map((c) => (
              <div key={c.id} className="comment">
                <strong>@{c.user?.username}:</strong> {c.content}
              </div>
            ))}
          </div>

          {/* форма снизу */}
          <form onSubmit={handleAddComment} className="comment-form">
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
    </div>
  );
}

export default PostDetailModal;
