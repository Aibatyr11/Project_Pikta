import { useState } from "react";
import { useUser } from "../context/UserContext";
import ChatsList from "../components/ChatsList";
import ChatWindow from "../components/ChatWindow";
import "../styles/ChatPage.css";

export default function ChatPage() {
  const { user } = useUser();
  const [selectedUser, setSelectedUser] = useState(null);

  if (!user) {
    return <div className="chat-page">⚠ Войдите, чтобы увидеть чаты</div>;
  }

  return (
    <div className="chat-page">
      <aside className="chats-sidebar">
        <div className="chats-sidebar-header">Ваши чаты</div>
        <ChatsList currentUser={user.username} onSelectChat={setSelectedUser} />
      </aside>

      <div className="chat-window empty">
        {selectedUser ? (
          <ChatWindow currentUser={user.username} targetUser={selectedUser} />
        ) : (
          <div className="empty-message">
            Выберите чат
          </div>
        )}
      </div>
    </div>
  );
}
