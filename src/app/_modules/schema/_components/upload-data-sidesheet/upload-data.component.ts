import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { SchemaService } from 'src/app/_services/home/schema.service';
import { DataSource, ValidationError } from 'src/app/_models/schema/schema';
import * as XLSX from 'xlsx';
import { SchemaDetailsService } from 'src/app/_services/home/schema/schema-details.service';
import { MetadataModeleResponse, MetadataModel } from 'src/app/_models/schema/schemadetailstable';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatStepper } from '@angular/material/stepper';
import { ActivatedRoute, Router } from '@angular/router';
import { SchemaListModuleList } from '@models/schema/schemalist';

type UploadedDataType = any[][];
@Component({
  selector: 'pros-upload-data',
  templateUrl: './upload-data.component.html',
  styleUrls: ['./upload-data.component.scss']
})
export class UploadDataComponent implements OnInit, AfterViewInit {
  currentStep: number;
  uploadFileStepCtrl: FormGroup;
  dataTableCtrl: FormGroup;
  displayedColumns = ['excel', 'excelfrstrowdata', 'field'];
  dataSource = [];
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
  isUploaded: boolean;
  @ViewChild(MatStepper) stepper!: MatStepper;

  /**
   * module ID of current module
   */
  moduleId: string;

  /**
   * store module Info and schemalist of current moduleId
   */
  moduleInfo: SchemaListModuleList;

  /**
   * To hold the outlet name.
   */
  outlet: string;

  /**
   * Hold upload error message and status
   */
  uploadError: ValidationError = {
    status: false,
    message: ''
  };

  constructor(
    private _formBuilder: FormBuilder,
    private schemaService: SchemaService,
    private schemaDetailsService: SchemaDetailsService,
    private snackBar: MatSnackBar,
    private router: Router,
    private activatedRoute: ActivatedRoute,
  ) { }
  ngOnInit(): void {
    this.activatedRoute.params.subscribe((params) => {
      this.moduleId = params.moduleId;
      this.outlet = params.outlet;
      this.getSchemaList();
    })

    this.uploadFileStepCtrl = this._formBuilder.group({
      uploadFileCtrl: ['', Validators.required]
    });
    this.dataTableCtrl = this._formBuilder.group({
      dataTableFldCtrl: ['', Validators.required]
    });
    this.headerFieldsList.push({ fieldId: 'objectnumber', fieldDescri: 'Module Object Number' } as MetadataModel);
  }

  uploadFile() {
    this.uploadError = {
      status: false,
      message: ''
    }
    this.isUploaded = false;
    if (document.getElementById('uploadFileCtrl')) {
      document.getElementById('uploadFileCtrl').click();
    }
  }

  /**
   * Function to get the excel file and get fields and data
   * @param evt file uploaded event
   */
  fileChange(evt: Event) {
    let errorText = '';
    if (evt !== undefined) {
      this.uploadError.status = false;
      this.uploadError.message = '';
      const target: DataTransfer = (evt.target) as unknown as DataTransfer;
      if (target.files.length !== 1) {
        errorText = 'Cannot use multiple files';
        this.uploadError = {
          status: true,
          message: errorText
        }
        return;
      }
      // check file type
      let type = '';
      try {
        type = target.files[0].name.split('.')[1];
      } catch (ex) {
        console.error(ex)
      }
      if (type === 'xlsx' || type === 'xls' || type === 'csv') {
        // check size of file
        const size = target.files.item(0).size;
        const sizeKb = Math.round((size / 1024));
        if (sizeKb > (10 * 1024)) {
          this.uploadedFile = null;
          errorText = `File size too large , upload less then 10 MB`;
          this.uploadError = {
            status: true,
            message: errorText
          }
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
          const file = target.files[0]
          this.uploadedFile = file;
          this.uploadFileStepCtrl.get('uploadFileCtrl').setValue(this.uploadedFile);
        };
        reader.readAsBinaryString(target.files[0]);
        this.excelMdoFieldMappedData = [];
      } else {
        errorText = `Unsupported file format, allowed file formats are .xlsx, .xls and .csv`;
        this.uploadedFile = null;
        this.uploadError = {
          status: true,
          message: errorText
        }
      }
    }
  }

  /**
   * method to maually control step
   * @param value pass step Index
   */
  step(value: number) {
    this.stepper.selectedIndex = value;
    this.isUploaded = false;
  }

  /**
   * get all fields of module
   * @param moduleId the value of module
   */
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

  /**
   * make metadata fields
   */
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

  /**
   * change step when click on next
   * @param event value of event
   */
  controlStepChange(event: any) {
    switch (event.selectedIndex) {
      case 1:
        this.prepareDataSource();
        break;
      default:
        break;
    }
  }

  /**
   * prepare data to show from excel file
   */
  prepareDataSource() {
    const dataS: DataSource[] = [];
    for (let i = 0; i < this.uploadedData[0].length; i++) {
      const datS: DataSource = { excelFld: this.uploadedData[0][i], excelFrstRow: this.uploadedData[1][i], mdoFldId: '', mdoFldDesc: '', columnIndex: i };
      dataS.push(datS);
    }
    this.dataSource = dataS;
  }

  /**
   * map excel field to meta data field
   * @param data value of fields
   */
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

    if(this.excelMdoFieldMappedData.length>0){
      this.uploadError = {
        status: false,
        message: ''
      }
    }
  }

  /**
   * function to upload data on server
   * @param stepper value of step
   */
  uploadFileData(stepper: MatStepper) {
    if (this.excelMdoFieldMappedData.length === 0) {
      this.uploadError = {
        status: true,
        message: `Please map atleast one field`
      }
      this.dataTableCtrl.controls.dataTableFldCtrl.setValue(''); // set valitor here
      return;
    }
    this.schemaService.uploadUpdateFileData(this.uploadFileStepCtrl.get('uploadFileCtrl').value, this.fileSno).subscribe(res => {
      this.fileSno = res;
      this.uploadDataHttpCall(stepper);
    }, error => {
      console.error(`Error ${error}`);
    });
  }

  uploadDataHttpCall(stepper: MatStepper) {
    const objType = this.moduleInfo.moduleId;
    if (objType) {
      this.schemaService.uploadData(this.excelMdoFieldMappedData, objType, this.fileSno).subscribe(res => {
        // remove valitor here and move to next step
        this.dataTableCtrl.controls.dataTableFldCtrl.setValue('done');
        this.isUploaded = true;
      }, error => {
        console.error(`Error ${error}`);
        this.snackBar.open(`Something went wrong , please check mdo logs `, 'Close', { duration: 5000 });
      });
    }
  }

  /**
   * update map excel field to meta data field
   * @param columnInde value of column index
   */
  getSelectedFieldId(columnInde: number): string {
    const availmap = this.excelMdoFieldMappedData.filter(fill => fill.columnIndex === columnInde);
    if (availmap.length > 0) {
      return availmap[0].mdoFldId;
    }
    return '';
  }

  /**
   * function to close the sidesheet
   */
  close() {
    this.router.navigate([{ outlets: { [`${this.outlet}`]: null } }]);
  }

  /**
   * get schema list according to module ID
   */
  public getSchemaList() {
    this.schemaService.getSchemaInfoByModuleId(this.moduleId).subscribe((moduleData) => {
      if(moduleData) {
        this.moduleInfo = moduleData;
        this.getMetadataFields(this.moduleInfo.moduleId);
      }
    }, error => {
      console.error('Error: {}', error.message);
    });
 }

 ngAfterViewInit() {
  this.stepper.selectionChange.subscribe((change) => {
    this.currentStep = change.selectedIndex;
  });
 }
}