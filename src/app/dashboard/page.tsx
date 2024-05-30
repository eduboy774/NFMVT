'use client';
import React, { useState } from 'react';
import Sidebar from '../ui/Sidebar';
import Statistics from './Component/Statistics';
import { HomeIcon, ChartBarIcon, DocumentTextIcon, PlusCircleIcon } from '@heroicons/react/24/outline';

export default function Dashboard() {
  const [activeItem, setActiveItem] = useState('Dashboard');

  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: <HomeIcon className="w-5 h-5" />, current: true },
    // { name: 'Upload', href: '/upload-case-file', icon: <PlayIcon className="w-5 h-5" />, current: false },
    { name: 'Statistics', href: '/general-statistics', icon: <ChartBarIcon className="w-5 h-5" />, current: false },
    // { name: 'Visuals', href: '/visuals', icon: <EyeIcon className="w-5 h-5" />, current: false },
    { name: 'Reports', href: '/report', icon: <DocumentTextIcon className="w-5 h-5" />, current: false },
    { name: 'Create New Case', href: '/', icon: <PlusCircleIcon className="w-5 h-5" />, current: false },
  ];
 
  

  return (
    <div className="flex min-h-screen">
      <Sidebar navigation={navigation} activeItem={activeItem} setActiveItem={setActiveItem} />
      
      <div className="flex-grow p-8 ml-64">
        <header className="bg-white shadow">
          <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
            <h1 className="text-3xl font-bold tracking-tight text-gray-900">Dashboard</h1>
          </div>
        </header>
        <main>
          <Statistics />
        </main>
      </div>
    </div>
  );
};

