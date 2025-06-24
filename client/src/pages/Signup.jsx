import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Signup = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: '',
    password: '',
    instrument: '',
  });

  const handleChange = (e) => {
    const target = e.target;
  
    // we'll check if target has value or name
    if (!target || !target.name) return;
  
    // we'll check if target is one of the options below in order to continue 
    if (!['INPUT', 'SELECT', 'TEXTAREA'].includes(target.tagName)) return;
  
    setFormData({
      ...formData, // the three dots (Spread operator) will access all the keys and the values in the object ​​and will update them.
      [target.name]: target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); // prevents page refreshing

    try {
      const res = await axios.post('http://localhost:5000/signup', formData);
      alert('נרשמת בהצלחה!');
      console.log(res.data);
      navigate('/login'); 
    } catch (err) {
      alert('אירעה שגיאה בהרשמה');
      console.error(err);
    }
  };

  return (
    <div style={{ maxWidth: '400px', margin: 'auto' }}>
      <h2>הרשמה</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
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
        <select
          name="instrument"
          value={formData.instrument}
          onChange={handleChange}
          required
        >
          <option value="">בחר כלי נגינה</option>
          <option value="guitar">גיטרה</option>
          <option value="bass">בס</option>
          <option value="drums">תופים</option>
          <option value="vocals">שירה</option>
          <option value="keyboard">קלידים</option>
          <option value="saxophone">סקסופון</option>
        </select>
        <br /><br />
        <button type="submit">הרשמה</button>
      </form>
    </div>
  );
};

export default Signup;