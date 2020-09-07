import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { SchemaService } from 'src/app/_services/home/schema.service';
import { ObjectTypeResponse } from 'src/app/_models/schema/schema';
import { Observable } from 'rxjs';
import * as XLSX from 'xlsx';
import { SchemaDetailsService } from 'src/app/_services/home/schema/schema-details.service';
import { MetadataModeleResponse, MetadataModel } from 'src/app/_models/schema/schemadetailstable';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatStepper } from '@angular/material/stepper';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { SchemaListComponent } from '../schema-list/schema-list.component';
export interface DataSource {
  excelFld: string;
  excelFrstRow: string;
  mdoFldId: string;
  mdoFldDesc: string;
  columnIndex: number;
}
type UploadedDataType = any[][];
@Component({
  selector: 'pros-upload-data',
  templateUrl: './upload-data.component.html',
  styleUrls: ['./upload-data.component.scss']
})
export class UploadDataComponent implements OnInit {
  isLinear = true;
  uploadFileStepCtrl: FormGroup;
  dataTableCtrl: FormGroup;
  selectedMdoFldCtrl: FormControl;
  displayedColumns = ['excel', 'excelfrstrowdata', 'mapping', 'field'];
  dataSource = [];
  filteredModules: Observable<ObjectTypeResponse[]>;
  moduleInpFrmCtrl: FormControl;
  excelHeader: string[];
  metadataFields: MetadataModeleResponse;
  metaDataFieldList: MetadataModel[] = [];
  headerFieldsList: MetadataModel[] = [];
  uploadedData: UploadedDataType;
  excelMdoFieldMappedData: DataSource[] = [];
  fileSno = '';
  uploadedFile: File;
  uploadDisabled = true;
  plantCode: string;
  @ViewChild(MatStepper) stepper!: MatStepper;
  constructor(
    private _formBuilder: FormBuilder,
    private schemaService: SchemaService,
    private schemaDetailsService: SchemaDetailsService,
    private snackBar: MatSnackBar,
    public dialogRef: MatDialogRef<SchemaListComponent>,
    @Inject(MAT_DIALOG_DATA) public moduleInfo: any,
  ) {
    this.moduleInpFrmCtrl = new FormControl();
    this.selectedMdoFldCtrl = new FormControl();
  }
  ngOnInit(): void {
    // get all field of module
    if (this.moduleInfo.module) {
      this.getMetadataFields(this.moduleInfo.module.moduleId);
    } else {
      this.getMetadataFields(this.moduleInfo.object);
    }
    this.uploadFileStepCtrl = this._formBuilder.group({
      uploadFileCtrl: ['', Validators.required]
    });
    this.dataTableCtrl = this._formBuilder.group({
      dataTableFldCtrl: ['', Validators.required]
    });
    this.headerFieldsList.push({ fieldId: 'objectnumber', fieldDescri: 'Module Object Number' } as MetadataModel);
  }
  uploadFile() {
    if (document.getElementById('uploadFileCtrl')) {
      document.getElementById('uploadFileCtrl').click();
    }
  }
  fileChange(evt) {
    if (evt !== undefined) {
      const target: DataTransfer = (evt.target) as DataTransfer;
      if (target.files.length !== 1) throw new Error('Cannot use multiple files');
      // check file type
      let type = '';
      try {
        type = target.files[0].name.split('.')[1];
      } catch (ex) { console.error(ex) }
      if (type === 'xlsx' || type === 'xls' || type === 'csv') {
        // check size of file
        const size = target.files.item(0).size;
        const sizeKb = Math.round((size / 1024));
        if (sizeKb > (10 * 1024)) {
          this.uploadedFile = null;
          this.uploadFileStepCtrl.setValue({ uploadFileCtrl: '' });
          this.snackBar.open(`File size too large , upload less then 10 MB`, 'Close', { duration: 5000 });
          return false;
        }
        const reader: FileReader = new FileReader();
        reader.onload = (e: any) => {
          /* read workbook */
          const bstr: string = e.target.result;
          const wb: XLSX.WorkBook = XLSX.read(bstr, { type: 'binary' });
          /* grab first sheet */
          const wsname: string = wb.SheetNames[0];
          const ws: XLSX.WorkSheet = wb.Sheets[wsname];
          /* save data */
          const data = XLSX.utils.sheet_to_json(ws, { header: 1 });
          this.uploadedData = (data as UploadedDataType);
          this.excelHeader = this.uploadedData[0] as string[];
          // move to next step
          this.stepper.next();
          const file = evt.target.files[0]
          this.uploadedFile = file;
          this.uploadFileStepCtrl.get('uploadFileCtrl').setValue(file);
        };
        reader.readAsBinaryString(target.files[0]);
        this.excelMdoFieldMappedData = [];
      } else {
        this.uploadedFile = null;
        this.uploadFileStepCtrl.setValue({ uploadFileCtrl: '' });
        this.snackBar.open(`Only allow .xlsx, .xls and .csv file format`, 'Close', { duration: 5000 });
      }
    }
  }
  getMetadataFields(moduleId) {
    this.schemaDetailsService.getMetadataFields(moduleId).subscribe(response => {
      this.metadataFields = response;
      Object.keys(this.metadataFields.headers).forEach(fldid => {
        this.plantCode = this.metadataFields.headers[fldid].plantCode;
      });
      this.uploadDisabled = false;
      this.makeMetadataControle();
    }, error => {
      console.error(`Error ${error}`);
    });
  }
  makeMetadataControle(): void {
    const allMDF = this.metadataFields;
    this.metaDataFieldList = [];
    if (allMDF) {
      if (allMDF.headers) {
        Object.keys(allMDF.headers).forEach(header => {
          this.metaDataFieldList.push(allMDF.headers[header]);
          this.headerFieldsList.push(allMDF.headers[header]);
        });
      }
      // grid
      if (allMDF.grids) {
        Object.keys(allMDF.grids).forEach(grid => {
          if (allMDF.gridFields[grid]) {
            Object.keys(allMDF.gridFields[grid]).forEach(fldId => {
              this.metaDataFieldList.push(allMDF.gridFields[grid][fldId]);
            });
          }
        });
      }
      // // heirerchy
      if (allMDF.hierarchy) {
        Object.keys(allMDF.hierarchy).forEach(heiId => {
          const heId = allMDF.hierarchy[heiId].heirarchyId;
          if (allMDF.hierarchyFields[heId]) {
            Object.keys(allMDF.hierarchyFields[heId]).forEach(fldId => {
              this.metaDataFieldList.push(allMDF.hierarchyFields[heId][fldId]);
            });
          }
        });
      }
    }
  }
  controlStepChange(event: any) {
    switch (event.selectedIndex) {
      case 1:
        this.prepareDataSource();
        break;
      default:
        break;
    }
  }
  prepareDataSource() {
    const dataS: DataSource[] = [];
    for (let i = 0; i < this.uploadedData[0].length; i++) {
      const datS: DataSource = { excelFld: this.uploadedData[0][i], excelFrstRow: this.uploadedData[1][i], mdoFldId: '', mdoFldDesc: '', columnIndex: i };
      dataS.push(datS);
    }
    this.dataSource = dataS;
  }
  updateMapFields(data) {
    if (data && data.fieldId !== '') {
      const mapData = { columnIndex: data.index, excelFld: data.execlFld, mdoFldId: data.fieldId, mdoFldDesc: data.fieldDesc, excelFrstRow: null };
      const availmap = this.excelMdoFieldMappedData.filter(fill => fill.columnIndex === data.index);
      if (availmap.length === 0) {
        this.excelMdoFieldMappedData.push(mapData);
      } else {
        const oldMapFld = availmap[0];
        this.excelMdoFieldMappedData.splice(this.excelMdoFieldMappedData.indexOf(oldMapFld, 1));
        oldMapFld.mdoFldId = data.fieldId;
        oldMapFld.mdoFldDesc = data.fieldDesc;
        this.excelMdoFieldMappedData.push(oldMapFld);
      }
    } else {
      const availmap = this.excelMdoFieldMappedData.filter(fill => fill.columnIndex === data.index);
      if (availmap.length !== 0) {
        this.excelMdoFieldMappedData.splice(this.excelMdoFieldMappedData.indexOf(availmap[0], 1));
      }
    }
  }
  uploadFileData(stepper: MatStepper) {
    if (this.excelMdoFieldMappedData.length <= 0) {
      this.snackBar.open(`Please map atleast one field `, 'Close', { duration: 2000 });
      this.dataTableCtrl.controls.dataTableFldCtrl.setValue(''); // set valitor here
      return false;
    }
    this.schemaService.uploadUpdateFileData(this.uploadFileStepCtrl.get('uploadFileCtrl').value, this.fileSno).subscribe(res => {
      this.fileSno = res;
      if (this.moduleInfo.object) {
        this.uploadCorrectionHttpCall(stepper);
      } else {
        this.uploadDataHttpCall(stepper);
      }
    }, error => {
      console.error(`Error ${error}`);
    });
  }
  uploadDataHttpCall(stepper: MatStepper) {
    const objType = this.moduleInfo.module.moduleId;
    if (objType) {
      this.schemaService.uploadData(this.excelMdoFieldMappedData, objType, this.fileSno).subscribe(res => {
        // remove valitor here and move to next step
        this.dataTableCtrl.controls.dataTableFldCtrl.setValue('done');
        stepper.next();
      }, error => {
        console.error(`Error ${error}`);
        this.snackBar.open(`Something went wrong , please check mdo logs `, 'Close', { duration: 5000 });
      });
    }
  }
  uploadCorrectionHttpCall(stepper: MatStepper) {
    const objType = this.moduleInfo.object;
    const schemaId = this.moduleInfo.schemaId;
    const runId = this.moduleInfo.runId;
    if (objType) {
      this.schemaService.uploadCorrectionData(this.excelMdoFieldMappedData, objType, schemaId, runId, this.plantCode, this.fileSno).subscribe(res => {
        // remove valitor here and move to next step
        this.dataTableCtrl.controls.dataTableFldCtrl.setValue('done');
        stepper.next();
      }, error => {
        console.error(`Error ${error}`);
        this.snackBar.open(`Something went wrong , please check mdo logs `, 'Close', { duration: 5000 });
      });
    }
  }
  getSelectedFieldId(columnInde: number): string {
    const availmap = this.excelMdoFieldMappedData.filter(fill => fill.columnIndex === columnInde);
    if (availmap.length > 0) {
      return availmap[0].mdoFldId;
    }
    return '';
  }
  /**
   * Close dialog after saved or click close
   */
  closeDialog() {
    this.dialogRef.close();
  }
}