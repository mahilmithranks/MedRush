import User from '../models/User.js'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || 'supersecretkey'

export const signup = async (req, res) => {
  const { name, email, password, role } = req.body
  try {
    const existing = await User.findOne({ email })
    if (existing) return res.status(400).json({ message: 'Email already in use' })

    const hashedPassword = await bcrypt.hash(password, 10)
    const user = await User.create({ name, email, password: hashedPassword, role })

    const token = jwt.sign({ id: user._id, role: user.role }, JWT_SECRET, { expiresIn: '1d' })
    res.cookie('token', token, { httpOnly: true, sameSite: 'strict' })
    res.status(201).json({ message: 'Signup successful', user: { id: user._id, role: user.role } })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

export const login = async (req, res) => {
  const { email, password } = req.body
  try {
    const user = await User.findOne({ email })
    if (!user) return res.status(404).json({ message: 'User not found' })

    const valid = await bcrypt.compare(password, user.password)
    if (!valid) return res.status(401).json({ message: 'Invalid credentials' })

    const token = jwt.sign({ id: user._id, role: user.role }, JWT_SECRET, { expiresIn: '1d' })
    res.cookie('token', token, { httpOnly: true, sameSite: 'strict' })
    res.status(200).json({ message: 'Login successful', user: { id: user._id, role: user.role } })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}
