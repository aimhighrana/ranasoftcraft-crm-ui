import { Component, OnInit } from '@angular/core';
import { Breadcrumb } from 'src/app/_models/breadcrumb';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { SchemaService } from 'src/app/_services/home/schema.service';
import { ObjectTypeResponse } from 'src/app/_models/schema/schema';
import { Observable, of } from 'rxjs';
import * as XLSX from 'xlsx';
import { SchemaDetailsService } from 'src/app/_services/home/schema/schema-details.service';
import { MetadataModeleResponse, MetadataModel } from 'src/app/_models/schema/schemadetailstable';
import { MatSnackBar } from '@angular/material/snack-bar';
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
  moduleFormCtrl: FormGroup;
  uploadFileStepCtrl: FormGroup;
  dataTableCtrl: FormGroup;
  selectedMdoFldCtrl: FormControl;

  displayedColumns = ['excel','excelfrstrowdata','mapping','field'];
  dataSource = [];

  moduleList: ObjectTypeResponse[] = [];
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

  breadcrumb: Breadcrumb = {
    heading: 'Upload Data',
    links: [
      {
        link: '/home/schema',
        text: 'Schema group(s)'
      }
    ]
  };
  constructor(
    private _formBuilder: FormBuilder,
    private schemaService: SchemaService,
    private schemaDetailsService: SchemaDetailsService,
    private snackBar: MatSnackBar
  ) {
    this.moduleInpFrmCtrl = new FormControl();
    this.selectedMdoFldCtrl = new FormControl();
  }


  ngOnInit(): void {
    this.moduleFormCtrl = this._formBuilder.group({
      moduleInpFrmCtrl: ['', Validators.required]
    });
    this.uploadFileStepCtrl = this._formBuilder.group({
      uploadFileCtrl: ['', Validators.required]
    });
    this.dataTableCtrl = this._formBuilder.group({
      dataTableFldCtrl: ['', Validators.required]
    });
    this.getAllModules();
    this.moduleFormCtrl.valueChanges.subscribe(ctrl=>{
      const chngVal = ctrl ? ctrl.moduleInpFrmCtrl : '';
      if(typeof chngVal === 'string') {
        if(chngVal && chngVal !== '') {
          const filteredArray = this.moduleList.filter(module =>module.objectdesc.toLocaleLowerCase().indexOf(chngVal.toLocaleLowerCase()) !==-1);
          this.filteredModules = of(filteredArray);
        } else {
          this.filteredModules = of(this.moduleList);
        }
      }
    });
    this.headerFieldsList.push({fieldId: 'objectnumber',fieldDescri: 'Module Object Number'} as MetadataModel);
  }

  getAllModules() {
    this.schemaService.getAllObjectType().subscribe(data => {
      this.moduleList = data;
      this.filteredModules = of(data);
    }, error => {
      console.error('Error while fetching modules');
    });
  }
  moduleDisplayFn(obj: ObjectTypeResponse): string {
    return obj ?( obj.objectdesc ? obj.objectdesc : '') : '';
  }

  uploadFile() {
    document.getElementById('uploadFileCtrl').click();
  }

  fileChange(evt) {
    if(evt !== undefined) {
      const target: DataTransfer = (evt.target) as DataTransfer;
      if (target.files.length !== 1) throw new Error('Cannot use multiple files');
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
        console.log(this.uploadedData[0]);
        this.excelHeader = this.uploadedData[0] as string[];
        console.log(this.excelHeader);
        const file = evt.target.files[0]
        this.uploadedFile = file;
        this.uploadFileStepCtrl.get('uploadFileCtrl').setValue(file);

      };
      reader.readAsBinaryString(target.files[0]);
      this.excelMdoFieldMappedData = [];
    }
  }

  getMetadataFields(moduleId) {
    this.schemaDetailsService.getMetadataFields(moduleId).subscribe(response => {
      this.metadataFields = response;
      console.log(this.metadataFields);
      this.makeMetadataControle();
    }, error => {
      console.error(`Error ${error}`);
    });
  }

  makeMetadataControle(): void {
    const allMDF = this.metadataFields;
    this.metaDataFieldList = [];
    if(allMDF) {
      if(allMDF.headers) {
        Object.keys(allMDF.headers).forEach(header =>{
          this.metaDataFieldList.push(allMDF.headers[header]);
          this.headerFieldsList.push(allMDF.headers[header]);
        });
      }

      // grid
      if(allMDF.grids) {
        Object.keys(allMDF.grids).forEach(grid =>{
          if(allMDF.gridFields[grid]) {
            Object.keys(allMDF.gridFields[grid]).forEach(fldId => {
              this.metaDataFieldList.push(allMDF.gridFields[grid][fldId]);
            });
          }
        });
      }

      // // heirerchy
      if(allMDF.hierarchy) {
        Object.keys(allMDF.hierarchy).forEach(heiId =>{
          const heId = allMDF.hierarchy[heiId].heirarchyId;
          if(allMDF.hierarchyFields[heId]) {
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
          const selectedModuleId = event.previouslySelectedStep.stepControl.controls.moduleInpFrmCtrl ? event.previouslySelectedStep.stepControl.controls.moduleInpFrmCtrl.value.objectid: '';
          if(selectedModuleId) {this.getMetadataFields(selectedModuleId); }
          break;
        case 2:
          this.prepareDataSource();
          break;
        default:
          break;
    }
  }

  prepareDataSource() {
    const dataS: DataSource[] = [];
    for(let i=0; i< this.uploadedData[0].length; i++) {
      const datS: DataSource = {excelFld: this.uploadedData[0][i], excelFrstRow: this.uploadedData[1][i],mdoFldId: '',mdoFldDesc: '', columnIndex: i};
      dataS.push(datS);
    }
    this.dataSource = dataS;
  }

  updateMapFields(data) {
    if(data && data.fieldId !== '') {
      const mapData = {columnIndex: data.index, excelFld: data.execlFld, mdoFldId: data.fieldId,mdoFldDesc: data.fieldDesc, excelFrstRow: null};
      const availmap =  this.excelMdoFieldMappedData.filter(fill => fill.columnIndex === data.index);
      if(availmap.length === 0) {
        this.excelMdoFieldMappedData.push(mapData);
      } else {
        const oldMapFld = availmap[0];
        this.excelMdoFieldMappedData.splice(this.excelMdoFieldMappedData.indexOf(oldMapFld,1));
        oldMapFld.mdoFldId = data.fieldId;
        oldMapFld.mdoFldDesc = data.fieldDesc;
        this.excelMdoFieldMappedData.push(oldMapFld);
      }
      console.log(this.excelMdoFieldMappedData);
    } else {
      const availmap =  this.excelMdoFieldMappedData.filter(fill => fill.columnIndex === data.index);
      if(availmap.length !== 0) {
        this.excelMdoFieldMappedData.splice(this.excelMdoFieldMappedData.indexOf(availmap[0],1));
      }
    }
  }

  uploadFileData() {
    if(this.excelMdoFieldMappedData.length <= 0) {
      this.snackBar.open(`Please map atleast one field `, 'Close',{duration:2000});
      this.dataTableCtrl.controls.dataTableFldCtrl.setValue(''); // set valitor here
      return false;
    }
    this.schemaService.uploadUpdateFileData(this.uploadFileStepCtrl.get('uploadFileCtrl').value, this.fileSno).subscribe(res=>{
      console.log(res);
      this.fileSno = res;
      this.uploadDataHttpCall();
    },error=>{
      console.error(error);
    });
  }

  uploadDataHttpCall() {
    const objType = this.moduleFormCtrl.controls.moduleInpFrmCtrl.value.objectid;
    if(objType) {
      this.schemaService.uploadData(this.excelMdoFieldMappedData,objType, this.fileSno).subscribe(res=>{
        this.dataTableCtrl.controls.dataTableFldCtrl.setValue('done'); // remove valitor here
        this.snackBar.open(`Reqquest accept successfully `, 'Close',{duration:5000});
      },error=>{
        console.error(error);
        this.snackBar.open(`Something went wrong , please check mdo logs `, 'Close',{duration:5000});
      });
    }
  }

  getSelectedFieldId(columnInde: number): string {
    const availmap =  this.excelMdoFieldMappedData.filter(fill => fill.columnIndex === columnInde);
    if(availmap.length >0) {
      return availmap[0].mdoFldId;
    }
    return '';
  }

}
