import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { SchemalistService } from '@services/home/schema/schemalist.service';
import { Subscription } from 'rxjs';
import { UploadDatasetComponent } from '../upload-dataset/upload-dataset.component';

@Component({
  selector: 'pros-welcome-mdo',
  templateUrl: './welcome-mdo.component.html',
  styleUrls: ['./welcome-mdo.component.scss']
})
export class WelcomeMdoComponent implements OnInit, OnDestroy {

  /**
   * Modules list to pre-populate
   */
  modulesList = [];

  /**
   * Schema list to pre-populate
   */
  schemaLists = [];

  /**
   * save required data for upload-dataset
   */
  data : any = {};

  /**
   * All the http or normal subscription will store in this array
   */
  subscriptions: Subscription[] = [];

  /**
   * constructor of class
   * @param matDialog Instance of MatDialog
   * @param schemaListService Instance the Schema List service class
   */
  constructor(
    public matDialog: MatDialog,
    private schemaListService: SchemalistService
  ) { }

  /**
   * Unsubscribe from Observables, services and DOM events
   */
  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => {
      sub.unsubscribe();
    });
  }

  /**
   * load pre loaded function
   */
  ngOnInit(): void {
    this.getObjectTypes();
  }

  /**
   * return all the modules with their schemas
   */
  getObjectTypes() {
    const schemaListSub = this.schemaListService.getSchemaList().subscribe((modules: []) => {
      if (modules && modules.length > 0) {
        this.modulesList.push(...modules);
      }
    });
    this.subscriptions.push(schemaListSub);
  }

  /**
   * open Upload data dialog
   */
  openUploadScreen() {
    const dialogRef = this.matDialog.open(UploadDatasetComponent, {
      height: '800px',
      width: '800px',
      data: {selecteddata:this.data},
      disableClose: true,
    });
    dialogRef.afterClosed().subscribe(result => {
      this.data = {};
      console.log('The dialog was closed');
    });
  }

  /**
   * Open schemalist by using that objectId
   * @param objectId value selected oject
   */
  schemaList(objectId) {
    this.modulesList.forEach(module => {
      if(module.moduleId === objectId) {
        this.data.objectid = module.moduleId;
        this.data.objectdesc = module.moduleDesc;
        this.schemaLists = module.schemaLists;
      }
    })
  }

  /**
   * Open Upload data of selected schemaId or for new schema
   * @param schema value when existing schema selected
   */
  selectschema(schema?) {
    this.data.schemaId = schema ? schema.schemaId : null;
    this.data.schemadesc = schema ? schema.schemaDescription : null;
    this.openUploadScreen();
  }
}
