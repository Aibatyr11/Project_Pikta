import { useEffect, useState } from 'react';
import RegisterForm from './components/RegisterForm';
import LoginForm from "./components/LoginForm";
import PostList from "./components/PostList";
function App() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    fetch('http://localhost:8000/api/users/')
      .then(res => res.json())
      .then(data => setUsers(data));
  }, []);

  return (
    <div>
      <h1>Пользователи</h1>
      {users.map(user => (
        <div key={user.id}>
          <h2>{user.username}</h2>
          <p>{user.email}</p>
          <p>{user.bio}</p>
          {user.avatar && <img src={`http://localhost:8000${user.avatar}`} alt="avatar" width={100} />}
          
        </div>
      ))}
      <RegisterForm />
      <LoginForm />
      <PostList />
    </div>
  );
}

export default App;
