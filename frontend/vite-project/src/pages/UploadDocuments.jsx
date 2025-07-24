import { useUser } from '@clerk/clerk-react';
import { UploadButton } from "@uploadthing/react";
import { useNavigate } from 'react-router-dom';

export default function UploadDocuments() {
  // Destructure isLoaded to check if Clerk has finished loading user data
  const { user, isLoaded } = useUser();
  const navigate = useNavigate();

  const handleUploadComplete = async (docType, res) => {
    const fileUrl = res[0].url;
    console.log(`Upload successful for ${docType}: ${fileUrl}`);

    try {
      // Send the file URL to your backend to be saved
      const response = await fetch('http://localhost:8000/api/users/update-docs', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          clerkId: user.id,
          fileUrl: fileUrl,
          docType: docType,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to save document URL');
      }

      alert(`${docType.replace(/([A-Z])/g, ' $1')} uploaded successfully!`);
      // After upload, send the user to the pending approval page
      navigate('/pending-approval');

    } catch (error) {
      console.error('Error saving document:', error);
      alert('There was an error saving your document. Please try again.');
    }
  };

  // Show a loading message until Clerk is ready
  if (!isLoaded) {
    return (
        <div className="flex items-center justify-center h-screen">
            <p>Loading user information...</p>
        </div>
    );
  }

  // Once loaded, we can safely check the user's role
  const role = user?.publicMetadata?.role;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-4">
      <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-md">
        <h1 className="text-3xl font-bold text-gray-800 mb-4 text-center">
          Verification Required
        </h1>

        {/* Render the correct uploader based on the user's role */}
        {role === 'pharmacist' && (
          <div>
            <h2 className="text-xl font-semibold mb-2">Upload Pharmacy License</h2>
            <p className="text-sm text-gray-500 mb-4">Please upload a clear PDF or image of your license.</p>
            <UploadButton
              endpoint="imageOrPdfUploader"
              onClientUploadComplete={(res) => handleUploadComplete('pharmacyLicense', res)}
              onUploadError={(error) => alert(`ERROR! ${error.message}`)}
            />
          </div>
        )}

        {role === 'delivery-partner' && (
          <div className="space-y-6">
             <h2 className="text-xl font-semibold mb-2">Upload Your Documents</h2>
             <p className="text-sm text-gray-500 mb-4">Please upload both your license and a photo ID.</p>
            <div>
              <h3 className="font-medium">1. Delivery License</h3>
              <UploadButton
                endpoint="imageOrPdfUploader"
                onClientUploadComplete={(res) => handleUploadComplete('deliveryLicense', res)}
                onUploadError={(error) => alert(`ERROR! ${error.message}`)}
              />
            </div>
            <div>
              <h3 className="font-medium">2. Photo ID (JPEG/PNG)</h3>
              <UploadButton
                endpoint="imageUploader"
                onClientUploadComplete={(res) => handleUploadComplete('photoId', res)}
                onUploadError={(error) => alert(`ERROR! ${error.message}`)}
              />
            </div>
          </div>
        )}

        {/* Fallback for customers or if the role is not one that requires uploads */}
        {role === 'customer' && (
          <p>No documents are required for your role. Redirecting...</p>
        )}
      </div>
    </div>
  );
}
