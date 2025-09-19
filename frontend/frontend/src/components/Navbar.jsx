import { NavLink } from "react-router-dom";
import { useEffect, useState } from "react";
import { authFetch } from "../utils/auth";
import "../styles/Navbar.css";


// импорт иконок
import homeIcon from "../assets/icons/home.png";
import exploreIcon from "../assets/icons/explore.png";
import notificationsIcon from "../assets/icons/notifications.png";
import messagesIcon from "../assets/icons/messages.png";
import registerIcon from "../assets/icons/register.png";
import loginIcon from "../assets/icons/login.png";
import createIcon from "../assets/icons/create.png";
import profileIcon from "../assets/icons/profile.png";

export default function Navbar() {
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    authFetch("http://localhost:8000/api/current_user/")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => setCurrentUser(data))
      .catch(() => setCurrentUser(null));
  }, []);

  return (
    <aside className="sidebar">
      <div className="sidebar-logo">Pikta</div>

      <nav className="sidebar-nav">
        <NavLink to="/" end className="nav-item">
          <img src={homeIcon} alt="Home" className="nav-icon" />
          <span className="nav-text">Home</span>
        </NavLink>
        <NavLink to="/search" className="nav-item">
          <img src={exploreIcon} alt="Explore" className="nav-icon" />
          <span className="nav-text">Explore</span>
        </NavLink>
        <NavLink to="/notifications" className="nav-item">
          <img src={notificationsIcon} alt="Notifications" className="nav-icon" />
          <span className="nav-text">Notifications</span>
        </NavLink>
   
        <NavLink to="/chat" className="nav-item">
          <img src={messagesIcon} alt="Messages" className="nav-icon" />
          <span className="nav-text">Chat</span>
        </NavLink>

        <NavLink to="/register" className="nav-item">
          <img src={registerIcon} alt="Регистрация" className="nav-icon" />
          <span className="nav-text">Регистрация</span>
        </NavLink>
        <NavLink to="/login" className="nav-item">
          <img src={loginIcon} alt="Вход" className="nav-icon" />
          <span className="nav-text">Вход</span>
        </NavLink>

        


        {currentUser && (
          <>
            <NavLink to="/create-post" className="nav-item">
              <img src={createIcon} alt="Create Post" className="nav-icon" />
              <span className="nav-text">Create Post</span>
            </NavLink>
            <NavLink
              to={`/profile/${currentUser.username}`}
              className="nav-item"
            >
              <img src={profileIcon} alt="Profile" className="nav-icon" />
              <span className="nav-text">Profile</span>
            </NavLink>
          </>
        )}
      </nav>
    </aside>
  );
}
