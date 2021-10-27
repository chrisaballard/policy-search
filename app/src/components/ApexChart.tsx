import React, { useState } from 'react';
import dynamic from 'next/dynamic';
const Chart = dynamic(() => import('react-apexcharts'), { ssr: false });

const ApexChart = () => {
  function generateData(baseval, count, yrange) {
    var i = 0;
    var series = [];
    while (i < count) {
      var x = Math.floor(Math.random() * (750 - 1 + 1)) + 1;;
      var y = Math.floor(Math.random() * (yrange.max - yrange.min + 1)) + yrange.min;
      var z = Math.floor(Math.random() * (75 - 15 + 1)) + 15;
  
      series.push([x, y, z]);
      baseval += 86400000;
      i++;
    }
    console.log(series)
    return series;
  }
  const series = [
    // {
    //   name: 'Bubble1',
    //   color: '#000',
    //   data: generateData(new Date('11 Feb 2017 GMT').getTime(), 10, {
    //     min: 10,
    //     max: 60
    //   })
    // },
    {
      name: 'Bubble1',
      color: '#ff0000',
      data: [
        [5, 5, 10],
      ]
    },
    {
      name: 'Bubble2',
      color: '#000',
      data: [
        [4, 6, 3],
      ]
    },
   
  ];
  const options = {
      grid: {
        show: false
      },
      legend: {
        show: false
      },
      chart: {
          height: 350,
          type: 'bubble',
          toolbar: {
            show: false,
          }
      },
      dataLabels: {
          enabled: true,
          textAnchor: 'start',
          style: {
            colors: ['#000']
          },
          formatter: function(val, { seriesIndex, dataPointIndex, w }) {
            return w.config.series[seriesIndex].name
          }
      },
      xaxis: {
          max: 10,
          type: 'category',
          labels: {
            show: false
          },
          categories: [
            'anything', 'another', 'aslsdf', 'lsdfjk'
          ],
          axisBorder: {
            show: false
          }

      },
      yaxis: {
          max: 10,
          labels: {
            show: false
          }
      }
    };


  return (
    <div>
      <Chart
        options={options}
        series={series}
        type="bubble"
        height={350}
      />
    </div>
  )
}
export default ApexChart;