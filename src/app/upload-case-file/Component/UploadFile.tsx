"use client";
import React, { useState } from 'react';
import { FiUpload } from 'react-icons/fi';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function UploadFile() {
  const [file, setFile] = useState<File>();
  const [fileName, setFileName] = useState<string>('');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setFileName(selectedFile.name);
    }
  };

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Check if a file is selected
    if (!file) {
      toast.error('No file selected');
      return;
    }

    // Check if the file format is supported
    const acceptedExtensions = ['.pcap', '.pcapng'];
    const fileExtension = file.name.split('.').pop()?.toLowerCase() || '';
    if (!acceptedExtensions.includes(`.${fileExtension}`)) {
      toast.error('Please select a .pcap or .pcapng file.');
      return;
    }

    try {
      // Upload the file
      const data = new FormData();
      data.set('file', file);

      const uploadRes = await fetch('http://localhost:3000/api/file-upload', {
        method: 'POST',
        body: data,
      });

      // Check if upload was successful
      if (!uploadRes.ok) {
        throw new Error('Error uploading file');
      }

      toast.success('File uploaded successfully');

      // Process the file
      const processRes = await fetch('http://localhost:3000/api/process-file', {
        method: 'POST',
        body: JSON.stringify({ filterType: 'HTTP HEADERS' }), // or whatever filter type you want
        headers: {
          'Content-Type': 'application/json',
        },
      });

      // Check if processing was successful
      if (processRes.ok) {
        toast.success('File processed successfully');
      } else {
        throw new Error('Error processing file');
      }
    } catch (error) {
      // Handle errors
      console.error('Error:', error.message);
      toast.error('Error: ' + error.message);
    }
  };

  return (
    <>
      <ToastContainer />
      <form onSubmit={onSubmit} className="max-w-sm mx-auto">
        <div className="flex flex-col items-center mb-4">
          <div className="flex flex-col items-center mb-2 relative">
            <label
              className="w-64 flex flex-col items-center px-4 py-6 bg-white text-blue rounded-lg shadow-lg tracking-wide uppercase border border-blue cursor-pointer hover:bg-blue hover:text-gray-500 mb-2">
              <FiUpload className="w-8 h-8 mb-2"/>
              <span className="mt-2 text-base leading-normal">Choose a file</span>
              <input
                type="file"
                name="file"
                className="hidden"
                accept=".pcap, .pcapng"
                onChange={handleFileChange}
              />
            </label>
            {fileName && (
              <span className="text-sm absolute bottom-0 left-0 p-2 bg-yellow-200 rounded-b-lg">
                {fileName}
              </span>
            )}
          </div>
          <button
            type="submit"
            className="relative px-6 py-3 bg-blue text-black rounded-lg shadow-lg focus:outline-none focus:ring-2 focus:ring-blue hover:bg-blue-300 hover:text-white transform transition-all duration-300 ease-in-out hover:scale-105"
          >
            Upload
          </button>
        </div>
      </form>
    </>
  );
}
