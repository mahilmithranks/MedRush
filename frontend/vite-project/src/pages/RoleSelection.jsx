// src/pages/RoleSelection.jsx
import { useNavigate } from "react-router-dom";

export default function RoleSelection() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-2xl font-semibold mb-6">Select Your Role</h1>
      <div className="flex gap-4">
        <button
          onClick={() => navigate("/dashboard/customer")}
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded"
        >
          Customer
        </button>
        <button
          onClick={() => navigate("/dashboard/pharmacist")}
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded"
        >
          Pharmacist
        </button>
        <button
          onClick={() => navigate("/dashboard/delivery")}
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded"
        >
          Delivery
        </button>
      </div>
    </div>
  );
}
