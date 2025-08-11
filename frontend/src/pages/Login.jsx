import React, { useState } from 'react';
import axios from 'axios';

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' });

  const handle = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/auth/login`,
        form
      );
      // Save JWT token to localStorage
      localStorage.setItem('token', res.data.token);
      alert('Login successful');
      window.location.href = '/dashboard'; // Redirect after login
    } catch (err) {
      alert(err.response?.data?.msg || 'Login failed');
    }
  };

  return (
    <form
      onSubmit={submit}
      style={{
        maxWidth: 420,
        margin: '2rem auto',
        display: 'flex',
        flexDirection: 'column',
        gap: '10px',
      }}
    >
      <h2>Login</h2>
      <input
        name="email"
        placeholder="Email"
        value={form.email}
        onChange={handle}
        required
      />
      <input
        name="password"
        type="password"
        placeholder="Password"
        value={form.password}
        onChange={handle}
        required
      />
      <button type="submit">Login</button>
    </form>
  );
}
