import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { authFetch } from "../utils/auth";
import { useUser } from "../context/UserContext";
import "../styles/ChatsList.css";

export default function ChatsList({ onSelectChat }) {
  const { user } = useUser();
  const [chats, setChats] = useState([]);
  const location = useLocation();

  useEffect(() => {
    if (user) {
      authFetch(`http://localhost:8000/api/chats/${user.username}/`)
        .then((res) => res.json())
        .then((data) => {
          setChats(data);
          console.log("Chats data:", data);
          const params = new URLSearchParams(location.search);
          const withUser = params.get("with");
          if (withUser) onSelectChat(withUser);
        });
    }
  }, [user, location.search]);

  const getAvatarUrl = (avatar) => {
    if (!avatar) return "/default-avatar.png";
    return avatar.startsWith("http")
      ? avatar
      : `http://localhost:8000${avatar}`;
  };

  const renderLastMessage = (msg) => {
    if (!msg) return <i>Нет сообщений</i>;
    if (typeof msg === "string") return msg;
    if (typeof msg === "object") {
      if (msg.type === "post") {
        return (
          <span className="post-message-preview">
            📎 Пост: {msg.caption || "без описания"}
          </span>
        );
      }
      return <span>[Объект сообщения]</span>;
    }

    return String(msg);
  };

  return (
    <div className="chats-list">
      {chats.map((chat) => (
        <div
          key={chat.username}
          className="chat-item"
          onClick={() => onSelectChat(chat.username)}
        >
          <img
            src={getAvatarUrl(chat.avatar)}
            alt={chat.username}
            className="chat-avatar"
          />
          <div className="chat-info">
            <b>{chat.username}</b>
            <div className="chat-last-message">
              {renderLastMessage(chat.last_message)}
            </div>
            <small>
              {chat.last_message_time &&
                new Date(chat.last_message_time).toLocaleTimeString()}
            </small>
          </div>
        </div>
      ))}
    </div>
  );
}
