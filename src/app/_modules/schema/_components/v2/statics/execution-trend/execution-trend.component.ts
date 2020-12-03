import { Component, OnInit } from '@angular/core';
import { ChartDataSets, ChartOptions, ChartTooltipModel, ChartType } from 'chart.js';
import { Label } from 'ng2-charts';

@Component({
  selector: 'pros-execution-trend',
  templateUrl: './execution-trend.component.html',
  styleUrls: ['./execution-trend.component.scss']
})
export class ExecutionTrendComponent implements OnInit {

  barChartLabels: Label[] = ['2006', '2007', '2008', '2009', '2010', '2011', '2012'];
  barChartType: ChartType = 'line';
  barChartLegend = true;
  barChartPlugins = [];

  barChartData: ChartDataSets[] = [
    {
      data: [100,79, 60, 81, 56, 55, 40], label: 'Error', stack : 'a' ,
      fill: false,
      lineTension: 0.1,
      backgroundColor: 'red',
      borderDash:[2],
      pointBorderColor: 'rgba(75,192,192,1)',
      pointBackgroundColor: '#fff',
      borderColor: '#FFEC8B',
      borderCapStyle: 'butt',
      borderJoinStyle: 'miter',
      pointBorderWidth: 0,
      pointHoverRadius: 0,
      pointHoverBackgroundColor: 'rgba(75,192,192,1)',
      pointHoverBorderColor: 'rgba(220,220,220,1)',
      pointHoverBorderWidth: 0,
      pointRadius: 0,
      pointHitRadius: 0,

    },
    {
      data: [28, 48, 40, 19, 86, 27, 90], label: 'Success', stack:'a' ,
      fill: 'rgba(187,205,151,0.5)',

    },
    {
      data: [10, 30, 40, 60, 86, 10, 90], label: 'Warning', stack:'a',
      fill: 'rgba(187,205,151,0.5)',
      borderDash:[5]
    }
  ];

  barChartOptions: ChartOptions = {
    responsive: true,
    tooltips:{
      custom:(tooltipModel: ChartTooltipModel) =>{
        // TODO ..
      }
    },
    scales:{
      xAxes: [{
          gridLines: {
              display:false,
              color: 'rgba(255,255,255,0.1)',
          },
          scaleLabel: {
            display: true,
            labelString: 'Years',
          },
          ticks: {
            fontColor: '#000',
          }
        }],
      yAxes: [{
        scaleLabel: {
           display: true,
           labelString: 'Values',
        },
        ticks: {
          fontColor: '#000',
        }
     }]
   },
   legend: {
    position: 'bottom',
    labels: {
      fontSize: 12,
      usePointStyle: false,
      boxWidth: 30,
    }
  }

  };


  constructor() { }

  ngOnInit(): void {
  }


}
