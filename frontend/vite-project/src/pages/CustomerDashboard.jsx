// src/pages/CustomerDashboard.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from "@clerk/clerk-react";
import { FileUploader } from '../components/FileUploader'; // Reuse our uploader!

export default function CustomerDashboard() {
    const [myPrescriptions, setMyPrescriptions] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const { getToken, userId } = useAuth();

    // Function to get the user's prescription history
    const fetchMyPrescriptions = async () => {
        if (!userId) return;
        setIsLoading(true);
        try {
            const token = await getToken();
            const response = await axios.get('/api/prescriptions/my-prescriptions', {
                headers: { 'Authorization': `Bearer ${token}` },
            });
            setMyPrescriptions(response.data);
        } catch (error) {
            console.error("Failed to fetch prescriptions:", error);
        } finally {
            setIsLoading(false);
        }
    };

    // Fetch history when component loads
    useEffect(() => {
        fetchMyPrescriptions();
    }, [userId]);

    // This function runs after a file is successfully uploaded to UploadThing
    const handleUploadComplete = async (res) => {
        const prescriptionImageUrl = res[0].url;
        try {
            const token = await getToken();
            // Now, save the prescription URL to our database
            await axios.post('/api/prescriptions/upload', 
                { clerkId: userId, prescriptionImageUrl },
                { headers: { 'Authorization': `Bearer ${token}` } }
            );
            alert('Prescription uploaded successfully! It is now pending review.');
            // Refresh the list to show the new prescription
            fetchMyPrescriptions();
        } catch (error) {
            console.error("Failed to save prescription to database:", error);
            alert('There was an error saving your prescription.');
        }
    };

    const getStatusChip = (status) => {
        switch (status) {
            case 'approved':
                return <span className="px-3 py-1 text-sm font-semibold text-green-800 bg-green-200 rounded-full">Approved</span>;
            case 'rejected':
                return <span className="px-3 py-1 text-sm font-semibold text-red-800 bg-red-200 rounded-full">Rejected</span>;
            case 'pending':
            default:
                return <span className="px-3 py-1 text-sm font-semibold text-yellow-800 bg-yellow-200 rounded-full">Pending</span>;
        }
    };

    return (
        <div className="bg-gray-50 min-h-screen p-8">
            <h1 className="text-4xl font-bold text-gray-800 mb-8">My Dashboard</h1>

            {/* Section for Uploading Prescriptions */}
            <div className="bg-white p-6 rounded-xl shadow-lg mb-10">
                <h2 className="text-2xl font-semibold text-gray-700 mb-4">Upload a New Prescription</h2>
                <FileUploader
                    endpoint="prescriptionUploader"
                    onUploadComplete={handleUploadComplete}
                />
            </div>

            {/* Section for Prescription History */}
            <div className="bg-white p-6 rounded-xl shadow-lg">
                <h2 className="text-2xl font-semibold text-gray-700 mb-4">My Prescription History</h2>
                {isLoading ? (
                    <p>Loading history...</p>
                ) : myPrescriptions.length === 0 ? (
                    <p className="text-gray-500">You have not uploaded any prescriptions yet.</p>
                ) : (
                    <div className="space-y-4">
                        {myPrescriptions.map((p) => (
                            <div key={p._id} className="flex justify-between items-center p-4 border rounded-lg bg-gray-50">
                                <div>
                                    <p className="font-semibold">Uploaded on: {new Date(p.createdAt).toLocaleDateString()}</p>
                                    <a href={p.prescriptionImageUrl} target="_blank" rel="noopener noreferrer" className="text-sm text-blue-600 hover:underline">View Image</a>
                                </div>
                                {getStatusChip(p.status)}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}