import { useEffect, useState } from "react";
import { authFetch } from "../utils/auth";
import { useUser } from "../context/UserContext";

export default function ChatsList({ onSelectChat }) {
  const { user } = useUser();
  const [chats, setChats] = useState([]);

  useEffect(() => {
    if (user) {
      authFetch(`http://localhost:8000/api/chats/${user.username}/`)
        .then((res) => res.json())
        .then((data) => setChats(data));
    }
  }, [user]);

  return (
    <div className="chats-list">
      {chats.map((chat) => (
        <div
          key={chat.username}
          className="chat-item"
          onClick={() => onSelectChat(chat.username)}
        >
          <img
            src={chat.avatar || "/default-avatar.png"}
            alt={chat.username}
            className="chat-avatar"
          />
          <div className="chat-info">
            <b>{chat.username}</b>
            <div className="chat-last-message">
              {chat.last_message}
            </div>
            <small>
              {new Date(chat.last_message_time).toLocaleTimeString()}
            </small>
          </div>
        </div>
      ))}
    </div>
  );
}
