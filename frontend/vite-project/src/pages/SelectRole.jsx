import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const RoleCard = ({ title, description, icon, onClick }) => (
    <motion.div
        whileHover={{ y: -10, scale: 1.05 }}
        className="bg-white/70 backdrop-blur-md p-8 rounded-xl shadow-lg cursor-pointer text-center"
        onClick={onClick}
    >
        <div className="text-6xl mb-4">{icon}</div>
        <h3 className="text-2xl font-bold text-gray-800">{title}</h3>
        <p className="text-gray-600 mt-2">{description}</p>
    </motion.div>
);

export default function SelectRole() {
    const navigate = useNavigate();

    const handleRoleSelect = (role) => {
        // This will navigate to the sign-up page and pass the selected role
        navigate(`/sign-up?role=${role}`);
    };

    return (
        <div className="relative min-h-screen w-full flex items-center justify-center bg-gray-100 p-4">
            <div className="relative z-10 flex flex-col items-center">
                <h1 className="text-5xl font-extrabold text-gray-900 mb-4">
                    Welcome to MedRush 🔥
                </h1>
                <p className="text-xl text-gray-700 mb-10">
                    Choose your role to get started
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <RoleCard
                        title="Customer"
                        description="Order medicines and track deliveries."
                        icon="🛒"
                        onClick={() => handleRoleSelect('customer')}
                    />
                    <RoleCard
                        title="Pharmacist"
                        description="Manage your inventory and prescriptions."
                        icon="💊"
                        onClick={() => handleRoleSelect('pharmacist')}
                    />
                    <RoleCard
                        title="Delivery Partner"
                        description="View and manage delivery orders."
                        icon="🚴‍♂️"
                        onClick={() => handleRoleSelect('delivery-partner')}
                    />
                </div>
            </div>
        </div>
    );
}