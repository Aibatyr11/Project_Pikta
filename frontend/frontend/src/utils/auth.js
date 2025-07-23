// Сохраняем токен
export function saveToken(token) {
  localStorage.setItem("accessToken", token);
}

// Получаем токен
export function getToken() {
  return localStorage.getItem("accessToken");
}

// Удаляем токен
export function clearToken() {
  localStorage.removeItem("accessToken");
}

// Обёртка для fetch с авторизацией
export function authFetch(url, options = {}) {
  const token = getToken();

  const headers = {
    ...options.headers,
    "Authorization": token ? `Bearer ${token}` : "",
    "Content-Type": "application/json"
  };

  return fetch(url, {
    ...options,
    headers
  });
}
