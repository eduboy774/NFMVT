import React from "react";
import {handleFileSelect} from './pcap'
import {toast} from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

 export default function UploadFile(){
   const incidenceId = localStorage.getItem('incidenceId');
   
   const handleFileChange = (event) => {
    if (event) {
    handleFileSelect(event);
    
    const file = event.target.files[0];  
    const caseNumber = localStorage.getItem('case_number')
    const fileName =file.name;
    const fileType =file.type;
    const fileSize =file.size;
    const md5hash = '';

    const onFileUpload = async (event) => {
    const file = event.target.files[0];
    const fileName = file.name
    console.log(file);
    const formData = new FormData();
    console.log(formData);

    fetch("http://localhost:3000/api/upload-file", {
      method: "POST",
      body: JSON.stringify({ caseNumber:caseNumber,fileName: fileName, fileType: fileType, fileSize: fileSize,incidenceId:incidenceId }),
      headers: {
        "Content-Type": "application/json",
      },
    })
    .then((response) => {
      if (!response.ok) {
        throw new Error("An error occurred while adding case.");
      }
      return response.json();
    })
    .then((data) => {
      console.log("File added successfully:", data);
      toast.success("Case File Uploaded Successfully")
      // router.push('/dashboard');
    })
    .catch((error) => {
      console.error("Error:", error);
      toast.error("Error While Uploading Case File!")
    });
    } 
  };
}
  

  
   
  return (
    <>
      <div className="flex items-center justify-center w-full">
          <label htmlFor="dropzone-file" className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50">
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <svg className="w-8 h-8 mb-4 text-gray-500" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16">
                      <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"/>
                  </svg>
                  <p className="mb-2 text-sm text-gray-500 "><span className="font-semibold">Click to upload</span> or drag and drop</p>
                  <p className="text-xs text-gray-500  uppercase">pcap</p>
              </div>
              <input id="dropzone-file" type="file" className="hidden" onChange={onFileUpload} accept=".pcap" />
          </label>
      </div> 
    </>
  )



 }
