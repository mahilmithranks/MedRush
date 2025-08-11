import React, { useState } from 'react';
import axios from 'axios';

export default function Register() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', password: '', role: 'customer' });

  const handle = e => setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async e => {
    e.preventDefault();
    try {
      const res = await axios.post(`${import.meta.env.VITE_API_URL}/api/auth/register`, form);
      alert(res.data.msg);
    } catch (err) {
      alert(err.response?.data?.msg || 'Error');
    }
  };

  return (
    <form onSubmit={submit} style={{maxWidth:420, margin:'2rem auto'}}>
      <h2>Register</h2>
      <input name="name" placeholder="Name" value={form.name} onChange={handle} required />
      <input name="email" placeholder="Email" value={form.email} onChange={handle} required />
      <input name="phone" placeholder="Phone" value={form.phone} onChange={handle} />
      <input name="password" type="password" placeholder="Password" value={form.password} onChange={handle} required />
      <select name="role" value={form.role} onChange={handle}>
        <option value="customer">Customer</option>
        <option value="pharmacist">Pharmacist</option>
        <option value="delivery">Delivery Partner</option>
      </select>
      <button type="submit">Register</button>
    </form>
  );
}
