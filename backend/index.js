import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import bodyParser from 'body-parser';
import 'dotenv/config';
import { Webhook } from 'svix';

// THE FIX: Import the correct 'clerkMiddleware' from the new package
import { clerkMiddleware } from '@clerk/express';

import { createRouteHandler } from "uploadthing/express";
import { ourFileRouter } from "./uploadthing.js";
import User from './models/user.model.js';
import Prescription from './models/prescription.model.js';

const app = express();

// --- Middleware & Setup ---
app.use(cors());
app.use(express.json());

// This middleware will make the 'req.auth' object available on all routes
// but will NOT protect them by default.
app.use(clerkMiddleware());

mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log('MongoDB connected successfully.'))
    .catch(err => console.error('MongoDB connection error:', err));

app.use(
  "/api/uploadthing",
  createRouteHandler({ router: ourFileRouter, config: { /* ... */ } })
);


// --- Public Routes ---
app.get('/', (req, res) => {
    res.send('MedRush Backend is running!');
});

app.post('/api/webhooks/clerk', bodyParser.raw({type: 'application/json'}), async (req, res) => {
    // ... Webhook logic remains the same ...
});


// --- Authenticated API Routes ---
// We now manually check for req.auth.userId in each route that needs to be protected.

// Get current user profile from our DB
app.get('/api/users/me', async (req, res) => {
    if (!req.auth.userId) return res.status(401).json({ error: "Unauthorized" });
    try {
        const user = await User.findOne({ clerkId: req.auth.userId });
        if (!user) return res.status(404).json({ error: 'User not found.' });
        res.status(200).json(user);
    } catch (error) { res.status(500).json({ error: 'Server error.' }); }
});

// Get all prescriptions for the logged-in customer
app.get('/api/prescriptions/my-prescriptions', async (req, res) => {
    if (!req.auth.userId) return res.status(401).json({ error: "Unauthorized" });
    try {
        const customer = await User.findOne({ clerkId: req.auth.userId });
        if (!customer) return res.status(404).json({ error: 'Customer not found.' });
        const prescriptions = await Prescription.find({ customerId: customer._id }).sort({ createdAt: -1 });
        res.status(200).json(prescriptions);
    } catch (error) { res.status(500).json({ error: 'Server error.' }); }
});

// ... (all your other authenticated routes should also have the 'if (!req.auth.userId)' check at the top)


// --- Server Start ---
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));