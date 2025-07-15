// Folder: server/models/Pharmacy.js
const mongoose = require('mongoose');

const pharmacySchema = new mongoose.Schema({
  name: { type: String, required: true },
  pinCode: { type: String, required: true },
  isOpen: { type: Boolean, default: false },
  pharmacistPhoto: { type: String },
  location: {
    lat: { type: Number },
    lng: { type: Number },
  },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Pharmacy', pharmacySchema);