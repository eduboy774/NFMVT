import React,{useState} from "react";
import CountForIncidence from "./CountForIncidence";
import { useRouter } from "next/navigation";

export default function  Statistics(){


  const [getIncedence, setAlIncidence] = useState([]);
  const [getCaseNumber,setCaseNumber] = useState(null)
  const router = useRouter();

  const handleNavigate = (case_number) => {
    // router.push(`/upload-file/${id}`);
    setCaseNumber(case_number);
    localStorage.setItem('case_number',case_number)
    router.push('/uploadfile')
  };

   // Fetch the task data from the API when the component is rendered
   fetch("http://localhost:3000/api/get-case", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  }).then((res) => {
    res.json().then((data) => {
      setAlIncidence(data); // Set the task data state with the API response
    });
  });

  return (
    <>
      {/*CARDS*/}
      <div className="mx-auto max-w-7xl py-6 sm:px-6 lg:px-8">
        <div className="bg-gray-50 py-10 p-3 rounded-lg">
          <div className="grid grid-cols-5 gap-3 mb-2 hover:shadow-lime-50">
            <dl className="bg-gray-600 rounded-lg flex flex-col items-center justify-center h-[120px] m-1">
              <dt
                className="w-8 h-8 rounded-full bg-gray-500 text-orange-300 text-sm font-medium flex items-center justify-center mb-1">{11}</dt>
              <dd className="text-orange-300 text-sm font-medium mb-1">DNS Queries</dd>
              <dd className="text-gray-400 text-xs font-medium">Display DNS related queries data.</dd>
            </dl>
            <dl className="bg-gray-600 rounded-lg flex flex-col items-center justify-center h-[120px] m-1">
              <dt
                className="w-8 h-8 rounded-full bg-gray-500 text-teal-300 text-sm font-medium flex items-center justify-center mb-1">{12}</dt>
              <dd className="text-teal-300 text-sm font-medium mb-1">HTTP Communication</dd>
              <dd className="text-gray-400 text-xs font-medium">Display HTTP requests and responses.</dd>
            </dl>
            <dl className="bg-gray-600 rounded-lg flex flex-col items-center justify-center h-[120px] m-1">
              <dt
                className="w-8 h-8 rounded-full bg-gray-500 text-blue-300 text-sm font-medium flex items-center justify-center mb-1">{23}</dt>
              <dd className="text-blue-300 text-sm font-medium mb-1">Open Ports</dd>
              <dd className="text-gray-400 text-xs font-medium">Shows all open TCP ports.</dd>
            </dl>
            <dl className="bg-gray-600 rounded-lg flex flex-col items-center justify-center h-[120px] m-1">
              <dt
                className="w-8 h-8 rounded-full bg-gray-500 text-red-400 text-sm font-medium flex items-center justify-center mb-1">{12}</dt>
              <dd className="text-red-400  text-sm font-medium mb-1">Connections</dd>
              <dd className="text-gray-400 text-xs font-medium">Shows available connections.</dd>
            </dl>
            <dl className="bg-gray-600 rounded-lg flex flex-col items-center justify-center h-[120px] m-1">
              <dt
                className="w-8 h-8 rounded-full bg-gray-500 text-green-400 text-sm font-medium flex items-center justify-center mb-1">{12}</dt>
              <dd className="text-green-400  text-sm font-medium mb-1">Images</dd>
              <dd className="text-gray-400 text-xs font-medium">Shows found images.</dd>
            </dl>
            <dl className="bg-gray-600 rounded-lg flex flex-col items-center justify-center h-[120px] m-1">
              <dt
                className="w-8 h-8 rounded-full bg-gray-500 text-blue-300 text-sm font-medium flex items-center justify-center mb-1">{23}</dt>
              <dd className="text-blue-300 text-sm font-medium mb-1">Hosts</dd>
              <dd className="text-gray-400 text-xs font-medium">Shows all identified hosts.</dd>
            </dl>
            <dl className="bg-gray-600 rounded-lg flex flex-col items-center justify-center h-[120px] m-1">
              <dt
                className="w-8 h-8 rounded-full bg-gray-500 text-green-400 text-sm font-medium flex items-center justify-center mb-1">{12}</dt>
              <dd className="text-green-400  text-sm font-medium mb-1">Documents</dd>
              <dd className="text-gray-400 text-xs font-medium">Shows found documents.</dd>
            </dl>
            <dl className="bg-gray-600 rounded-lg flex flex-col items-center justify-center h-[120px] m-1">
              <dt
                className="w-8 h-8 rounded-full bg-gray-500 text-green-400 text-sm font-medium flex items-center justify-center mb-1">{12}</dt>
              <dd className="text-green-400  text-sm font-medium mb-1">FTP</dd>
              <dd className="text-gray-400 text-xs font-medium">Shows FTP session data.</dd>
            </dl>
            <div className="mx-auto max-w-7xl py-6 sm:px-6 lg:px-8">
              <CountForIncidence/>
            </div>
          </div>
        </div>

      {/*TABLE*/}
      <section className="bg-gray-50 dark:bg-gray-900 p-3">
        <div className="mx-auto max-w-screen-xl px-4 lg:px-12 p-10">
          <div className="bg-white dark:bg-gray-800 relative shadow-md sm:rounded-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                  <thead className="text-xs text-gray-700  bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                  <tr>
                    <th scope="col" className="px-4 py-3">ID</th>
                    <th scope="col" className="px-4 py-3">Case Number</th>
                    <th scope="col" className="px-4 py-3">Case Description</th>
                    <th scope="col" className="px-4 py-3">Investigator Name</th>
                    <th scope="col" className="px-4 py-3">Actions</th>
                  </tr>
                  </thead>
                  <tbody>
                  {getIncedence.map((item) => (
                    <tr className="border-b dark:border-gray-700" key={item.id}>
                      <td className="px-4 py-3">{item.id}</td>
                      <td className="px-4 py-3">{item.case_number}</td>
                      <td className="px-4 py-3">{item.case_description}</td>
                      <td className="px-4 py-3">{item.investigator}</td>
                      <td className="px-4 py-3">
                        <button id="apple-imac-27-dropdown-button" data-dropdown-toggle="apple-imac-27-dropdown"
                                className="inline-flex items-center p-0.5 text-sm font-medium text-center text-gray-500 hover:text-gray-800 rounded-lg focus:outline-none dark:text-gray-400 dark:hover:text-gray-100"
                                type="button" onClick={() => handleNavigate(item.case_number)}>
                          <svg className="w-5 h-5" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20"
                               xmlns="http://www.w3.org/2000/svg">
                            <path
                              d="M6 10a2 2 0 11-4 0 2 2 0 014 0zM12 10a2 2 0 11-4 0 2 2 0 014 0zM16 12a2 2 0 100-4 2 2 0 000 4z"/>
                          </svg>
                        </button>
                        <div id="apple-imac-27-dropdown"
                             className="hidden z-10 w-44 bg-white rounded divide-y divide-gray-100 shadow dark:bg-gray-700 dark:divide-gray-600">
                          <ul className="py-1 text-sm text-gray-700 dark:text-gray-200"
                              aria-labelledby="apple-imac-27-dropdown-button">
                            <li>
                              <a href="#"
                                 className="block py-2 px-4 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Show</a>
                            </li>
                            <li>
                              <a href="#"
                                 className="block py-2 px-4 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Edit</a>
                            </li>
                          </ul>
                          <div className="py-1">
                            <a href="#"
                               className="block py-2 px-4 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white">Delete</a>
                          </div>
                        </div>
                      </td>

                    </tr>
                  ))}
                  </tbody>
                </table>
              </div>
              <nav
                className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-3 md:space-y-0 p-4"
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
                        <path fill-rule="evenodd"
                              d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                              clip-rule="evenodd"/>
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
                        <path fill-rule="evenodd"
                              d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                              clip-rule="evenodd"/>
                      </svg>
                    </a>
                  </li>
                </ul>
              </nav>
              </table>
            </div>
            </div>
        </div>
        </section>
      </div>

    </>
  );
}
