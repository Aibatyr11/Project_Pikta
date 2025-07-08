import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

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
  const [currentUser, setCurrentUser] = useState(null);
  const [isFollowing, setIsFollowing] = useState(false);

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
    if (user) {
      console.log("USER OBJECT:", user);
    }
    }, [user]);


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
      .then(res => res.json())
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
      .then(res => {
        if (res.ok) {
          setIsFollowing(false);
        } else {
          return res.json().then(err => {
            throw new Error(err.detail || "Ошибка при отписке");
          });
        }
      })
      .catch(err => alert(err.message));
  };


  if (!user) return <p>Загрузка...</p>;

  

  return (
    <div>
      <h2>Профиль: {user.username}</h2>
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
      <p><strong>Email:</strong> {user.email}</p>
      <p><strong>О себе:</strong> {user.bio}</p>

      <p><strong>Подписчики:</strong> {user.followers_count}</p>
      <p><strong>Подписки:</strong> {user.following_count}</p>



      {/* 🔹 КНОПКА ПОДПИСКИ */}
      {currentUser && currentUser.id !== user.id && (
        isFollowing ? (
          <button onClick={handleUnfollow}>Отписаться</button>
        ) : (
          <button onClick={handleFollow}>Подписаться</button>
        )
      )}

      <h3>Посты:</h3>
      {posts.map((post) => (
        <div key={post.id}>
          <img
            src={post.image.startsWith("http") ? post.image : `http://localhost:8000${post.image}`}
            alt="post"
          width="300"
          />

          
          <p>{post.caption}</p>
          <p><small>{new Date(post.created_at).toLocaleString()}</small></p>
        </div>
      ))}
    </div>
  );
}

export default UserProfile;
