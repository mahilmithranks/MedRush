import React, { useState } from 'react';
import axios from 'axios';

export default function RoleSelection() {
  const [selectedRole, setSelectedRole] = useState('');
  const token = localStorage.getItem('token');

  const submitRole = async () => {
    if (!selectedRole) return alert('Please select a role');

    try {
      await axios.patch(
        `${import.meta.env.VITE_API_URL}/api/auth/role`,
        { role: selectedRole },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert('Role updated successfully');
      window.location.href = '/dashboard';
    } catch (err) {
      alert(err.response?.data?.msg || 'Error updating role');
    }
  };

  return (
    <div style={{ maxWidth: 500, margin: '2rem auto', textAlign: 'center' }}>
      <h2>Select Your Role</h2>
      <div style={{ margin: '1rem 0' }}>
        <label>
          <input
            type="radio"
            name="role"
            value="customer"
            onChange={(e) => setSelectedRole(e.target.value)}
          />{' '}
          Customer
        </label>
        <br />
        <label>
          <input
            type="radio"
            name="role"
            value="pharmacist"
            onChange={(e) => setSelectedRole(e.target.value)}
          />{' '}
          Pharmacist
        </label>
        <br />
        <label>
          <input
            type="radio"
            name="role"
            value="delivery"
            onChange={(e) => setSelectedRole(e.target.value)}
          />{' '}
          Delivery Partner
        </label>
      </div>
      <button onClick={submitRole}>Continue</button>
    </div>
  );
}
