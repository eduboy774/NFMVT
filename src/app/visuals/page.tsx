/* eslint-disable @next/next/no-img-element */
'use client'

import React, {useState} from 'react'
import Sidebar from '../ui/Sidebar';
import { HomeIcon, PlayIcon, ChartBarIcon, EyeIcon, DocumentTextIcon, PlusCircleIcon } from '@heroicons/react/24/outline';
import Chart from 'react-apexcharts';

export default function Visuals() {
  const [activeItem, setActiveItem] = useState('Visuals');

  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: <HomeIcon className="w-5 h-5" />, current: false },
    { name: 'Upload', href: '/upload-case-file', icon: <PlayIcon className="w-5 h-5" />, current: false },
    { name: 'Statistics', href: '/statistics', icon: <ChartBarIcon className="w-5 h-5" />, current: false },
    { name: 'Visuals', href: '/visuals', icon: <EyeIcon className="w-5 h-5" />, current: true },
    { name: 'Reports', href: '/report', icon: <DocumentTextIcon className="w-5 h-5" />, current: false },
    { name: 'Create New Case', href: '/', icon: <PlusCircleIcon className="w-5 h-5" />, current: false },
  ];
  
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
      <Sidebar navigation={navigation} activeItem={activeItem} setActiveItem={setActiveItem} />

      <div className="flex-grow p-8 ml-64">
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
