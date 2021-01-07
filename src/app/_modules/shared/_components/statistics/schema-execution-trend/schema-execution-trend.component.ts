import { Component, Input, OnChanges, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { SchemaExecutionLog } from '@models/schema/schemadetailstable';
import { SchemaDetailsService } from '@services/home/schema/schema-details.service';
import { ChartDataSets, ChartOptions, ChartType } from 'chart.js';
import { BaseChartDirective, Label } from 'ng2-charts';
import * as moment from 'moment';
import * as _ from 'lodash';

@Component({
  selector: 'pros-schema-execution-trend',
  templateUrl: './schema-execution-trend.component.html',
  styleUrls: ['./schema-execution-trend.component.scss']
})
export class SchemaExecutionTrendComponent implements OnInit, OnChanges {

  /**
   * To store module ID
   */
  @Input() moduleId: string;

  /**
   * To store schema ID
   */
  @Input() schemaId: string;

  /**
   * To store variant ID
   */
  @Input() variantId = '0';

  @ViewChild(BaseChartDirective) chart: BaseChartDirective;

  dataSetLabels: Label[] = [];
  chartType: ChartType = 'line';
  chartPlugins = [];


  dataSet: ChartDataSets[] = [
    {
      data: [],
      label: 'Error',
      stack : 'a' ,
      fill: 'red',
      borderColor: 'red',
      borderDash:[5],
      /* lineTension: 0.1,
      backgroundColor: 'red',
      borderDash:[5],
      pointBorderColor: 'rgba(75,192,192,1)',
      pointBackgroundColor: '#fff',
      borderColor: 'orange',
      borderCapStyle: 'butt',
      borderJoinStyle: 'miter',
      pointBorderWidth: 0,
      pointHoverRadius: 0,
      pointHoverBackgroundColor: 'rgba(75,192,192,1)',
      pointHoverBorderColor: 'rgba(220,220,220,1)',
      pointHoverBorderWidth: 0,
      pointRadius: 0,
      pointHitRadius: 0, */
    },
    {
      data: [],
      label: 'Success',
      stack:'a' ,
      fill: 'rgba(187,205,151,0.5)',
      borderColor: 'green',
      borderDash:[5]
    }
  ];

  chartOptions: ChartOptions = {
    responsive: true,
    tooltips: {
      callbacks: {
        label: (tooltipItem, data) => {
          let label = data.datasets[tooltipItem.datasetIndex].label || '';
          label += ': ';
          const sum = data.datasets.reduce((total, dataSet) => total + +dataSet.data[tooltipItem.index], 0);
          const perc = Math.round((+tooltipItem.yLabel / sum) * 100);
          label += `${perc || 0} %`;
          return label;
        }
      },
      backgroundColor: 'rgba(255,255,255,0.9)',
      bodyFontColor: '#999',
      borderColor: '#999',
      borderWidth: 1,
      caretPadding: 15,
      displayColors: true,
      enabled: true,
      intersect: true,
      mode: 'x',
      titleFontColor: '#999',
      titleMarginBottom: 10,
      xPadding: 15,
      yPadding: 15,
    },
    scales: {
      xAxes: [{
        gridLines: {
          display: false,
          color: 'rgba(255,255,255,0.1)',
        },
        scaleLabel: {
          display: true,
          labelString: 'Weeks',
        },
        ticks: {
          fontColor: '#000',
        }
      }],
      yAxes: [{
        scaleLabel: {
          display: true,
          labelString: 'Values'
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

  /**
   * mock data for preparing chart
   */
  data: SchemaExecutionLog[] = [];


  /**
   * constructor of class
   */
  constructor(private schemaDetailsService: SchemaDetailsService) { }


  ngOnChanges(changes: SimpleChanges): void {
    this.dataSetLabels = [];
    this.dataSet.forEach(d => {
      d.data = [];
    })
    this.getExecutionTrendData(this.schemaId, this.variantId);
  }

  /**
   * ANGULAR HOOK
   */
  ngOnInit(): void {

  }

  /**
   * Function to get execution trend data
   * @param schemaId: schema id
   * @param variantId: variant id
   */
  getExecutionTrendData(schemaId: string, variantId: string) {
    this.schemaDetailsService.getExecutionOverviewChartData(schemaId, variantId)
      .subscribe((response) => {
        console.log(response);
        this.data = response;
        this.prepareDataSet(this.data);
      }, (error) => {
        console.log('Something went wrong while getting exec trend data.', error.message)
      })
  }

  /**
   * Function to prepare data set
   * @param rawData: sorted trend data according to exec start date
   */
  prepareDataSet(rawData: SchemaExecutionLog[]) {

    const currentMonth = new Date().getMonth();
    const groupedData = this.groupByMonthWeeks(currentMonth, rawData);
    let weeklyErr = 0;
    let weeklySuccess = 0;
    let weeklyTotal = 0;

    for (const data of groupedData) {
      // calc the avg of week..
      weeklyTotal = data.executions.reduce((total, execution) => total + execution.total, 0);
      weeklySuccess = data.executions.reduce((total, execution) => total + execution.totalSuccess, 0);
      weeklyErr = data.executions.reduce((total, execution) => total + execution.totalError, 0);

      console.log(weeklyErr, weeklySuccess, weeklyTotal);

      weeklyErr = weeklyErr / data.executions.length;
      weeklySuccess = weeklySuccess / data.executions.length;

      // Push the data into chart properties..
      this.dataSetLabels.push(`Week ${data.weekOfMonth}`);
      this.dataSet[0].data.push(weeklyErr);
      this.dataSet[1].data.push(weeklySuccess);
    }

    console.log(this.dataSet);
    console.log(this.dataSetLabels);
  }

  groupByMonthWeeks(currentMonth: number, data: SchemaExecutionLog[]) {

    const groupedData = _.chain(data)
      .filter(row => moment(row.exeStrtDate).month() === currentMonth)
      .groupBy(row => moment(row.exeStrtDate).isoWeek())
      .map((executions, weekOfYear) => {
        console.log('Week of year ', weekOfYear)
        // const weekOfMonth = Math.ceil(moment(executions[0].exeStrtDate).date() / 7);
        const groupFirstDate = executions[0].exeStrtDate;
        const weekStartDate = moment(groupFirstDate).startOf('isoWeek').format('ll');
        const weekEndDate = moment(groupFirstDate).endOf('isoWeek').format('ll');
        const weekOfMonth = Math.ceil((moment(groupFirstDate).date() + 6 - moment(groupFirstDate).day()) / 7);
        return { weekOfMonth, weekStartDate, weekEndDate, executions };
      })
      .sortBy('weekOfMonth')
      .value();

    console.log(groupedData);
    return groupedData;

  }

}
