/* eslint-disable @next/next/no-img-element */
'use client';

import React, { useState } from 'react';
import { HomeIcon, EyeIcon, ChartBarIcon, DocumentTextIcon, PlusCircleIcon } from '@heroicons/react/24/outline';
import HttpHeadersTableDetails from './Component/HttpHeadersTableDetails';
import HttpHeadersDrawing from './Component/HttpHeadersDrawing';
import Sidebar from '../../ui/Sidebar';


const HTTPHeaders = () => {
  const [activeItem, setActiveItem] = useState('Statistics');
  const [getCaseUuid,setCaseUuid] = useState(null);
  const case_uuid = localStorage.getItem('caseUidFrmUploadCase');
 
  useEffect(() => {
    if (case_uuid) {
      setCaseUuid(case_uuid)
    }
  }, [case_uuid]);

  const navigation = [
    {
      name: 'Dashboard',
      href: '/dashboard',
      icon: <HomeIcon className="w-5 h-5" />,
      current: true,
    },
    {
      name: 'Statistics',
      href: '/general-statistics',
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
          name: 'HTTP Requests',
          href: '/network/http-requests',
          current: true,
          badgeCount: 9,
        },
        // {
        //   name: 'HTTP Everything',
        //   href: '/network/http-everything',
        //   current: false,
        //   badgeCount: 15,
        // },
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

  return (
    <div className="flex min-h-screen">
      <Sidebar navigation={navigation} activeItem={activeItem} setActiveItem={setActiveItem} />

      <div className="flex-grow p-8 ml-64">
        <header className="bg-white shadow">
          <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
            <h1 className="text-3xl font-bold tracking-tight text-gray-900">HTTP Headers</h1>
          </div>
        </header>
        <main>
          <div className='allTableDetailsHere'>
            { getCaseUuid && <HttpHeadersDrawing  case_uuid={getCaseUuid}/>}
          </div>
          <div className='allDrawingDetailsHere'>
            <HttpHeadersTableDetails case_uuid={getCaseUuid} />
          </div>
        </main>
      </div>
    </div>
  );
};

export default HTTPHeaders;
