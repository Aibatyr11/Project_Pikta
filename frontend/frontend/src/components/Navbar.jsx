import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { authFetch } from "../utils/auth";
import "../App.css";

export default function Navbar() {
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    authFetch("http://localhost:8000/api/current_user/")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => setCurrentUser(data))
      .catch(() => setCurrentUser(null));
  }, []);

  return (
    <div className="sidebar">
      
      <nav>
        <Link to="/">🏠 Home</Link>
        <Link to="/explore">🔍 Explore</Link>
        <Link to="/notifications">🔔 Notifications</Link>
        <Link to="/messages">✉️ Messages</Link>
        <Link to="/register">📝 Регистрация</Link>
        <Link to="/login">🔑 Вход</Link>
        {currentUser ? (
          <>
            <Link to="/create-post">➕ Create Post</Link>
            <Link to={`/profile/${currentUser.username}`}>👤 Profile</Link>
             
               
          
          </>
        ) : (
          <>
           
          </>
          
        )}
      </nav>
    </div>
  );
}
