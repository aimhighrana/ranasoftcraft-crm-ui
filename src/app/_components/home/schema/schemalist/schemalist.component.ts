import { Component, OnInit } from '@angular/core';
import { Breadcrumb } from 'src/app/_models/breadcrumb';
import { SchemaService } from 'src/app/_services/home/schema.service';
import { SchemalistService } from 'src/app/_services/home/schema/schemalist.service';
import { ActivatedRoute, Router } from '@angular/router';
import { SchemaList, SchemaDetails } from 'src/app/_models/schema/schemalist';

@Component({
  selector: 'pros-schemalist',
  templateUrl: './schemalist.component.html',
  styleUrls: ['./schemalist.component.scss']
})
export class SchemalistComponent implements OnInit {
  title:string;
  breadcrumb: Breadcrumb = {
    heading: this.title+' List',
    links: [
      {
        link: '/home/schema',
        text: 'Schema'
      } 
    ]
  };
  constructor(private _schemaService:SchemaService,private _schemaListService:SchemalistService,private _activatedRouter:ActivatedRoute,private _router:Router) { }

  schemaGroupId:string;
  schemaLists:SchemaList[];  
  ngOnInit() {
    this._activatedRouter.params.subscribe(params=>{
      let grpId = params['schemaGrpId'];
      let title = params['title'];
      if(grpId!=undefined && grpId!=""){
        this.schemaGroupId = grpId;
        this.title = title;
        this.breadcrumb.heading=this.title+' List';
      }
    });
    this.getAllSchemaList();
  }

  getAllSchemaList(){
    if(this.schemaGroupId!=undefined && this.schemaGroupId!="")
     this.schemaLists =  this._schemaListService.getAllSchemaDetails(this.schemaGroupId);
  }

  showSchemaDetails(schemaDetails:any){
    this._router.navigate(['/home/schema/schema-details',schemaDetails.schema_id,schemaDetails.title]);
  }
}
