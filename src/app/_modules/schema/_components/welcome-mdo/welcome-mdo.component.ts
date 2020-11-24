import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { SchemalistService } from '@services/home/schema/schemalist.service';
import { UploadDatasetComponent } from '../upload-dataset/upload-dataset.component';

@Component({
  selector: 'pros-welcome-mdo',
  templateUrl: './welcome-mdo.component.html',
  styleUrls: ['./welcome-mdo.component.scss']
})
export class WelcomeMdoComponent implements OnInit {

  /**
   * Modules list to pre-populate
   */
  modulesList = [];

  /**
   * Schema list to pre-populate
   */
  schemaLists = [];

  data : any = {};

  constructor(
    public matDialog: MatDialog,
    private schemaListService: SchemalistService
  ) { }

  ngOnInit(): void {
    this.getObjectTypes();
  }

  getObjectTypes() {
    this.schemaListService.getSchemaList().subscribe((modules: []) => {
      if (modules && modules.length > 0) {
        this.modulesList.push(...modules);
      }
    });
  }

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

  schemaList(objectId) {
    this.modulesList.forEach(module => {
      if(module.moduleId === objectId) {
        this.data.objectid = module.moduleId;
        this.data.objectdesc = module.moduleDesc;
        this.schemaLists = module.schemaLists;
      }
    })
  }

  selectschema(schema?) {
    this.data.schemaId = schema ? schema.schemaId : null;
    this.data.schemadesc = schema ? schema.schemaDescription : null;
    this.openUploadScreen();
  }

}
