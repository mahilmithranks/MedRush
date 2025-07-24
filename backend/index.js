import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import bodyParser from 'body-parser';
import 'dotenv/config'; // Note the new import style for dotenv
import { Webhook } from 'svix';
import { createRouteHandler } from "uploadthing/express";
import { ourFileRouter } from "./uploadthing.js";

// Import all database models
import User from './models/user.model.js';
import Prescription from './models/prescription.model.js';

const app = express();
app.use(cors());

// Connect the UploadThing route handler
app.use(
  "/api/uploadthing",
  createRouteHandler({
    router: ourFileRouter,
  }),
);

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log('MongoDB connected successfully.'))
    .catch(err => console.error('MongoDB connection error:', err));

app.get('/', (req, res) => {
    res.send('MedRush Backend is running!');
});

// --- CLERK WEBHOOK ---
app.post('/api/webhooks/clerk', bodyParser.raw({type: 'application/json'}), async (req, res) => {
    const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET;
    if (!WEBHOOK_SECRET) {
        return res.status(400).send('Webhook secret not configured.');
    }
    const svix_id = req.headers["svix-id"];
    const svix_timestamp = req.headers["svix-timestamp"];
    const svix_signature = req.headers["svix-signature"];
    if (!svix_id || !svix_timestamp || !svix_signature) {
        return res.status(400).send('Error occured -- no svix headers');
    }
    const payload = req.body;
    const body = JSON.stringify(payload);
    const wh = new Webhook(WEBHOOK_SECRET);
    let evt;
    try {
        evt = wh.verify(body, {
            "svix-id": svix_id,
            "svix-timestamp": svix_timestamp,
            "svix-signature": svix_signature,
        });
    } catch (err) {
        console.error('Error verifying webhook:', err);
        return res.status(400).send('Error occured');
    }
    const { id } = evt.data;
    const eventType = evt.type;
    if (eventType === 'user.created') {
        const { id, email_addresses, public_metadata } = evt.data;
        const newUser = new User({
            clerkId: id,
            email: email_addresses[0].email_address,
            role: public_metadata.role || 'customer',
        });
        await newUser.save();
        console.log(`New user ${newUser.email} created with role ${newUser.role}`);
    }
    res.status(200).send('Webhook received');
});

// --- USER DOCUMENT UPLOAD ROUTE ---
app.put('/api/users/update-docs', express.json(), async (req, res) => {
  const { clerkId, fileUrl, docType } = req.body;
  if (!clerkId || !fileUrl || !docType) return res.status(400).json({ error: 'Missing required fields.' });
  try {
    const updateData = {};
    if (docType === 'pharmacyLicense') updateData.pharmacyLicenseUrl = fileUrl;
    else if (docType === 'deliveryLicense') updateData.deliveryLicenseUrl = fileUrl;
    else if (docType === 'photoId') updateData.photoIdUrl = fileUrl;
    else return res.status(400).json({ error: 'Invalid document type.' });
    const updatedUser = await User.findOneAndUpdate({ clerkId }, { $set: updateData }, { new: true });
    if (!updatedUser) return res.status(404).json({ error: 'User not found.' });
    res.status(200).json({ message: 'Document URL saved.', user: updatedUser });
  } catch (error) { res.status(500).json({ error: 'Server error.' }); }
});

// --- PRESCRIPTION ROUTES ---
app.post('/api/prescriptions/upload', express.json(), async (req, res) => {
  const { clerkId, prescriptionImageUrl } = req.body;
  if (!clerkId || !prescriptionImageUrl) return res.status(400).json({ error: 'Missing required fields.' });
  try {
    const customer = await User.findOne({ clerkId: clerkId });
    if (!customer) return res.status(404).json({ error: 'Customer not found.' });
    const newPrescription = new Prescription({ customerId: customer._id, prescriptionImageUrl });
    await newPrescription.save();
    res.status(201).json({ message: 'Prescription uploaded.', prescription: newPrescription });
  } catch (error) { res.status(500).json({ error: 'Server error.' }); }
});

app.get('/api/prescriptions/pending', async (req, res) => {
    try {
        const pendingPrescriptions = await Prescription.find({ status: 'pending' })
            .populate('customerId', 'email');
        res.status(200).json(pendingPrescriptions);
    } catch (error) {
        res.status(500).json({ error: 'Server error while fetching prescriptions.' });
    }
});

app.put('/api/prescriptions/:id/status', express.json(), async (req, res) => {
    const { id } = req.params;
    const { status, pharmacistClerkId } = req.body;
    try {
        const pharmacist = await User.findOne({ clerkId: pharmacistClerkId });
        if (!pharmacist) return res.status(404).json({ error: 'Pharmacist not found.' });
        const updatedPrescription = await Prescription.findByIdAndUpdate(
            id,
            { status: status, pharmacistId: pharmacist._id },
            { new: true }
        );
        res.status(200).json(updatedPrescription);
    } catch (error) {
        res.status(500).json({ error: 'Server error while updating prescription.' });
    }
});

// --- ADMIN ROUTES ---
app.get('/api/admin/unapproved-users', async (req, res) => {
  try {
    const unapprovedUsers = await User.find({
      $or: [ { role: 'pharmacist', isPharmacistApproved: false }, { role: 'delivery-partner', isDeliveryPartnerApproved: false } ]
    });
    res.status(200).json(unapprovedUsers);
  } catch (error) { res.status(500).json({ error: 'Server error.' }); }
});

app.put('/api/admin/approve-user', express.json(), async (req, res) => {
  const { clerkId } = req.body;
  if (!clerkId) return res.status(400).json({ error: 'Clerk ID is required.' });
  try {
    const user = await User.findOne({ clerkId });
    if (!user) return res.status(404).json({ error: 'User not found.' });
    let updateData = {};
    if (user.role === 'pharmacist') updateData.isPharmacistApproved = true;
    else if (user.role === 'delivery-partner') updateData.isDeliveryPartnerApproved = true;
    const updatedUser = await User.findOneAndUpdate({ clerkId }, { $set: updateData }, { new: true });
    res.status(200).json({ message: 'User approved.', user: updatedUser });
  } catch (error) { res.status(500).json({ error: 'Server error.' }); }
});

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
