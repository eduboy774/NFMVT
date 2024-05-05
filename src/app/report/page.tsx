/* eslint-disable @next/next/no-img-element */
'use client'

import React, { useState} from 'react'
import Sidebar from '../ui/Sidebar';
import { HomeIcon, PlayIcon, ChartBarIcon, EyeIcon, DocumentTextIcon, PlusCircleIcon } from '@heroicons/react/24/outline';

export default function Reports() {
  const [activeItem, setActiveItem] = useState('Reports');

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
            <div className="flex flex-wrap justify-center">
              <h1>Generate Reports Here..</h1>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
