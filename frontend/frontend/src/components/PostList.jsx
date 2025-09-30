// frontend/src/pages/PostList.jsx
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { authFetch } from "../utils/auth";
import { getComments } from "../api";
import PostDetailModal from "../components/PostDetailModal";
import "../styles/PostList.css";

function PostList() {
  const [posts, setPosts] = useState([]);
  const [error, setError] = useState("");
  const [previewComments, setPreviewComments] = useState({});

  // состояние модалки
  const [selectedPostId, setSelectedPostId] = useState(null);

  useEffect(() => {
    authFetch("http://localhost:8000/api/posts/")
      .then((res) => {
        if (!res.ok) throw new Error(`Ошибка загрузки постов: ${res.status}`);
        return res.json();
      })
      .then((data) => {
        setPosts(data);
        data.forEach((post) => {
          getComments(post.id).then((comments) => {
            setPreviewComments((prev) => ({
              ...prev,
              [post.id]: comments.slice(-2),
            }));
          });
        });
      })
      .catch((err) => {
        console.error("Ошибка загрузки постов:", err);
        setError("Не удалось загрузить посты. Убедитесь, что вы вошли в систему.");
      });
  }, []);

  const toggleLike = (postId, isCurrentlyLiked) => {
    const method = isCurrentlyLiked ? "DELETE" : "POST";

    authFetch(
      `http://localhost:8000/api/posts/${postId}/${isCurrentlyLiked ? "unlike" : "like"}/`,
      { method }
    )
      .then((res) => {
        if (!res.ok) throw new Error("Ошибка при отправке лайка");
        return res.json();
      })
      .then(() => {
        setPosts((prevPosts) =>
          prevPosts.map((post) =>
            post.id === postId
              ? {
                  ...post,
                  is_liked: !isCurrentlyLiked,
                  likes_count: post.likes_count + (isCurrentlyLiked ? -1 : 1),
                }
              : post
          )
        );
      })
      .catch((err) => console.error("Ошибка лайка:", err.message));
  };

  const openModal = (postId) => {
    setSelectedPostId(postId);
  };

  const closeModal = () => {
    setSelectedPostId(null);
  };

  if (error) {
    return <p style={{ color: "red", marginTop: "50px" }}>{error}</p>;
  }

  return (
    <div className="post-list">
      {posts.map((post) => (
        <div key={post.id} className="post">
          {/* Автор поста */}
          <div className="post-header">
            {post.user.avatar && (
              <Link to={`/profile/${post.user.username}`}>
                <img src={post.user.avatar} alt="Avatar" className="post-avatar" />
              </Link>
            )}
            <Link to={`/profile/${post.user.username}`} className="post-user">
              <strong>{post.user.username}</strong>
            </Link>
            <span className="post-time">
              {new Date(post.created_at).toLocaleString()}
            </span>
          </div>

          {/* Картинка поста (по клику откроется модалка) */}
          {post.image && (
            <div className="post-image" onClick={() => openModal(post.id)}>
              <img src={post.image} alt="Post" />
            </div>
          )}

                    {/* Лайки */}
          <div className="post-actions">
            <button onClick={() => toggleLike(post.id, post.is_liked)}>
              {post.is_liked ? "❤️" : "🤍"} {post.likes_count}
            </button>
          </div>

          {/* Контент */}
          <div className="post-content">
            <p>{post.caption}</p>
            {post.location && <p><strong>{post.location}</strong></p>}
          </div>



          {/* Превью комментариев */}
          <div className="post-comments">
            {previewComments[post.id]?.map((c) => (
              <div key={c.id} className="comment-preview">
                <strong>{c.user?.username || "Аноним"}:</strong> {c.content}
              </div>
            ))}

            <button
              className="view-comments-btn"
              onClick={() => openModal(post.id)}
            >
              💬 Посмотреть все комментарии
            </button>
          </div>

          {/* Модалка рендерится прямо здесь, если пост выбран */}
          {selectedPostId === post.id && (
            <PostDetailModal
              postId={post.id}
              isOpen={true}
              onClose={closeModal}
            />
          )}
        </div>
      ))}
    </div>
  );
}

export default PostList;
