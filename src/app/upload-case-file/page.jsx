/* eslint-disable @next/next/no-img-element */
'use client'
import React,{useState,useEffect} from 'react'
import Sidebar from '../ui/Sidebar';
import { HomeIcon, DocumentTextIcon, PlusCircleIcon } from '@heroicons/react/24/outline';
import UploadFile from './Component/UploadFile'
import {ToastContainer} from "react-toastify";
import { useRouter } from "next/navigation";

export default function Upload() {
  const [activeItem, setActiveItem] = useState('Upload');
  const [getCaseUuid,setCaseUuid] = useState(null)


  const router = useRouter();
  // Get the case_uuid query parameter from the URL, or use a default value
  const case_uuid = router.query?.case_uuid ?? 'default-value';


  useEffect( ()=>{ 
    setCaseUuid(case_uuid)
  },[case_uuid]
  );



  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: <HomeIcon className="w-5 h-5" />, current: false },
    { name: 'Reports', href: '/report', icon: <DocumentTextIcon className="w-5 h-5" />, current: false },
    { name: 'Create New Case', href: '/', icon: <PlusCircleIcon className="w-5 h-5" />, current: false },
  ];
  
  return (
    <>
      <ToastContainer/>
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
                  <UploadFile  case_uuid={getCaseUuid}/>
                </div>
                <div className='w-6/12 mt-8'>
                  {/*<TableForUploaded/>*/}
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </>
  )
}
