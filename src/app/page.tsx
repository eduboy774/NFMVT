/* eslint-disable @next/next/no-img-element */
'use client'

import { useRouter } from "next/navigation";
import { useState } from "react";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
type T = /*unresolved*/ any

export default function Example() {
  const router = useRouter();
  const [values, setValues] = useState({
    login: 'userAdmin',
    password: 'admin'
  }); 



  const successMessage = () => toast("Case added successfully");
  function handleSubmit (event) {
    event.preventDefault();

    const caseNumber = event?.target.elements?.caseNumber.value;
    const caseDescription = event?.target.elements?.caseDescription.value;
    const investigator = event?.target.elements?.investigator.value;
    
    // const posts = await createCase(values.caseNumber, values.caseDescription, values.investigator);
    fetch("http://localhost:3000/api/create-case", {
      method: "POST",
      body: JSON.stringify({ caseNumber: caseNumber, caseDescription: caseDescription, investigator: investigator }),
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
      console.log("Case added successfully:", data);
      alert("Case added successfully")
      successMessage()
      router.push('/dashboard');
    })
    .catch((error) => {
      console.error("Error:", error);
    });
     
  };

  return (
    <>
      <div className="flex min-h-screen">
        {/* First half with image */}
        <div className="w-1/2 flex justify-center items-center">
          <img
            className="h-auto max-w-full max-h-full"
            src="./visual.png"
            alt="Your Image"
          />
        </div>

        {/* Second half with form */}
        <div className="w-1/2 flex flex-col justify-center px-6 py-12 lg:px-8">
          <div className="sm:mx-auto sm:w-full sm:max-w-sm">
            <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-500 uppercase">
              Network Traffic and Filesystem Metadata Visualization
            </h2>
          </div>

          <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
            <form className="space-y-6" onSubmit={handleSubmit}>
              <div>
                <label htmlFor="caseNumber" className="block text-sm font-medium leading-6 text-gray-500">
                  Case Number
                </label>
                <div className="mt-2">
                  <input
                    id="caseNumber"
                    name="caseNumber"
                    type="number"
                    placeholder="Enter Case Number"
                    min="0"
                    className="block w-full rounded-md border-0 py-1.5 text-gray-500 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between">
                  <label htmlFor="caseDescription" className="block text-sm font-medium leading-6 text-gray-500">
                    Case Description
                  </label>
                </div>
                <div className="mt-2">
                <textarea
                  id="caseDescription"
                  name="caseDescription"
                  placeholder="Enter Case description...."
                  //required
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                ></textarea>
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between">
                  <label htmlFor="investigator" className="block text-sm font-medium leading-6 text-gray-500">
                    Investigator Name
                  </label>
                </div>
                <div className="mt-2">
                  <input
                    id="investigator"
                    name="investigator"
                    type="text"
                    //required
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  />
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                >
                  Create Case
                </button>
              </div>

              <div className="text-sm">
                <a href="#" className="font-semibold text-indigo-600 hover:text-indigo-500">
                  Open an existing case
                </a>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  )
}
