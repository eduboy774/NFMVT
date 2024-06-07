import React, { Component } from 'react';
import Chart from 'react-apexcharts';

class BarGraph extends Component {
  constructor(props) {
    super(props);

    const httpHeadersData = props.httpHeadersData;

    // Extract the packet number and source IP address from the httpHeadersData array
    const packetData = httpHeadersData.map(item => ({
      x: item.sourceIp,
      y: item.packetNumber
    }));

    // Group the packet data by source IP address and sum the packet numbers
    const groupedData = packetData.reduce((acc, cur) => {
      const x = cur.x;
      const y = cur.y;
      const index = acc.findIndex(item => item.x === x);

      if (index === -1) {
        acc.push({ x, y });
      } else {
        acc[index].y += y;
      }

      return acc;
    }, []);

    // Format the grouped data for the bar graph's series and categories properties
    const series = [{
      name: 'Packet Number',
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
            text: 'Packet Number'
          }
        },
        fill: {
          opacity: 1
        },
        tooltip: {
          y: {
            formatter: function (val) {
              return "Packet Number: " + val
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
            <Chart
              options={this.state.options}
              series={this.state.series}
              type="bar"
              width="100%"
              height="350"
            />
          </div>
        </div>
      </div>
    );
  }
}

export default BarGraph;
