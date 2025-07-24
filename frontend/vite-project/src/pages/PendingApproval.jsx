import { UserButton, useUser } from "@clerk/clerk-react";

export default function PendingApproval() {
  const { user } = useUser();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-4">
      <div className="absolute top-4 right-4">
        <UserButton afterSignOutUrl="/" />
      </div>
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">
          Application Pending ⏳
        </h1>
        <p className="text-lg text-gray-600">
          Thank you for signing up, {user?.firstName}!
        </p>
        <p className="text-lg text-gray-600 mt-2">
          Your account is currently under review for approval. We will notify you once the process is complete.
        </p>
      </div>
    </div>
  );
}