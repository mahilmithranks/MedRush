import { UserButton } from "@clerk/clerk-react";
import { useState, useEffect } from "react";

export default function AdminDashboard() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUnapprovedUsers = async () => {
      try {
        const response = await fetch('http://localhost:8000/api/admin/unapproved-users');
        if (!response.ok) {
          throw new Error('Failed to fetch users');
        }
        const data = await response.json();
        setUsers(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUnapprovedUsers();
  }, []);

  const handleApproveUser = async (clerkId) => {
    try {
        const response = await fetch('http://localhost:8000/api/admin/approve-user', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ clerkId: clerkId }),
        });

        if (!response.ok) {
            throw new Error('Failed to approve user');
        }

        // Refresh the list of users after approval
        setUsers(users.filter(user => user.clerkId !== clerkId));
        alert('User approved successfully!');

    } catch (err) {
        alert(err.message);
    }
  };

  return (
    <div className="p-8">
      <header className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <UserButton afterSignOutUrl="/" />
      </header>
      <main>
        <h2 className="text-2xl font-semibold mb-4">Pending Approvals</h2>
        {loading && <p>Loading users...</p>}
        {error && <p className="text-red-500">Error: {error}</p>}
        <div className="bg-white shadow rounded-lg">
          <ul className="divide-y divide-gray-200">
            {users.length > 0 ? users.map((user) => (
              <li key={user.clerkId} className="p-4 flex justify-between items-center">
                <div>
                  <p className="font-semibold">{user.email}</p>
                  <p className="text-sm text-gray-500 capitalize">{user.role}</p>
                  {/* In a real app, you'd have links to their uploaded docs here */}
                </div>
                <button
                  onClick={() => handleApproveUser(user.clerkId)}
                  className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded"
                >
                  Approve
                </button>
              </li>
            )) : (
              <p className="p-4 text-gray-500">No users are currently pending approval.</p>
            )}
          </ul>
        </div>
      </main>
    </div>
  );
}