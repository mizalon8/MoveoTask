import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import "../styles/Signup.css";
import logo from "../assets/moveo.png"; 

const Signup = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: '',
    password: '',
    instrument: '',
  });

  const handleChange = (e) => {
    const target = e.target;
    if (!target || !target.name) return;
    if (!['INPUT', 'SELECT', 'TEXTAREA'].includes(target.tagName)) return;

    setFormData({
      ...formData,
      [target.name]: target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('https://moveotask-production-a21d.up.railway.app/signup', formData);
      alert('You have successfully registered!');
      console.log(res.data);
      navigate('/login');
    } catch (err) {
      alert('An error occurred during registration.');
      console.error(err);
    }
  };

  return (
    <div className="signup-container">
      <img src={logo} alt="Moveo Logo" className="signup-logo" />

      <div className="signup-login-link">
        <span>Already have a user?</span>
        <Link to="/login">
          <button>Login</button>
        </Link>
      </div>

      <h2 className="signup-title">Signup</h2>

      <form onSubmit={handleSubmit} className="signup-form">
        <input
          type="text"
          name="username"
          className="signup-input"
          placeholder="Username"
          value={formData.username}
          onChange={handleChange}
          required
        />
        <input
          type="password"
          name="password"
          className="signup-input"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          required
        />
        <select
          name="instrument"
          className="signup-select"
          value={formData.instrument}
          onChange={handleChange}
          required
        >
          <option value="">Choose instrument</option>
          <option value="guitar">Guitar</option>
          <option value="bass">Bass</option>
          <option value="drums">Drums</option>
          <option value="keyboard">Piano</option>
          <option value="saxophone">Saxophone</option>
          <option value="vocals">I'm a singer</option>
        </select>
        <button type="submit" className="signup-button">Signup</button>
      </form>
    </div>
  );
};

export default Signup;