import { UserButton } from "@clerk/clerk-react";
import { Link } from "react-router-dom"; // Import Link

export default function CustomerDashboard() {
  return (
    <div className="p-8">
      <header className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Customer Dashboard</h1>
        <UserButton afterSignOutUrl="/" />
      </header>
      <main className="mt-8">
        <p>Welcome, Customer! Your prescriptions and orders will appear here.</p>
        <div className="mt-6">
          <Link 
            to="/upload-prescription"
            className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
          >
            Upload a New Prescription
          </Link>
        </div>
      </main>
    </div>
  );
}