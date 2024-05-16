"use client";

import React, { useState, useEffect } from 'react';
import Sidebar from '../ui/Sidebar';
import { HomeIcon, PlayIcon, ChartBarIcon, EyeIcon, DocumentTextIcon, PlusCircleIcon } from '@heroicons/react/24/outline';

export default function Reports() {
  const [activeItem, setActiveItem] = useState('Reports');
  const [filters, setFilters] = useState({
    caseStatus: '',
    investigatorName: '',
  });
  const [selectedCase, setSelectedCase] = useState(null);
  const [cases, setCases] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/get-case');
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

  const handleGenerateReport = () => {
    console.log('Generating report with filters:', filters);
  };

  const handleCaseSelect = (caseData) => {
    setSelectedCase(caseData);
    console.log('Selected case:', caseData);
  };

  const filteredCases = filters.caseStatus
    ? cases.filter((caseData) => caseData.case_status === filters.caseStatus)
    : cases;

  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: <HomeIcon className="w-5 h-5" />, current: false },
    { name: 'Upload', href: '/upload-case-file', icon: <PlayIcon className="w-5 h-5" />, current: false },
    { name: 'Statistics', href: '/statistics', icon: <ChartBarIcon className="w-5 h-5" />, current: false },
    { name: 'Visuals', href: '/visuals', icon: <EyeIcon className="w-5 h-5" />, current: false },
    { name: 'Reports', href: '/report', icon: <DocumentTextIcon className="w-5 h-5" />, current: true },
    { name: 'Create New Case', href: '/', icon: <PlusCircleIcon className="w-5 h-5" />, current: false },
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
            <div className="flex flex-wrap justify-center mb-8">
              <select
                className="block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                name="caseStatus"
                value={filters.caseStatus}
                onChange={handleFilterChange}
              >
                <option value="">All Status</option>
                <option value="Active">Active</option>
                <option value="Closed">Closed</option>
              </select>
            </div>

            {filteredCases.length > 0 ? (
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Case Number</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Investigator Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Case Status</th>
                </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                {filteredCases.map((caseData, index) => (
                  <tr key={index} className="hover:bg-gray-50 cursor-pointer" onClick={() => handleCaseSelect(caseData)}>
                    <td className="px-6 py-4 whitespace-nowrap">{caseData.case_number}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{caseData.case_investigator_name}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{caseData.case_status}</td>
                  </tr>
                ))}
                </tbody>
              </table>
            ) : (
              <p className="text-center text-gray-500">No data available for the selected status.</p>
            )}

            <div className="flex justify-center mt-8">
              <button
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-primary-700 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                onClick={handleGenerateReport}
              >
                Generate Report
              </button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
