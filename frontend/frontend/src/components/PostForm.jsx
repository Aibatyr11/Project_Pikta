import React, { useState } from "react";
import "../styles/PostForm.css"; // подключаем отдельный css
import { authFetch } from "../utils/auth";

function PostForm() {
  const [caption, setCaption] = useState("");
  const [location, setLocation] = useState("");
  const [image, setImage] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("caption", caption);
    formData.append("location", location);
    formData.append("image", image);

    const response = await authFetch("http://localhost:8000/api/posts/", {
      method: "POST",
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
    <form className="post-form" onSubmit={handleSubmit} encType="multipart/form-data">
      <h2 className="post-form-title">Создать пост</h2>

      <input
        type="text"
        placeholder="Описание"
        value={caption}
        onChange={(e) => setCaption(e.target.value)}
        className="post-input"
        required
      />

      <input
        type="text"
        placeholder="Локация"
        value={location}
        onChange={(e) => setLocation(e.target.value)}
        className="post-input"
      />

      <input
        type="file"
        accept="image/*"
        onChange={(e) => setImage(e.target.files[0])}
        className="post-file"
        required
      />

      <button type="submit" className="post-btn">
        Опубликовать
      </button>
    </form>
  );
}

export default PostForm;
