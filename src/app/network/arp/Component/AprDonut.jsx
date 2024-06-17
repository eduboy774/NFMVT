import React, { Component } from 'react';
import ReactApexChart from 'react-apexcharts';


class AprDonut extends Component {
  constructor(props) {
    super(props);

    const arpData = props.arpData;

    // Extract the unique values for each key
    const srcMacAddresses = [...new Set(arpData.map(item => item.arp_src_hw_mac))];
    const srcIpAddresses = [...new Set(arpData.map(item => item.arp_src_proto_ipv4))];
    const dstMacAddresses = [...new Set(arpData.map(item => item.arp_dst_hw_mac))];
    const dstIpAddresses = [...new Set(arpData.map(item => item.arp_dst_proto_ipv4))];

    console.log('Unique values:', {
      srcMacAddresses,
      srcIpAddresses,
      dstMacAddresses,
      dstIpAddresses
    });

    // Calculate the frequency of each unique value
    const srcMacAddressFrequency = srcMacAddresses.map(mac => ({
      mac,
      frequency: arpData.filter(item => item.arp_src_hw_mac === mac).length
    }));
    const srcIpAddressFrequency = srcIpAddresses.map(ip => ({
      ip,
      frequency: arpData.filter(item => item.arp_src_proto_ipv4 === ip).length
    }));
    const dstMacAddressFrequency = dstMacAddresses.map(mac => ({
      mac,
      frequency: arpData.filter(item => item.arp_dst_hw_mac === mac).length
    }));
    const dstIpAddressFrequency = dstIpAddresses.map(ip => ({
      ip,
      frequency: arpData.filter(item => item.arp_dst_proto_ipv4 === ip).length
    }));

    console.log('Frequency data:', {
      srcMacAddressFrequency,
      srcIpAddressFrequency,
      dstMacAddressFrequency,
      dstIpAddressFrequency
    });

    // Format the data for the pie chart
    const srcMacAddressSeries = srcMacAddressFrequency.map(item => item.frequency);
    const srcMacAddressLabels = srcMacAddressFrequency.map(item => item.mac);
    const srcIpAddressSeries = srcIpAddressFrequency.map(item => item.frequency);
    const srcIpAddressLabels = srcIpAddressFrequency.map(item => item.ip);
    const dstMacAddressSeries = dstMacAddressFrequency.map(item => item.frequency);
    const dstMacAddressLabels = dstMacAddressFrequency.map(item => item.mac);
    const dstIpAddressSeries = dstIpAddressFrequency.map(item => item.frequency);
    const dstIpAddressLabels = dstIpAddressFrequency.map(item => item.ip);

    console.log('Chart data:', {
      srcMacAddressSeries,
      srcMacAddressLabels,
      srcIpAddressSeries,
      srcIpAddressLabels,
      dstMacAddressSeries,
      dstMacAddressLabels,
      dstIpAddressSeries,
      dstIpAddressLabels
    });

    this.state = {
      options: {
        chart: {
          type: 'pie',
        },
        labels: srcMacAddressLabels,
        responsive: [{
          breakpoint: 480,
          options: {
            chart: {
              width: 200
            },
            legend: {
              position: 'bottom'
            }
          }
        }]
      },
      series: srcMacAddressSeries,
    };
  }

  render() {
    console.log('State:', this.state);

    return (
      <div className="Aprdonut">
        <ReactApexChart
          options={this.state.options}
          series={this.state.series}
          type="pie"
          style={{ width: '800px', height: '500px' }}
        />
      </div>
    );
  }
}



export default AprDonut;
