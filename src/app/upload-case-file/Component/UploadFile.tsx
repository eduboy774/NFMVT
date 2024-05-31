import React, { useEffect, useState } from 'react';
import { FiUpload } from 'react-icons/fi';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {useRouter} from "next/navigation";

export default function UploadFile() {
  const router = useRouter();
  const [file, setFile] = useState<File>();
  const [fileName, setFileName] = useState<string>('');
  const [getCaseUuid,setCaseUuid] = useState(null)
  const caseUuid = localStorage.getItem('case_uuid');

  useEffect( ()=>{ 
    setCaseUuid(caseUuid)
  },[caseUuid]
  );
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setFileName(selectedFile.name);
    }
  };

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!file) {
      toast.error('No file selected');
      return;
    }

    const acceptedExtensions = ['.pcap', '.pcapng'];
    const fileExtension = file.name.split('.').pop()?.toLowerCase() || '';
    if (!acceptedExtensions.includes(`.${fileExtension}`)) {
      toast.error('Invalid file format. Please select a .pcap or .pcapng file.');
      return;
    }

    try {
      const data = new FormData();
      data.set('file', file,);
      if (getCaseUuid) {
        data.set('case_uuid', getCaseUuid);
      }

      const res = await fetch('http://localhost:3000/api/file-upload', {
        method: 'POST',
        body: data,
      });

      if (!res.ok) {
        throw new Error(await res.text());
      }
      
      if(res.status === 200) {
        
      }
      toast.success('File uploaded successfully');
      
      setTimeout(() => {
        router.push('/general-statistics');
      }, 3000)
    } catch (error) {
      console.error('Error uploading file:', error);
      toast.error('Error uploading file. Please try again later.');
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
