/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { FiUpload, FiX } from 'react-icons/fi';
import { PencilIcon, TrashIcon, ChartBarSquareIcon } from '@heroicons/react/24/outline';
import ChartStatistics from "../../general-statistics/Component/ChartStatistics";
import CommonStatistics from "../../general-statistics/Component/CommonStatistics";
import enviroment from '../../../env';
import 'react-toastify/dist/ReactToastify.css';
import { toast, ToastContainer } from "react-toastify";
import { Tooltip } from 'react-tippy';
import 'react-tippy/dist/tippy.css';

export default function Dashboard() {
  const [allIncidence, setAllIncidence] = useState([]);
  const [registeredCases, setRegisteredCases] = useState(0);
  const [activeCases, setActiveCases] = useState(0);
  const [closedCases, setClosedCases] = useState(0);
  const [clickedCategory, setClickedCategory] = useState(null);
  const [isModalOpenEditCase, setIsModalOpenCase] = useState(false);

  const [caseDetails, setCaseDetails] = useState({
    case_investigator_name: '',
    case_investigator_organization: '',
    case_description: '',
    case_status: ''
  });

  const router = useRouter();
  const endpoint = enviroment?.endpoint;

  const handleSubmit = (event) => {
    const caseDescription = event?.target.elements?.caseDescription.value;
    const investigator = event?.target.elements?.investigator.value;
    const organization = event?.target.elements?.organization.value;
    console.log(caseDescription, investigator, organization);
  };

  const fetchCases = () => {
    fetch(endpoint + '/get-case', {
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
    localStorage.setItem('case_uuid', case_uuid)
    const url = `/general-statistics`;
    router.push(url);
  };

  const handleNavigate = (case_uuid) => {
    localStorage.setItem('case_uuid', case_uuid)
    const url = `/upload-case-file`;
    // Call router.push with the URL
    router.push(url);
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
    if (item) {
      setCaseDetails(item);
      setIsModalOpenCase(true);
    }
  };

  const handleSubmitEdit = async (event, caseDetails) => {
    event.preventDefault();

    try {
      const formData = new FormData(event.target);
      const updatedCaseDetails = {
        case_investigator_name: formData.get('investigator'),
        case_investigator_organization: formData.get('organization'),
        case_description: formData.get('caseDescription'),
        case_status: formData.get('caseStatus')
      };

      const response = await fetch(`${endpoint}/edit-case`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          case_uuid: caseDetails?.case_uuid,
          case_number: caseDetails?.case_number,
          ...updatedCaseDetails
        }),
      });

      if (response.ok) {
        toast.success('Case details updated successfully');
        setCaseDetails(updatedCaseDetails);
        fetchCases();
        setIsModalOpenCase(false);
      } else {
        toast.error('Failed to update case details');
      }
    } catch (error) {
      console.error('Error updating case details:', error);
      toast.error('An error occurred while updating case details');
    }
  };

  const handleToggleCaseModal = () => {
    setIsModalOpenCase(!isModalOpenEditCase);
  };

  const handleClickOutsideModal = (event) => {
    if (event.target.classList.contains('bg-gray-900')) {
      setIsModalOpenCase(false);
    }
  };

  useEffect(() => {
    window.addEventListener('click', handleClickOutsideModal);

    return () => {
      window.removeEventListener('click', handleClickOutsideModal);
    };
  }, [isModalOpenEditCase]);

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
                    <tr
                      className={`border-b dark:border-gray-700 ${index % 2 === 0 ? 'bg-white dark:bg-gray-800' : 'bg-gray-200 dark:bg-gray-700'} hover:bg-gray-100 dark:hover:bg-gray-700`}
                      key={item.case_uuid}>
                      <td className="px-4 py-3">{index + 1}</td>
                      <td className="px-4 py-3">{item.case_number}</td>
                      <td className="px-4 py-3">{item.case_description}</td>
                      <td className="px-4 py-3">{item.case_investigator_name}</td>
                      <td className="px-4 py-3">{item.case_investigator_organization}</td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-1 font-semibold leading-tight ${item.case_status === 'Active' ? 'text-green-800 bg-green-100' : 'text-red-800 bg-red-100'} rounded-full dark:bg-gray-700 dark:text-gray-100`}>
                          {item.case_status}
                        </span>
                      </td>
                      <td className="px-1 py-1">
                        <Tooltip title="Edit">
                          <PencilIcon className="h-5 w-5 text-blue-500 hover:text-blue-700 cursor-pointer" onClick={() => handleEdit(item)} />
                        </Tooltip>
                      </td>
                      <td className="px-1 py-1">
                        <Tooltip title="Delete">
                          <TrashIcon className="h-5 w-5 text-red-500 hover:text-red-700 cursor-pointer" onClick={() => handleDelete(item.case_uuid)} />
                        </Tooltip>
                      </td>
                      <td className="px-1 py-1">
                        <Tooltip title="View General Statistics">
                          <ChartBarSquareIcon className="h-5 w-5 text-gray-500 hover:text-gray-700 cursor-pointer" onClick={() => handleView(item.case_uuid)} />
                        </Tooltip>
                      </td>
                      <td className="px-1 py-1">
                        <Tooltip title="Upload">
                          <FiUpload className="h-5 w-5 text-gray-500 hover:text-gray-700 cursor-pointer" onClick={() => handleNavigate(item.case_uuid)} />
                        </Tooltip>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      </div>

      {isModalOpenEditCase && (
        <div
          id="editCaseModal"
          aria-hidden="true"
          className="fixed top-0 left-0 right-0 z-50 flex justify-center items-center w-full p-4 overflow-x-hidden overflow-y-auto h-full bg-gray-900 bg-opacity-50"
        >
          <div className="relative w-full max-w-2xl max-h-full">
            <div className="relative bg-white rounded-lg shadow dark:bg-gray-800">
              <button
                onClick={handleToggleCaseModal}
                type="button"
                className="absolute top-3 right-2.5 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center dark:hover:bg-gray-600 dark:hover:text-white"
              >
                <FiX className="h-5 w-5" />
                <span className="sr-only">Close modal</span>
              </button>
              <div className="px-6 py-6 lg:px-8">
                <h3 className="mb-4 text-xl font-medium text-gray-900 dark:text-white">
                  Edit Case Details
                </h3>
                <form
                  className="space-y-6"
                  onSubmit={(event) => handleSubmitEdit(event, caseDetails)}
                >
                  <div>
                    <label
                      htmlFor="investigator"
                      className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                    >
                      Investigator Name
                    </label>
                    <input
                      type="text"
                      name="investigator"
                      id="investigator"
                      defaultValue={caseDetails.case_investigator_name}
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                      placeholder="Investigator Name"
                      required
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="organization"
                      className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                    >
                      Investigator Organization
                    </label>
                    <input
                      type="text"
                      name="organization"
                      id="organization"
                      defaultValue={caseDetails.case_investigator_organization}
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                      placeholder="Investigator Organization"
                      required
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="caseDescription"
                      className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                    >
                      Case Description
                    </label>
                    <input
                      type="text"
                      name="caseDescription"
                      id="caseDescription"
                      defaultValue={caseDetails.case_description}
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                      placeholder="Case Description"
                      required
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="caseStatus"
                      className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                    >
                      Case Status
                    </label>
                    <select
                      name="caseStatus"
                      id="caseStatus"
                      defaultValue={caseDetails.case_status}
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                      required
                    >
                      <option value="Active">Active</option>
                      <option value="Closed">Closed</option>
                    </select>
                  </div>
                  <button
                    type="submit"
                    className="w-full text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-500 dark:hover:bg-blue-600 dark:focus:ring-blue-800"
                  >
                    Update Case
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
