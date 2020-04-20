import { Component, OnInit } from '@angular/core';
import { Breadcrumb } from 'src/app/_models/breadcrumb';
import { SchemalistService } from 'src/app/_services/home/schema/schemalist.service';
import { ActivatedRoute, Router } from '@angular/router';
import { SchemaService } from 'src/app/_services/home/schema.service';
import { Observable } from 'rxjs';
import { SchemaListModuleList, SchemaListDetails } from 'src/app/_models/schema/schemalist';
import { Userdetails } from 'src/app/_models/userdetails';

@Component({
  selector: 'pros-schema-list',
  templateUrl: './schema-list.component.html',
  styleUrls: ['./schema-list.component.scss']
})
export class SchemaListComponent implements OnInit {
  title: Observable<string>;
  breadcrumb: Breadcrumb = {
    heading: ' List',
    links: [
      {
        link: '/home/schema',
        text: 'Schema group(s)'
      }
    ]
  };
  constructor(
    private schemaListService: SchemalistService,
    private activatedRouter: ActivatedRoute,
    private router: Router,
    private schemaService: SchemaService
  ) { }

  schemaGroupId: string;
  schemaListDetails: SchemaListModuleList[] = [];
  userDetails: Userdetails;
  ngOnInit() {
    this.subscribeRouterParams();
  }
  private subscribeRouterParams() {
    this.activatedRouter.params.subscribe(params => {
      const grpId = params.schemaGrpId;
      if (grpId && this.schemaGroupId !== grpId) {
        this.schemaGroupId = grpId;
        this.onLoadSchemaList();
        this.groupDetails();
      }
    });
  }
  private onLoadSchemaList() {
    this.schemaListService.getSchemaListByGroupId(this.schemaGroupId).subscribe(
      (responseData: SchemaListModuleList[]) => {
        this.schemaListDetails = responseData;
      }, error => {
        console.error('Error while fetching schema list data');
      }
    );
  }
  private groupDetails() {
    this.schemaService.getSchemaGroupDetailsBySchemaGrpId(this.schemaGroupId).subscribe(data => {
      this.breadcrumb.heading = data.groupName + ' List';
    }, error => {
      console.error('Error while fetch group details');
    });
  }
  public showSchemaDetails(schemaDetails: any, moduleId: string) {
    this.router.navigate(['/home/schema/schema-details', moduleId, this.schemaGroupId, schemaDetails.schemaId]);
  }
  public variants(moduleId: string, schemaId: string) {
    this.router.navigate(['/home/schema/schema-variants', moduleId, this.schemaGroupId, schemaId]);
  }
  public run(schemaId: string) {
    this.router.navigate(['/home/schema/schema-execution', this.schemaGroupId, schemaId]);
  }
  public edit(moduleId: string, schema: SchemaListDetails) {
    this.router.navigate(['/home/schema/create-schema', moduleId, this.schemaGroupId, schema.schemaId]);
  }
}
