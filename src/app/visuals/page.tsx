/* eslint-disable @next/next/no-img-element */
'use client'

import { Fragment } from 'react'
import { Disclosure, Menu, Transition } from '@headlessui/react'
import { Bars3Icon, BellIcon, XMarkIcon } from '@heroicons/react/24/outline'
import Chart from 'react-apexcharts';

const user = {
  name: 'Tom Cook',
}

const navigation = [
  { name: 'Dashboard', href: '/dashboard', current: false },
  { name: 'Upload', href: '/uploadfile', current: false },
  { name: 'Statistics', href: '/statistics', current: false },
  { name: 'Visuals', href: '/visuals', current: true },
  { name: 'Report', href: '/report', current: false },
  { name: 'Create New Case', href: '/', current: false },
]

const userNavigation = [
  { name: 'Your Profile', href: '#' },
]

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ')
}

export default function Dashboard() {
  const barChartOptions = {
    chart: {
      type: 'bar'
    },
    xaxis: {
      categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep']
    }
  };

  const barChartSeries = [{
    name: 'Sales',
    data: [30, 40, 35, 50, 49, 60, 70, 91, 125]
  }];

  const pieChartOptions = {
    chart: {
      type: 'pie'
    },
    labels: ['Team A', 'Team B', 'Team C', 'Team D', 'Team E']
  };

  const pieChartSeries = [44, 55, 13, 43, 22];

  const lineChartOptions = {
    chart: {
      type: 'line'
    },
    xaxis: {
      categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep']
    }
  };

  const lineChartSeries = [{
    name: 'Revenue',
    data: [150, 200, 250, 300, 350, 400, 450, 500, 550]
  }];

  const doughnutChartOptions = {
    chart: {
      type: 'donut'
    },
    labels: ['Product A', 'Product B', 'Product C']
  };

  const doughnutChartSeries = [30, 20, 50];

  // Polar area chart options and series data
  const polarAreaChartOptions = {
    chart: {
      type: 'polarArea',
    },
    labels: ['Category A', 'Category B', 'Category C', 'Category D', 'Category E'],
  };

  const polarAreaChartSeries = [30, 40, 45, 50, 49];

  // Heatmap options and series data
  const heatmapOptions = {
    chart: {
      type: 'heatmap',
    },
    plotOptions: {
      heatmap: {
        radius: 2, // Adjust this value as needed
      },
    },
    dataLabels: {
      enabled: false,
    },
    colors: ['#008FFB'],
    xaxis: {
      categories: ['Day 1', 'Day 2', 'Day 3', 'Day 4', 'Day 5', 'Day 6', 'Day 7'],
    },
  };

  const heatmapSeries = [
    {
      name: 'Metric 1',
      data: [10, 15, 20, 25, 30, 35, 40], // Adjust these values as needed
    },
    {
      name: 'Metric 2',
      data: [15, 20, 25, 30, 35, 40, 45], // Adjust these values as needed
    },
    // Add more series data as needed
  ];

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
          <div className="ml-2 space-y-1 flex flex-col">
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
      </Disclosure>

      <div className="flex-grow p-8">
        <header className="bg-white shadow">
          <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
            <h1 className="text-3xl font-bold tracking-tight text-gray-900">Visualization</h1>
          </div>
        </header>
        <main>
          <div className="container mx-auto py-10 px-4">
            <div className="flex flex-wrap justify-center">
              {/* Bar chart */}
              <div className="mx-4">
                <Chart options={barChartOptions} series={barChartSeries} type="bar" width={400} />
              </div>
              {/* Pie chart */}
              <div className="mx-4">
                <Chart options={pieChartOptions} series={pieChartSeries} type="pie" width={400} />
              </div>
              {/* Line chart */}
              <div className="mx-4">
                <Chart options={lineChartOptions} series={lineChartSeries} type="line" width={400} />
              </div>
              {/* Doughnut chart */}
              <div className="mx-4">
                <Chart options={doughnutChartOptions} series={doughnutChartSeries} type="donut" width={400} />
              </div>
              {/* Polar area chart */}
              <div className="mx-4">
                <Chart options={polarAreaChartOptions} series={polarAreaChartSeries} type="polarArea" width={400} />
              </div>
              {/* Heatmap */}
              <div className="mx-4">
                <Chart options={heatmapOptions} series={heatmapSeries} type="heatmap" height={300} />
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
