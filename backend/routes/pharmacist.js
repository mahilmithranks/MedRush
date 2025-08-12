// backend/routes/pharmacist.js
const express = require('express');
const router = express.Router();
const { upload, uploadToCloudinary } = require('../middleware/uploadAndCloudinary');
const authenticate = require('../middleware/auth'); // Ensure default export matches
const User = require('../models/User');

// Upload pharmacist license
router.post('/license-upload', authenticate, upload.single('license'), async (req, res) => {
  try {
    const decodedUser = req.user; // From JWT payload
    if (!decodedUser) return res.status(401).json({ message: 'Unauthorized' });

    const user = await User.findById(decodedUser.id); // Get full user document
    if (!user) return res.status(404).json({ message: 'User not found' });

    if (user.role !== 'pharmacist')
      return res.status(403).json({ message: 'Only pharmacists can upload a license' });

    if (!req.file) return res.status(400).json({ message: 'No file uploaded' });

    // Upload to Cloudinary
    const result = await uploadToCloudinary(req.file.buffer, 'medrush/pharmacist_licenses');

    // Save URL and status
    user.pharmacistLicenseUrl = result.secure_url;
    user.pharmacistLicenseStatus = 'pending';
    await user.save();

    res.json({
      message: 'License uploaded successfully',
      url: user.pharmacistLicenseUrl,
      status: user.pharmacistLicenseStatus
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Upload failed', error: err.message });
  }
});

// Get license status
router.get('/license-status', authenticate, async (req, res) => {
  try {
    const decodedUser = req.user;
    const user = await User.findById(decodedUser.id).select('pharmacistLicenseUrl pharmacistLicenseStatus');

    if (!user) return res.status(404).json({ message: 'User not found' });

    res.json({
      pharmacistLicenseUrl: user.pharmacistLicenseUrl,
      pharmacistLicenseStatus: user.pharmacistLicenseStatus
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Could not fetch license status', error: err.message });
  }
});

module.exports = router;
