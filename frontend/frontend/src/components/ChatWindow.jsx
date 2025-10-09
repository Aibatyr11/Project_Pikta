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
      type: "text",
    };
    socket.send(JSON.stringify(msgData));
    setInput("");
  };

  const renderMessage = (msg) => {
    if (typeof msg.message === "string") {
      return <p>{msg.message}</p>;
    }

    if (typeof msg.message === "object" && msg.message.type === "post") {
      const post = msg.message;
      return (
        <div className="chat-post-card">
          {post.image && (
            <img
              src={post.image}
              alt="post"
              className="chat-post-image"
            />
          )}
          <div className="chat-post-body">
            <p className="chat-post-caption">{post.caption}</p>
            <p className="chat-post-author">Автор: {post.author}</p>
            <a
              href={`/posts/${post.post_id}`}
              className="chat-post-link"
              target="_blank"
              rel="noreferrer"
            >
              
            </a>
          </div>
        </div>
      );
    }

    return <pre>{JSON.stringify(msg.message, null, 2)}</pre>;
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
            {renderMessage(msg)}
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
