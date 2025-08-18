import React, { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Profile from "./pages/Profile";
import CreatePost from "./pages/CreatePost";
import EditProfile from "./components/EditProfile";
import PrivacyModal from "./components/PrivacyModal";
import { UserProvider } from "./context/UserContext";
import { authFetch } from "./utils/auth";
import ResetPassword from "./pages/ResetPassword";
import Topbar from "./components/Topbar";

function App() {
  const [showPolicy, setShowPolicy] = useState(false);
  const [policyChecked, setPolicyChecked] = useState(false);

  useEffect(() => {
    authFetch("http://localhost:8000/api/privacy-policy/")
      .then((res) => {
        if (!res.ok) throw new Error();
        return res.json();
      })
      .then((data) => {
        if (!data.accepted) setShowPolicy(true);
      })
      .catch(() => {})
      .finally(() => setPolicyChecked(true));
  }, []);

  const handleAccept = () => {
    authFetch("http://localhost:8000/api/privacy-policy/", { method: "POST" })
      .then((res) => {
        if (!res.ok) throw new Error("Ошибка при отправке согласия");
        setShowPolicy(false);
      })
      .catch((err) => alert(err.message));
  };

  return (
    <UserProvider>
      <BrowserRouter>
        <div className="app-container">
          {/* ✅ Топбар сверху */}
          <Topbar />

          {/* ✅ Под ним основной layout */}
          <div className="app-layout">
            <Navbar />

            <div className="main-content">
              {showPolicy && <PrivacyModal onAccept={handleAccept} />}
              {policyChecked && !showPolicy && (
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/register" element={<Register />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/profile/:username" element={<Profile />} />
                  <Route path="/create-post" element={<CreatePost />} />
                  <Route path="/edit-profile" element={<EditProfile />} />
                  <Route path="/reset-password" element={<ResetPassword />} />
                </Routes>
              )}
            </div>
          </div>
        </div>
      </BrowserRouter>
    </UserProvider>
  );
}

export default App;
