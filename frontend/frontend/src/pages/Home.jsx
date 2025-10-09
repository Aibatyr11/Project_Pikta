import { useEffect, useState } from "react";
import { Link } from "react-router-dom";  
import { useUser } from "../context/UserContext";
import { authFetch } from "../utils/auth";
import PostList from "../components/PostList";
import "../styles/Home.css";

export default function Home() {
  const { user } = useUser(); 
  const [suggestions, setSuggestions] = useState([]);

  useEffect(() => {
    if (!user) return; 

    authFetch("http://localhost:8000/api/users/")
      .then((res) => res.json())
      .then((data) => {
        const filtered = data.filter((u) => u.username !== user.username);
        setSuggestions(filtered);
      })
      .catch((err) => console.error("Ошибка при загрузке пользователей", err));
  }, [user]);

  return (
    <div className="home-layout">
      <div className="left-placeholder"></div>
      <div className="center-feed">
        <div className="feed">
          <PostList />
        </div>
      </div>

      <div className="rightbar">
        <div className="suggestions">
          <h3>Suggestions for you</h3>
          {suggestions.length === 0 ? (
            <p>Нет предложений</p>
          ) : (
            suggestions.map((u) => (
              <div key={u.id} className="suggestion" style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <Link to={`/profile/${u.username}`}>
                  <img
                    src={
                      u.avatar
                        ? u.avatar.startsWith("http")
                          ? u.avatar
                          : `http://localhost:8000${u.avatar}`
                        : "https://via.placeholder.com/40"
                    }
                    alt="Avatar"
                    width="40"
                    height="40"
                    style={{ borderRadius: "50%", objectFit: "cover" }}
                  />
                </Link>                
                <strong>{u.username}</strong>
                
                
              </div>
            ))
          )}
        </div>

        <div className="explore">
          <h3>Explore</h3>
          <button>#sunset</button>
          <button>#nature</button>
        </div>
      </div>
    </div>
  );
}
