// App.jsx
import { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import UserProfile from "./components/UserProfile";
import RegisterForm from "./components/RegisterForm";
import LoginForm from "./components/LoginForm";
import PostList from "./components/PostList";
import PostForm from "./components/PostForm";

function Users() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    fetch("http://localhost:8000/api/users/")
      .then((res) => res.json())
      .then((data) => setUsers(data));
  }, []);

  return (
    <div>
      <h1>Пользователи</h1>
      {users.map((user) => (
        <div key={user.id}>
          <h2>{user.username}</h2>
          <p>{user.email}</p>
          <p>{user.bio}</p>
          {user.avatar && (
            <img
              src={`http://localhost:8000${user.avatar}`}
              alt="avatar"
              width={100}
            />
          )}
        </div>
      ))}
      <RegisterForm />
      <LoginForm />
      <PostList />
      <PostForm />
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Users />} />
        <Route path="/profile/:username" element={<UserProfile />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
