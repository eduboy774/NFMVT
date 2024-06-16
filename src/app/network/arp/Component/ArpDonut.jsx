import React, { Component } from 'react';
import Chart from 'react-apexcharts';

class Donut extends Component {
  constructor(props) {
    super(props);

    const arpData = props?.arpData;

    const httpMethods = arpData?.map(item => item.httpMethod);
    const protocols = arpData?.map(item => item.protocol);

    const httpMethodFrequency = httpMethods?.reduce((acc, curr) => {
      acc[curr] = (acc[curr] || 0) + 1;
      return acc;
    }, {});
    
    const protocolFrequency = protocols?.reduce((acc, curr) => {
      acc[curr] = (acc[curr] || 0) + 1;
      return acc;
    }, {});

    const httpMethodLabels = Object.keys(httpMethodFrequency);
    const httpMethodSeries = Object.values(httpMethodFrequency);

    const protocolLabels = Object.keys(protocolFrequency);
    const protocolSeries = Object.values(protocolFrequency);

    this.state = {
      options: {
        labels: httpMethodLabels, // or protocolLabels
      },
      series: httpMethodSeries, // or protocolSeries
    };
    
  }

  render() {
    
    const { options, series } = this.state;
  
    return (
      <div className="donut">
        <Chart
          options={options}
          series={series}
          type="pie"
          width="396"
        />
      </div>
    );
  }
  
}

export default Donut;


