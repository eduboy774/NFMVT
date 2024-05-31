/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from "react";
import CountForIncidence from "@/componets/app/dashboard/Component/CountForIncidence" ;
import { useRouter } from "next/navigation";
import { FiUpload } from 'react-icons/fi';
import { PencilIcon, TrashIcon, ChartBarSquareIcon } from '@heroicons/react/24/outline';
import CommonStatistics from "../../general-statistics/Component/CommonStatistics";
import enviroment from '../../../env';
import 'react-toastify/dist/ReactToastify.css';
import { toast, ToastContainer } from "react-toastify";

export default function Cases() {
  const [allIncidence, setAllIncidence] = useState([]);
  const [registeredCases, setRegisteredCases] = useState(0);
  const [activeCases, setActiveCases] = useState(0);
  const [closedCases, setClosedCases] = useState(0);
  const [caseNumber, setCaseNumber] = useState(null);
  const [clickedCategory, setClickedCategory] = useState(null);
  const router = useRouter();
  const endpoint = enviroment?.endpoint;

  useEffect(() => {
    fetch(endpoint+'get-case', {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        setAllIncidence(data);
        setRegisteredCases(data.length);
        setActiveCases(data.filter((item) => item.case_status === "Active").length);
        setClosedCases(data.filter((item) => item.case_status === "Closed").length);
      });
  }, []);

  const handleView = (case_number) => {
    console.log(`Viewing case number: ${case_number}`);
    router.push('/visuals');
  };

  const handleNavigate = (case_number) => {
    setCaseNumber(case_number);
    localStorage.setItem("case_number", case_number);
    router.push("/upload-case-file");
  };

  const handleCategoryClick = (category) => {
    setClickedCategory(category);
  };

 
  const handleDelete = (case_uuid) => {
    // Extract the case_uuid from the item
  
    // Make a DELETE request to the endpoint
    fetch(`${endpoint}/delete-case?case_uuid=${case_uuid}`, {
      method: "DELETE",
    })
      .then((response) => {
        if (response.ok) {
         toast.success("Case Deleted Successfull")
         setAllIncidence((allIncidence) => allIncidence.filter((item) => item.case_uuid !== case_uuid));
        } else {
          toast.warning("Failed to Deleted Case")
        }
      })
      .catch((error) => {
        toast.error("Network",error)
      });
  };

  const handleEdit = (item) => {
    // Implement your edit logic here
    console.log("Editing item:", item);
  };

  let filteredCases = allIncidence;
  if (clickedCategory === "active") {
    filteredCases = allIncidence.filter((item) => item.case_status === "Active");
  } else if (clickedCategory === "closed") {
    filteredCases = allIncidence.filter((item) => item.case_status === "Closed");
  }

  return (
    <>
    <ToastContainer />
      <div className="mx-auto max-w-7xl py-6 sm:px-6 lg:px-8">
        <div className="py-10 p-3 rounded-lg">
          <CommonStatistics
            registeredCases={registeredCases}
            activeCases={activeCases}
            closedCases={closedCases}
            onCategoryClick={handleCategoryClick}
          />
          <div className="mx-auto max-w-7xl py-6 sm:px-6 lg:px-8">
            <CountForIncidence/>
          </div>
        </div>

        <section className="dark:bg-gray-900 p-3 mt-4">
          <div className="bg-white dark:bg-gray-800 relative shadow-md sm:rounded-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                <thead className="text-xs text-gray-700 bg-gray-100 dark:bg-gray-400 dark:text-gray-200">
                <tr>
                  <th scope="col" className="px-4 py-3">ID</th>
                  <th scope="col" className="px-4 py-3">Case Number</th>
                  <th scope="col" className="px-4 py-3">Case Description</th>
                  <th scope="col" className="px-4 py-3">Investigator Name</th>
                  <th scope="col" className="px-4 py-3">Investigator Organization</th>
                  <th scope="col" className="px-4 py-3">Case Status</th>
                  <th scope="col" className="px-4 py-3" colSpan={5}>Actions</th>
                </tr>
                </thead>
                <tbody>
                {filteredCases.map((item, index) => (
                  <tr
                    className={`border-b dark:border-gray-700 ${index % 2 === 0 ? 'bg-white dark:bg-gray-800' : 'bg-gray-200 dark:bg-gray-700'} hover:bg-gray-100 dark:hover:bg-gray-700`}
                    key={item.case_uuid}>
                    <td className="px-4 py-3">{index + 1}</td>
                    <td className="px-4 py-3">{item.case_number}</td>
                    <td className="px-4 py-3">{item.case_description}</td>
                    <td className="px-4 py-3">{item.case_investigator_name}</td>
                    <td className="px-4 py-3">{item.case_investigator_organization}</td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-block px-2 py-1 rounded-full ${item.case_status === 'Active' ? 'bg-green-400 text-white' : 'bg-red-500 text-white'}`}>
                        {item.case_status}
                      </span>
                    </td>
                    <td className="" colSpan={3}>
                      <button className="btn-icon-primary mr-2 px-2" onClick={() => handleView(item.case_number)}>
                        <ChartBarSquareIcon className="w-6 h-6"/>
                      </button>
                      <button className="btn-icon-primary px-2" onClick={() => handleNavigate(item.case_number)}>
                        <FiUpload className="w-6 h-6"/>
                      </button>
                      <button className="btn-icon-primary px-2" onClick={() => handleEdit(item.case_number)}>
                        <PencilIcon className="w-6 h-6 text-blue-800"/>
                      </button>
                      <button className="btn-icon-primary px-2" onClick={() => handleDelete(item?.case_uuid)}>
                        <TrashIcon className="w-6 h-6 text-red-800"/>
                      </button>
                    </td>
                  </tr>
                ))}

                </tbody>
              </table>
            </div>
            { filteredCases?.length === 0 &&(<div className="flex justify-center py-4">
                <span className="text-grey-300 py-4 px-4 text-md text-gray-700 dark:text-gray-200 border rounded">No Data Found</span>
              </div>)}

            <nav
              className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-3 md:p-4"
              aria-label="Table navigation">
              <span className="text-sm font-normal text-gray-500 dark:text-gray-400">
                Showing
                <span className="font-semibold text-gray-900 dark:text-white">1-10</span>
                of
                <span className="font-semibold text-gray-900 dark:text-white">1000</span>
              </span>
              <ul className="inline-flex items-stretch -space-x-px">
                <li>
                  <a href="#"
                     className="flex items-center justify-center h-full py-1.5 px-3 ml-0 text-gray-500 bg-white rounded-l-lg border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white">
                    <span className="sr-only">Previous</span>
                    <svg className="w-5 h-5" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20"
                         xmlns="http://www.w3.org/2000/svg">
                      <path fillRule="evenodd"
                            d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                            clipRule="evenodd"/>
                    </svg>
                  </a>
                </li>
                <li>
                  <a href="#"
                     className="flex items-center justify-center text-sm py-2 px-3 leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white">1</a>
                </li>
                <li>
                  <a href="#"
                     className="flex items-center justify-center text-sm py-2 px-3 leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white">2</a>
                </li>
                <li>
                  <a href="#" aria-current="page"
                     className="flex items-center justify-center text-sm z-10 py-2 px-3 leading-tight text-primary-600 bg-primary-50 border border-primary-300 hover:bg-primary-100 hover:text-primary-700 dark:border-gray-700 dark:bg-gray-700 dark:text-white">3</a>
                </li>
                <li>
                  <a href="#"
                     className="flex items-center justify-center text-sm py-2 px-3 leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white">...</a>
                </li>
                <li>
                  <a href="#"
                     className="flex items-center justify-center text-sm py-2 px-3 leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white">100</a>
                </li>
                <li>
                  <a href="#"
                     className="flex items-center justify-center h-full py-1.5 px-3 leading-tight text-gray-500 bg-white rounded-r-lg border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white">
                    <span className="sr-only">Next</span>
                    <svg className="w-5 h-5" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20"
                         xmlns="http://www.w3.org/2000/svg">
                      <path fillRule="evenodd"
                            d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                            clipRule="evenodd"/>
                    </svg>
                  </a>
                </li>
              </ul>
            </nav>
          </div>
        </section>
      </div>
    </>
  );
}
