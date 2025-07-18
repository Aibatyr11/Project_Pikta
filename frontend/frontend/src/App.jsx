import React, { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Profile from "./pages/Profile";
import CreatePost from "./pages/CreatePost";
import PrivacyModal from "./components/PrivacyModal";

import { UserProvider } from "./context/UserContext";


function App() {
  const [showPolicy, setShowPolicy] = useState(false);

  useEffect(() => {
    fetch("http://localhost:8000/api/privacy-policy/", {
      credentials: "include",
    })
      .then(res => res.json())
      .then(data => {
        if (!data.accepted) setShowPolicy(true);
      });
  }, []);

  const handleAccept = () => {
    fetch("http://localhost:8000/api/privacy-policy/", {
      method: "POST",
      credentials: "include",
    })
      .then(() => setShowPolicy(false));
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
          </Routes>
        )}
      </div>
    </BrowserRouter>
  </UserProvider>
);
}

export default App;
