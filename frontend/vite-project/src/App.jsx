// src/App.jsx
import {
  SignedIn,
  SignedOut,
  RedirectToSignIn,
  SignIn,
  SignUp
} from "@clerk/clerk-react";

import { Routes, Route } from "react-router-dom";

import RoleSelection from "./pages/RoleSelection";
import CustomerDashboard from "./pages/CustomerDashboard";
import PharmacistDashboard from "./pages/PharmacistDashboard";
import DeliveryDashboard from "./pages/DeliveryDashboard";

function App() {
  return (
    <Routes>
      {/* Public Route */}
      <Route path="/select-role" element={<RoleSelection />} />

      {/* Auth Routes */}
      <Route path="/sign-in/*" element={<SignIn />} />
      <Route path="/sign-up/*" element={<SignUp />} />

      {/* Protected Routes */}
      <Route
        path="/dashboard/customer"
        element={
          <SignedIn>
            <CustomerDashboard />
          </SignedIn>
        }
      />
      <Route
        path="/dashboard/pharmacist"
        element={
          <SignedIn>
            <PharmacistDashboard />
          </SignedIn>
        }
      />
      <Route
        path="/dashboard/delivery"
        element={
          <SignedIn>
            <DeliveryDashboard />
          </SignedIn>
        }
      />

      {/* Optional fallback route */}
      <Route
        path="/protected"
        element={
          <>
            <SignedIn>Protected Content</SignedIn>
            <SignedOut>
              <RedirectToSignIn />
            </SignedOut>
          </>
        }
      />
    </Routes>
  );
}

export default App;
