import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [formData, setFormData] = useState({ username: '', password: '' });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post('http://localhost:5000/login', formData);
      const { token, role } = res.data;

      localStorage.setItem('token', token);

      alert('התחברת בהצלחה!');

      if (role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/player');
      }
    } catch (err) {
      alert('שגיאה בהתחברות, נסה שוב.');
      console.error(err);
    }
  };

  return (
    <div style={{ maxWidth: '400px', margin: 'auto' }}>
      <h2>התחברות</h2>
      <form onSubmit={handleSubmit}>
        <input
          name="username"
          placeholder="שם משתמש"
          value={formData.username}
          onChange={handleChange}
          required
        />
        <br />
        <input
          type="password"
          name="password"
          placeholder="סיסמה"
          value={formData.password}
          onChange={handleChange}
          required
        />
        <br />
        <button type="submit">התחבר</button>
      </form>
    </div>
  );
};

export default Login;
