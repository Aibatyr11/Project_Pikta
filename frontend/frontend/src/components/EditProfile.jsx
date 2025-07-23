import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../context/UserContext";
import { getToken } from "../utils/auth"; // ✅ Функция получения access токена

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
    const token = getToken(); // 🔥 Получаем токен из localStorage

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
        headers: {
          Authorization: `Bearer ${token}`, // ✅ Передаём токен
        },
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
    } catch (err) {
      alert("Сетевая ошибка");
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Вы уверены, что хотите удалить профиль? Это действие необратимо.")) return;

    const token = getToken();

    try {
      const res = await fetch("http://localhost:8000/api/delete_profile/", {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.ok) {
        alert("Профиль удалён.");
        setUser(null);
        navigate("/");
      } else {
        const err = await res.json();
        alert(err.detail || "Ошибка при удалении профиля");
      }
    } catch (err) {
      alert("Сетевая ошибка");
    }
  };

  return (
    <div className="center-container" style={{ marginTop: "100px", textAlign: "center" }}>
      <h2>Редактировать профиль</h2>
      <form
        onSubmit={handleSubmit}
        style={{
          background: "#111",
          padding: "2rem",
          borderRadius: "20px",
          maxWidth: "400px",
          margin: "0 auto",
        }}
      >
        <div>
          <label htmlFor="username">Имя пользователя:</label>
          <br />
          <input id="username" name="username" value={formData.username} onChange={handleChange} required />
        </div>

        <div>
          <label htmlFor="email">Email:</label>
          <br />
          <input id="email" name="email" type="email" value={formData.email} onChange={handleChange} required />
        </div>

        <div>
          <label htmlFor="bio">О себе:</label>
          <br />
          <textarea id="bio" name="bio" value={formData.bio} onChange={handleChange} />
        </div>

        <div>
          <label htmlFor="avatar">Аватар:</label>
          <br />
          <input id="avatar" type="file" name="avatar" onChange={handleChange} accept="image/*" />
        </div>

        <button
          type="submit"
          style={{
            marginTop: "1rem",
            background: "#00aaff",
            color: "white",
            padding: "10px",
            borderRadius: "10px",
            width: "100%",
          }}
        >
          Сохранить
        </button>

        <button
          type="button"
          onClick={handleDelete}
          style={{
            marginTop: "1rem",
            background: "red",
            color: "white",
            padding: "10px",
            borderRadius: "10px",
            width: "100%",
          }}
        >
          Удалить профиль
        </button>
      </form>
    </div>
  );
}

export default EditProfile;
