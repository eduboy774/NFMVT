/* eslint-disable @next/next/no-img-element */
'use client';
import React, { useState } from 'react';
import Sidebar from '../ui/Sidebar';
import { HomeIcon, PlayIcon, ChartBarIcon, EyeIcon, DocumentTextIcon, PlusCircleIcon } from '@heroicons/react/24/outline';
import { ToastContainer } from "react-toastify";
import TableForUploaded from './Component/TableForUploaded';
import UploadFile from './Component/UploadFile';


export default function Upload() {
  const [activeItem, setActiveItem] = useState('Upload');

  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: <HomeIcon className="w-5 h-5" />, current: false },
    { name: 'Upload', href: '/upload-case-file', icon: <PlayIcon className="w-5 h-5" />, current: true },
    { name: 'Statistics', href: '/statistics', icon: <ChartBarIcon className="w-5 h-5" />, current: false },
    { name: 'Visuals', href: '/visuals', icon: <EyeIcon className="w-5 h-5" />, current: false },
    { name: 'Reports', href: '/report', icon: <DocumentTextIcon className="w-5 h-5" />, current: false },
    { name: 'Create New Case', href: '/', icon: <PlusCircleIcon className="w-5 h-5" />, current: false },
  ];

  return (
    <>
      <ToastContainer />
      <div className="min-h-full">
        <Sidebar navigation={navigation} activeItem={activeItem} setActiveItem={setActiveItem} />

        <div className="flex-grow p-8 ml-64">
          <header className="bg-white shadow">
            <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
              <h1 className="text-3xl font-bold tracking-tight text-gray-900">Upload File</h1>
            </div>
          </header>
          <main>
            <div className='flex items-center justify-center py-10 px-10'>
              <div className='w-full flex flex-row'>
                <div className='w-6/12 py-11 px-11'>
                  <UploadFile />
                </div>
                <div className='w-6/12 mt-8'>
                  <TableForUploaded />
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </>
  );
}
