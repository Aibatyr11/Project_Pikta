import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom"; // если ты используешь Router

function UserProfile() {
  const { username } = useParams(); // из URL /profile/username
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    fetch(`http://localhost:8000/api/profile/${username}/`)
      .then((res) => res.json())
      .then((data) => {
        setUser(data.user);
        setPosts(data.posts);
      });
  }, [username]);

  if (!user) return <p>Загрузка...</p>;

  return (
    <div>
      <h2>Профиль: {user.username}</h2>
      {user.avatar && (
        <img
          src={`http://localhost:8000${user.avatar}`}
          alt="Аватар"
          width="100"
          style={{ borderRadius: "50%" }}
        />
      )}
      <p><strong>Email:</strong> {user.email}</p>
      <p><strong>О себе:</strong> {user.bio}</p>

      <h3>Посты:</h3>
      {posts.map((post) => (
        <div key={post.id}>
          <img src={`http://localhost:8000${post.image}`} alt="post" width="300" />
          <p>{post.caption}</p>
          <p><small>{new Date(post.created_at).toLocaleString()}</small></p>
        </div>
      ))}
    </div>
  );
}

export default UserProfile;
