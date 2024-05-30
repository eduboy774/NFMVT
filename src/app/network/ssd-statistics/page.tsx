'use client';
import React, { useState } from 'react';
import Sidebar from '../../../ui/Sidebar';
import { HomeIcon, EyeIcon, ChartBarIcon, DocumentTextIcon, PlusCircleIcon } from '@heroicons/react/24/outline';
import SsdpTableDetails from './Component/SsdpTableDetails';
import SsdpDrawing from './Component/SsdpDrawing';

const Statistics = () => {
  const [activeItem, setActiveItem] = useState('Statistics');
  const [isStatisticsOpen, setIsStatisticsOpen] = useState(false);

  const navigation = [
    {
      name: 'Dashboard',
      href: '/dashboard',
      icon: <HomeIcon className="w-5 h-5" />,
      current: activeItem === 'Dashboard',
    },
    {
      name: 'Statistics',
      href: '/general-statistics',
      icon: <ChartBarIcon className="w-5 h-5" />,
      current: activeItem === 'Statistics',
      isOpen: isStatisticsOpen,
      toggleOpen: () => setIsStatisticsOpen(!isStatisticsOpen),
      items: [
        {
          name: 'SSDP',
          href: '/ssdp-requests',
          current: activeItem === 'SSDP',
        },
        {
          name: 'Hosts',
          href: '/hosts',
          current: activeItem === 'Hosts',
        },
        {
          name: 'ARP',
          href: '/arp-requests',
          current: activeItem === 'ARP',
        },
        {
          name: 'DNS Servers',
          href: '/dns-servers',
          current: activeItem === 'DNS Servers',
        },
        {
          name: 'HTTP Headers',
          href: '/http-headers',
          current: activeItem === 'HTTP Headers',
        },
        {
          name: 'HTTP Everything',
          href: '/http-everything',
          current: activeItem === 'HTTP Everything',
        },
        {
          name: 'Open Ports',
          href: '/open-ports',
          current: activeItem === 'Open Ports',
        },
        {
          name: 'Connections',
          href: '/connections',
          current: activeItem === 'Connections',
        },
      ],
    },
    {
      name: 'Visuals',
      href: '/visuals',
      icon: <EyeIcon className="w-5 h-5" />,
      current: activeItem === 'Visuals',
    },
    {
      name: 'Reports',
      href: '/report',
      icon: <DocumentTextIcon className="w-5 h-5" />,
      current: activeItem === 'Reports',
    },
    {
      name: 'Create New Case',
      href: '/',
      icon: <PlusCircleIcon className="w-5 h-5" />,
      current: activeItem === 'Create New Case',
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
            <SsdpDrawing />
          </div>
          <div className='allDrawingDetailsHere'>
            <SsdpTableDetails />
          </div>
        </main>
      </div>
    </div>
  );
};

export default Statistics;
