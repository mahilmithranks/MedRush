// src/components/FileUploader.jsx
import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { useUser } from '@clerk/clerk-react';

// --- CHANGE THIS LINE ---
// From: import { useUploadThing } from '@uploadthing/react';
// To:
import { useUploadThing } from '../utils/uploadthing'; // Adjust path if needed
// ----------------------

export function FileUploader({ endpoint, onUploadComplete }) {
  const { user } = useUser();

  const onDrop = useCallback((acceptedFiles) => {
    startUpload(acceptedFiles);
  }, []);

  const { getRootProps, getInputProps } = useDropzone({ onDrop });

  const { startUpload, isUploading } = useUploadThing(endpoint, {
    onClientUploadComplete: (res) => {
      onUploadComplete(res);
    },
    onUploadError: (error) => {
      alert(`Upload Error: ${error.message}`);
    },
    headers: { "x-user-id": user?.id },
  });

  return (
    <div {...getRootProps()} className="border-2 border-dashed border-gray-400 rounded-lg p-8 text-center cursor-pointer hover:bg-gray-50">
      <input {...getInputProps()} />
      {isUploading ? (
        <p>Uploading...</p>
      ) : (
        <p>Drag 'n' drop a file here, or click to select a file</p>
      )}
    </div>
  );
}