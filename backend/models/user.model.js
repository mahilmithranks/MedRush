import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
    clerkId: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    firstName: { type: String, default: '' },
    lastName: { type: String, default: '' },
    role: {
        type: String,
        enum: ['customer', 'pharmacist', 'delivery-partner', 'admin'],
        required: true,
    },
    // Pharmacist specific fields
    pharmacyLicenseUrl: { type: String, default: '' },
    isPharmacistApproved: { type: Boolean, default: false },
    // Delivery Partner specific fields
    deliveryLicenseUrl: { type: String, default: '' },
    photoIdUrl: { type: String, default: '' },
    isDeliveryPartnerApproved: { type: Boolean, default: false },
}, { timestamps: true });

// This pattern prevents errors during development hot-reloading
const User = mongoose.models.User || mongoose.model('User', UserSchema);

export default User;
