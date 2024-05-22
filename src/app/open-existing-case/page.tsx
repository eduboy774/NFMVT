/* eslint-disable @next/next/no-img-element */
'use client';
import React, { useState } from 'react';
import Sidebar from '../ui/Sidebar';
import Cases from './Component/Cases';
import { HomeIcon, BellIcon, PlusCircleIcon, EyeIcon, DocumentTextIcon, ChartBarIcon } from '@heroicons/react/24/outline'

export default function OpenExistingCase() {
  const [activeItem, setActiveItem] = useState('Open Existing Case');

  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: <HomeIcon className="w-5 h-5" />, current: false },
    // { name: 'Upload', href: '/upload-case-file', icon: <BellIcon className="w-5 h-5" />, current: false },
    // { name: 'Statistics', href: '/statistics', icon: <ChartBarIcon className="w-5 h-5" />, current: false },
    // { name: 'Visuals', href: '/visuals', icon: <EyeIcon className="w-5 h-5" />, current: false },
    { name: 'Reports', href: '/report', icon: <DocumentTextIcon className="w-5 h-5" />, current: false },
    { name: 'Create New Case', href: '/', icon: <PlusCircleIcon className="w-5 h-5" />, current: false },
    { name: 'Open Existing Case', href: '/open-existing-case', icon: <PlusCircleIcon className="w-5 h-5" />, current: true },
  ];

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
          <Cases />
        </main>
      </div>
    </div>
  );
};


