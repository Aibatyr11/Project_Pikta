// import { useEffect, useState } from "react";

// export default function ChatWindow({ currentUser, targetUser }) {
//   const [messages, setMessages] = useState([]);
//   const [input, setInput] = useState("");
//   const [socket, setSocket] = useState(null);

//   useEffect(() => {
//     if (!targetUser || !currentUser) return;

//     const roomName = [currentUser, targetUser].sort().join("_");

//     const ws = new WebSocket(`ws://localhost:8000/ws/chat/${roomName}/`);
//     ws.onmessage = (event) => {
//       const data = JSON.parse(event.data);
//       setMessages((prev) => [...prev, data]);
//     };
//     setSocket(ws);

//     return () => ws.close();
//   }, [targetUser, currentUser]);

//   const handleSend = (e) => {
//     e.preventDefault();
//     if (!input.trim() || !socket) return;

//     const msgData = {
//       sender: currentUser,
//       receiver: targetUser,
//       message: input,
//     };
//     socket.send(JSON.stringify(msgData));
//     setInput("");
//   };

//   return (
//     <div className="flex flex-col h-full">
//       {/* Заголовок */}
//       <div className="px-4 py-3 border-b font-bold text-lg bg-white shadow-sm">
//         Чат с {targetUser}
//       </div>

//       {/* Сообщения */}
//       <div className="flex-1 overflow-y-auto p-4 bg-gray-50 space-y-3">
//         {messages.map((msg, i) => (
//           <div
//             key={i}
//             className={`max-w-xs p-3 rounded-2xl shadow-sm ${
//               msg.sender === currentUser
//                 ? "ml-auto bg-blue-500 text-white rounded-br-none"
//                 : "mr-auto bg-white text-gray-800 border rounded-bl-none"
//             }`}
//           >
//             <div className="text-sm">{msg.message}</div>
//           </div>
//         ))}
//       </div>

//       {/* Форма */}
//       <form
//         onSubmit={handleSend}
//         className="flex p-3 border-t bg-white gap-2"
//       >
//         <input
//           value={input}
//           onChange={(e) => setInput(e.target.value)}
//           placeholder="Введите сообщение..."
//           className="flex-1 p-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400"
//         />
//         <button
//           type="submit"
//           className="px-4 py-2 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition"
//         >
//           Отпрsadавить
//         </button>
//       </form>
//     </div>
//   );
// }
