/* eslint-disable @next/next/no-img-element */
'use client'

import { Fragment } from 'react'
import { Disclosure, Menu, Transition } from '@headlessui/react'
import { Bars3Icon, BellIcon, XMarkIcon } from '@heroicons/react/24/outline'
import Chart from 'react-apexcharts';

const user = {
  name: 'Tom Cook',
  email: 'tom@example.com',
  imageUrl:
    'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
}

const navigation = [
  { name: 'Dashboard', href: '/dashboard', current: true },
  { name: 'Upload', href: '/uploadfile', current: false },
  { name: 'Statistics', href: '/statistics', current: false },
  { name: 'Visuals', href: '/visuals', current: false },
  { name: 'Report', href: '/report', current: false },
]

const userNavigation = [
  { name: 'Your Profile', href: '#' },
  { name: 'Settings', href: '#' },
  { name: 'Sign out', href: '#' },
]

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ')
}

export default function Dashboard() {
  return (
    <>
      <div className="min-h-full">
        <Disclosure as="nav" className="bg-gray-800">
          {({ open }) => (
            <>
              <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="flex h-16 items-center justify-between">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <img
                        className="h-8 w-8"
                        src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=500"
                        alt="Your Company"
                      />
                    </div>
                    <div className="hidden md:block">
                      <div className="ml-10 flex items-baseline space-x-4">
                        {navigation.map((item) => (
                          <a
                            key={item.name}
                            href={item.href}
                            className={classNames(
                              item.current
                                ? 'bg-gray-900 text-white'
                                : 'text-gray-300 hover:bg-gray-700 hover:text-white',
                              'rounded-md px-3 py-2 text-sm font-medium'
                            )}
                            aria-current={item.current ? 'page' : undefined}
                          >
                            {item.name}
                          </a>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="hidden md:block">
                    <div className="ml-4 flex items-center md:ml-6">
                      <button
                        type="button"
                        className="rounded-full bg-gray-800 p-1 text-gray-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800"
                      >
                        <span className="sr-only">View notifications</span>
                        <BellIcon className="h-6 w-6" aria-hidden="true" />
                      </button>

                      {/* Profile dropdown */}
                      <Menu as="div" className="relative ml-3">
                        <div>
                          <Menu.Button className="flex max-w-xs items-center rounded-full bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800">
                            <span className="sr-only">Open user menu</span>
                            <img className="h-8 w-8 rounded-full" src={user.imageUrl} alt="" />
                          </Menu.Button>
                        </div>
                        <Transition
                          as={Fragment}
                          enter="transition ease-out duration-100"
                          enterFrom="transform opacity-0 scale-95"
                          enterTo="transform opacity-100 scale-100"
                          leave="transition ease-in duration-75"
                          leaveFrom="transform opacity-100 scale-100"
                          leaveTo="transform opacity-0 scale-95"
                        >
                          <Menu.Items className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                            {userNavigation.map((item) => (
                              <Menu.Item key={item.name}>
                                {({ active }) => (
                                  <a
                                    href={item.href}
                                    className={classNames(
                                      active ? 'bg-gray-100' : '',
                                      'block px-4 py-2 text-sm text-gray-700'
                                    )}
                                  >
                                    {item.name}
                                  </a>
                                )}
                              </Menu.Item>
                            ))}
                          </Menu.Items>
                        </Transition>
                      </Menu>
                    </div>
                  </div>
                  <div className="-mr-2 flex md:hidden">
                    {/* Mobile menu button */}
                    <Disclosure.Button className="inline-flex items-center justify-center rounded-md bg-gray-800 p-2 text-gray-400 hover:bg-gray-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800">
                      <span className="sr-only">Open main menu</span>
                      {open ? (
                        <XMarkIcon className="block h-6 w-6" aria-hidden="true" />
                      ) : (
                        <Bars3Icon className="block h-6 w-6" aria-hidden="true" />
                      )}
                    </Disclosure.Button>
                  </div>
                </div>
              </div>

              <Disclosure.Panel className="md:hidden">
                <div className="space-y-1 px-2 pb-3 pt-2 sm:px-3">
                  {navigation.map((item) => (
                    <Disclosure.Button
                      key={item.name}
                      as="a"
                      href={item.href}
                      className={classNames(
                        item.current ? 'bg-gray-900 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white',
                        'block rounded-md px-3 py-2 text-base font-medium'
                      )}
                      aria-current={item.current ? 'page' : undefined}
                    >
                      {item.name}
                    </Disclosure.Button>
                  ))}
                </div>
                <div className="border-t border-gray-700 pb-3 pt-4">
                  <div className="flex items-center px-5">
                    <div className="flex-shrink-0">
                      <img className="h-10 w-10 rounded-full" src={user.imageUrl} alt="" />
                    </div>
                    <div className="ml-3">
                      <div className="text-base font-medium leading-none text-white">{user.name}</div>
                      <div className="text-sm font-medium leading-none text-gray-400">{user.email}</div>
                    </div>
                    <button
                      type="button"
                      className="ml-auto flex-shrink-0 rounded-full bg-gray-800 p-1 text-gray-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800"
                    >
                      <span className="sr-only">View notifications</span>
                      <BellIcon className="h-6 w-6" aria-hidden="true" />
                    </button>
                  </div>
                  <div className="mt-3 space-y-1 px-2">
                    {userNavigation.map((item) => (
                      <Disclosure.Button
                        key={item.name}
                        as="a"
                        href={item.href}
                        className="block rounded-md px-3 py-2 text-base font-medium text-gray-400 hover:bg-gray-700 hover:text-white"
                      >
                        {item.name}
                      </Disclosure.Button>
                    ))}
                  </div>
                </div>
              </Disclosure.Panel>
            </>
          )}
        </Disclosure>

        <header className="bg-white shadow">
          <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
            <h1 className="text-3xl font-bold tracking-tight text-gray-900">Statistics</h1>
          </div>
        </header>
        <main>
          <div className="container mx-auto py-10 px-4">
            <div className="flex flex-wrap justify-center">
              {/*  TABLE HERE */}
              <div className="bg-white dark:bg-blue-800 relative shadow-md sm:rounded-lg overflow-hidden">
                <div
                  className="flex flex-col md:flex-row items-center justify-between space-y-3 md:space-y-0 md:space-x-4 p-4">
                  <div className="w-full md:w-1/2">
                    <form className="flex items-center">
                      <label htmlFor="simple-search" className="sr-only">Search</label>
                      <div className="relative w-full">
                        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                          <svg aria-hidden="true" className="w-5 h-5 text-gray-500 dark:text-gray-400"
                               fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                            <path fill-rule="evenodd"
                                  d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                                  clip-rule="evenodd"/>
                          </svg>
                        </div>
                        <input type="text" id="simple-search"
                               className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full pl-10 p-2 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                               placeholder="Search"/>
                      </div>
                    </form>
                  </div>
                  <div
                    className="w-full md:w-auto flex flex-col md:flex-row space-y-2 md:space-y-0 items-stretch md:items-center justify-end md:space-x-3 flex-shrink-0">
                    <button type="button"
                            className="flex items-center justify-center text-white bg-primary-700 hover:bg-primary-800 focus:ring-4 focus:ring-primary-300 font-medium rounded-lg text-sm px-4 py-2 dark:bg-primary-600 dark:hover:bg-primary-700 focus:outline-none dark:focus:ring-primary-800">
                      <svg className="h-3.5 w-3.5 mr-2" fill="currentColor" viewBox="0 0 20 20"
                           xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                        <path clip-rule="evenodd" fill-rule="evenodd"
                              d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"/>
                      </svg>
                      Add product
                    </button>
                    <div className="flex items-center space-x-3 w-full md:w-auto">
                      <button id="actionsDropdownButton" data-dropdown-toggle="actionsDropdown"
                              className="w-full md:w-auto flex items-center justify-center py-2 px-4 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-primary-700 focus:z-10 focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700"
                              type="button">
                        <svg className="-ml-1 mr-1.5 w-5 h-5" fill="currentColor" viewBox="0 0 20 20"
                             xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                          <path clip-rule="evenodd" fill-rule="evenodd"
                                d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"/>
                        </svg>
                        Actions
                      </button>
                      <div id="actionsDropdown"
                           className="hidden z-10 w-44 bg-white rounded divide-y divide-gray-100 shadow dark:bg-gray-700 dark:divide-gray-600">
                        <ul className="py-1 text-sm text-gray-700 dark:text-gray-200"
                            aria-labelledby="actionsDropdownButton">
                          <li>
                            <a href="#"
                               className="block py-2 px-4 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Mass
                              Edit</a>
                          </li>
                        </ul>
                        <div className="py-1">
                          <a href="#"
                             className="block py-2 px-4 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white">Delete
                            all</a>
                        </div>
                      </div>
                      <button id="filterDropdownButton" data-dropdown-toggle="filterDropdown"
                              className="w-full md:w-auto flex items-center justify-center py-2 px-4 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-primary-700 focus:z-10 focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700"
                              type="button">
                        <svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true"
                             className="h-4 w-4 mr-2 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                          <path fill-rule="evenodd"
                                d="M3 3a1 1 0 011-1h12a1 1 0 011 1v3a1 1 0 01-.293.707L12 11.414V15a1 1 0 01-.293.707l-2 2A1 1 0 018 17v-5.586L3.293 6.707A1 1 0 013 6V3z"
                                clip-rule="evenodd"/>
                        </svg>
                        Filter
                        <svg className="-mr-1 ml-1.5 w-5 h-5" fill="currentColor" viewBox="0 0 20 20"
                             xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                          <path clip-rule="evenodd" fill-rule="evenodd"
                                d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"/>
                        </svg>
                      </button>
                      <div id="filterDropdown"
                           className="z-10 hidden w-48 p-3 bg-white rounded-lg shadow dark:bg-gray-700">
                        <h6 className="mb-3 text-sm font-medium text-gray-900 dark:text-white">Choose brand</h6>
                        <ul className="space-y-2 text-sm" aria-labelledby="filterDropdownButton">
                          <li className="flex items-center">
                            <input id="apple" type="checkbox" value=""
                                   className="w-4 h-4 bg-gray-100 border-gray-300 rounded text-primary-600 focus:ring-primary-500 dark:focus:ring-primary-600 dark:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500"/>
                            <label htmlFor="apple"
                                   className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-100">Apple
                              (56)</label>
                          </li>
                          <li className="flex items-center">
                            <input id="fitbit" type="checkbox" value=""
                                   className="w-4 h-4 bg-gray-100 border-gray-300 rounded text-primary-600 focus:ring-primary-500 dark:focus:ring-primary-600 dark:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500"/>
                            <label htmlFor="fitbit"
                                   className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-100">Microsoft
                              (16)</label>
                          </li>
                          <li className="flex items-center">
                            <input id="razor" type="checkbox" value=""
                                   className="w-4 h-4 bg-gray-100 border-gray-300 rounded text-primary-600 focus:ring-primary-500 dark:focus:ring-primary-600 dark:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500"/>
                            <label htmlFor="razor"
                                   className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-100">Razor
                              (49)</label>
                          </li>
                          <li className="flex items-center">
                            <input id="nikon" type="checkbox" value=""
                                   className="w-4 h-4 bg-gray-100 border-gray-300 rounded text-primary-600 focus:ring-primary-500 dark:focus:ring-primary-600 dark:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500"/>
                            <label htmlFor="nikon"
                                   className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-100">Nikon
                              (12)</label>
                          </li>
                          <li className="flex items-center">
                            <input id="benq" type="checkbox" value=""
                                   className="w-4 h-4 bg-gray-100 border-gray-300 rounded text-primary-600 focus:ring-primary-500 dark:focus:ring-primary-600 dark:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500"/>
                            <label htmlFor="benq" className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-100">BenQ
                              (74)</label>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                    <tr>
                      <th scope="col" className="px-4 py-3">Product name</th>
                      <th scope="col" className="px-4 py-3">Category</th>
                      <th scope="col" className="px-4 py-3">Brand</th>
                      <th scope="col" className="px-4 py-3">Description</th>
                      <th scope="col" className="px-4 py-3">Price</th>
                      <th scope="col" className="px-4 py-3">
                        <span className="sr-only">Actions</span>
                      </th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr className="border-b dark:border-gray-700">
                      <th scope="row"
                          className="px-4 py-3 font-medium text-gray-900 whitespace-nowrap dark:text-white">Apple iMac
                        27&#34;</th>
                      <td className="px-4 py-3">PC</td>
                      <td className="px-4 py-3">Apple</td>
                      <td className="px-4 py-3">300</td>
                      <td className="px-4 py-3">$2999</td>
                      <td className="px-4 py-3 flex items-center justify-end">
                        <button id="apple-imac-27-dropdown-button" data-dropdown-toggle="apple-imac-27-dropdown"
                                className="inline-flex items-center p-0.5 text-sm font-medium text-center text-gray-500 hover:text-gray-800 rounded-lg focus:outline-none dark:text-gray-400 dark:hover:text-gray-100"
                                type="button">
                          <svg className="w-5 h-5" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20"
                               xmlns="http://www.w3.org/2000/svg">
                            <path
                              d="M6 10a2 2 0 11-4 0 2 2 0 014 0zM12 10a2 2 0 11-4 0 2 2 0 014 0zM16 12a2 2 0 100-4 2 2 0 000 4z"/>
                          </svg>
                        </button>
                        <div id="apple-imac-27-dropdown"
                             className="hidden z-10 w-44 bg-white rounded divide-y divide-gray-100 shadow dark:bg-gray-700 dark:divide-gray-600">
                          <ul className="py-1 text-sm text-gray-700 dark:text-gray-200"
                              aria-labelledby="apple-imac-27-dropdown-button">
                            <li>
                              <a href="#"
                                 className="block py-2 px-4 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Show</a>
                            </li>
                            <li>
                              <a href="#"
                                 className="block py-2 px-4 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Edit</a>
                            </li>
                          </ul>
                          <div className="py-1">
                            <a href="#"
                               className="block py-2 px-4 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white">Delete</a>
                          </div>
                        </div>
                      </td>
                    </tr>
                    <tr className="border-b dark:border-gray-700">
                      <th scope="row"
                          className="px-4 py-3 font-medium text-gray-900 whitespace-nowrap dark:text-white">Apple iMac
                        20&#34;</th>
                      <td className="px-4 py-3">PC</td>
                      <td className="px-4 py-3">Apple</td>
                      <td className="px-4 py-3">200</td>
                      <td className="px-4 py-3">$1499</td>
                      <td className="px-4 py-3 flex items-center justify-end">
                        <button id="apple-imac-20-dropdown-button" data-dropdown-toggle="apple-imac-20-dropdown"
                                className="inline-flex items-center p-0.5 text-sm font-medium text-center text-gray-500 hover:text-gray-800 rounded-lg focus:outline-none dark:text-gray-400 dark:hover:text-gray-100"
                                type="button">
                          <svg className="w-5 h-5" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20"
                               xmlns="http://www.w3.org/2000/svg">
                            <path
                              d="M6 10a2 2 0 11-4 0 2 2 0 014 0zM12 10a2 2 0 11-4 0 2 2 0 014 0zM16 12a2 2 0 100-4 2 2 0 000 4z"/>
                          </svg>
                        </button>
                        <div id="apple-imac-20-dropdown"
                             className="hidden z-10 w-44 bg-white rounded divide-y divide-gray-100 shadow dark:bg-gray-700 dark:divide-gray-600">
                          <ul className="py-1 text-sm text-gray-700 dark:text-gray-200"
                              aria-labelledby="apple-imac-20-dropdown-button">
                            <li>
                              <a href="#"
                                 className="block py-2 px-4 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Show</a>
                            </li>
                            <li>
                              <a href="#"
                                 className="block py-2 px-4 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Edit</a>
                            </li>
                          </ul>
                          <div className="py-1">
                            <a href="#"
                               className="block py-2 px-4 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white">Delete</a>
                          </div>
                        </div>
                      </td>
                    </tr>
                    <tr className="border-b dark:border-gray-700">
                      <th scope="row"
                          className="px-4 py-3 font-medium text-gray-900 whitespace-nowrap dark:text-white">Apple iPhone
                        14
                      </th>
                      <td className="px-4 py-3">Phone</td>
                      <td className="px-4 py-3">Apple</td>
                      <td className="px-4 py-3">1237</td>
                      <td className="px-4 py-3">$999</td>
                      <td className="px-4 py-3 flex items-center justify-end">
                        <button id="apple-iphone-14-dropdown-button" data-dropdown-toggle="apple-iphone-14-dropdown"
                                className="inline-flex items-center p-0.5 text-sm font-medium text-center text-gray-500 hover:text-gray-800 rounded-lg focus:outline-none dark:text-gray-400 dark:hover:text-gray-100"
                                type="button">
                          <svg className="w-5 h-5" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20"
                               xmlns="http://www.w3.org/2000/svg">
                            <path
                              d="M6 10a2 2 0 11-4 0 2 2 0 014 0zM12 10a2 2 0 11-4 0 2 2 0 014 0zM16 12a2 2 0 100-4 2 2 0 000 4z"/>
                          </svg>
                        </button>
                        <div id="apple-iphone-14-dropdown"
                             className="hidden z-10 w-44 bg-white rounded divide-y divide-gray-100 shadow dark:bg-gray-700 dark:divide-gray-600">
                          <ul className="py-1 text-sm text-gray-700 dark:text-gray-200"
                              aria-labelledby="apple-iphone-14-dropdown-button">
                            <li>
                              <a href="#"
                                 className="block py-2 px-4 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Show</a>
                            </li>
                            <li>
                              <a href="#"
                                 className="block py-2 px-4 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Edit</a>
                            </li>
                          </ul>
                          <div className="py-1">
                            <a href="#"
                               className="block py-2 px-4 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white">Delete</a>
                          </div>
                        </div>
                      </td>
                    </tr>
                    <tr className="border-b dark:border-gray-700">
                      <th scope="row"
                          className="px-4 py-3 font-medium text-gray-900 whitespace-nowrap dark:text-white">Apple iPad
                        Air
                      </th>
                      <td className="px-4 py-3">Tablet</td>
                      <td className="px-4 py-3">Apple</td>
                      <td className="px-4 py-3">4578</td>
                      <td className="px-4 py-3">$1199</td>
                      <td className="px-4 py-3 flex items-center justify-end">
                        <button id="apple-ipad-air-dropdown-button" data-dropdown-toggle="apple-ipad-air-dropdown"
                                className="inline-flex items-center p-0.5 text-sm font-medium text-center text-gray-500 hover:text-gray-800 rounded-lg focus:outline-none dark:text-gray-400 dark:hover:text-gray-100"
                                type="button">
                          <svg className="w-5 h-5" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20"
                               xmlns="http://www.w3.org/2000/svg">
                            <path
                              d="M6 10a2 2 0 11-4 0 2 2 0 014 0zM12 10a2 2 0 11-4 0 2 2 0 014 0zM16 12a2 2 0 100-4 2 2 0 000 4z"/>
                          </svg>
                        </button>
                        <div id="apple-ipad-air-dropdown"
                             className="hidden z-10 w-44 bg-white rounded divide-y divide-gray-100 shadow dark:bg-gray-700 dark:divide-gray-600">
                          <ul className="py-1 text-sm text-gray-700 dark:text-gray-200"
                              aria-labelledby="apple-ipad-air-dropdown-button">
                            <li>
                              <a href="#"
                                 className="block py-2 px-4 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Show</a>
                            </li>
                            <li>
                              <a href="#"
                                 className="block py-2 px-4 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Edit</a>
                            </li>
                          </ul>
                          <div className="py-1">
                            <a href="#"
                               className="block py-2 px-4 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white">Delete</a>
                          </div>
                        </div>
                      </td>
                    </tr>
                    <tr className="border-b dark:border-gray-700">
                      <th scope="row"
                          className="px-4 py-3 font-medium text-gray-900 whitespace-nowrap dark:text-white">Xbox Series
                        S
                      </th>
                      <td className="px-4 py-3">Gaming/Console</td>
                      <td className="px-4 py-3">Microsoft</td>
                      <td className="px-4 py-3">56</td>
                      <td className="px-4 py-3">$299</td>
                      <td className="px-4 py-3 flex items-center justify-end">
                        <button id="xbox-series-s-dropdown-button" data-dropdown-toggle="xbox-series-s-dropdown"
                                className="inline-flex items-center p-0.5 text-sm font-medium text-center text-gray-500 hover:text-gray-800 rounded-lg focus:outline-none dark:text-gray-400 dark:hover:text-gray-100"
                                type="button">
                          <svg className="w-5 h-5" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20"
                               xmlns="http://www.w3.org/2000/svg">
                            <path
                              d="M6 10a2 2 0 11-4 0 2 2 0 014 0zM12 10a2 2 0 11-4 0 2 2 0 014 0zM16 12a2 2 0 100-4 2 2 0 000 4z"/>
                          </svg>
                        </button>
                        <div id="xbox-series-s-dropdown"
                             className="hidden z-10 w-44 bg-white rounded divide-y divide-gray-100 shadow dark:bg-gray-700 dark:divide-gray-600">
                          <ul className="py-1 text-sm text-gray-700 dark:text-gray-200"
                              aria-labelledby="xbox-series-s-dropdown-button">
                            <li>
                              <a href="#"
                                 className="block py-2 px-4 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Show</a>
                            </li>
                            <li>
                              <a href="#"
                                 className="block py-2 px-4 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Edit</a>
                            </li>
                          </ul>
                          <div className="py-1">
                            <a href="#"
                               className="block py-2 px-4 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white">Delete</a>
                          </div>
                        </div>
                      </td>
                    </tr>
                    <tr className="border-b dark:border-gray-700">
                      <th scope="row"
                          className="px-4 py-3 font-medium text-gray-900 whitespace-nowrap dark:text-white">PlayStation
                        5
                      </th>
                      <td className="px-4 py-3">Gaming/Console</td>
                      <td className="px-4 py-3">Sony</td>
                      <td className="px-4 py-3">78</td>
                      <td className="px-4 py-3">$799</td>
                      <td className="px-4 py-3 flex items-center justify-end">
                        <button id="playstation-5-dropdown-button" data-dropdown-toggle="playstation-5-dropdown"
                                className="inline-flex items-center p-0.5 text-sm font-medium text-center text-gray-500 hover:text-gray-800 rounded-lg focus:outline-none dark:text-gray-400 dark:hover:text-gray-100"
                                type="button">
                          <svg className="w-5 h-5" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20"
                               xmlns="http://www.w3.org/2000/svg">
                            <path
                              d="M6 10a2 2 0 11-4 0 2 2 0 014 0zM12 10a2 2 0 11-4 0 2 2 0 014 0zM16 12a2 2 0 100-4 2 2 0 000 4z"/>
                          </svg>
                        </button>
                        <div id="playstation-5-dropdown"
                             className="hidden z-10 w-44 bg-white rounded divide-y divide-gray-100 shadow dark:bg-gray-700 dark:divide-gray-600">
                          <ul className="py-1 text-sm text-gray-700 dark:text-gray-200"
                              aria-labelledby="playstation-5-dropdown-button">
                            <li>
                              <a href="#"
                                 className="block py-2 px-4 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Show</a>
                            </li>
                            <li>
                              <a href="#"
                                 className="block py-2 px-4 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Edit</a>
                            </li>
                          </ul>
                          <div className="py-1">
                            <a href="#"
                               className="block py-2 px-4 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white">Delete</a>
                          </div>
                        </div>
                      </td>
                    </tr>
                    <tr className="border-b dark:border-gray-700">
                      <th scope="row"
                          className="px-4 py-3 font-medium text-gray-900 whitespace-nowrap dark:text-white">Xbox Series
                        X
                      </th>
                      <td className="px-4 py-3">Gaming/Console</td>
                      <td className="px-4 py-3">Microsoft</td>
                      <td className="px-4 py-3">200</td>
                      <td className="px-4 py-3">$699</td>
                      <td className="px-4 py-3 flex items-center justify-end">
                        <button id="xbox-series-x-dropdown-button" data-dropdown-toggle="xbox-series-x-dropdown"
                                className="inline-flex items-center p-0.5 text-sm font-medium text-center text-gray-500 hover:text-gray-800 rounded-lg focus:outline-none dark:text-gray-400 dark:hover:text-gray-100"
                                type="button">
                          <svg className="w-5 h-5" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20"
                               xmlns="http://www.w3.org/2000/svg">
                            <path
                              d="M6 10a2 2 0 11-4 0 2 2 0 014 0zM12 10a2 2 0 11-4 0 2 2 0 014 0zM16 12a2 2 0 100-4 2 2 0 000 4z"/>
                          </svg>
                        </button>
                        <div id="xbox-series-x-dropdown"
                             className="hidden z-10 w-44 bg-white rounded divide-y divide-gray-100 shadow dark:bg-gray-700 dark:divide-gray-600">
                          <ul className="py-1 text-sm text-gray-700 dark:text-gray-200"
                              aria-labelledby="xbox-series-x-dropdown-button">
                            <li>
                              <a href="#"
                                 className="block py-2 px-4 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Show</a>
                            </li>
                            <li>
                              <a href="#"
                                 className="block py-2 px-4 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Edit</a>
                            </li>
                          </ul>
                          <div className="py-1">
                            <a href="#"
                               className="block py-2 px-4 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white">Delete</a>
                          </div>
                        </div>
                      </td>
                    </tr>
                    <tr className="border-b dark:border-gray-700">
                      <th scope="row"
                          className="px-4 py-3 font-medium text-gray-900 whitespace-nowrap dark:text-white">Apple Watch
                        SE
                      </th>
                      <td className="px-4 py-3">Watch</td>
                      <td className="px-4 py-3">Apple</td>
                      <td className="px-4 py-3">657</td>
                      <td className="px-4 py-3">$399</td>
                      <td className="px-4 py-3 flex items-center justify-end">
                        <button id="apple-watch-se-dropdown-button" data-dropdown-toggle="apple-watch-se-dropdown"
                                className="inline-flex items-center p-0.5 text-sm font-medium text-center text-gray-500 hover:text-gray-800 rounded-lg focus:outline-none dark:text-gray-400 dark:hover:text-gray-100"
                                type="button">
                          <svg className="w-5 h-5" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20"
                               xmlns="http://www.w3.org/2000/svg">
                            <path
                              d="M6 10a2 2 0 11-4 0 2 2 0 014 0zM12 10a2 2 0 11-4 0 2 2 0 014 0zM16 12a2 2 0 100-4 2 2 0 000 4z"/>
                          </svg>
                        </button>
                        <div id="apple-watch-se-dropdown"
                             className="hidden z-10 w-44 bg-white rounded divide-y divide-gray-100 shadow dark:bg-gray-700 dark:divide-gray-600">
                          <ul className="py-1 text-sm text-gray-700 dark:text-gray-200"
                              aria-labelledby="apple-watch-se-dropdown-button">
                            <li>
                              <a href="#"
                                 className="block py-2 px-4 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Show</a>
                            </li>
                            <li>
                              <a href="#"
                                 className="block py-2 px-4 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Edit</a>
                            </li>
                          </ul>
                          <div className="py-1">
                            <a href="#"
                               className="block py-2 px-4 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white">Delete</a>
                          </div>
                        </div>
                      </td>
                    </tr>
                    <tr className="border-b dark:border-gray-700">
                      <th scope="row"
                          className="px-4 py-3 font-medium text-gray-900 whitespace-nowrap dark:text-white">NIKON D850
                      </th>
                      <td className="px-4 py-3">Photo</td>
                      <td className="px-4 py-3">Nikon</td>
                      <td className="px-4 py-3">465</td>
                      <td className="px-4 py-3">$599</td>
                      <td className="px-4 py-3 flex items-center justify-end">
                        <button id="nikon-d850-dropdown-button" data-dropdown-toggle="nikon-d850-dropdown"
                                className="inline-flex items-center p-0.5 text-sm font-medium text-center text-gray-500 hover:text-gray-800 rounded-lg focus:outline-none dark:text-gray-400 dark:hover:text-gray-100"
                                type="button">
                          <svg className="w-5 h-5" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20"
                               xmlns="http://www.w3.org/2000/svg">
                            <path
                              d="M6 10a2 2 0 11-4 0 2 2 0 014 0zM12 10a2 2 0 11-4 0 2 2 0 014 0zM16 12a2 2 0 100-4 2 2 0 000 4z"/>
                          </svg>
                        </button>
                        <div id="nikon-d850-dropdown"
                             className="hidden z-10 w-44 bg-white rounded divide-y divide-gray-100 shadow dark:bg-gray-700 dark:divide-gray-600">
                          <ul className="py-1 text-sm text-gray-700 dark:text-gray-200"
                              aria-labelledby="nikon-d850-dropdown-button">
                            <li>
                              <a href="#"
                                 className="block py-2 px-4 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Show</a>
                            </li>
                            <li>
                              <a href="#"
                                 className="block py-2 px-4 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Edit</a>
                            </li>
                          </ul>
                          <div className="py-1">
                            <a href="#"
                               className="block py-2 px-4 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white">Delete</a>
                          </div>
                        </div>
                      </td>
                    </tr>
                    <tr className="border-b dark:border-gray-700">
                      <th scope="row"
                          className="px-4 py-3 font-medium text-gray-900 whitespace-nowrap dark:text-white">Monitor BenQ
                        EX2710Q
                      </th>
                      <td className="px-4 py-3">TV/Monitor</td>
                      <td className="px-4 py-3">BenQ</td>
                      <td className="px-4 py-3">354</td>
                      <td className="px-4 py-3">$499</td>
                      <td className="px-4 py-3 flex items-center justify-end">
                        <button id="benq-ex2710q-dropdown-button" data-dropdown-toggle="benq-ex2710q-dropdown"
                                className="inline-flex items-center p-0.5 text-sm font-medium text-center text-gray-500 hover:text-gray-800 rounded-lg focus:outline-none dark:text-gray-400 dark:hover:text-gray-100"
                                type="button">
                          <svg className="w-5 h-5" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20"
                               xmlns="http://www.w3.org/2000/svg">
                            <path
                              d="M6 10a2 2 0 11-4 0 2 2 0 014 0zM12 10a2 2 0 11-4 0 2 2 0 014 0zM16 12a2 2 0 100-4 2 2 0 000 4z"/>
                          </svg>
                        </button>
                        <div id="benq-ex2710q-dropdown"
                             className="hidden z-10 w-44 bg-white rounded divide-y divide-gray-100 shadow dark:bg-gray-700 dark:divide-gray-600">
                          <ul className="py-1 text-sm text-gray-700 dark:text-gray-200"
                              aria-labelledby="benq-ex2710q-dropdown-button">
                            <li>
                              <a href="#"
                                 className="block py-2 px-4 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Show</a>
                            </li>
                            <li>
                              <a href="#"
                                 className="block py-2 px-4 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Edit</a>
                            </li>
                          </ul>
                          <div className="py-1">
                            <a href="#"
                               className="block py-2 px-4 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white">Delete</a>
                          </div>
                        </div>
                      </td>
                    </tr>
                    </tbody>
                  </table>
                </div>
                <nav
                  className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-3 md:space-y-0 p-4"
                  aria-label="Table navigation">
                <span className="text-sm font-normal text-gray-500 dark:text-gray-400">
                    Showing
                    <span className="font-semibold text-gray-900 dark:text-white">1-10</span>
                    of
                    <span className="font-semibold text-gray-900 dark:text-white">1000</span>
                </span>
                  <ul className="inline-flex items-stretch -space-x-px">
                    <li>
                      <a href="#"
                         className="flex items-center justify-center h-full py-1.5 px-3 ml-0 text-gray-500 bg-white rounded-l-lg border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white">
                        <span className="sr-only">Previous</span>
                        <svg className="w-5 h-5" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20"
                             xmlns="http://www.w3.org/2000/svg">
                          <path fill-rule="evenodd"
                                d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                                clip-rule="evenodd"/>
                        </svg>
                      </a>
                    </li>
                    <li>
                      <a href="#"
                         className="flex items-center justify-center text-sm py-2 px-3 leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white">1</a>
                    </li>
                    <li>
                      <a href="#"
                         className="flex items-center justify-center text-sm py-2 px-3 leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white">2</a>
                    </li>
                    <li>
                      <a href="#" aria-current="page"
                         className="flex items-center justify-center text-sm z-10 py-2 px-3 leading-tight text-primary-600 bg-primary-50 border border-primary-300 hover:bg-primary-100 hover:text-primary-700 dark:border-gray-700 dark:bg-gray-700 dark:text-white">3</a>
                    </li>
                    <li>
                      <a href="#"
                         className="flex items-center justify-center text-sm py-2 px-3 leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white">...</a>
                    </li>
                    <li>
                      <a href="#"
                         className="flex items-center justify-center text-sm py-2 px-3 leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white">100</a>
                    </li>
                    <li>
                      <a href="#"
                         className="flex items-center justify-center h-full py-1.5 px-3 leading-tight text-gray-500 bg-white rounded-r-lg border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white">
                        <span className="sr-only">Next</span>
                        <svg className="w-5 h-5" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20"
                             xmlns="http://www.w3.org/2000/svg">
                          <path fill-rule="evenodd"
                                d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                                clip-rule="evenodd"/>
                        </svg>
                      </a>
                    </li>
                  </ul>
                </nav>
              </div>
            </div>
          </div>
        </main>
      </div>
    </>
  )
}
