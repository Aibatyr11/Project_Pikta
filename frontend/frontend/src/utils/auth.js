// utils/auth.js

// Сохраняем токены
export function saveToken(token) {
  localStorage.setItem("accessToken", token);
}

export function saveRefreshToken(token) {
  localStorage.setItem("refreshToken", token);
}

// Получаем токены
export function getToken() {
  return localStorage.getItem("accessToken");
}

export function getRefreshToken() {
  return localStorage.getItem("refreshToken");
}

// Очищаем токены
export function clearToken() {
  localStorage.removeItem("accessToken");
  localStorage.removeItem("refreshToken");
}

// Обновление accessToken через refreshToken
async function refreshAccessToken() {
  const refresh = getRefreshToken();
  if (!refresh) return null;

  const response = await fetch("http://localhost:8000/api/token/refresh/", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ refresh }),
  });

  if (!response.ok) {
    clearToken();
    return null;
  }

  const data = await response.json();
  saveToken(data.access);
  return data.access;
}

// Обёртка для fetch с авторизацией и автообновлением токена
export async function authFetch(url, options = {}) {
  let token = getToken();

  // Базовые заголовки
  const headers = {
    ...options.headers,
    Authorization: token ? `Bearer ${token}` : "",
  };

  // Только если body не FormData, ставим Content-Type
  if (!(options.body instanceof FormData)) {
    headers["Content-Type"] = "application/json";
  }

  let response = await fetch(url, {
    ...options,
    headers,
  });

  // Если 401, обновляем токен
  if (response.status === 401) {
    const newToken = await refreshAccessToken();
    if (!newToken) return response;

    const retryHeaders = {
      ...options.headers,
      Authorization: `Bearer ${newToken}`,
    };

    if (!(options.body instanceof FormData)) {
      retryHeaders["Content-Type"] = "application/json";
    }

    response = await fetch(url, {
      ...options,
      headers: retryHeaders,
    });
  }

  return response;
}
