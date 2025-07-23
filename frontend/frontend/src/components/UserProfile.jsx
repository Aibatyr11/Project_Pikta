import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import '../App.css';
import { useUser } from "../context/UserContext";
import { getToken } from "../utils/auth";

function UserProfile() {
  const { username } = useParams();
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [likedPosts, setLikedPosts] = useState([]);
  const [activeTab, setActiveTab] = useState("posts");
  const [isFollowing, setIsFollowing] = useState(false);
  const { user: currentUser, setUser: setCurrentUser } = useUser();

  const token = getToken();

  useEffect(() => {
    // Получить профиль и посты
    fetch(`http://localhost:8000/api/profile/${username}/`)
      .then((res) => res.json())
      .then((data) => {
        setUser(data.user);
        setPosts(data.posts);
      });

    // Получить текущего пользователя
    if (token) {
      fetch("http://localhost:8000/api/current_user/", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then((res) => res.ok ? res.json() : null)
        .then((data) => data && setCurrentUser(data))
        .catch(() => setCurrentUser(null));
    }
  }, [username, token]);

  useEffect(() => {
    if (user && currentUser && user.id !== currentUser.id && token) {
      fetch(`http://localhost:8000/api/is_following/${user.id}/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then((res) => res.json())
        .then((data) => setIsFollowing(data.is_following));
    }
  }, [user, currentUser, token]);

  useEffect(() => {
    if (activeTab === "likes" && token) {
      fetch(`http://localhost:8000/api/liked_posts/${username}/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then((res) => res.json())
        .then((data) => setLikedPosts(data));
    }
  }, [activeTab, username, token]);

  const handleFollow = () => {
    fetch("http://localhost:8000/api/follow/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ followed_id: user.id }),
    })
      .then((res) => res.json())
      .then(() => setIsFollowing(true));
  };

  const handleUnfollow = () => {
    fetch("http://localhost:8000/api/unfollow/", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ followed_id: user.id }),
    })
      .then((res) => {
        if (res.ok) {
          setIsFollowing(false);
        } else {
          return res.json().then((err) => {
            throw new Error(err.detail || "Ошибка при отписке");
          });
        }
      })
      .catch((err) => alert(err.message));
  };

  if (!user) return <p>Загрузка...</p>;

  return (
    <div className="center-container" style={{ textAlign: "center" }}>
      <div>
        {user.avatar ? (
          <img
            src={user.avatar}
            alt="Аватар"
            style={{
              width: "150px",
              height: "150px",
              borderRadius: "50%",
              objectFit: "cover",
              backgroundColor: "#333",
              marginTop: "100px",
            }}
          />
        ) : (
          <p>Аватар отсутствует</p>
        )}
      </div>

      <h2>@{user.username}</h2>

      <div style={{ display: "flex", justifyContent: "center", gap: "30px", margin: "1rem 0" }}>
        <div>
          <strong>{user.following_count}</strong><br />Подписки
        </div>
        <div>
          <strong>{user.followers_count}</strong><br />Подписчики
        </div>
        <div>
          <strong>{posts.reduce((sum, p) => sum + (p.likes_count || 0), 0)}</strong><br />Лайки
        </div>
      </div>

      {currentUser && currentUser.id !== user.id && (
        isFollowing ? (
          <button onClick={handleUnfollow}>Отписаться</button>
        ) : (
          <button onClick={handleFollow}>Подписаться</button>
        )
      )}

      <p style={{ marginTop: "1rem" }}>{user.bio || "О себе не указано"}</p>

      <div style={{ display: "flex", justifyContent: "center", gap: "10px", marginTop: "2rem" }}>
        <button onClick={() => setActiveTab("posts")} style={{ backgroundColor: activeTab === "posts" ? "#007cd1" : "" }}>Посты</button>
        <button onClick={() => setActiveTab("likes")} style={{ backgroundColor: activeTab === "likes" ? "#007cd1" : "" }}>Лайки</button>
        <button disabled>Избранное</button>
      </div>

      {currentUser && currentUser.id === user.id && (
        <button onClick={() => window.location.href = "/edit-profile"}>Настройки профиля</button>
      )}

      <div style={{ marginTop: "2rem" }}>
        {activeTab === "posts" && (
          <>
            <h3>Посты:</h3>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "10px" }}>
              {posts.map((post) => (
                <img
                  key={post.id}
                  src={post.image.startsWith("http") ? post.image : `http://localhost:8000${post.image}`}
                  alt="post"
                  width="100%"
                  style={{ borderRadius: "10px" }}
                />
              ))}
            </div>
          </>
        )}

        {activeTab === "likes" && (
          <>
            <h3>Понравившиеся посты:</h3>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "10px" }}>
              {likedPosts.map((post) => (
                <img
                  key={post.id}
                  src={post.image.startsWith("http") ? post.image : `http://localhost:8000${post.image}`}
                  alt="liked"
                  width="100%"
                  style={{ borderRadius: "10px" }}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default UserProfile;
