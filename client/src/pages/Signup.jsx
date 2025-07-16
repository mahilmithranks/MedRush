import React, { useState } from 'react'
import AuthScene from '../canvas/AuthScene'
import { motion } from 'framer-motion'
import axios from 'axios'

function Signup() {
    const [form, setForm] = useState({
        name: '',
        email: '',
        password: '',
        role: 'customer'
    })

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value })
    }

    const handleSignup = async (e) => {
        e.preventDefault()
        try {
            const res = await axios.post('http://localhost:5000/api/auth/signup', form)
            alert(`Signed up as ${res.data.user.role}`)
        } catch (err) {
            alert('Signup failed')
        }
    }

    return (
        <div className="relative w-screen h-screen bg-black overflow-hidden text-white">
            {/* Fullscreen 3D Capsule Background */}
            <div className="absolute inset-0 z-0">
                <AuthScene />
            </div>

            {/* Centered Glassmorphic Signup Form */}
            <motion.div
                className="absolute inset-0 flex items-center justify-center z-10"
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1 }}
            >
                <form
                    onSubmit={handleSignup}
                    className="bg-black/60 p-8 rounded-xl shadow-xl space-y-4 w-11/12 max-w-md text-white backdrop-blur-lg border border-white/10"
                >
                    <h2 className="text-2xl md:text-3xl font-bold text-center bg-gradient-to-br from-cyan-300 via-white to-blue-500 text-transparent bg-clip-text">
                        Create MedRush Account
                    </h2>

                    <input
                        type="text"
                        name="name"
                        placeholder="Full Name"
                        className="w-full p-3 rounded-md bg-white/10 placeholder-gray-300 text-white focus:outline-none focus:ring-2 focus:ring-cyan-400"
                        onChange={handleChange}
                        required
                    />

                    <input
                        type="email"
                        name="email"
                        placeholder="Email"
                        className="w-full p-3 rounded-md bg-white/10 placeholder-gray-300 text-white focus:outline-none focus:ring-2 focus:ring-cyan-400"
                        onChange={handleChange}
                        required
                    />

                    <input
                        type="password"
                        name="password"
                        placeholder="Password"
                        className="w-full p-3 rounded-md bg-white/10 placeholder-gray-300 text-white focus:outline-none focus:ring-2 focus:ring-cyan-400"
                        onChange={handleChange}
                        required
                    />

                    <select
                        name="role"
                        className="w-full p-3 rounded-md bg-white/10 text-white focus:outline-none focus:ring-2 focus:ring-cyan-400"
                        onChange={handleChange}
                        required
                    >
                        <option value="customer">Customer</option>
                        <option value="pharmacy">Pharmacy Owner</option>
                    </select>

                    <button
                        type="submit"
                        className="w-full py-3 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 transition-all text-white rounded-md font-semibold tracking-wide shadow-md"
                    >
                        Sign Up
                    </button>


                    <p className="text-xs text-center text-gray-400 mt-2">
                        Already have an account?{' '}
                        <a href="/login" className="underline text-cyan-400 hover:text-cyan-300">
                            Login
                        </a>
                    </p>
                </form>
            </motion.div>
        </div>
    )
}

export default Signup
