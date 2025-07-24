import mongoose from 'mongoose';

const PrescriptionSchema = new mongoose.Schema({
  customerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  prescriptionImageUrl: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending',
  },
  // This will be filled in when a pharmacist approves the prescription
  pharmacistId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
}, { timestamps: true });

const Prescription = mongoose.models.Prescription || mongoose.model('Prescription', PrescriptionSchema);

export default Prescription;
