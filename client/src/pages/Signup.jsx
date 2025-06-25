import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

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
      const res = await axios.post('http://localhost:5000/signup', formData);
      alert('You have successfully registered!');
      console.log(res.data);
      navigate('/login');
    } catch (err) {
      alert('An error occurred during registration.');
      console.error(err);
    }
  };

  return (
    <div style={{ position: 'relative', maxWidth: '400px', margin: 'auto', paddingTop: '60px' }}>
      <div style={{ position: 'absolute', top: 0, right: 0, padding: '10px' }}>
        <span>Already have a user?</span>
        <Link to="/login">
          <button style={{ marginRight: '5px' }}>Login</button>
        </Link>
      </div>

      <h2>Signup</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
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
        <select
          name="instrument"
          value={formData.instrument}
          onChange={handleChange}
          required
        >
          <option value=""> Choose instrument </option>
          <option value="guitar">guitar</option>
          <option value="bass">bass</option>
          <option value="drums">drums</option>
          <option value="keyboard">piano</option>
          <option value="saxophone">saxophone</option>
          <option value="vocals">I'm a singer</option>
        </select>
        <br /><br />
        <button type="submit">Signup</button>
      </form>
    </div>
  );
};

export default Signup;