import { Component, OnInit, Input, OnChanges, SimpleChanges } from '@angular/core';
import { ChartDataSets, ChartOptions, ChartType } from 'chart.js';
import { Label } from 'ng2-charts';
import { SchemaDetailsService } from 'src/app/_services/home/schema/schema-details.service';
import * as moment from 'moment';
import { CategoryInfo, CategoryChartDataSet } from 'src/app/_models/schema/schemadetailstable';
import { SchemaListDetails, SchemaStaticThresholdRes } from 'src/app/_models/schema/schemalist';
import { SchemalistService } from 'src/app/_services/home/schema/schemalist.service';

@Component({
  selector: 'pros-categories-chart',
  templateUrl: './categories-chart.component.html',
  styleUrls: ['./categories-chart.component.scss']
})
export class CategoriesChartComponent implements OnInit, OnChanges {

  @Input()
  schemaId: string;
  @Input()
  runId: string;
  @Input()
  categoryId: string;
  @Input()
  schemaStatus: string;
  @Input()
  variantId: string;

  @Input()
  thresholdRes: SchemaStaticThresholdRes;


  selectedCategoryId: string;
  selectedStatus: string;
  categoryInfoLst: CategoryInfo[];
  schemaStatusLst: string[];
  schemaDetails: SchemaListDetails = new SchemaListDetails();
  categoryChartData: ChartDataSets[] = [{ data: [] }];
  categoryChartDataDetails: CategoryChartDataSet;
  categoryChartLabels: Label[] = this.generateDynamicTimeSeries();
  categoryChartOptions: ChartOptions = {
    responsive: true,
    elements: { line: { fill: false } },
    legend: {
      display: false,
      position: 'top',

    },
    scales: {
      xAxes: [{
        type: 'time',
        time: { tooltipFormat: 'lll' },
        scaleLabel: { display: true, labelString: 'Date' },
        ticks: { maxRotation: 0 }
      }], yAxes: [{
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
          onPan() { console.log('I am pan ...!'); },
          onPanComplete() { console.log('On pan Complete !'); }
        },
        zoom: {
          enabled: false,
          grag: true,
          mode: 'x',
          limits: { max: 10, min: 0.5 },
          onZoom() { console.log('ONZOOM'); },
          onZoomComplete() { console.log('ZOOM Complete'); }
        }
      }
    }
  };
  categoryChartLegend = true;
  categoryChartType: ChartType = 'line';

  constructor(
    private schemaDetailsService: SchemaDetailsService,
    private schemaListService: SchemalistService
  ) {
    this.categoryChartData = [{ data: [] }];
    this.categoryInfoLst = [];
    this.schemaStatusLst = [];
    this.categoryChartDataDetails = new CategoryChartDataSet();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if(changes.thresholdRes && changes.thresholdRes.previousValue !== changes.thresholdRes.currentValue) {
      this.thresholdRes = changes.thresholdRes.currentValue;
    }
  }

  ngOnInit() {
    this.categoryInfoList();
    this.getSchemaStatus();
  }
  getCategoryChartData(schemaId: string, variantId: string, categoryId: string, schemaStatus: string) {
    categoryId = categoryId ? categoryId : '17052018003'; // 17052018003 for validness
    schemaStatus = schemaStatus ? schemaStatus : 'ERROR';
    this.selectedCategoryId = categoryId;
    this.selectedStatus = schemaStatus;
    this.schemaDetailsService.getCategoryChartDetails(schemaId, variantId, categoryId, schemaStatus).subscribe(data => {
      this.categoryChartData = data.dataSet;
      this.categoryChartDataDetails = data;
    });
  }

  generateDynamicTimeSeries(): Label[] {
    const array = new Array();
    for (let i = 0; i < 7; i++) {
      array.push(moment().add(i, 'd').toDate());
    }
    return array;
  }

  private categoryInfoList() {
    this.schemaDetailsService.getAllCategoryInfo().subscribe(data => {
      this.categoryInfoLst = data;
    }, error => {
      console.error('Error while getting category info list');
    });
  }

  private getSchemaStatus() {
    this.schemaDetailsService.getSchemaStatus().subscribe(data => {
      this.schemaStatusLst = data;
    }, error => {
      console.error('Error while fetch schema status');
    });
  }

  public changeCategoryChart() {
    if (this.selectedCategoryId && this.selectedStatus) {
      this.getCategoryChartData(this.schemaId, this.variantId, this.selectedCategoryId, this.selectedStatus);
    }
  }
}
