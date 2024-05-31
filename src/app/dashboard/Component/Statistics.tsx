import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { FiUpload } from 'react-icons/fi';
import { PencilIcon, TrashIcon, ChartBarSquareIcon } from '@heroicons/react/24/outline';
import ChartStatistics from "../../general-statistics/Component/ChartStatistics";
import CommonStatistics from "../../general-statistics/Component/CommonStatistics";
import enviroment from '../../../env';
import 'react-toastify/dist/ReactToastify.css';
import { toast, ToastContainer } from "react-toastify";
import { Tooltip } from 'react-tippy';
import 'react-tippy/dist/tippy.css';

export default function Statistics() {
  const [allIncidence, setAllIncidence] = useState([]);
  const [registeredCases, setRegisteredCases] = useState(0);
  const [activeCases, setActiveCases] = useState(0);
  const [closedCases, setClosedCases] = useState(0);
  const [caseNumber, setCaseNumber] = useState(null);
  const [clickedCategory, setClickedCategory] = useState(null);
  const [isModalOpenEditCase, setIsModalOpenCase] = useState(false);

  const router = useRouter();

  const endpoint = enviroment?.endpoint;


  const handleToggleCaseModal = () => {
    setIsModalOpenCase(!isModalOpenEditCase);
  };
  
  const handleSubmit = () => {
  };

  const fetchCases = () => {
    fetch(endpoint+'/get-case', {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setAllIncidence(data);
        setRegisteredCases(data.length);
        setActiveCases(data.filter((item) => item.case_status === "Active").length);
        setClosedCases(data.filter((item) => item.case_status === "Closed").length);
      });
  };

  useEffect(() => {
    fetchCases();
  }, []);

  const handleView = (case_uuid) => {
    localStorage.setItem("case_uuid", case_uuid);
    router.push('/general-statistics');
  };

  const handleNavigate = (case_uuid) => {
    setCaseNumber(case_uuid);
    localStorage.setItem("case_uuid", case_uuid);
    router.push("/upload-case-file");
  };

  const handleCategoryClick = (category) => {
    setClickedCategory(category);
  };

  const handleDelete = (case_uuid) => {
    const deleteToast = toast(
      ({ closeToast }) => (
        <div>
          <p>Are you sure you want to delete this case?</p>
          <div>
            <button
              onClick={() => confirmDelete(case_uuid, closeToast)}
              style={{
                backgroundColor: 'red',
                color: 'white',
                border: 'none',
                padding: '8px 12px',
                marginRight: '10px',
                cursor: 'pointer',
                borderRadius: '4px'
              }}
            >
              Yes
            </button>
            <button
              onClick={closeToast}
              style={{
                backgroundColor: '#007BFF',
                color: 'white',
                border: 'none',
                padding: '8px 12px',
                cursor: 'pointer',
                borderRadius: '4px'
              }}
            >
              No
            </button>
          </div>
        </div>
      ),
      { autoClose: false, style: { background: '#ffeeba' } }
    );
  };

  const confirmDelete = (case_uuid, closeToast) => {
    fetch(`${endpoint}/delete-case?case_uuid=${case_uuid}`, {
      method: "DELETE",
    })
      .then((response) => {
        if (response.ok) {
          toast.success("Case Deleted Successfully");
          setAllIncidence((allIncidence) => allIncidence.filter((item) => item.case_uuid !== case_uuid));
          fetchCases();
        } else {
          toast.warning("Failed to Delete Case.");
        }
        closeToast();
      })
      .catch((error) => {
        toast.error("Network error:", error);
        closeToast();
      });
  };

  const handleEdit = (item) => {
    // Implement your edit logic here
    if(item){
      setIsModalOpenCase(!isModalOpenEditCase);
    }
  };

  let filteredCases = allIncidence;
  if (clickedCategory === "active") {
    filteredCases = allIncidence.filter((item) => item.case_status === "Active");
  } else if (clickedCategory === "closed") {
    filteredCases = allIncidence.filter((item) => item.case_status === "Closed");
  }

  // @ts-ignore
  // @ts-ignore
  return (
    <>
      <ToastContainer />
      <div className="mx-auto max-w-7xl py-6 sm:px-6 lg:px-8">
        {/* Render ChartStatistics component with appropriate props */}
        <ChartStatistics
          registeredCases={registeredCases}
          activeCases={activeCases}
          closedCases={closedCases}
        />

        <div className="py-10 p-3 rounded-lg">
          <CommonStatistics
            registeredCases={registeredCases}
            activeCases={activeCases}
            closedCases={closedCases}
            onCategoryClick={handleCategoryClick}
          />
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
                {filteredCases?.map((item, index) => (
                  <tr className={`border-b dark:border-gray-700 ${index % 2 === 0 ? 'bg-white dark:bg-gray-800' : 'bg-gray-200 dark:bg-gray-700'} hover:bg-gray-100 dark:hover:bg-gray-700`} key={item.case_uuid}>
                    <td className="px-4 py-3">{index + 1}</td>
                    <td className="px-4 py-3">{item.case_number}</td>
                    <td className="px-4 py-3">{item.case_description}</td>
                    <td className="px-4 py-3">{item.case_investigator_name}</td>
                    <td className="px-4 py-3">{item.case_investigator_organization}</td>
                    <td className="px-4 py-3">
                        <span className={`inline-block px-2 py-1 rounded-full ${item.case_status === 'Active' ? 'bg-green-400 text-white' : 'bg-red-500 text-white'}`}>
                          {item.case_status}
                        </span>
                    </td>
                    <td className="py-4" colSpan={3}>
                      <Tooltip title="View Case">
                        <button className="btn-icon-primary px-2" onClick={() => handleView(item.case_uuid)}>
                          <ChartBarSquareIcon className="w-6 h-6"/>
                        </button>
                      </Tooltip>
                      <Tooltip title="Upload Case File">
                        <button className="btn-icon-primary px-2" onClick={() => handleNavigate(item.case_uuid)}>
                          <FiUpload className="w-6 h-6"/>
                        </button>
                      </Tooltip>
                      <Tooltip title="Edit Case">
                        <button className="btn-icon-primary px-2" onClick={() => handleEdit(item.case_uuid)}>
                          <PencilIcon className="w-6 h-6 text-blue-800"/>
                        </button>
                      </Tooltip>
                      <Tooltip title="Delete Case">
                        <button className="btn-icon-primary px-2" onClick={() => handleDelete(item.case_uuid)}>
                          <TrashIcon className="w-6 h-6 text-red-800"/>
                        </button>
                      </Tooltip>
                    </td>
                  </tr>
                ))}
                </tbody>
              </table>
            </div>
            {filteredCases?.length === 0 && (
              <div className="flex justify-center py-4">
                <span className="text-grey-300 py-4 px-4 text-md text-gray-700 dark:text-gray-200 border rounded">No Data Found</span>
              </div>
            )}
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
                     className="flex items-center justify-center h-full py-1.5 px-3 ml-0 leading-tight text-gray-500 bg-white rounded-l-lg border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white">
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
      {isModalOpenEditCase &&(<div id="land-info-modal-occupancy" aria-hidden="true"
                              className={`fixed mt-8 flex justify-center bg-gray-900 bg-opacity-50 shadow-lg items-center h-screen  z-50 ${isModalOpenEditCase ? '' : 'hidden'} w-full p-4 overflow-x-hidden overflow-y-auto md:inset-0 h-[calc(100%-1rem)] max-h-full`}
                      >
                        <div className="relative w-100 max-h-full">
                            <div className="relative bg-white rounded-lg shadow">
                                <button type="button" onClick={handleToggleCaseModal} className="absolute top-3 right-2.5 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ml-auto inline-flex justify-center items-center" data-modal-hide="owner-info-modal">
                                    <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                                        <path stroke="currentColor" strokeLinecap="round" stroke-linejoin="round" stroke-width="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"/>
                                    </svg>
                                    <span className="sr-only">Close modal</span>
                                </button>
                                <div className="px-6 py-6 lg:px-8">
                                <form>
                                    <h3 className="mb-4 text-xl font-medium text-gray-900">Edit Case Details</h3>

                                     </form>
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
                    className="block w-80 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
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
                  Update Case
                </button>
              </div>

            </form>
          </div>
                                 </div> 
                            </div>
                        </div>
                      </div> 
                    )}
    </>
  );
}
