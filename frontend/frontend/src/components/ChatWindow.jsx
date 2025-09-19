import { useEffect, useState } from "react";
import "../styles/ChatWindow.css";

export default function ChatWindow({ currentUser, targetUser }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    setMessages([]);
    if (!targetUser || !currentUser) return;

    const roomName = [currentUser, targetUser].sort().join("_");

    const ws = new WebSocket(`ws://localhost:8000/ws/chat/${roomName}/`);
    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      setMessages((prev) => [...prev, data]);
    };
    setSocket(ws);

    return () => ws.close();
  }, [targetUser, currentUser]);

  const handleSend = (e) => {
    e.preventDefault();
    if (!input.trim() || !socket) return;

    const msgData = {
      sender: currentUser,
      receiver: targetUser,
      message: input,
    };
    socket.send(JSON.stringify(msgData));
    setInput("");
  };

  return (
    <div className="chat-window">
      <div className="chat-header">Чат с {targetUser}</div>

      <div className="chat-messages">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`message-bubble ${
              msg.sender === currentUser ? "message-right" : "message-left"
            }`}
          >
            {msg.message}
          </div>
        ))}
      </div>

      <form className="chat-form" onSubmit={handleSend}>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Введите сообщение..."
        />
        <button type="submit">Отправить</button>
      </form>
    </div>
  );
}
