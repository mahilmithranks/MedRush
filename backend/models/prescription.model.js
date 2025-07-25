import mongoose from 'mongoose';

const PrescriptionSchema = new mongoose.Schema({
    customerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    pharmacistId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    prescriptionImageUrl: {
        type: String,
        required: true,
    },
    status: {
        type: String,
        enum: ['pending', 'approved', 'rejected', 'ordered'],
        default: 'pending',
    },
}, { timestamps: true });

const Prescription = mongoose.model('Prescription', PrescriptionSchema);

export default Prescription;