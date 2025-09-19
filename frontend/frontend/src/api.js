// frontend/frontend/src/api.js
import { authFetch } from "./utils/auth";
const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:8000/api";


export async function getPosts() {
  const res = await fetch(`${API_BASE}/posts/`);
  if (!res.ok) throw new Error("Ошибка при загрузке постов");
  return res.json();
}

export async function getPost(postId) {
  const res = await fetch(`${API_BASE}/posts/${postId}/`);
  if (!res.ok) throw new Error("Ошибка при загрузке поста");
  return res.json();
}

export async function getComments(postId) {
  const res = await fetch(`${API_BASE}/posts/${postId}/comments/`);
  if (!res.ok) throw new Error("Ошибка при загрузке комментариев");
  return res.json();
}



export async function addComment(postId, content) {
  const res = await authFetch(`${API_BASE}/posts/${postId}/comments/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ content }),
  });

  if (!res.ok) throw new Error("Ошибка при добавлении комментария");
  return res.json();
}


export async function searchUsers(query) {
  const res = await fetch(`${API_BASE}/search_users/?q=${encodeURIComponent(query)}`);
  if (!res.ok) throw new Error("Ошибка при поиске пользователей");
  return res.json();
}
