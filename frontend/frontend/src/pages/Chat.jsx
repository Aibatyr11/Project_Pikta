import { useEffect, useState } from "react";

export default function Chat() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [socket, setSocket] = useState(null);

  const [targetUser, setTargetUser] = useState(""); // собеседник
  const [currentUser, setCurrentUser] = useState(""); // ⚡ теперь динамично

  useEffect(() => {
    if (!targetUser || !currentUser) return;

    const roomName = [currentUser, targetUser].sort().join("_");

    // 1. Загружаем историю сообщений
    fetch(`http://localhost:8000/chat/history/${currentUser}/${targetUser}/`)
      .then((res) => res.json())
      .then((data) => {
        setMessages(data);
      })
      .catch((err) => console.error("Ошибка загрузки истории:", err));

    // 2. Подключаем WebSocket
    const ws = new WebSocket(`ws://localhost:8000/ws/chat/${roomName}/`);

    ws.onopen = () => console.log("✅ WebSocket открыт");
    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      console.log("📩 Пришло:", data);

      setMessages((prev) => [...prev, data]);
    };
    ws.onclose = () => console.log("❌ WebSocket закрыт");

    setSocket(ws);

    return () => ws.close();
  }, [targetUser, currentUser]);

  const handleSend = (e) => {
    e.preventDefault();
    if (!input.trim() || !socket) return;

    const msgData = {
      sender: currentUser,
      receiver: targetUser, // ⚡ добавляем
      message: input,
    };

    socket.send(JSON.stringify(msgData));
    setInput("");
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>Чат</h2>

      {/* вводим своего юзера */}
      <div style={{ marginBottom: 10 }}>
        <input
          type="text"
          placeholder="Ваш username..."
          value={currentUser}
          onChange={(e) => setCurrentUser(e.target.value)}
        />
      </div>

      {/* выбор собеседника */}
      <div style={{ marginBottom: 10 }}>
        <input
          type="text"
          placeholder="Собеседник..."
          value={targetUser}
          onChange={(e) => setTargetUser(e.target.value)}
        />
      </div>

      {/* окно чата */}
      <div
        style={{
          border: "1px solid #ccc",
          borderRadius: 8,
          padding: 10,
          height: 250,
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

      {/* форма отправки */}
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
