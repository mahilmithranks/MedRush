import { useUser } from '@clerk/clerk-react';
import { UploadButton } from "@uploadthing/react";
import { useNavigate } from 'react-router-dom';

export default function UploadPrescription() {
  const { user } = useUser();
  const navigate = useNavigate();

  const handleUploadComplete = async (res) => {
    const fileUrl = res[0].url;
    try {
      const response = await fetch('http://localhost:8000/api/prescriptions/upload', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          clerkId: user.id,
          prescriptionImageUrl: fileUrl,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to upload prescription');
      }
      alert('Prescription uploaded successfully! A pharmacist will review it shortly.');
      navigate('/customer-dashboard'); // Go back to the dashboard
    } catch (error) {
      alert('There was an error uploading your prescription.');
      console.error(error);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-4">
      <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-md">
        <h1 className="text-3xl font-bold text-gray-800 mb-4 text-center">
          Upload Your Prescription
        </h1>
        <p className="text-center text-gray-500 mb-6">
          Please upload a clear image or PDF of your prescription.
        </p>
        <UploadButton
          endpoint="imageOrPdfUploader" // This should match your UploadThing config
          onClientUploadComplete={handleUploadComplete}
          onUploadError={(error) => alert(`ERROR! ${error.message}`)}
        />
      </div>
    </div>
  );
}