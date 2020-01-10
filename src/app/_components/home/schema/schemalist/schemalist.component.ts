import { Component, OnInit } from '@angular/core';
import { Breadcrumb } from 'src/app/_models/breadcrumb';
import { SchemalistService } from 'src/app/_services/home/schema/schemalist.service';
import { ActivatedRoute, Router } from '@angular/router';
import { SchemaService } from 'src/app/_services/home/schema.service';
import { SchemaGroupDetailsResponse } from 'src/app/_models/schema/schema';
import { Observable } from 'rxjs';
import { SchemaListModuleList } from 'src/app/_models/schema/schemalist';
import { Userdetails } from 'src/app/_models/userdetails';

@Component({
  selector: 'pros-schemalist',
  templateUrl: './schemalist.component.html',
  styleUrls: ['./schemalist.component.scss']
})
export class SchemalistComponent implements OnInit {
  title: Observable<string>;
  breadcrumb: Breadcrumb = {
    heading: ' List',
    links: [
      {
        link: '/home/schema',
        text: 'Schema'
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
  moduleSchemaListDetails: SchemaListModuleList[] = [];
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
        this.getSchemaGroupDetails();
      }
    });
  }
  private onLoadSchemaList() {
    this.schemaListService.getSchemaListByGroupId(this.schemaGroupId).subscribe(
      (responseData: SchemaListModuleList[]) => {
        this.moduleSchemaListDetails = responseData;
      }, error => {
        console.error('Error while fetching schema list data');
      }
    );
  }
  showSchemaDetails(schemaDetails: any, moduleId: string) {
    this.router.navigate(['/home/schema/schema-details', moduleId, this.schemaGroupId, schemaDetails.schemaId]);
  }
  private getSchemaGroupDetails() {
    this.schemaService.getSchemaGroupDetailsBySchemaGrpId(this.schemaGroupId).subscribe((response: SchemaGroupDetailsResponse) => {
          this.breadcrumb.heading = response.groupName + ' List';
        }, error => {
          console.error('Error while fetching schema group details !');
        }
      );
  }
  public showVariants(data: any) {
    this.router.navigate(['/home/schema/schema-variants', data.moduleId, data.groupId, data.schemaId]);
  }
}
