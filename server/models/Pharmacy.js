// server/models/pharmacy.js
import mongoose from 'mongoose';

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

const Pharmacy = mongoose.model('Pharmacy', pharmacySchema);
export default Pharmacy;
