/* eslint-disable @next/next/no-img-element */
'use client';

import React, { useState } from 'react';
import Sidebar from '../ui/Sidebar';
import { HomeIcon, PlayIcon, ChartBarIcon, EyeIcon, DocumentTextIcon, PlusCircleIcon } from '@heroicons/react/24/outline';
import StatisticsContent from './Component/StatisticsContent';

const Statistics = () => {
  const [activeItem, setActiveItem] = useState('Statistics');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: <HomeIcon className="w-5 h-5" />, current: false },
    { name: 'Upload', href: '/upload-case-file', icon: <PlayIcon className="w-5 h-5" />, current: false },
    { name: 'Statistics', href: '/statistics', icon: <ChartBarIcon className="w-5 h-5" />, current: true },
    { name: 'Visuals', href: '/visuals', icon: <EyeIcon className="w-5 h-5" />, current: false },
    { name: 'Reports', href: '/report', icon: <DocumentTextIcon className="w-5 h-5" />, current: false },
    { name: 'Create New Case', href: '/', icon: <PlusCircleIcon className="w-5 h-5" />, current: false },
  ];

  return (
    <div className="flex min-h-screen">
      <Sidebar navigation={navigation} activeItem={activeItem} setActiveItem={setActiveItem} />
      {/*<Sidebar navigation={navigation} activeItem={activeItem} setActiveItem={setActiveItem} isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} />*/}
      <div className={`flex-grow p-8 ml-0 md:ml-64 transition-all duration-500 ${isSidebarOpen ? '' : 'md:ml-0'}`}>
        <header className="bg-white shadow mb-3 md:hidden">
          <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
            <h1 className="text-3xl font-bold tracking-tight text-gray-900">Statistics</h1>
          </div>
        </header>
        <main>
          <StatisticsContent />
        </main>
      </div>
    </div>
  );
};

export default Statistics;
