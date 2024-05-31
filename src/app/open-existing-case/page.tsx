/* eslint-disable @next/next/no-img-element */
'use client';
import React, { useState } from 'react';
import Sidebar from '../ui/Sidebar';
import Cases from './Component/Cases';
import { HomeIcon, BellIcon, PlusCircleIcon, EyeIcon, DocumentTextIcon, ChartBarIcon } from '@heroicons/react/24/outline'

export default function OpenExistingCase() {
  const [activeItem, setActiveItem] = useState('Open Existing Case');
  const [refresh, setRefresh] = useState(false);

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
          href: '/network/ssdp-requests',
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
          href: '/network/arp-requests',
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
          name: 'HTTP Everything',
          href: '/network/http-everything',
          current: false,
          badgeCount: 15,
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

  // Function to trigger refresh
  const triggerRefresh = () => setRefresh(!refresh);

  return (
    <div className="flex min-h-screen">
      <Sidebar navigation={navigation} activeItem={activeItem} setActiveItem={setActiveItem} />
      <div className="flex-grow p-8 ml-64">
        <header className="bg-white shadow">
          <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
            <h1 className="text-3xl font-bold tracking-tight text-gray-900">Open Existing Case</h1>
          </div>
        </header>
        <main>
          <Cases refresh={refresh} triggerRefresh={triggerRefresh} />
        </main>
      </div>
    </div>
  );
};


