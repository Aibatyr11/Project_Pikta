import { useEffect, useState } from "react";

export default function ChatWindow({ currentUser, targetUser }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    if (!targetUser || !currentUser) return;

    const roomName = [currentUser, targetUser].sort().join("_");
    
    // // Загружаем историю
    // fetch(`http://localhost:8000/chat/history/${currentUser}/${targetUser}/`)
    //   .then(res => res.json())
    //   .then(data => setMessages(data))
    //   .catch(err => console.error("Ошибка загрузки истории:", err));

    // WebSocket
    const ws = new WebSocket(`ws://localhost:8000/ws/chat/${roomName}/`);
    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      setMessages(prev => [...prev, data]);
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
    <div style={{ padding: 20 }}>
      <h3>Чат с {targetUser}</h3>
      <div
        style={{
          border: "1px solid #ccc",
          borderRadius: 8,
          padding: 10,
          height: 300,
          overflowY: "auto",
          marginBottom: 10,
        }}
      >
        {messages.map((msg, i) => (
          <div
            key={i}
            style={{
              textAlign: msg.sender === currentUser ? "right" : "left",
              margin: "5px 0",
            }}
          >
            <b>{msg.sender}: </b>
            {msg.message}
          </div>
        ))}
      </div>

      <form onSubmit={handleSend} style={{ display: "flex", gap: 10 }}>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Введите сообщение..."
          style={{ flex: 1, padding: 8 }}
        />
        <button type="submit">Отправить</button>
      </form>
    </div>
  );
}
