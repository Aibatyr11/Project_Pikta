import { Link } from "react-router-dom";
import '../App.css';
import React, { useEffect, useState } from "react";

function PostList() {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    fetch("http://localhost:8000/api/posts/")
      .then((res) => res.json())
      .then((data) => {
        console.log(data); // Смотри, что приходит от бэка
        setPosts(data);
      });
  }, []);

  return (
    <div className="center-container" style={{ textAlign: "center" }}>
      <h2>Посты</h2>
      {posts.map((post) => (
        <div
          key={post.id}
          style={{
            border: "1px solid #ccc",
            margin: "1rem 0",
            padding: "1rem",
            borderRadius: "10px",
            maxWidth: "900px",
            justifyContent: 'center'
          }}
        >
          {/* Автор поста */}
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            {post.user.avatar && (
              <Link to={`/profile/${post.user.username}`}>
              <img
                src={post.user.avatar}
                alt="Avatar"
                width="80"
                height="80"
                style={{ borderRadius: "50%", objectFit: "cover" }}
              />
              </Link>
            )}
            <Link to={`/profile/${post.user.username}`}>
              <strong>{post.user.username}</strong>
            </Link>
          </div>

          {/* Картинка поста */}
          <div style={{ marginTop: "1rem" }}>
            {post.image && (
              <img
                src={post.image}
                alt="Post"
                width="100%"
                style={{ maxHeight: "400px", objectFit: "cover", borderRadius: "8px" }}
              />
            )}
          </div>

          {/* Описание, локация и дата */}
          <p><strong>Описание:</strong> {post.caption}</p>
          {post.location && <p><strong>Локация:</strong> {post.location}</p>}
          <p><strong>Дата:</strong> {new Date(post.created_at).toLocaleString()}</p>
        </div>
      ))}
    </div>
  );
}

export default PostList;
