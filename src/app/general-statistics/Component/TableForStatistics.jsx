/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import LoaderComponent from "../../component/Loader";
import enviroment from "@/componets/env";
import { FiBarChart2, FiInfo, FiUser, FiUsers, FiTag, FiCheckCircle, FiClock } from 'react-icons/fi';
import { format, parseISO } from 'date-fns';

// eslint-disable-next-line import/no-anonymous-default-export
export default function TableForStatics(props) {
  const [isLoading, setIsLoading] = useState(false);
  const [getGeneralStatistics, setGeneralStatistcs] = useState([])
  const endpoint = enviroment?.endpoint;
  const [getCaseUuid, setCaseUuid] = useState(localStorage.getItem('case_uuid') || null);
  const [activeTab, setActiveTab] = useState(0);

  const handleTabClick = (index) => {
    setActiveTab(index);
  };

  useEffect(() => {
    if (props.case_uuid) {
      setCaseUuid(props?.case_uuid);
      localStorage.setItem('case_uuid', props?.case_uuid);
    }
  }, [props.case_uuid]);

  // Fetch the task data from the API when the component is rendered
  useEffect(() => {
    setIsLoading(true);
    fetch(`${endpoint}/get-general-statistics?case_uuid=${getCaseUuid}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    }).then((res) => {
      res.json().then((data) => {
        setGeneralStatistcs(data)
        setIsLoading(false);
      });
    });
  }, []);

    const formatDate = (dateString) => {
    if (!dateString) return "";

    const date = parseISO(dateString);
    return format(date, "do MMMM yyyy");
  };

  console.log(getGeneralStatistics);

  if (isLoading) return LoaderComponent;

  return (
    <>
      <div className="container mx-auto py-10 px-4">
        <div className="w-full bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
          <ul className="text-sm font-medium text-center text-gray-500 divide-x divide-gray-200 rounded-lg sm:flex dark:divide-gray-600 dark:text-gray-400 rtl:divide-x-reverse" id="fullWidthTab" data-tabs-toggle="#fullWidthTabContent" role="tablist">
            <li className="w-full">
              <button
                id="stats-tab"
                data-tabs-target="#stats"
                type="button"
                role="tab"
                aria-controls="stats"
                aria-selected="true"
                className={`inline-block w-full p-4 rounded-ss-lg hover:bg-gray-400 focus:outline-none ${activeTab === 0 ? 'bg-gray-500 text-white dark:bg-gray-500' : 'bg-gray-50 dark:bg-gray-700 dark:hover:bg-gray-600'}`}
                onClick={() => handleTabClick(0)}
              >
                <FiInfo className="inline-block mr-2" />Case Details
              </button>
            </li>
            <li className="w-full">
              <button
                id="about-tab"
                data-tabs-target="#about"
                type="button"
                role="tab"
                aria-controls="about"
                aria-selected="false"
                className={`inline-block w-full p-4 hover:bg-gray-400 focus:outline-none ${activeTab === 1 ? 'bg-gray-500 text-white dark:bg-gray-500' : 'bg-gray-50 dark:bg-gray-700 dark:hover:bg-gray-600'}`}
                onClick={() => handleTabClick(1)}
              >
                <FiBarChart2 className="inline-block mr-2" />Statistics
              </button>
            </li>
          </ul>
          <div id="fullWidthTabContent" className="border-t border-gray-200 dark:border-gray-600">
            {activeTab === 0 && (
              <div className="p-4 bg-white rounded-lg md:p-8 dark:bg-gray-800" id="about" role="tabpanel" aria-labelledby="about-tab">
                <h2 className="mb-5 text-2xl font-extrabold tracking-tight text-gray-900 dark:text-white">{getGeneralStatistics[0]?.case_investigator_name}</h2>
                <ul role="list" className="space-y-4 text-gray-500 dark:text-gray-400">
                  <li className="flex space-x-2 rtl:space-x-reverse items-center">
                    <FiUser className="flex-shrink-0 w-4 h-4 text-blue-600 dark:text-blue-500" />
                    <span className="leading-tight">{getGeneralStatistics[0]?.case_investigator_organization}</span>
                  </li>
                  <li className="flex space-x-2 rtl:space-x-reverse items-center">
                    <FiTag className="flex-shrink-0 w-4 h-4 text-blue-600 dark:text-blue-500" />
                    <span className="leading-tight">{getGeneralStatistics[0]?.case_number}</span>
                  </li>
                  <li className="flex space-x-2 rtl:space-x-reverse items-center">
                    <FiCheckCircle className="flex-shrink-0 w-4 h-4 text-blue-600 dark:text-blue-500" />
                    <span className="leading-tight">{getGeneralStatistics[0]?.case_status}</span>
                  </li>
                  <li className="flex space-x-2 rtl:space-x-reverse items-center">
                    <FiClock className="flex-shrink-0 w-4 h-4 text-blue-600 dark:text-blue-500" />
                    <span className="leading-tight">{formatDate(getGeneralStatistics[0]?.created_at)}</span>
                  </li>
                </ul>
              </div>
            )}
            {activeTab === 1 && (
              <div className="p-4 bg-white rounded-lg md:p-8 dark:bg-gray-800" id="stats" role="tabpanel" aria-labelledby="stats-tab">
                <dl className="grid max-w-screen-xl grid-cols-2 gap-8 p-4 mx-auto text-gray-900 sm:grid-cols-3 xl:grid-cols-6 dark:text-white sm:p-8">
                  <div className="flex flex-col items-center justify-center">
                    <FiUsers className="mb-2 text-3xl text-blue-600 dark:text-blue-500" />
                    <dt className="mb-2 text-3xl font-extrabold">{getGeneralStatistics[0]?.no_of_connections}</dt>
                    <dd className="text-gray-500 dark:text-gray-400">Connections</dd>
                  </div>
                  <div className="flex flex-col items-center justify-center">
                    <FiTag className="mb-2 text-3xl text-blue-600 dark:text-blue-500" />
                    <dt className="mb-2 text-3xl font-extrabold">{getGeneralStatistics[0]?.no_of_dns_smb_ldap_servers}</dt>
                    <dd className="text-gray-500 dark:text-gray-400">DNS Servers</dd>
                  </div>
                  <div className="flex flex-col items-center justify-center">
                    <FiUser className="mb-2 text-3xl text-blue-600 dark:text-blue-500" />
                    <dt className="mb-2 text-3xl font-extrabold">{getGeneralStatistics[0]?.no_of_hosts}</dt>
                    <dd className="text-gray-500 dark:text-gray-400">Hosts</dd>
                  </div>
                  <div className="flex flex-col items-center justify-center">
                    <FiClock className="mb-2 text-3xl text-blue-600 dark:text-blue-500" />
                    <dt className="mb-2 text-3xl font-extrabold">{getGeneralStatistics[0]?.no_of_http_headers}</dt>
                    <dd className="text-gray-500 dark:text-gray-400">Http Headers</dd>
                  </div>
                  <div className="flex flex-col items-center justify-center">
                    <FiTag className="mb-2 text-3xl text-blue-600 dark:text-blue-500" />
                    <dt className="mb-2 text-3xl font-extrabold">{getGeneralStatistics[0]?.no_of_open_ports}</dt>
                    <dd className="text-gray-500 dark:text-gray-400">Open Ports</dd>
                  </div>
                  <div className="flex flex-col items-center justify-center">
                    <FiCheckCircle className="mb-2 text-3xl text-blue-600 dark:text-blue-500" />
                    <dt className="mb-2 text-3xl font-extrabold">{getGeneralStatistics[0]?.no_of_ssdp}</dt>
                    <dd className="text-gray-500 dark:text-gray-400">SSDP</dd>
                  </div>
                </dl>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  )
}
