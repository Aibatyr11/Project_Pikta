import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import '../App.css';
import { useUser } from "../context/UserContext";

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

function UserProfile() {
  const { username } = useParams();
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);
  // const [currentUser, setCurrentUser] = useState(null);
  const [isFollowing, setIsFollowing] = useState(false);
  const { user: currentUser, setUser: setCurrentUser } = useUser();


  useEffect(() => {
    fetch(`http://localhost:8000/api/profile/${username}/`)
      .then((res) => res.json())
      .then((data) => {
        setUser(data.user);
        setPosts(data.posts);
      });

    fetch("http://localhost:8000/api/current_user/", {
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => setCurrentUser(data));
  }, [username]);

  useEffect(() => {
    if (user && currentUser && user.id !== currentUser.id) {
      fetch(`http://localhost:8000/api/is_following/${user.id}/`, {
        credentials: "include",
      })
        .then((res) => res.json())
        .then((data) => setIsFollowing(data.is_following));
    }
  }, [user, currentUser]);

  const handleFollow = () => {
    const csrftoken = getCookie("csrftoken");
    fetch("http://localhost:8000/api/follow/", {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        "X-CSRFToken": csrftoken,
      },
      body: JSON.stringify({ followed_id: user.id }),
    })
      .then((res) => res.json())
      .then(() => setIsFollowing(true));
  };

  const handleUnfollow = () => {
    const csrftoken = getCookie("csrftoken");
    fetch("http://localhost:8000/api/unfollow/", {
      method: "DELETE",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        "X-CSRFToken": csrftoken,
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
            width="100"
            height="100"
            style={{ borderRadius: "50%" }}
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

      {/* Кнопки выбора типа контента */}
      <div style={{ display: "flex", justifyContent: "center", gap: "10px", marginTop: "2rem" }}>
        <button>Посты</button>
        <button>Лайки</button>
        <button>Избранное</button>
      </div>

      {/* Посты */}
      <div style={{ marginTop: "2rem" }}>
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
      </div>
    </div>
  );
}

export default UserProfile;
