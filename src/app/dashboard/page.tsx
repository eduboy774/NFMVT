/* eslint-disable @next/next/no-img-element */
'use client'

import { Fragment } from 'react'
import { Disclosure, Menu, Transition } from '@headlessui/react'
import { Bars3Icon, BellIcon, XMarkIcon } from '@heroicons/react/24/outline'
import Statistics from './Component/Statistics';

const user = {
  name: 'Tom Cook',
}

const navigation = [
  { name: 'Dashboard', href: '/dashboard', current: true },
  { name: 'Upload', href: 'uploadfile', current: false },
  { name: 'Statistics', href: '/statistics', current: false },
  { name: 'Visuals', href: '/visuals', current: false },
  { name: 'Reports', href: '/report', current: false },
  { name: 'Create New Case', href: '/', current: false },
]

const userNavigation = [
  { name: 'Your Profile', href: '#' },
]

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ')
}

export default function Dashboard() {
  return (
    <div className="flex min-h-screen">
      <Disclosure as="nav" className="bg-gray-800 w-64 flex-shrink-0">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <img
                  className="h-8 w-8"
                  src="./visual.png"
                  alt="Your Company"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="mt-4">
          <div className="ml-2 space-y-1">
            {navigation.map((item) => (
              <a
                key={item.name}
                href={item.href}
                className={classNames(
                  item.current
                    ? 'bg-gray-900 text-white'
                    : 'text-gray-300 hover:bg-gray-700 hover:text-white',
                  'block rounded-md px-3 py-2 text-sm font-medium'
                )}
                aria-current={item.current ? 'page' : undefined}
              >
                {item.name}
              </a>
            ))}
          </div>
        </div>
      </Disclosure>

      <div className="flex-grow p-8">
        <header className="bg-white shadow">
          <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
            <h1 className="text-3xl font-bold tracking-tight text-gray-900">Dashboard</h1>
          </div>
        </header>
        <main>
          <Statistics/>
        </main>
      </div>
    </div>
  )
}
