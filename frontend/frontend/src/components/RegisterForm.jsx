import React, { useState } from 'react';
import '../App.css';
function RegisterForm() {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: ''
  });

  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(''); // очистка перед отправкой

    try {
      const response = await fetch('http://localhost:8000/api/register/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (response.ok) {
        setMessage('✅ Регистрация прошла успешно!');
        setFormData({ username: '', email: '', password: '' });
      } else {
        setMessage(`❌ Ошибка: ${data.error || JSON.stringify(data)}`);
      }
    } catch (error) {
      setMessage(`⚠️ Сетевая ошибка: ${error.message}`);
    }
  };

  return (
    <div className="center-container" style={{ textAlign: "center" }}>
      <h2>Регистрация</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="username"
          placeholder="Имя пользователя"
          value={formData.username}
          onChange={handleChange}
          required
        /><br /><br />
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          required
        /><br /><br />
        <input
          type="password"
          name="password"
          placeholder="Пароль"
          value={formData.password}
          onChange={handleChange}
          required
        /><br /><br />
        <button type="submit">Зарегистрироваться</button>
      </form>
      <p>{message}</p>
    </div>
  );
}

export default RegisterForm;
