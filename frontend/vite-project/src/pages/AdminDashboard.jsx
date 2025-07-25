import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from "@clerk/clerk-react";

export default function AdminDashboard() {
    const [unapprovedUsers, setUnapprovedUsers] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const { getToken } = useAuth();

    const fetchUnapprovedUsers = async () => {
        setIsLoading(true);
        try {
            const token = await getToken();
            const response = await axios.get('/api/admin/unapproved-users', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            setUnapprovedUsers(response.data);
        } catch (error) {
            console.error("Error fetching unapproved users:", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchUnapprovedUsers();
    }, []);

    const handleApproveUser = async (clerkId) => {
        try {
            const token = await getToken();
            await axios.put('/api/admin/approve-user', 
                { clerkId }, // Request body
                { headers: { 'Authorization': `Bearer ${token}` } }
            );
            alert('User approved!');
            // Refresh the list to remove the approved user
            fetchUnapprovedUsers();
        } catch (error) {
            console.error("Error approving user:", error);
            alert('Failed to approve user.');
        }
    };

    if (isLoading) {
        return <div className="p-8 text-center">Loading users for approval...</div>;
    }

    return (
        <div className="p-8">
            <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
            <h2 className="text-xl font-semibold mb-4">Pending Approvals</h2>
            <div className="space-y-4">
                {unapprovedUsers.length > 0 ? (
                    unapprovedUsers.map(user => (
                        <div key={user.clerkId} className="bg-white p-4 rounded-lg shadow-md flex justify-between items-center">
                            <div>
                                <p className="font-bold">{user.email}</p>
                                <p className="text-sm capitalize text-gray-600">{user.role.replace('-', ' ')}</p>
                                {user.pharmacyLicenseUrl && (
                                    <a href={user.pharmacyLicenseUrl} target="_blank" rel="noopener noreferrer" className="text-sm text-blue-600 hover:underline">
                                        View License
                                    </a>
                                )}
                            </div>
                            <button
                                onClick={() => handleApproveUser(user.clerkId)}
                                className="bg-green-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-green-700 transition"
                            >
                                Approve
                            </button>
                        </div>
                    ))
                ) : (
                    <p className="text-gray-500">No users are currently waiting for approval.</p>
                )}
            </div>
        </div>
    );
}