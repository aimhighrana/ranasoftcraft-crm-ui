import { Component, OnInit } from '@angular/core';
import { GenericWidgetComponent } from '../../generic-widget/generic-widget.component';
import { TimeDisplayFormat, ChartDataSets, ChartOptions } from 'chart.js';
import { Label } from 'ng2-charts';
import * as moment from 'moment';
import { WidgetService } from 'src/app/_services/widgets/widget.service';
import { BehaviorSubject } from 'rxjs';
import { TimeSeriesWidget } from '../../../_models/widget';

@Component({
  selector: 'pros-timeseries-widget',
  templateUrl: './timeseries-widget.component.html',
  styleUrls: ['./timeseries-widget.component.scss']
})
export class TimeseriesWidgetComponent extends GenericWidgetComponent implements OnInit {

  timeDateFormat: TimeDisplayFormat;
  dataSet: ChartDataSets[];
  dataSetlabel: Label[] = [];
  widgetInfo:BehaviorSubject<TimeSeriesWidget> = new BehaviorSubject<TimeSeriesWidget>(null);
  /**
   * Timeseries chart option config see chart.js for more details
   */
  options: ChartOptions = {
    responsive: true,
    scales: {
      xAxes: [{
        type: 'time',
        time: {
          tooltipFormat: 'lll',
          unit: 'week'
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
    private widgetService: WidgetService
  ) {
    super();
  }

  ngOnInit(): void {
    this.dataSet = this.getDummyData().dataSet;
    this.widgetService.getTimeseriesWidgetInfo(this.widgetId).subscribe(res=>{
      this.widgetInfo.next(res);
    },error=>console.error(`Error : ${error}`));
  }

  emitEvtFilterCriteria(event: any): void {
    throw new Error('Method not implemented.');
  }

  getDummyData(): any {
    return {dataSet:[{type:'bar',label:'ZMRO',id:'ZMRO_001',backgroundColor:'rgba(249, 229, 229, 1)',borderColor:'rgba(195, 0, 0, 1)',fill:true,data:[{x:this.getDateString(2),y:90820},{x:this.getDateString(3),y:26593},{x:this.getDateString(5),y:37414},{x:this.getDateString(6),y:37414},{x:this.getDateString(9),y:2759},{x:this.getDateString(11),y:21445}]},{type:'bar',label:'HAWA',id:'HAWA_001',backgroundColor:'rgba(231, 246, 237, 1)',borderColor:'rgba(18, 164, 74, 1)',fill:true,data:[{x:this.getDateString(1),y:86789},{x:this.getDateString(2),y:1929},{x:this.getDateString(7),y:10},{x:this.getDateString(9),y:762},{x:this.getDateString(10),y:8979},{x:this.getDateString(18),y:0}]},{type:'bar',label:'SPARE_PART',id:'SPARE_PART_001',backgroundColor:'rgba(246, 244, 249, 1)',borderColor:'rgba(163, 145, 197, 1)',fill:true,data:[{x:this.getDateString(0),y:111},{x:this.getDateString(1),y:2356},{x:this.getDateString(4),y:8979},{x:this.getDateString(8),y:234},{x:this.getDateString(12),y:678},{x:this.getDateString(16),y:2356}]},{type:'bar',label:'MRO_MAT',id:'MRO_MAT_001',backgroundColor:'rgba(248, 240, 246, 1)',borderColor:'rgba(182, 104, 170, 1)',fill:true,data:[{x:this.getDateString(4),y:276},{x:this.getDateString(7),y:124},{x:this.getDateString(9),y:8962},{x:this.getDateString(10),y:7862},{x:this.getDateString(14),y:243},{x:this.getDateString(17),y:7783}]}]};
  }
  getDateString(days) {
    return moment().add(days, 'd').format('MM/DD/YYYY HH:mm');
  }
}
