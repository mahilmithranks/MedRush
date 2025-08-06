require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const authRoutes = require('./routes/authRoutes');
const medicineRoutes = require('./routes/medicineRoutes'); // Import medicine routes

// Initialize Express App
const app = express();

// --- Middleware ---
// This section MUST come before your routes.
app.use(cors());
app.use(express.json()); // This line parses incoming JSON requests.

// --- Database Connection ---
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected successfully.'))
  .catch(err => console.error('MongoDB connection error:', err));

// --- API Routes ---
// Test Route
app.get('/api', (req, res) => {
  res.send('MedRush API is running! 🚀');
});

// Mount Authentication Routes
app.use('/api/auth', authRoutes);

// Mount Medicine Routes
app.use('/api/medicines', medicineRoutes); // Add this line

// --- Server Initialization ---
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));