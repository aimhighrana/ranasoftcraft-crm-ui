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
  overviewChartLabels: Label[] = [];
  overviewChartLegend = true;
  overviewChartType = 'line';

  @Input()
  schemaId: string;
  @Input()
  runId: string;

  @Input()
  variantId: string;

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
    this.overviewChartdata = [{ data: []}];
    this.schemaDetails = new SchemaListDetails();
  }

  ngOnInit() {
    this.getSchemaDetails();
    this.getOverViewChartdata(this.schemaId, this.variantId);
  }

  private getOverViewChartdata(schemaId: string, variantId: string) {
    this.schemaDetailsService.getOverviewChartDetails(schemaId, variantId, undefined).subscribe(data => {
      this.overviewChartdata = data.dataSet as any;
    }, error => {
      console.error(`Execption while fetching overview chart data ${error}`);
    });
  }

  private getSchemaDetails() {
    this.schemaListService.getSchemaDetailsBySchemaId(this.schemaId).subscribe(data => {
      this.schemaDetails = data;
    },error=>{
      console.error(`Exception while fetching schema details ${error}`);
    });
  }
}

