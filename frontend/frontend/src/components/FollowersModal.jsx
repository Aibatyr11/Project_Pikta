import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom"; // ✅ добавляем Link
import { authFetch } from "../utils/auth";
import "../styles/Modal.css";

export default function FollowersModal({ isOpen, onClose, username, type }) {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    if (isOpen && username) {
      const url =
        type === "followers"
          ? `http://localhost:8000/api/followers/${username}/`
          : `http://localhost:8000/api/following/${username}/`;

      authFetch(url)
        .then((res) => res.json())
        .then((data) => setUsers(data))
        .catch(() => setUsers([]));
    }
  }, [isOpen, username, type]);

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <h3>{type === "followers" ? "Подписчики" : "Подписки"}</h3>

        {users.length === 0 ? (
          <p>Нет данных</p>
        ) : (
          <ul className="user-list">
            {users.map((u) => (
              <li key={u.id} className="user-item">
                {u.avatar ? (
                  <Link to={`/profile/${u.username}`} onClick={onClose}>
                    <img
                      src={`http://localhost:8000${u.avatar}`}
                      alt="avatar"
                      className="post-avatar"
                    />
                  </Link>
                ) : (
                  <Link
                    to={`/profile/${u.username}`}
                    onClick={onClose}
                    className="avatar-placeholder"
                  >
                    ?
                  </Link>
                )}
                <Link
                  to={`/profile/${u.username}`}
                  onClick={onClose}
                  className="post-user"
                >
                  <span>@{u.username}</span>
                </Link>
              </li>
            ))}
          </ul>
        )}

        <button className="btn secondary" onClick={onClose}>
          Закрыть
        </button>
      </div>
    </div>
  );
}
