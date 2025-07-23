import React, { useState } from "react";
import '../App.css';
import { getToken } from "../utils/auth"; // 🔥 используем JWT

function PostForm() {
  const [caption, setCaption] = useState("");
  const [location, setLocation] = useState("");
  const [image, setImage] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = getToken();
    if (!token) {
      alert("⚠️ Необходимо войти в аккаунт");
      return;
    }

    const formData = new FormData();
    formData.append("caption", caption);
    formData.append("location", location);
    formData.append("image", image);

    const response = await fetch("http://localhost:8000/api/posts/", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`, // ✅ JWT вместо CSRF
      },
      body: formData,
    });

    if (response.ok) {
      alert("✅ Пост успешно добавлен");
      setCaption("");
      setLocation("");
      setImage(null);
    } else {
      const error = await response.json();
      alert("❌ Ошибка: " + (error.detail || "Что-то пошло не так"));
    }
  };

  return (
    <form onSubmit={handleSubmit} encType="multipart/form-data">
      <h2>Создать пост</h2>
      <input
        type="text"
        placeholder="Описание"
        value={caption}
        onChange={(e) => setCaption(e.target.value)}
        required
      />
      <br />
      <input
        type="text"
        placeholder="Локация"
        value={location}
        onChange={(e) => setLocation(e.target.value)}
      />
      <br />
      <input
        type="file"
        accept="image/*"
        onChange={(e) => setImage(e.target.files[0])}
        required
      />
      <br />
      <button type="submit">Опубликовать</button>
    </form>
  );
}

export default PostForm;
