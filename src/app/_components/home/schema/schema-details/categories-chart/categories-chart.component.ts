import { Component, OnInit } from '@angular/core';
import { ChartDataSets, ChartOptions, ChartType } from 'chart.js';
import { Label } from 'ng2-charts';
import { SchemaDetailsService } from 'src/app/_services/home/schema/schema-details.service';
import * as moment from 'moment';

@Component({
  selector: 'pros-categories-chart',
  templateUrl: './categories-chart.component.html',
  styleUrls: ['./categories-chart.component.scss']
})
export class CategoriesChartComponent implements OnInit {

  categoryChartData:ChartDataSets[];
  categoryChartLabels:Label[]=this.generateDynamicTimeSeries();
  categoryChartOptions:ChartOptions={
    responsive:true,     
    elements:{line:{fill:false}},
    legend:{
      display:true,
      position:'top',
      
    },   
    scales:{xAxes:[{
      type:'time',
      time:{tooltipFormat:'lll'},
      scaleLabel:{display:true,labelString:'Date'},
      ticks:{maxRotation:0}      
    }],yAxes:[{
      scaleLabel:{
        display:true,
        labelString:'Value'
      }
    }]},
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
   }
  }
  categoryChartLegend:boolean =true;
  categoryChartType:ChartType='line';

  constructor(private __schemaDetailsService:SchemaDetailsService) { }

  ngOnInit() {
    this.getCategoryChartData();
  }
  getCategoryChartData(){
    let categoryChartdata = this.__schemaDetailsService.getCategoryChartData();
    if(categoryChartdata!=undefined && categoryChartdata!=''){
      this.categoryChartData = categoryChartdata.dataSet;
      //this.categoryChartLabels = categoryChartdata.labels;
    }
  }

  generateDynamicTimeSeries():Label[]{
    let array = new Array();
    for(let i=0;i<7;i++){
      array.push(moment().add(i,'d').toDate());
    }
    return array;
  }
}
