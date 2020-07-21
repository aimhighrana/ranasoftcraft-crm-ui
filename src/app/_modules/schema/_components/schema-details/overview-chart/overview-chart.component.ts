import { Component, OnInit, Input, OnChanges, SimpleChanges } from '@angular/core';
import { ChartDataSets, ChartOptions, TimeDisplayFormat } from 'chart.js';
import { Label } from 'ng2-charts';
import { SchemaDetailsService } from 'src/app/_services/home/schema/schema-details.service';
import { SchemaListDetails, SchemaStaticThresholdRes } from 'src/app/_models/schema/schemalist';

@Component({
  selector: 'pros-overview-chart',
  templateUrl: './overview-chart.component.html',
  styleUrls: ['./overview-chart.component.scss']
})
export class OverviewChartComponent implements OnInit, OnChanges {

  timeDateFormat: TimeDisplayFormat;
  overviewChartdata: ChartDataSets[];
  overviewChartLabels: Label[] = [];
  overviewChartLegend = true;
  overviewChartType = 'line';

  @Input()
  schemaId: string;
  @Input()
  runId: string;

  @Input()
  variantId: string;

  @Input()
  thresholdRes: SchemaStaticThresholdRes;

  schemaDetails: SchemaListDetails;
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
          enabled: false,
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


  constructor(
    private schemaDetailsService: SchemaDetailsService
  ) {
    this.overviewChartdata = [{ data: []}];
    this.schemaDetails = new SchemaListDetails();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if(changes.thresholdRes && changes.thresholdRes.previousValue !== changes.thresholdRes.currentValue) {
      this.thresholdRes = changes.thresholdRes.currentValue;
    }
  }

  ngOnInit() {
    this.getOverViewChartdata(this.schemaId, this.variantId);
  }

  private getOverViewChartdata(schemaId: string, variantId: string) {
    this.schemaDetailsService.getOverviewChartDetails(schemaId, variantId, undefined).subscribe(data => {
      this.overviewChartdata = data.dataSet as any;
    }, error => {
      console.error(`Execption while fetching overview chart data ${error}`);
    });
  }

}

