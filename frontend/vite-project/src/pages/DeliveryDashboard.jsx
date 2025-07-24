import { UserButton } from "@clerk/clerk-react";

export default function DeliveryDashboard() {
  return (
    <div className="p-8">
      <header className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Delivery Partner Dashboard</h1>
        <UserButton afterSignOutUrl="/" />
      </header>
      <main className="mt-8">
        <p>Welcome, Delivery Partner! Your assigned deliveries will appear here.</p>
      </main>
    </div>
  );
}