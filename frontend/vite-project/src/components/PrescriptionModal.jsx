// src/components/PrescriptionModal.jsx

import React from 'react';

export default function PrescriptionModal({ prescription, onClose, onApprove, onReject }) {
    if (!prescription) return null;

    return (
        // Backdrop
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center">
            {/* Modal Content */}
            <div className="bg-white rounded-lg shadow-2xl p-6 w-full max-w-lg relative">
                <h2 className="text-2xl font-bold mb-4">Prescription Review</h2>
                <p className="mb-4">From: <span className="font-semibold">{prescription.customerId.email}</span></p>

                {/* Prescription Image */}
                <div className="mb-6 border rounded-lg overflow-hidden">
                    <img
                        src={prescription.prescriptionImageUrl}
                        alt="Prescription"
                        className="w-full h-auto object-contain"
                    />
                </div>

                {/* Action Buttons */}
                <div className="flex justify-end gap-4">
                    <button
                        onClick={() => onReject(prescription._id)}
                        className="px-6 py-2 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition"
                    >
                        Reject
                    </button>
                    <button
                        onClick={() => onApprove(prescription._id)}
                        className="px-6 py-2 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition"
                    >
                        Approve
                    </button>
                </div>

                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 text-2xl"
                >
                    &times;
                </button>
            </div>
        </div>
    );
}