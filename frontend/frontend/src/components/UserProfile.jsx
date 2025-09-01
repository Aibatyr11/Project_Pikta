// src/pages/UserProfile.jsx
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "./UserProfile.css";
import { useUser } from "../context/UserContext";
import { authFetch } from "../utils/auth";

function UserProfile() {
  const { username } = useParams();
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [likedPosts, setLikedPosts] = useState([]);
  const [activeTab, setActiveTab] = useState("posts");
  const [isFollowing, setIsFollowing] = useState(false);
  const { user: currentUser, setUser: setCurrentUser } = useUser();

  useEffect(() => {
    fetch(`http://localhost:8000/api/profile/${username}/`)
      .then((res) => res.json())
      .then((data) => {
        setUser(data.user);
        setPosts(data.posts);
      });

    authFetch("http://localhost:8000/api/current_user/")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => data && setCurrentUser(data))
      .catch(() => setCurrentUser(null));
  }, [username]);

  useEffect(() => {
    if (user && currentUser && user.id !== currentUser.id) {
      authFetch(`http://localhost:8000/api/is_following/${user.id}/`)
        .then((res) => res.json())
        .then((data) => setIsFollowing(data.is_following));
    }
  }, [user, currentUser]);

  useEffect(() => {
    if (activeTab === "likes") {
      authFetch(`http://localhost:8000/api/liked_posts/${username}/`)
        .then((res) => res.json())
        .then((data) => setLikedPosts(data));
    }
  }, [activeTab, username]);

  const handleFollow = () => {
    authFetch("http://localhost:8000/api/follow/", {
      method: "POST",
      body: JSON.stringify({ followed_id: user.id }),
    }).then(() => setIsFollowing(true));
  };

  const handleUnfollow = () => {
    authFetch("http://localhost:8000/api/unfollow/", {
      method: "DELETE",
      body: JSON.stringify({ followed_id: user.id }),
    })
      .then((res) => {
        if (res.ok) setIsFollowing(false);
        else return res.json().then((err) => { throw new Error(err.detail); });
      })
      .catch((err) => alert(err.message));
  };

  if (!user) return <p className="loading">Загрузка...</p>;

  return (
    <div className="profile-page">
      <div className="profile-header">
        <div className="avatar-block">
          {user.avatar ? (
            <img src={user.avatar} alt="Аватар" className="profile-avatar" />
          ) : (
            <div className="profile-avatar empty">?</div>
          )}
        </div>

        <div className="profile-info">
          <h2 className="profile-username">@{user.username}</h2>

          <div className="profile-stats">
            <div><strong>{posts.length}</strong><span>Посты</span></div>
            <div><strong>{user.followers_count}</strong><span>Подписчики</span></div>
            <div><strong>{user.following_count}</strong><span>Подписки</span></div>
          </div>

          {currentUser && currentUser.id !== user.id && (
            <div className="profile-buttons">
              {isFollowing ? (
                <button onClick={handleUnfollow} className="btn secondary">Отписаться</button>
              ) : (
                <button onClick={handleFollow} className="btn primary">Подписаться</button>
              )}
            </div>
          )}

          {currentUser && currentUser.id === user.id && (
            <div className="profile-buttons">
              <button onClick={() => (window.location.href = "/edit-profile")} className="btn primary">
                Редактировать профиль
              </button>
            </div>
          )}
        </div>
      </div>

      <p className="profile-bio">{user.bio || "О себе не указано"}</p>

      {/* Tabs */}
      <div className="profile-tabs">
        <button
          onClick={() => setActiveTab("posts")}
          className={`tab-btn ${activeTab === "posts" ? "active" : ""}`}
        >
          Посты
        </button>
        <button
          onClick={() => setActiveTab("likes")}
          className={`tab-btn ${activeTab === "likes" ? "active" : ""}`}
        >
          Лайки
        </button>
      </div>

      {/* Posts grid */}
      <div className="posts-grid">
        {activeTab === "posts" &&
          posts.map((post) => (
            <img
              key={post.id}
              src={post.image.startsWith("http") ? post.image : `http://localhost:8000${post.image}`}
              alt="post"
              className="post-thumb"
            />
          ))}

        {activeTab === "likes" &&
          likedPosts.map((post) => (
            <img
              key={post.id}
              src={post.image.startsWith("http") ? post.image : `http://localhost:8000${post.image}`}
              alt="liked"
              className="post-thumb"
            />
          ))}
      </div>
    </div>
  );
}

export default UserProfile;
