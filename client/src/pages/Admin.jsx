import React, { useEffect, useState } from 'react';

const Admin = () => {
  const [username, setUsername] = useState('');

  useEffect(() => {
    const savedUsername = localStorage.getItem('username');
    setUsername(savedUsername || 'Admin');
  }, []);

  return (
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
      <h1>Welcome Admin, {username}!</h1>
      <p>Here you can manage users, songs, and rehearsal rooms.</p>
    </div>
  );
};

export default Admin;