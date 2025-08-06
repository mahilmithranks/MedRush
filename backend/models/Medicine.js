const mongoose = require('mongoose');

const medicineSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  stock: {
    type: Number,
    required: true,
    default: 0,
  },
  // This links the medicine to the pharmacist who owns it
  pharmacist: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User', // This refers to our 'User' model
  },
}, { timestamps: true });

const Medicine = mongoose.model('Medicine', medicineSchema);

module.exports = Medicine;