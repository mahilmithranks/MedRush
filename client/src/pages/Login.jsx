import React, { useState } from 'react'
import AuthScene from '../canvas/AuthScene'
import { motion } from 'framer-motion'
import axios from 'axios'

function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const handleLogin = async (e) => {
    e.preventDefault()
    try {
      const res = await axios.post('http://localhost:5000/api/auth/login', { email, password })
      alert(`Logged in as ${res.data.user.role}`)
    } catch (err) {
      alert('Login failed')
    }
  }

  return (
    <div className="relative w-screen h-screen bg-black overflow-hidden text-white">
      {/* Fullscreen 3D Capsule Background */}
      <div className="absolute inset-0 z-0">
        <AuthScene />
      </div>

      {/* Centered Glassmorphic Login Form */}
      <motion.div
        className="absolute inset-0 flex items-center justify-center z-10"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
      >
        <form
          onSubmit={handleLogin}
          className="bg-black/60 p-8 rounded-xl shadow-xl space-y-4 w-11/12 max-w-md text-white backdrop-blur-lg border border-white/10"
        >
          <h2
            className="text-2xl md:text-3xl font-bold text-center bg-gradient-to-br from-cyan-300 via-white to-blue-500 text-transparent bg-clip-text"
          >
            MedRush
          </h2>

          <p className="text-sm text-center text-gray-300 mb-2">
            Login to access <br /> emergency medicine delivery
          </p>

          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full p-3 rounded-md bg-white/10 placeholder-gray-300 text-white focus:outline-none focus:ring-2 focus:ring-cyan-400"
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full p-3 rounded-md bg-white/10 placeholder-gray-300 text-white focus:outline-none focus:ring-2 focus:ring-cyan-400"
          />

          <button
            type="submit"
            className="w-full py-3 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 transition-all text-white rounded-md font-semibold shadow-md"
          >
            Login
          </button>

          <p className="text-xs text-center text-gray-400 mt-2">
            Don't have an account?{' '}
            <a href="/signup" className="underline text-cyan-400 hover:text-cyan-300">
              Sign up
            </a>
          </p>
        </form>
      </motion.div>
    </div>
  )
}

export default Login
