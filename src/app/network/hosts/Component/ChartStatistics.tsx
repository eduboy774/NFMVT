import React, { useEffect, useState } from 'react';
import Chart from 'react-apexcharts';

const ChartStatistics = ({ registeredCases, activeCases, closedCases }) => {
  const [chartData, setChartData] = useState({
    series: [],
    options: {
      chart: {
        type: 'donut',
        height: 350,
        toolbar: {
          show: false,
        },
        options3d: {
          enabled: true,
          alpha: 45,
          beta: 0,
          depth: 30,
          viewDistance: 45,
        },
        dropShadow: {
          enabled: true,
          enabledSeries: [0],
          top: -2,
          left: 2,
          blur: 5,
          opacity: 0.06
        }
      },
      labels: ['Registered', 'Active', 'Closed'],
      dataLabels: {
        enabled: true,
      },
      title: {
        text: 'Cases Statistics',
        align: 'center',
        style: {
          fontSize: '20px',
        },
      },
      colors: ['#008FFB', '#00E396', '#E11950'],
      legend: {
        position: 'bottom',
      },
    },
    plotOptions: {
      pie: {
        expandOnClick: true
      }
    }
  });

  useEffect(() => {
    setChartData((prevData) => ({
      ...prevData,
      series: [registeredCases, activeCases, closedCases],
    }));
  }, [registeredCases, activeCases, closedCases]);

  return (
    <div className="bg-white p-4 rounded-lg shadow-md">
      <Chart
        options={chartData.options}
        series={chartData.series}
        type="donut"
        height={350}
      />
    </div>
  );
};

export default ChartStatistics;
