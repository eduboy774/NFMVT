'use client';
import React, { useState } from 'react';
import { HomeIcon, EyeIcon, ChartBarIcon, DocumentTextIcon, PlusCircleIcon } from '@heroicons/react/24/outline';
import SsdpTableDetails from './Component/SsdpTableDetails';
import SsdpDrawing from './Component/SsdpDrawing';
import Sidebar from '../../ui/Sidebar';

const GeneralStatistics = () => {
  const [activeItem, setActiveItem] = useState('Statistics');

  const navigation = [
    {
      name: 'Dashboard',
      href: '/dashboard',
      icon: <HomeIcon className="w-5 h-5" />,
      current: true,
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
          badgeCount: 5,  // Example badge count
        },
        {
          name: 'Hosts',
          href: '/hosts',
          current: false,
          badgeCount: 12,  // Example badge count
        },
        {
          name: 'ARP',
          href: '/arp-requests',
          current: false,
          badgeCount: 3,  // Example badge count
        },
        {
          name: 'DNS Servers',
          href: '/dns-servers',
          current: false,
          badgeCount: 7,  // Example badge count
        },
        {
          name: 'HTTP Headers',
          href: '/http-headers',
          current: false,
          badgeCount: 9,  // Example badge count
        },
        {
          name: 'HTTP Everything',
          href: '/http-everything',
          current: false,
          badgeCount: 15,  // Example badge count
        },
        {
          name: 'Open Ports',
          href: '/open-ports',
          current: false,
          badgeCount: 8,  // Example badge count
        },
        {
          name: 'Connections',
          href: '/connections',
          current: false,
          badgeCount: 11,  // Example badge count
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
            <SsdpDrawing/>
          </div>
          <div className='allDrawingDetailsHere'>
            <SsdpTableDetails />
          </div>

        </main>
      </div>
    </div>
  );
};

export default GeneralStatistics;

