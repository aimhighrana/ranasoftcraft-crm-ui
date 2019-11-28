import { Component, OnInit } from '@angular/core';
import { Breadcrumb } from 'src/app/_models/breadcrumb';
import { SchemaService } from 'src/app/_services/home/schema.service';
import { SchemalistService } from 'src/app/_services/home/schema/schemalist.service';
import { ActivatedRoute, Router } from '@angular/router';
import { SchemaList } from 'src/app/_models/schema/schemalist';

@Component({
  selector: 'pros-schemalist',
  templateUrl: './schemalist.component.html',
  styleUrls: ['./schemalist.component.scss']
})
export class SchemalistComponent implements OnInit {
  title: string;
  breadcrumb: Breadcrumb = {
    heading: this.title + ' List',
    links: [
      {
        link: '/home/schema',
        text: 'Schema'
      }
    ]
  };
  constructor(
    private schemaService: SchemaService,
    private schemaListService: SchemalistService,
    private activatedRouter: ActivatedRoute,
    private router: Router
  ) { }

  schemaGroupId: string;
  schemaLists: SchemaList[];
  ngOnInit() {
    this.activatedRouter.params.subscribe(params => {
      const grpId = params.schemaGrpId;
      const title = params.title;
      if (grpId !== undefined && grpId !== '') {
        this.schemaGroupId = grpId;
        this.title = title;
        this.breadcrumb.heading = this.title + ' List';
      }
    });
    this.getAllSchemaList();
  }

  getAllSchemaList() {
    if (this.schemaGroupId !== undefined && this.schemaGroupId !== '') {
     this.schemaLists =  this.schemaListService.getAllSchemaDetails(this.schemaGroupId);
    }
  }

  showSchemaDetails(schemaDetails: any) {
    this.router.navigate(['/home/schema/schema-details', schemaDetails.schema_id, schemaDetails.title]);
  }
}
