import React, { Component } from 'react';
import Chart from 'react-apexcharts';
import ReactApexChart from 'react-apexcharts';


class BarGraph extends Component {
  constructor(props) {
    super(props);

    const openPortsData = props.openPortsData;

    // Extract the source IP and destination port from the openPortsData array
    const packetData = openPortsData.map(item => ({
      x: item.src_ip, // use the correct property name here
      y: item.dst_port // and here
    }));
    
    // Group the packet data by source IP address
    const groupedData = packetData.reduce((acc, cur) => {
      const x = cur.x;
      const y = cur.y;
      const index = acc.findIndex(item => item.x === x);
    
      if (index === -1) {
        acc.push({ x, y });
      } else {
        // If you want to sum the destination ports for the same source IP, you can uncomment the line below
        // acc[index].y += y;
      }
    
      return acc;
    }, []);
    
    // Format the grouped data for the bar graph's series and categories properties
    const series = [{
      name: 'Destination Port',
      data: groupedData.map(item => item.y)
    }];
    const categories = groupedData.map(item => item.x);
    
    this.state = {
      series,
      categories,
      options: {
        chart: {
          type: 'bar',
          height: 350
        },
        plotOptions: {
          bar: {
            horizontal: false,
            columnWidth: '80%',
            endingShape: 'rounded'
          },
        },
        dataLabels: {
          enabled: false
        },
        stroke: {
          show: true,
          width: 2,
          colors: ['transparent']
        },
        xaxis: {
          categories,
          rotate: -90
        },
        yaxis: {
          title: {
            text: 'Destination Port'
          }
        },
        fill: {
          opacity: 1
        },
        tooltip: {
          y: {
            formatter: function (val) {
              return "Destination Port: " + val
            }
          }
        }
      }
    };
    
  }

  render() {
    return (
      <div className="app">
        <div className="row">
          <div className="mixed-chart">
          <ReactApexChart
           options={this.state.options} 
           series={this.state.series} 
           type="line" height={350}
           width="100%"
            />

          </div>
        </div>
      </div>
    );
  }
}

export default BarGraph;


//
// class ApexChart extends React.Component {
//   constructor(props) {
//     super(props);

    // this.state = {
    
    //   series: [{
    //     name: 'Website Blog',
    //     type: 'column',
    //     data: [440, 505, 414, 671, 227, 413, 201, 352, 752, 320, 257, 160]
    //   }, {
    //     name: 'Social Media',
    //     type: 'line',
    //     data: [23, 42, 35, 27, 43, 22, 17, 31, 22, 22, 12, 16]
    //   }],
    //   options: {
    //     chart: {
    //       height: 350,
    //       type: 'line',
    //     },
    //     stroke: {
    //       width: [0, 4]
    //     },
    //     title: {
    //       text: 'Traffic Sources'
    //     },
    //     dataLabels: {
    //       enabled: true,
    //       enabledOnSeries: [1]
    //     },
    //     labels: ['01 Jan 2001', '02 Jan 2001', '03 Jan 2001', '04 Jan 2001', '05 Jan 2001', '06 Jan 2001', '07 Jan 2001', '08 Jan 2001', '09 Jan 2001', '10 Jan 2001', '11 Jan 2001', '12 Jan 2001'],
    //     xaxis: {
    //       type: 'datetime'
    //     },
    //     yaxis: [{
    //       title: {
    //         text: 'Website Blog',
    //       },
        
    //     }, {
    //       opposite: true,
    //       title: {
    //         text: 'Social Media'
    //       }
    //     }]
    //   },
    
    
    // };
  // }



