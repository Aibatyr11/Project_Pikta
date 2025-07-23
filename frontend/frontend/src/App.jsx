import React, { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Profile from "./pages/Profile";
import CreatePost from "./pages/CreatePost";
import PrivacyModal from "./components/PrivacyModal";
import EditProfile from "./components/EditProfile";
import { UserProvider } from "./context/UserContext";

function App() {
  const [showPolicy, setShowPolicy] = useState(false);

  useEffect(() => {
    const access = localStorage.getItem("accessToken");
    if (!access) return;

    fetch("http://localhost:8000/api/privacy-policy/", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${access}`,
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Ошибка при получении политики");
        return res.json();
      })
      .then((data) => {
        if (!data.accepted) setShowPolicy(true);
      })
      .catch(() => setShowPolicy(true));
  }, []);

  const handleAccept = () => {
    const access = localStorage.getItem("accessToken");
    if (!access) return;

    fetch("http://localhost:8000/api/privacy-policy/", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${access}`,
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Ошибка при отправке согласия");
        setShowPolicy(false);
      })
      .catch((err) => alert(err.message));
  };

  return (
    <UserProvider>
      <BrowserRouter>
        <div className="center-container">
          <Navbar />
          {showPolicy && <PrivacyModal onAccept={handleAccept} />}
          {!showPolicy && (
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/register" element={<Register />} />
              <Route path="/login" element={<Login />} />
              <Route path="/profile/:username" element={<Profile />} />
              <Route path="/create-post" element={<CreatePost />} />
              <Route path="/edit-profile" element={<EditProfile />} />
            </Routes>
          )}
        </div>
      </BrowserRouter>
    </UserProvider>
  );
}

export default App;
