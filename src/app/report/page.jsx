'use client';

import React, { useState, useEffect } from 'react';
import Sidebar from '../ui/Sidebar';
import { HomeIcon, DocumentTextIcon, PlusCircleIcon, ChartBarIcon, EyeIcon } from '@heroicons/react/24/outline';
import enviroment from '@/componets/env';

export default function Reports() {
  const [activeItem, setActiveItem] = useState('Reports');
  const [generating, setGenerating] = useState({});
  const [filters, setFilters] = useState({
    caseStatus: '',
    investigatorName: '',
  });
  const [cases, setCases] = useState([]);
  const endpoint = enviroment?.endpoint;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/get-case-report');
        const data = await response.json();
        setCases(data);
      } catch (error) {
        console.error('Error fetching cases:', error);
      }
    };
    fetchData();
  }, []);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prevFilters) => ({
      ...prevFilters,
      [name]: value,
    }));
  };

  const handleGenerateReport = async (caseId) => {
    setGenerating((prev) => ({ ...prev, [caseId]: true }));

    try {
      const response = await fetch(`/api/simple-report?caseId=${caseId}`); // Pass the case ID as a query parameter

      if (!response.ok) {
        throw new Error('Failed to fetch data');
      }

      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `case_report_${caseId}.pdf`;
      link.click();
    } catch (error) {
      console.error('Error:', error);
      alert('An error occurred while generating the report.');
    } finally {
      setGenerating((prev) => ({ ...prev, [caseId]: false }));
    }
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric', hour12: true };
    return new Date(dateString).toLocaleString('en-US', options);
  };

  const filteredCases = filters.caseStatus
    ? cases.filter((caseData) => caseData.case_status === filters.caseStatus)
    : [];

  const navigation = [
    {
      name: 'Dashboard',
      href: '/dashboard',
      icon: <HomeIcon className="w-5 h-5" />,
      current: false,
    },
    {
      name: 'Statistics',
      href: '/statistics',
      icon: <ChartBarIcon className="w-5 h-5" />,
      current: false,
      items: [
        {
          name: 'SSDP',
          href: '/network/ssdp-statistics',
          current: false,
          badgeCount: 5,
        },
        {
          name: 'Hosts',
          href: '/network/hosts',
          current: false,
          badgeCount: 12,
        },
        {
          name: 'ARP',
          href: '/network/arp',
          current: false,
          badgeCount: 3,
        },
        {
          name: 'DNS Servers',
          href: '/network/dns-servers',
          current: false,
          badgeCount: 7,
        },
        {
          name: 'HTTP Headers',
          href: '/network/http-headers',
          current: false,
          badgeCount: 9,
        },
        {
          name: 'Open Ports',
          href: '/network/open-ports',
          current: false,
          badgeCount: 8,
        },
        {
          name: 'Connections',
          href: '/network/connections',
          current: false,
          badgeCount: 11,
        },
      ],
    },
    {
      name: 'Reports',
      href: '/report',
      icon: <DocumentTextIcon className="w-5 h-5" />,
      current: true,
    },
    {
      name: 'Create New Case',
      href: '/',
      icon: <PlusCircleIcon className="w-5 h-5" />,
      current: false,
    },
  ];

  return (
    <div className="flex min-h-screen">
      <Sidebar navigation={navigation} activeItem={activeItem} setActiveItem={setActiveItem} />
      <div className="flex-grow p-8 ml-64">
        <header className="bg-white shadow">
          <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
            <h1 className="text-3xl font-bold tracking-tight text-gray-900">Generate Report</h1>
          </div>
        </header>
        <main>
          <div className="container mx-auto py-10 px-4">
            <div className="flex">
              <div className="flex w-8/12">
                <select
                  className="block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                  name="caseStatus"
                  value={filters.caseStatus}
                  onChange={handleFilterChange}
                >
                  <option value="" disabled>
                    Select Case Status
                  </option>
                  <option value="Active">Active</option>
                  <option value="Closed">Closed</option>
                </select>
              </div>
            </div>

            {filters.caseStatus && filteredCases.length > 0 ? (
              <table className="min-w-full divide-y divide-gray-200 mt-4">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Case Number</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Investigator Name</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Case Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created At</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredCases.map((caseData, index) => (
                    <tr key={index} className="hover:bg-gray-50 cursor-pointer">
                      <td className="px-6 py-4 whitespace-nowrap">{caseData.case_number}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{caseData.case_investigator_name}</td>
                      <td className="px-4 py-3">
                        <span className={`inline-block px-2 py-1 rounded-full ${caseData.case_status === 'Active' ? 'bg-green-400 text-white' : 'bg-red-500 text-white'}`}>
                          {caseData.case_status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">{formatDate(caseData.created_at)}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <button
                          className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-primary-700 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                          onClick={() => handleGenerateReport(caseData.case_number)}
                          disabled={generating[caseData.case_number]}
                        >
                          {generating[caseData.case_number] ? 'Generating...' : 'Generate'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p className="text-center items-center text-gray-500">
                {filters.caseStatus === 'Active' ? 'No active cases available.' : filters.caseStatus === 'Closed' ? 'No closed cases available.' : 'Please select a case status to view data.'}
              </p>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
