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

      const { token, role, username, instrument } = res.data;

      sessionStorage.setItem("token", token);
      sessionStorage.setItem("userData", JSON.stringify({ username, role, instrument }));

      alert('connected successfully!');

      if (role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/player');
      }
    } catch (err) {
      alert('Connection error, try again.');
      console.error(err);
    }
  };

  return (
    <div style={{ maxWidth: '400px', margin: 'auto' }}>
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <input
          name="username"
          placeholder="username"
          value={formData.username}
          onChange={handleChange}
          required
        />
        <br />
        <input
          type="password"
          name="password"
          placeholder="password"
          value={formData.password}
          onChange={handleChange}
          required
        />
        <br />
        <button type="submit">Login</button>
      </form>
    </div>
  );
};

export default Login;
