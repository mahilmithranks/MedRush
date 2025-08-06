import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    role: 'customer',
  });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/api/auth/register', formData);
      
      console.log('Registration successful:', response.data);
      alert('Registration successful! Please log in.');
      navigate('/login');
      
    } catch (error) {
      // This is the corrected, robust error handling block
      if (error.response) {
        // The server responded with an error status code (4xx or 5xx)
        console.error('Registration error:', error.response.data);
        alert(`Registration failed: ${error.response.data.message}`);
      } else if (error.request) {
        // The request was made but no response was received
        console.error('No response from server:', error.message);
        alert('Could not connect to the server. Please check if the backend is running.');
      } else {
        // Something else happened while setting up the request
        console.error('Error:', error.message);
        alert('An unexpected error occurred.');
      }
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
        <h1 className="text-2xl font-bold text-center text-gray-900">Create an Account</h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="name" className="text-sm font-medium text-gray-700">Name</label>
            <input
              type="text" name="name" id="name" required
              className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
              onChange={handleChange} value={formData.name}
            />
          </div>
          <div>
            <label htmlFor="email" className="text-sm font-medium text-gray-700">Email</label>
            <input
              type="email" name="email" id="email" required
              className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
              onChange={handleChange} value={formData.email}
            />
          </div>
          <div>
            <label htmlFor="phone" className="text-sm font-medium text-gray-700">Phone</label>
            <input
              type="tel" name="phone" id="phone" required
              className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
              onChange={handleChange} value={formData.phone}
            />
          </div>
          <div>
            <label htmlFor="password" className="text-sm font-medium text-gray-700">Password</label>
            <input
              type="password" name="password" id="password" required
              className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
              onChange={handleChange} value={formData.password}
            />
          </div>
          <div>
            <label htmlFor="role" className="text-sm font-medium text-gray-700">I am a...</label>
            <select
              name="role"
              id="role"
              className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
              onChange={handleChange}
              value={formData.role}
            >
              <option value="customer">Customer</option>
              <option value="pharmacist">Pharmacist</option>
              <option value="delivery">Delivery Partner</option>
            </select>
          </div>
          <div>
            <button
              type="submit"
              className="w-full px-4 py-2 font-semibold text-white bg-indigo-600 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Register
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RegisterPage;