/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import LoaderComponent from "../../component/Loader";
import enviroment from "@/componets/env";

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
  },
    []
  )

  console.log({ getGeneralStatistics });

  if (isLoading) return LoaderComponent

  return (
    <>
      <div className="container mx-auto py-10 px-4">
        <div class="w-full bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
          <ul class="text-sm font-medium text-center text-gray-500 divide-x divide-gray-200 rounded-lg sm:flex dark:divide-gray-600 dark:text-gray-400 rtl:divide-x-reverse" id="fullWidthTab" data-tabs-toggle="#fullWidthTabContent" role="tablist">
            <li class="w-full">
              <button id="stats-tab" data-tabs-target="#stats" type="button" role="tab" aria-controls="stats" aria-selected="true" class="inline-block w-full p-4 rounded-ss-lg bg-gray-50 hover:bg-gray-100 focus:outline-none dark:bg-gray-700 dark:hover:bg-gray-600" onClick={() => handleTabClick(0)}>Statistics</button>
            </li>
            <li class="w-full">
              <button id="about-tab" data-tabs-target="#about" type="button" role="tab" aria-controls="about" aria-selected="false" class="inline-block w-full p-4 bg-gray-50 hover:bg-gray-100 focus:outline-none dark:bg-gray-700 dark:hover:bg-gray-600" onClick={() => handleTabClick(1)}>Case Details</button>
            </li>
          </ul>
          <div id="fullWidthTabContent" class="border-t border-gray-200 dark:border-gray-600">
            {activeTab === 0 && (<div class="p-4 bg-white rounded-lg md:p-8 dark:bg-gray-800" id="stats" role="tabpanel" aria-labelledby="stats-tab">
              <dl class="grid max-w-screen-xl grid-cols-2 gap-8 p-4 mx-auto text-gray-900 sm:grid-cols-3 xl:grid-cols-6 dark:text-white sm:p-8">
                <div class="flex flex-col items-center justify-center">
                  <dt class="mb-2 text-3xl font-extrabold">{getGeneralStatistics[0]?.no_of_connections}</dt>
                  <dd class="text-gray-500 dark:text-gray-400">Connections</dd>
                </div>
                <div class="flex flex-col items-center justify-center">
                  <dt class="mb-2 text-3xl font-extrabold">{getGeneralStatistics[0]?.no_of_dns_smb_ldap_servers}</dt>
                  <dd class="text-gray-500 dark:text-gray-400">Dns Ldap Servers</dd>
                </div>
                <div class="flex flex-col items-center justify-center">
                  <dt class="mb-2 text-3xl font-extrabold">{getGeneralStatistics[0]?.no_of_hosts}</dt>
                  <dd class="text-gray-500 dark:text-gray-400">Hosts</dd>
                </div>
                <div class="flex flex-col items-center justify-center">
                  <dt class="mb-2 text-3xl font-extrabold">{getGeneralStatistics[0]?.no_of_http_headers}</dt>
                  <dd class="text-gray-500 dark:text-gray-400">Http Headers</dd>
                </div>
                <div class="flex flex-col items-center justify-center">
                  <dt class="mb-2 text-3xl font-extrabold">{getGeneralStatistics[0]?.no_of_open_ports}</dt>
                  <dd class="text-gray-500 dark:text-gray-400">Open Ports</dd>
                </div>
                <div class="flex flex-col items-center justify-center">
                  <dt class="mb-2 text-3xl font-extrabold">{getGeneralStatistics[0]?.no_of_ssdp}</dt>
                  <dd class="text-gray-500 dark:text-gray-400">Ssdp</dd>
                </div>
              </dl>
            </div>)}
            {activeTab === 1 && (<><div class="p-4 bg-white rounded-lg md:p-8 dark:bg-gray-800" id="about" role="tabpanel" aria-labelledby="about-tab">
              <h2 class="mb-5 text-2xl font-extrabold tracking-tight text-gray-900 dark:text-white">{getGeneralStatistics[0]?.case_investigator_name}</h2>
              <ul role="list" class="space-y-4 text-gray-500 dark:text-gray-400">
                <li class="flex space-x-2 rtl:space-x-reverse items-center">
                  <svg class="flex-shrink-0 w-3.5 h-3.5 text-blue-600 dark:text-blue-500" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5Zm3.707 8.207-4 4a1 1 0 0 1-1.414 0l-2-2a1 1 0 0 1 1.414-1.414L9 10.586l3.293-3.293a1 1 0 0 1 1.414 1.414Z" />
                  </svg>
                  <span class="leading-tight">{getGeneralStatistics[0]?.case_investigator_organization}</span>
                </li>
                <li class="flex space-x-2 rtl:space-x-reverse items-center">
                  <svg class="flex-shrink-0 w-3.5 h-3.5 text-blue-600 dark:text-blue-500" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5Zm3.707 8.207-4 4a1 1 0 0 1-1.414 0l-2-2a1 1 0 0 1 1.414-1.414L9 10.586l3.293-3.293a1 1 0 0 1 1.414 1.414Z" />
                  </svg>
                  <span class="leading-tight">{getGeneralStatistics[0]?.case_number}</span>
                </li>
                <li class="flex space-x-2 rtl:space-x-reverse items-center">
                  <svg class="flex-shrink-0 w-3.5 h-3.5 text-blue-600 dark:text-blue-500" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5Zm3.707 8.207-4 4a1 1 0 0 1-1.414 0l-2-2a1 1 0 0 1 1.414-1.414L9 10.586l3.293-3.293a1 1 0 0 1 1.414 1.414Z" />
                  </svg>
                  <span class="leading-tight">{getGeneralStatistics[0]?.case_status}</span>
                </li>
                <li class="flex space-x-2 rtl:space-x-reverse items-center">
                  <svg class="flex-shrink-0 w-3.5 h-3.5 text-blue-600 dark:text-blue-500" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5Zm3.707 8.207-4 4a1 1 0 0 1-1.414 0l-2-2a1 1 0 0 1 1.414-1.414L9 10.586l3.293-3.293a1 1 0 0 1 1.414 1.414Z" />
                  </svg>
                  <span class="leading-tight">{getGeneralStatistics[0]?.created_at}</span>
                </li>
              </ul>
            </div>
            </>)}
          </div>
        </div>
      </div>
    </>
  )
}
