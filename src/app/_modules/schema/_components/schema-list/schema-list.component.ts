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
import { MatSnackBar } from '@angular/material/snack-bar';

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
    private matDialog: MatDialog,
    private matSnackBar: MatSnackBar,
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
  public onLoadSchemaList() {
    this.schemaListService.getSchemaList().subscribe(
      (responseData: SchemaListModuleList[]) => {
        this.schemaListDetails = responseData;
      }, error => {
        console.error('Error while fetching schema list data');
      }
    );
  }
  public groupDetails() {
    this.schemaService.getSchemaGroupDetailsBySchemaGrpId(this.schemaGroupId).subscribe(data => {
      this.breadcrumb.heading = data.groupName + ' List';
    }, error => {
      console.error('Error while fetch group details');
    });
  }

  public schemaDetails(moduleId: string, schema: SchemaListDetails) {
    if(schema.collaboratorModels){
      if(schema.collaboratorModels.isAdmin || schema.collaboratorModels.isViewer){
        this.router.navigate(['/home/schema/schema-details', moduleId, schema.schemaId, schema.variantId]);
      }
    }
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

  uploadData(module: SchemaListModuleList) {
    const dialogRef = this.matDialog.open(UploadDataComponent, {
      height: '706px',
      width: '1100px',
      data:{module},
      disableClose: true
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
  }

  /**
   * Delete schema by schema id
   * @param schemaId deleteable schemaid
   */
  delete(schemaId: string) {
    this.schemaService.deleteSChema(schemaId).subscribe(res=>{
      this.matSnackBar.open(`Successfully deleted `, 'Close',{duration:5000});
      this.router.routeReuseStrategy.shouldReuseRoute = () => false;
      this.router.onSameUrlNavigation = 'reload'
      this.router.navigate(['/home/schema']);
    }, error=>{
      this.matSnackBar.open(`Something went wrong `, 'Close',{duration:5000});
    })
  }


}
