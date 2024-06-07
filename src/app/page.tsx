/* eslint-disable @next/next/no-img-element */
'use client'

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { toast, ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import enviroment from "../env";

type T = /*unresolved*/ any

export default function App() {
  const router = useRouter();
  const [values, setValues] = useState({
    caseNumber: '',
    caseDescription: '',
    investigator: '',
    organization: '',
  });
  const [caseNumber, setCaseNumber] = useState(null);
  const endpoint = enviroment?.endpoint

  useEffect(() => {
    const currentYear = new Date().getFullYear();
    const threeDigits1 = Math.floor(Math.random() * 900) + 100;
    const threeDigits2 = Math.floor(Math.random() * 900) + 100;
    const caseNumber = `CN/${currentYear}/${threeDigits1}/${threeDigits2}`;
    setCaseNumber(caseNumber);
  }, []);

  function handleSubmit(event) {
    event.preventDefault();

    const caseDescription = event?.target.elements?.caseDescription.value;
    const investigator = event?.target.elements?.investigator.value;
    const organization = event?.target.elements?.organization.value;

    // Validation: Check for empty input fields
    if (!caseDescription || !investigator || !organization) {
      toast.error("Please fill in all fields.");
      return;
    }

    fetch(endpoint + '/case-create', {
      method: "POST",
      body: JSON.stringify({ caseNumber: caseNumber, caseDescription: caseDescription, investigator: investigator, organization: organization }),
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
        toast.success("Case created successfully!");

        // Delay redirection to dashboard by 3 seconds
        setTimeout(() => {
          router.push('/dashboard');
        }, 3000);
      })
      .catch((error) => {
        console.error("Error:", error);
        toast.error("An error occurred while creating the case.");
      });
  }

  return (
    <>
      <ToastContainer />
      <div className="flex min-h-screen">
        {/* First half with image */}
        <div className="w-1/3 flex justify-center items-center">
          <img
            className="h-auto max-w-full max-h-full py-15 px-19"
            src="./visual.png"
            alt="Your Image"
          />
        </div>

        {/* Second half with form */}
        <div className="w-2/3 flex flex-col justify-center px-20 py-12 lg:px-20">
          <div className="mx-auto w-full max-w-3xl">
            <h2 className="mt-10 text-center text-lg font-bold leading-8 tracking-tight text-gray-500 capitalize">
              Network Traffic and Filesystem Metadata Visualization
            </h2>
          </div>

          <div className="mt-10 mx-auto w-full max-w-3xl">
            <form className="space-y-6" onSubmit={handleSubmit}>
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
                    pattern="[A-Za-z .]+"
                    title="Please enter only letters"
                    placeholder="Enter Investigator Name"
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  />
                </div>
              </div>
              <div>
                <div className="flex items-center justify-between">
                  <label htmlFor="organization" className="block text-sm font-medium leading-6 text-gray-500">
                    Investigator Organization
                  </label>
                </div>
                <div className="mt-2">
                  <input
                    id="organization"
                    name="organization"
                    type="text"
                    pattern="[A-Za-z .]+"
                    title="Please enter only letters"
                    placeholder="Enter Investigator Organization"
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
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
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  ></textarea>
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
                <a href="./open-existing-case" className="font-semibold text-indigo-600 hover:text-indigo-500">
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
