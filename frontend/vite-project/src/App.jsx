import React, { useState, useEffect } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import { useAuth, SignIn, SignUp, UserButton } from '@clerk/clerk-react';

// Import all your page components
import SelectRole from './pages/SelectRole';
import CustomerDashboard from './pages/CustomerDashboard';
import PharmacistDashboard from './pages/PharmacistDashboard';
import DeliveryDashboard from './pages/DeliveryDashboard';
import AdminDashboard from './pages/AdminDashboard';
import PendingApproval from './pages/PendingApproval';
import UploadDocuments from './pages/UploadDocuments';

// This component handles the main routing logic after a user logs in
const AppLayout = () => {
    const { isSignedIn, isLoaded, getToken } = useAuth();
    const navigate = useNavigate();
    const [appUser, setAppUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (!isLoaded) return;

        if (isSignedIn) {
            const fetchAppUser = async () => {
                try {
                    const token = await getToken();
                    const response = await fetch('/api/users/me', {
                        headers: { 'Authorization': `Bearer ${token}` }
                    });

                    if (!response.ok) {
                        throw new Error(`Network response was not ok: ${response.statusText}`);
                    }
                    
                    const data = await response.json();
                    setAppUser(data);
                } catch (error) {
                    console.error("Failed to fetch app user data:", error);
                } finally {
                    setIsLoading(false);
                }
            };
            fetchAppUser();
        } else {
            setIsLoading(false);
        }
    }, [isLoaded, isSignedIn, navigate, getToken]);

    if (isLoading) {
        return <div className="p-8 text-center">Loading your experience...</div>;
    }

    if (!isSignedIn) {
        return <SelectRole />;
    }

    if (appUser) {
        return (
            <div>
                <header className="p-4 flex justify-end">
                    <UserButton afterSignOutUrl="/" />
                </header>
                
                <main>
                    {(() => {
                        switch (appUser.role) {
                            case 'admin':
                                return <AdminDashboard />;
                            case 'pharmacist':
                                if (!appUser.pharmacyLicenseUrl) return <UploadDocuments userRole="pharmacist" />;
                                if (!appUser.isPharmacistApproved) return <PendingApproval />;
                                return <PharmacistDashboard />;
                            case 'delivery-partner':
                                if (!appUser.deliveryLicenseUrl) return <UploadDocuments userRole="delivery-partner" />;
                                if (!appUser.isDeliveryPartnerApproved) return <PendingApproval />;
                                return <DeliveryDashboard />;
                            case 'customer':
                            default:
                                return <CustomerDashboard />;
                        }
                    })()}
                </main>
            </div>
        );
    }

    return <div className="p-8 text-center">Finalizing setup...</div>;
};

// The main App component that defines your application's routes
export default function App() {
    return (
        <Routes>
            {/* Public routes for signing in and up */}
            <Route path="/sign-in/*" element={<SignIn routing="path" path="/sign-in" />} />
            <Route path="/sign-up/*" element={<SignUp routing="path" path="/sign-up" />} />
            
            {/* The main route that handles all authenticated users */}
            <Route path="/*" element={<AppLayout />} />
        </Routes>
    );
}