import React from 'react';
import axios from 'axios';

function LogoutButton() {
  const handleLogout = async () => {
    try {
      const response = await axios.post('http://localhost:5000/auth/logout');
      alert(response.data.message);
    } catch (error) {
      alert('Error al cerrar sesión');
    }
  };

  return <button onClick={handleLogout}>Cerrar Sesión</button>;
}

export default LogoutButton;