import { useState } from "react";
import { useUser } from "../context/UserContext";
import ChatsList from "../components/ChatsList";
import ChatWindow from "../components/ChatWindow";

export default function ChatPage() {
  const { user } = useUser(); // 🔥 берём текущего юзера из контекста
  const [selectedUser, setSelectedUser] = useState(null);

  if (!user) {
    return <div style={{ padding: 20 }}>⚠ Войдите, чтобы увидеть чаты</div>;
  }

  return (
    <div style={{ display: "flex", height: "100vh" }}>
      <ChatsList currentUser={user.username} onSelectChat={setSelectedUser} />
      <div style={{ flex: 1 }}>
        {selectedUser ? (
          <ChatWindow currentUser={user.username} targetUser={selectedUser} />
        ) : (
          <div style={{ textAlign: "center", marginTop: 50 }}>
            Выберите чат
          </div>
        )}
      </div>
    </div>
  );
}
