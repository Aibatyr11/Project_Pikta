import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../context/UserContext";
import { getToken } from "../utils/auth";
import "../styles/EditProfile.css"; // ✅ стили

function EditProfile() {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    bio: "",
    avatar: null,
  });

  const { user, setUser } = useUser();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      setFormData({
        username: user.username || "",
        email: user.email || "",
        bio: user.bio || "",
        avatar: null,
      });
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "avatar") {
      setFormData({ ...formData, avatar: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = getToken();

    const data = new FormData();
    data.append("username", formData.username);
    data.append("email", formData.email);
    data.append("bio", formData.bio);
    if (formData.avatar) {
      data.append("avatar", formData.avatar);
    }

    try {
      const res = await fetch("http://localhost:8000/api/update_profile/", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: data,
      });

      if (res.ok) {
        const updatedUser = await res.json();
        setUser(updatedUser);
        navigate(`/profile/${updatedUser.username}`);
      } else {
        const error = await res.json();
        alert(error.detail || "Ошибка при обновлении профиля");
      }
    } catch {
      alert("Сетевая ошибка");
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Вы уверены, что хотите удалить профиль?")) return;

    const token = getToken();

    try {
      const res = await fetch("http://localhost:8000/api/delete_profile/", {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.ok) {
        alert("Профиль удалён.");
        setUser(null);
        navigate("/");
      } else {
        const err = await res.json();
        alert(err.detail || "Ошибка при удалении профиля");
      }
    } catch {
      alert("Сетевая ошибка");
    }
  };

  return (
    <div className="center-container">
      <form className="edit-form" onSubmit={handleSubmit}>
        <h2>Редактировать профиль</h2>

        <div>
          <label htmlFor="username">Имя пользователя:</label>
          <input id="username" name="username" value={formData.username} onChange={handleChange} required />
        </div>

        <div>
          <label htmlFor="email">Email:</label>
          <input id="email" name="email" type="email" value={formData.email} onChange={handleChange} required />
        </div>

        <div>
          <label htmlFor="bio">О себе:</label>
          <textarea id="bio" name="bio" value={formData.bio} onChange={handleChange} />
        </div>

        <div>
          <label htmlFor="avatar">Аватар:</label>
          <input id="avatar" type="file" name="avatar" onChange={handleChange} accept="image/*" />
        </div>

        <button type="submit">Сохранить</button>
        <button type="button" onClick={handleDelete}>Удалить профиль</button>
      </form>
    </div>
  );
}

export default EditProfile;
