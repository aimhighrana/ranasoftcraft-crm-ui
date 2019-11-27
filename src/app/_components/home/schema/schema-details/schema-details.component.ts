import { Component, OnInit, Input, ViewChild, Output } from '@angular/core';
import { Breadcrumb } from 'src/app/_models/breadcrumb';
import { SchemaDetailsService } from 'src/app/_services/home/schema/schema-details.service';
import { ChartDataSets, ChartOptions, ChartType, ChartColor, ChartData } from 'chart.js';
import { Label, Color } from 'ng2-charts';
import { ActivatedRoute } from '@angular/router';
import { Schemadetailstable, SchemaDataSource } from 'src/app/_models/schema/schemadetailstable';
import { MatTableDataSource, MatPaginator, MatSort, MatSlideToggleChange, MatSlideToggle } from '@angular/material';
import { SelectionModel } from '@angular/cdk/collections';
import 'chartjs-plugin-zoom';
import { OverviewChartComponent } from './overview-chart/overview-chart.component';
import { EventEmitter } from 'events';
import { FormControl } from '@angular/forms';
@Component({
  selector: 'pros-schema-details',
  templateUrl: './schema-details.component.html',
  styleUrls: ['./schema-details.component.scss']
})
export class SchemaDetailsComponent implements OnInit {
  title:string;
  breadcrumb: Breadcrumb = {
    heading: 'Schema Deatils',
    links: [
      {
        link: '/home/schema',
        text: 'Schema'
      },{
        link: '/home/schema/schema-list/all',
        text: 'Schema List'
      } 
    ]
  }; 
  @ViewChild(OverviewChartComponent,{static:false})schemaOverviewChart:OverviewChartComponent;
  overviewChartFormControl = new FormControl();
  // for doughnut chart 
  doughnutChartType:ChartType='doughnut';
  doughnutChartLabels:Label[];
  doughnutChartData:ChartDataSets;
  doughnutColours:Color[]=[{backgroundColor:['rgba(76, 170, 0, 1)','rgba(195, 0, 0, 1)'],},];
  doughnutChartOption:ChartOptions={
    responsive:true,
    title:{display:true,text:this.title!=undefined?this.title:'Rule Check'}

  } 
  // for schema table 
  constructor(private _schemaDetailsService:SchemaDetailsService,private _activatedRouter:ActivatedRoute) { }
  ngOnInit() {
    this._activatedRouter.params.subscribe(params=>{
      let schemaId = params["schemaId"];
      let title = params["title"];
      this.title = title;
      this.breadcrumb.heading=this.title+' Detail(s)';
    });    
    this.getDoughnutChartData();           
  }

  getDoughnutChartData(){
    let doughnutData = this._schemaDetailsService.getDoughnutChartData();
    if(doughnutData!=undefined && doughnutData!=""){
      this.doughnutChartLabels = doughnutData.labels;
      this.doughnutChartData = doughnutData.dataSet.data;
      //this.doughnutColours = doughnutData.dataSet.backgroundColor;
    }
  } 
  overViewChartPercentage(event){
     console.log('Event ::'+event);    
     let status = this.overviewChartFormControl.value;
     if(status!=null && status){
        this.schemaOverviewChart.getOverViewChartDataInPercentage();
     }else{
       this.schemaOverviewChart.getOverViewChartdata();
     }
     console.log('is Selected ::'+this.overviewChartFormControl.value);     
  }

}
