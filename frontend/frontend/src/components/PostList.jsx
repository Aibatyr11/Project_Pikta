import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { authFetch } from "../utils/auth";
import "../App.css";

function PostList() {
  const [posts, setPosts] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    authFetch("http://localhost:8000/api/posts/")
      .then((res) => {
        if (!res.ok) {
          throw new Error(`Ошибка загрузки постов: ${res.status}`);
        }
        return res.json();
      })
      .then((data) => setPosts(data))
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
        if (!res.ok) {
          throw new Error("Ошибка при отправке лайка");
        }
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
      .catch((err) => {
        console.error("Ошибка лайка:", err.message);
      });
  };

  if (error) {
    return <p style={{ color: "red", marginTop: "50px" }}>{error}</p>;
  }

  return (
    <div
      className="center-container"
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "20px",
        marginTop: "50px",
      }}
    >
      {posts.map((post) => (
        <div
          key={post.id}
          style={{
            border: "1px solid #ccc",
            padding: "1rem",
            borderRadius: "10px",
            maxWidth: "600px",
            width: "100%",
            textAlign: "left",
           
          }}
        >
          {/* Автор поста */}
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            {post.user.avatar && (
              <Link to={`/profile/${post.user.username}`}>
                <img
                  src={post.user.avatar}
                  alt="Avatar"
                  width="50"
                  height="50"
                  style={{ borderRadius: "50%", objectFit: "cover" }}
                />
              </Link>
            )}
            <Link to={`/profile/${post.user.username}`}>
              <strong>{post.user.username}</strong>
            </Link>
          </div>

          {/* Картинка поста */}
          {post.image && (
            <div style={{ marginTop: "1rem" }}>
              <img
                src={post.image}
                alt="Post"
                style={{
                  width: "100%",
                  maxHeight: "400px",
                  objectFit: "contain",
                  borderRadius: "8px",
                }}
              />
            </div>
          )}

          {/* Текстовая инфа */}
          <p>
            <strong>Описание:</strong> {post.caption}
          </p>
          {post.location && (
            <p>
              <strong>Локация:</strong> {post.location}
            </p>
          )}
          <p>
            <strong>Дата:</strong> {new Date(post.created_at).toLocaleString()}
          </p>

          {/* Лайки */}
          <button onClick={() => toggleLike(post.id, post.is_liked)}>
            {post.is_liked ? "❤️" : "🤍"} {post.likes_count}
          </button>
        </div>
      ))}
    </div>
  );
}

export default PostList;
