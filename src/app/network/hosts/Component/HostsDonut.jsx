import React, { Component } from 'react';
import ReactApexChart from 'react-apexcharts';

class Donut extends Component {
  constructor(props) {
    super(props);

    const hostsData = props?.hostsData;
    console.log({hostsData});

    const nameCounts = hostsData?.reduce((acc, curr) => {
      acc[curr.resolved_name] = (acc[curr.resolved_name] || 0) + 1;
      return acc;
    }, {});

    const ipCounts = hostsData?.reduce((acc, curr) => {
      acc[curr.ip_address] = (acc[curr.ip_address] || 0) + 1;
      return acc;
    }, {});

    const nameLabels = Object.keys(nameCounts);
    const nameSeries = Object.values(nameCounts);

    const ipLabels = Object.keys(ipCounts);
    const ipSeries = Object.values(ipCounts);

    this.state = {
      options: {
        chart: {
          type: 'donut',
        },
        labels: nameLabels, // or ipLabels
        dataLabels: {
          enabled: false,
        },
        responsive: [{
          breakpoint: 480,
          options: {
            chart: {
              width: 200,
            },
            // ...
          },
        }, {
          breakpoint: 600,
          options: {
            chart: {
              width: 400,
            },
          },
        }, {
          breakpoint: 800,
          options: {
            chart: {
              width: 600,
            },
          },
        }],
      // },
      },
      series: nameSeries, // or ipSeries
    };
  }

  render() {
    const { options, series } = this.state;

    return (
      <div className="donut" style={{ width: '800px', height: '500px' }}>
        <ReactApexChart
          options={options}
          series={series}
          type="donut"
          style={{ width: '800px', height: '500px' }}
        />
      </div>
    );
  }
}


export default Donut;


