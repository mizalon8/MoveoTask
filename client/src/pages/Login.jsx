import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import "../styles/Login.css";
import logo from "../assets/moveo.png";

const Login = () => {
  const [formData, setFormData] = useState({ username: '', password: '' });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post('https://moveotask-production-a21d.up.railway.app/login', formData);

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
    <div className="login-container">
      <img src={logo} alt="Moveo Logo" className="login-logo" />
      <div className="login-signup-link">
              <span>Don't have a user?</span>
              <Link to="/signup">
                <button>Signup</button>
              </Link>
      </div>
      <h2 className="login-title">Login</h2>
      <form className="login-form" onSubmit={handleSubmit}>
        <input
          name="username"
          placeholder="Username"
          className="login-input"
          value={formData.username}
          onChange={handleChange}
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          className="login-input"
          value={formData.password}
          onChange={handleChange}
          required
        />
        <button type="submit" className="login-button">
          Login
        </button>
      </form>
    </div>
  );
};

export default Login;
