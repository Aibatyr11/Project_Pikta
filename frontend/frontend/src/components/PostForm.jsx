import React, { useState } from "react";

function getCookie(name) {
  let cookieValue = null;
  if (document.cookie && document.cookie !== "") {
    const cookies = document.cookie.split(";");
    for (let cookie of cookies) {
      cookie = cookie.trim();
      if (cookie.startsWith(name + "=")) {
        cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
        break;
      }
    }
  }
  return cookieValue;
}

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

    const csrftoken = getCookie("csrftoken");

   const response = await fetch("http://localhost:8000/api/posts/", {
      method: "POST",
      credentials: "include", // 🔥 ВАЖНО
      headers: {
        "X-CSRFToken": csrftoken,
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
