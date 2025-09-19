import React, { useEffect, useState } from "react";
import { getComments } from "../api";
import CommentForm from "./CommentForm";
import "../styles/CommentsList.css";

const CommentsList = ({ postId }) => {
  const [comments, setComments] = useState([]);
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
    loadComments();
  }, [postId]);

  const handleNewComment = (comment) => {
    setComments((prev) => [...prev, comment]);
  };

  return (
    <div className="comments-wrapper">
      <h3 className="comments-title">💬 Комментарии ({comments.length})</h3>

      <CommentForm postId={postId} onCommentAdded={handleNewComment} />

      {loading && <p className="comments-info">Загрузка комментариев...</p>}
      {error && <p className="comments-info" style={{ color: "red" }}>{error}</p>}

      <div className="comments-list">
        {comments.map((c) => (
          <div key={c.id} className="comment-card">
            <div className="comment-header">
              <img
                src={`https://ui-avatars.com/api/?name=${
                  c.user?.username || "Аноним"
                }&background=0D8ABC&color=fff&size=40`}
                alt="avatar"
                className="comment-avatar"
              />
              <div>
                <strong className="comment-username">
                  {c.user ? c.user.username : "Аноним"}
                </strong>
                <div className="comment-date">
                  {new Date(c.created_at).toLocaleString()}
                </div>
              </div>
            </div>
            <p className="comment-text">{c.content}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CommentsList;
