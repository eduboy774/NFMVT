/* eslint-disable @next/next/no-img-element */
'use client';

import React, { useState } from 'react';
import Sidebar from '../ui/Sidebar';
import { HomeIcon,EyeIcon,PlayIcon, ChartBarIcon, DocumentTextIcon, PlusCircleIcon } from '@heroicons/react/24/outline';

const Statistics = () => {
  const [activeItem, setActiveItem] = useState('Statistics');

  const navigation = [
    {
      name: 'Dashboard',
      href: '/dashboard',
      icon: <HomeIcon className="w-5 h-5" />,
      current: true,
    },
    {
      name: 'Upload',
      href: '/upload-case-file',
      icon: <PlayIcon className="w-5 h-5" />,
      current: false,
    },
    {
      name: 'General Statistics',
      href: '/general-statistics',
      icon: <ChartBarIcon className="w-5 h-5" />,
      current: false,
      items: [
        {
          name: 'Ssdp',
          href: '/ssdp-statistics',
          current: false,
        },
        {
          name: 'Hosts',
          href: '/statistics/submenu2',
          current: false,
        },
      ],
    },
    {
      name: 'Visuals',
      href: '/visuals',
      icon: <EyeIcon className="w-5 h-5" />,
      current: false,
    },
    {
      name: 'Reports',
      href: '/report',
      icon: <DocumentTextIcon className="w-5 h-5" />,
      current: false,
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
            <h1 className="text-3xl font-bold tracking-tight text-gray-900">Statistics</h1>
          </div>
        </header>
        <main>
       <div className='allTableDetailsHere'>
      
        </div> 
          
        </main>
      </div>
    </div>
  );
};

export default Statistics;
