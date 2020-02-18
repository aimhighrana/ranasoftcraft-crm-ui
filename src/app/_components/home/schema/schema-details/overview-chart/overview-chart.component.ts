import { Component, OnInit, Input } from '@angular/core';
import { ChartDataSets, ChartOptions, TimeDisplayFormat } from 'chart.js';
import { Label } from 'ng2-charts';
import { SchemaDetailsService } from 'src/app/_services/home/schema/schema-details.service';
import { SchemaListDetails } from 'src/app/_models/schema/schemalist';
import { SchemalistService } from 'src/app/_services/home/schema/schemalist.service';

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

  @Input()
  schemaId: string;
  @Input()
  runId: string;
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


  constructor(
    private schemaDetailsService: SchemaDetailsService,
    private schemaListService: SchemalistService
  ) {
    this.overviewChartdata = [];
    this.schemaDetails = new SchemaListDetails();
  }

  ngOnInit() {
    this.getSchemaDetails();
  }

  getOverViewChartdata(schemaId: string, variantId: string, runId: string) {
    this.schemaDetailsService.getOverviewChartDetails(schemaId, variantId, undefined).subscribe(data => {
      this.overviewChartdata = data.dataSet as any;
      console.log(this.overviewChartdata);
    }, error => {
      console.error('Execption while fetching overview chart data');
    });
  }

  generateDynamicTimeSeries(): Label[] {
    const array = new Array();
    /*for (let i = 7; i > 1; i--) {
      array.push(moment().add(i, 'd').toDate());
    }*/
    return array;
  }

  private getSchemaDetails() {
    this.schemaListService.getSchemaDetailsBySchemaId(this.schemaId).subscribe(data => {
      this.schemaDetails = data;
      this.getOverViewChartdata(this.schemaId, this.schemaDetails.variantId, this.schemaDetails.runId);
    });
  }
}

