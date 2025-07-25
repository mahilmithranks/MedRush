// src/pages/PharmacistDashboard.jsx

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from "@clerk/clerk-react";

// Import the modal component
import PrescriptionModal from '../components/PrescriptionModal';

export default function PharmacistDashboard() {
    const [pendingPrescriptions, setPendingPrescriptions] = useState([]);
    const [selectedPrescription, setSelectedPrescription] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const { getToken } = useAuth(); // Use this to get a token for authenticated requests

    // Function to fetch pending prescriptions
    const fetchPrescriptions = async () => {
        setIsLoading(true);
        try {
            const token = await getToken();
            const response = await axios.get('/api/prescriptions/pending', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            setPendingPrescriptions(response.data);
        } catch (error) {
            console.error("Error fetching prescriptions:", error);
        } finally {
            setIsLoading(false);
        }
    };

    // Fetch data when the component mounts
    useEffect(() => {
        fetchPrescriptions();
    }, []);

    // Function to handle approving or rejecting a prescription
    const handleUpdateStatus = async (id, status) => {
        try {
            const token = await getToken();
            const { userId } = useAuth(); // Get the current pharmacist's clerkId
            await axios.put(`/api/prescriptions/${id}/status`, 
                { status, pharmacistClerkId: userId },
                { headers: { 'Authorization': `Bearer ${token}` } }
            );

            // Refresh the list after updating
            fetchPrescriptions();
            setSelectedPrescription(null); // Close the modal
        } catch (error) {
            console.error(`Error updating prescription to ${status}:`, error);
        }
    };

    if (isLoading) {
        return <div className="p-8">Loading prescriptions...</div>;
    }

    return (
        <div className="bg-gray-50 min-h-screen">
            <div className="max-w-7xl mx-auto p-8">
                <h1 className="text-4xl font-bold text-gray-800 mb-6">Pharmacist Dashboard</h1>
                <h2 className="text-2xl font-semibold text-gray-700 mb-8">Pending Prescriptions</h2>

                {pendingPrescriptions.length === 0 ? (
                    <p className="text-center text-gray-500 text-lg">No pending prescriptions at the moment.</p>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {pendingPrescriptions.map((prescription) => (
                            <div key={prescription._id} className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition">
                                <h3 className="text-lg font-bold text-gray-900">Request from</h3>
                                <p className="text-md text-gray-600 mb-4">{prescription.customerId.email}</p>
                                <p className="text-sm text-gray-500">
                                    Received: {new Date(prescription.createdAt).toLocaleDateString()}
                                </p>
                                <button
                                    onClick={() => setSelectedPrescription(prescription)}
                                    className="mt-4 w-full bg-blue-600 text-white font-semibold py-2 rounded-lg hover:bg-blue-700 transition"
                                >
                                    Review Prescription
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Render the modal when a prescription is selected */}
            <PrescriptionModal
                prescription={selectedPrescription}
                onClose={() => setSelectedPrescription(null)}
                onApprove={(id) => handleUpdateStatus(id, 'approved')}
                onReject={(id) => handleUpdateStatus(id, 'rejected')}
            />
        </div>
    );
}