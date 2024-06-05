// src/HeatmapChart.js
import React from 'react';
import ReactApexChart from 'react-apexcharts';

class HeatmapChart extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      series: [
        {
          name: 'Metric1',
          data: this.generateData(18, {
            min: 0,
            max: 90
          })
        },
        {
          name: 'Metric2',
          data: this.generateData(18, {
            min: 0,
            max: 90
          })
        },
        {
          name: 'Metric3',
          data: this.generateData(18, {
            min: 0,
            max: 90
          })
        },
        {
          name: 'Metric4',
          data: this.generateData(18, {
            min: 0,
            max: 90
          })
        },
        {
          name: 'Metric5',
          data: this.generateData(18, {
            min: 0,
            max: 90
          })
        },
        {
          name: 'Metric6',
          data: this.generateData(18, {
            min: 0,
            max: 90
          })
        },
        {
          name: 'Metric7',
          data: this.generateData(18, {
            min: 0,
            max: 90
          })
        },
        {
          name: 'Metric8',
          data: this.generateData(18, {
            min: 0,
            max: 90
          })
        },
        {
          name: 'Metric9',
          data: this.generateData(18, {
            min: 0,
            max: 90
          })
        }
      ],
      options: {
        chart: {
          height: 350,
          type: 'heatmap'
        },
        dataLabels: {
          enabled: false
        },
        colors: ['#008FFB'],
        title: {
          text: 'Heatmap Chart'
        },
        plotOptions: {
          heatmap: {
            shadeIntensity: 0.5,
            radius: 0,
            useFillColorAsStroke: true,
            colorScale: {
              ranges: [
                {
                  from: 0,
                  to: 50,
                  name: 'low',
                  color: '#00A100'
                },
                {
                  from: 51,
                  to: 100,
                  name: 'high',
                  color: '#128FD9'
                }
              ]
            }
          }
        }
      }
    };
  }

  generateData(count, yrange) {
    let i = 0;
    let series = [];
    while (i < count) {
      let x = 'w' + (i + 1).toString();
      let y = Math.floor(Math.random() * (yrange.max - yrange.min + 1)) + yrange.min;

      series.push({
        x: x,
        y: y
      });
      i++;
    }
    return series;
  }

  render() {
    return (
      <div id="chart">
        <ReactApexChart options={this.state.options} series={this.state.series} type="heatmap" height={350} />
      </div>
    );
  }
}

export default HeatmapChart;
