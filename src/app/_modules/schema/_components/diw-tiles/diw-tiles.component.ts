import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SchemaListModuleList, SchemaListDetails, SchemaStaticThresholdRes } from '@models/schema/schemalist';
import { SchemaService } from '@services/home/schema.service';
import { SchemaExecutionRequest } from '@models/schema/schema-execution';
import { SchemaExecutionService } from '@services/home/schema/schema-execution.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UploadDatasetComponent } from '../upload-dataset/upload-dataset.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'pros-diw-tiles',
  templateUrl: './diw-tiles.component.html',
  styleUrls: ['./diw-tiles.component.scss']
})
export class DiwTilesComponent implements OnInit {

  /**
   * To have the module id of selected module
   */
  public moduleId: string;

  /**
   * To have the module data according to the selected module.
   */
  public moduleData: SchemaListModuleList;

  /**
   * To prepare all schema data according to their statics.
   */
  public moduleSchemaData: SchemaStaticThresholdRes[];


  /**
   * constructor of class
   * @param activatedRoute Instance the ActivatedRoute class
   * @param schemaService Instance of schema service class
   * @param matSnackBar Instance of MatSnackBar class
   * @param matDialog Instance of MatDialog class
   */
  constructor(private activatedRoute: ActivatedRoute,
    private schemaService: SchemaService,
    private schemaExecutionService: SchemaExecutionService,
    private matSnackBar: MatSnackBar,
    private matDialog: MatDialog
  ) { }

  /**
   * ANGULAR HOOK
   */
  ngOnInit(): void {
    this.getRouteParams();
  }

  /**
   * get moduleId from the active router parameters
   */
  private getRouteParams() {
    this.activatedRoute.params.subscribe((params) => {
      this.moduleId = params.moduleId;
      this.moduleSchemaData = [];
      this.getSchemaList();
    })
  }

  /**
   * get schema list according to module ID
   */
  public getSchemaList() {
    this.schemaService.getSchemaInfoByModuleId(this.moduleId).subscribe((moduleData) => {
      // get data according to the schema statics
      this.moduleData = moduleData;
      this.getSchemaStatics(moduleData.schemaLists);
    }, error => {
      console.error('Error: {}', error.message);
    })
  }

  /**
   * Run schema now ..
   * @param schema runable schema details .
   */
  runSchema(schema: SchemaListDetails) {
    const schemaExecutionReq: SchemaExecutionRequest = new SchemaExecutionRequest();
    schemaExecutionReq.schemaId = schema.schemaId;
    schemaExecutionReq.variantId = '0'; // 0 for run all
    this.schemaExecutionService.scheduleSChema(schemaExecutionReq).subscribe(data => {
      if (data) {
        const exitSchema = this.moduleSchemaData.filter(sc => sc.schemaId === schema.schemaId)[0];
        if (exitSchema) {
          exitSchema.isInRunning = true;
        }
      }
    }, error => {
      this.matSnackBar.open(`Something went wrong while running schema`, 'Close', { duration: 5000 });
    });
  }

  /**
   * Getting Statics of Schema according to the schema ID.
   * @param schemaListArray all schema list array of a module
   */
  public getSchemaStatics(schemaListArray) {
    schemaListArray.map((schemaList: SchemaListDetails) => {
      const schemaData: SchemaStaticThresholdRes = {
        schemaId: '',
        threshold: '',
        thresHoldStatus: '',
        successCnt: 0,
        errorCnt: 0,
        totalCnt: 0,
        correctedCnt: 0,
        exeStrtDate: '',
        exeEndDate: '',
        isInRunning: false,
        schemaDescription: ''
      };
      schemaData.schemaId = schemaList.schemaId;
      schemaData.isInRunning = schemaList.isInRunning;
      schemaData.schemaDescription = schemaList.schemaDescription;
      this.moduleSchemaData.length = 0;
      this.schemaService.getSchemaThresholdStatics(schemaList.schemaId).subscribe((schemaStatics) => {
        schemaData.threshold = Math.round((schemaStatics.threshold + Number.EPSILON) * 100) / 100;
        schemaData.thresHoldStatus = schemaStatics.thresHoldStatus;
        schemaData.totalCnt = schemaStatics.totalCnt;
        schemaData.errorCnt = schemaStatics.errorCnt;
        schemaData.successCnt = schemaStatics.successCnt;
        schemaData.exeEndDate = schemaStatics.exeEndDate;
        this.moduleSchemaData.push(schemaData);
      }, error => {
        // console.log(error);
        schemaData.threshold = 0;
        schemaData.totalCnt = 0;
        schemaData.thresHoldStatus = 'undefined'
        schemaData.errorCnt = 0;
        schemaData.successCnt = 0;
        this.moduleSchemaData.push(schemaData);
      })
    })
  }

  /**
   * Function to open upload dataset dialog box
   * @param moduleId Id of the selected module
   * @param moduleDesc Description of the selected module
   */
  openUploadScreen(moduleId, moduleDesc) {
    const dialogRef = this.matDialog.open(UploadDatasetComponent, {
      height: '800px',
      width: '700px',
      data: {
        objectid: moduleId,
        objectdesc: moduleDesc
      },
      disableClose: true,
    });
    dialogRef.afterClosed().subscribe(() => {
      console.log('The dialog was closed');
      this.getSchemaList();
    });
  }
}