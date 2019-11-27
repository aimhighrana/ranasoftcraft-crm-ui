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
  timeDateFormat:TimeDisplayFormat;
  overviewChartdata:ChartDataSets[];
  overviewChartLabels:Label[]=this.generateDynamicTimeSeries();
  overviewChartLegend:boolean=true;
  overviewChartType:string ='line';
  overviewChartOptions:ChartOptions={
    responsive:true,
    scales:{
      xAxes:[{
        type:"time",
        time:{          
          tooltipFormat:'lll'
        },
        scaleLabel:{
          display:true,
          labelString:"Date"
        },
        ticks:{
          maxRotation:0,         
          fontSize:12
          

        }
      }],
      yAxes:[{
        scaleLabel:{
          display:true,
          labelString:"Value"
        }
      }]
    },
    plugins:{      
      zoom:{
        pan:{
          enabled:true,
          mode:'x',
          speed:10,
          threshold:10,            
          onPan:function(){console.log('I am pan ...!');},
          onPanComplete:function(){console.log('On pan Complete !')}
        },
        zoom:{
          enabled:true,
          grag:true,
          mode:'x',
          limits:{max:10,min:0.5},          
          onZoom:function(){console.log('ONZOOM')},
          onZoomComplete:function(){console.log('ZOOM Complete')}

        }
      }
    },
    tooltips:{
      mode:'index',
      intersect:false
    },
    hover:{
      mode:'nearest',
      intersect:true
    },
    legend:{
      display:false
    }
  }

  
  constructor(private _schemaDetailsService:SchemaDetailsService) { }

  ngOnInit() {
    this.getOverViewChartdata();
  }

  getOverViewChartdata(){
    let data = this._schemaDetailsService.getOverViewChartData();
    if(data!=undefined && data!=''){
      this.overviewChartdata = data.dataSet;
      //this.overviewChartLabels = data.labels;
    }
  }

  getOverViewChartDataInPercentage(){
    let data = this._schemaDetailsService.getOverViewChartData();
    let dataSet = data.dataSet;
    if(dataSet!=undefined && dataSet!=''){      
      let counter = 0;
      dataSet.forEach(element => {        
        let dataArray = element.data;
        let total = 0;
        let newArray = new Array();
        dataArray.forEach(dElement => {
          total+=dElement;           
        });
        dataArray.forEach(dElement => {          
          let val = (dElement/total)*100;
          newArray.push(val);
        });
        dataSet[counter].data=newArray;
        counter++;

      });
    }
    this.overviewChartdata= dataSet;
  }

  generateDynamicTimeSeries():Label[]{
    let array = new Array();
    for(let i=0;i<7;i++){
      array.push(moment().add(i,'d').toDate());
    }
    return array;
  }

}

