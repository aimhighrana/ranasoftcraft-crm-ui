import { Component, OnInit, ViewChild } from '@angular/core';
import { Breadcrumb } from 'src/app/_models/breadcrumb';
import { SchemaDetailsService } from 'src/app/_services/home/schema/schema-details.service';
import { ChartDataSets, ChartOptions, ChartType } from 'chart.js';
import { Label, Color } from 'ng2-charts';
import { ActivatedRoute } from '@angular/router';
import 'chartjs-plugin-zoom';
import { OverviewChartComponent } from './overview-chart/overview-chart.component';
import { FormControl } from '@angular/forms';
@Component({
  selector: 'pros-schema-details',
  templateUrl: './schema-details.component.html',
  styleUrls: ['./schema-details.component.scss']
})
export class SchemaDetailsComponent implements OnInit {
  title: string;
  breadcrumb: Breadcrumb = {
    heading: 'Schema Deatils',
    links: [
      {
        link: '/home/schema',
        text: 'Schema'
      }, {
        link: '/home/schema/schema-list/all',
        text: 'Schema List'
      }
    ]
  };
  @ViewChild(OverviewChartComponent, {static: false})schemaOverviewChart: OverviewChartComponent;
  overviewChartFormControl = new FormControl();
  // for doughnut chart
  doughnutChartType: ChartType = 'doughnut';
  doughnutChartLabels: Label[];
  doughnutChartData: ChartDataSets;
  doughnutColours: Color[] = [{backgroundColor: ['rgba(76, 170, 0, 1)', 'rgba(195, 0, 0, 1)'], }, ];
  doughnutChartOption: ChartOptions = {
    responsive: true,
    title: {display: true, text: this.title !== undefined ? this.title : 'Rule Check'}

  };
  // for schema table
  constructor(private schemaDetailsService: SchemaDetailsService, private activatedRouter: ActivatedRoute) { }
  ngOnInit() {
    this.activatedRouter.params.subscribe(params => {
      const schemaId = params.schemaId;
      const title = params.title;
      this.title = title;
      this.breadcrumb.heading = this.title + ' Detail(s)';
    });
    this.getDoughnutChartData();
  }

  getDoughnutChartData() {
    const doughnutData = this.schemaDetailsService.getDoughnutChartData();
    if (doughnutData !== undefined && doughnutData !== '') {
      this.doughnutChartLabels = doughnutData.labels;
      this.doughnutChartData = doughnutData.dataSet.data;
      // this.doughnutColours = doughnutData.dataSet.backgroundColor;
    }
  }
  overViewChartPercentage(event) {
     console.log('Event ::' + event);
     const status = this.overviewChartFormControl.value;
     if (status != null && status) {
        this.schemaOverviewChart.getOverViewChartDataInPercentage();
     } else {
       this.schemaOverviewChart.getOverViewChartdata();
     }
     console.log('is Selected ::' + this.overviewChartFormControl.value);
  }

}
