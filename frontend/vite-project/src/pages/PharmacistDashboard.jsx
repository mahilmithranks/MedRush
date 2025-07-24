import { UserButton, useUser } from "@clerk/clerk-react";
import { useState, useEffect } from "react";

export default function PharmacistDashboard() {
  const { user } = useUser();
  const [prescriptions, setPrescriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPendingPrescriptions = async () => {
      try {
        const response = await fetch('http://localhost:8000/api/prescriptions/pending');
        if (!response.ok) {
          throw new Error('Failed to fetch prescriptions');
        }
        const data = await response.json();
        setPrescriptions(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPendingPrescriptions();
  }, []);

  const handleUpdateStatus = async (prescriptionId, newStatus) => {
    try {
        const response = await fetch(`http://localhost:8000/api/prescriptions/${prescriptionId}/status`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ status: newStatus, pharmacistClerkId: user.id }),
        });

        if (!response.ok) {
            throw new Error('Failed to update prescription status');
        }

        // Remove the prescription from the list after handling it
        setPrescriptions(prescriptions.filter(p => p._id !== prescriptionId));
        alert(`Prescription ${newStatus} successfully!`);

    } catch (err) {
        alert(err.message);
    }
  };

  return (
    <div className="p-8">
      <header className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Pharmacist Dashboard</h1>
        <UserButton />
      </header>
      <main>
        <h2 className="text-2xl font-semibold mb-4">Pending Prescriptions</h2>
        {loading && <p>Loading prescriptions...</p>}
        {error && <p className="text-red-500">Error: {error}</p>}
        <div className="bg-white shadow rounded-lg">
          <ul className="divide-y divide-gray-200">
            {prescriptions.length > 0 ? prescriptions.map((p) => (
              <li key={p._id} className="p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center">
                <div className="mb-4 sm:mb-0">
                  <p className="font-semibold">Customer: {p.customerId.email}</p>
                  <a 
                    href={p.prescriptionImageUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-sm text-blue-500 hover:underline"
                  >
                    View Prescription
                  </a>
                </div>
                <div className="flex space-x-2">
                    <button
                        onClick={() => handleUpdateStatus(p._id, 'approved')}
                        className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded"
                    >
                        Approve
                    </button>
                    <button
                        onClick={() => handleUpdateStatus(p._id, 'rejected')}
                        className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded"
                    >
                        Reject
                    </button>
                </div>
              </li>
            )) : (
              <p className="p-4 text-gray-500">No prescriptions are currently pending.</p>
            )}
          </ul>
        </div>
      </main>
    </div>
  );
}
