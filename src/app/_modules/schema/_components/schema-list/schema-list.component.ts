import { Component, OnInit } from '@angular/core';
import { Breadcrumb } from 'src/app/_models/breadcrumb';
import { SchemalistService } from 'src/app/_services/home/schema/schemalist.service';
import { ActivatedRoute, Router } from '@angular/router';
import { SchemaService } from 'src/app/_services/home/schema.service';
import { Observable } from 'rxjs';
import { SchemaListModuleList, SchemaListDetails } from 'src/app/_models/schema/schemalist';
import { Userdetails } from 'src/app/_models/userdetails';
import { MatDialog } from '@angular/material/dialog';
import { UploadDataComponent } from '../upload-data/upload-data.component';

@Component({
  selector: 'pros-schema-list',
  templateUrl: './schema-list.component.html',
  styleUrls: ['./schema-list.component.scss']
})
export class SchemaListComponent implements OnInit {
  title: Observable<string>;
  breadcrumb: Breadcrumb = {
    heading: ' List',
    links: []
  };
  constructor(
    private schemaListService: SchemalistService,
    private activatedRouter: ActivatedRoute,
    private router: Router,
    private schemaService: SchemaService,
    private matDialog: MatDialog
  ) { }

  schemaGroupId: string;
  schemaListDetails: SchemaListModuleList[] = [];
  userDetails: Userdetails;
  ngOnInit() {
    this.subscribeRouterParams();
  }
  private subscribeRouterParams() {
    this.activatedRouter.params.subscribe(params => {
      this.onLoadSchemaList();
    });
  }
  private onLoadSchemaList() {
    this.schemaListService.getSchemaList().subscribe(
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
    this.router.navigate(['/home/schema/schema-details', moduleId, schemaDetails.schemaId]);
  }
  public variants(moduleId: string, schemaId: string) {
    this.router.navigate(['/home/schema/schema-variants', moduleId, schemaId]);
  }
  public run(schemaId: string) {
    this.router.navigate(['/home/schema/schema-execution', schemaId]);
  }
  public edit(moduleId: string, schema: SchemaListDetails) {
    this.router.navigate(['/home/schema/create-schema', moduleId , schema.schemaId]);
  }

  uploadData(moduleId: string) {
    const dialogRef = this.matDialog.open(UploadDataComponent, {
      height: '706px',
      width: '1100px',
      data:{moduleId}
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
  }


}
