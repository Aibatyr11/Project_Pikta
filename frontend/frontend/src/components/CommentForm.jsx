// import React, { useState } from "react";
// import { addComment } from "../api";
// import "../styles/CommentForm.css";

// const CommentForm = ({ postId, onCommentAdded }) => {
//   const [content, setContent] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (!content.trim()) {
//       setError("Комментарий не может быть пустым");
//       return;
//     }
//     setLoading(true);
//     setError("");
//     try {
//       const newComment = await addComment(postId, content);
//       setContent("");
//       if (onCommentAdded) onCommentAdded(newComment);
//     } catch (err) {
//       setError(err.message || "Ошибка отправки комментария");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <form onSubmit={handleSubmit} className="comment-form">
//       <textarea
//         className="comment-textarea"
//         value={content}
//         onChange={(e) => setContent(e.target.value)}
//         placeholder="Напишите комментарий..."
//         rows={3}
//       />
//       {error && <div className="comment-error">{error}</div>}
//       <button type="submit" disabled={loading} className="comment-button">
//         {loading ? "Отправка..." : "Отправить"}
//       </button>
//     </form>
//   );
// };

// export default CommentForm;
