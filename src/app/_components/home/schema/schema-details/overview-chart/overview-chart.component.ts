import { Component, OnInit } from '@angular/core';
import { ChartDataSets, ChartOptions, TimeDisplayFormat } from 'chart.js';
import { Label } from 'ng2-charts';
import { SchemaDetailsService } from 'src/app/_services/home/schema/schema-details.service';
import * as moment from 'moment';

@Component({
  selector: 'pros-overview-chart',
  templateUrl: './overview-chart.component.html',
  styleUrls: ['./overview-chart.component.scss']
})
export class OverviewChartComponent implements OnInit {
  timeDateFormat: TimeDisplayFormat;
  overviewChartdata: ChartDataSets[];
  overviewChartLabels: Label[] = this.generateDynamicTimeSeries();
  overviewChartLegend = true;
  overviewChartType = 'line';
  overviewChartOptions: ChartOptions = {
    responsive: true,
    scales: {
      xAxes: [{
        type: 'time',
        time: {
          tooltipFormat: 'lll'
        },
        scaleLabel: {
          display: true,
          labelString: 'Date'
        },
        ticks: {
          maxRotation: 0,
          fontSize: 12
        }
      }],
      yAxes: [{
        scaleLabel: {
          display: true,
          labelString: 'Value'
        }
      }]
    },
    plugins: {
      zoom: {
        pan: {
          enabled: true,
          mode: 'x',
          speed: 10,
          threshold: 10,
          onPan() {console.log('I am pan ...!'); },
          onPanComplete() {console.log('On pan Complete !'); }
        },
        zoom: {
          enabled: true,
          grag: true,
          mode: 'x',
          /*limits: {max: 10, min: 0.5}, */
          onZoom() {console.log('ONZOOM'); },
          onZoomComplete() {console.log('ZOOM Complete'); }

        }
      }
    },
    tooltips: {
      mode: 'index',
      intersect: false
    },
    hover: {
      mode: 'nearest',
      intersect: true
    },
    legend: {
      display: false
    }
  };


  constructor(private schemaDetailsService: SchemaDetailsService) { }

  ngOnInit() {
    this.getOverViewChartdata();
  }

  getOverViewChartdata() {
    this.schemaDetailsService.getOverViewChartData().subscribe(data => {
      this.overviewChartdata = data.dataSet;
    });
  }

  generateDynamicTimeSeries(): Label[] {
    const array = new Array();
    for (let i = 0; i < 7; i++) {
      array.push(moment().add(i, 'd').toDate());
    }
    return array;
  }

}

