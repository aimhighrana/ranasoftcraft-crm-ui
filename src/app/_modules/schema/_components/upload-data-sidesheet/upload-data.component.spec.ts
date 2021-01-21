import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UploadDataComponent } from './upload-data.component';
import { AppMaterialModuleForSpec } from 'src/app/app-material-for-spec.module';
import { MatIconModule } from '@angular/material/icon';
import { RouterTestingModule } from '@angular/router/testing';
import { FormsModule, ReactiveFormsModule, FormGroup, FormControl } from '@angular/forms';
import { BreadcrumbComponent } from 'src/app/_modules/shared/_components/breadcrumb/breadcrumb.component';
import { AddTileComponent } from 'src/app/_modules/shared/_components/add-tile/add-tile.component';
import { MatStepper } from '@angular/material/stepper';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { of } from 'rxjs';
import { SchemaDetailsService } from '@services/home/schema/schema-details.service';
import { SchemaService } from '@services/home/schema.service';
import { DataSource } from '@models/schema/schema';
import { SchemaListModuleList } from '@models/schema/schemalist';
import { MetadataModel } from '@models/schema/schemadetailstable';

describe('UploadDataComponent', () => {
  let component: UploadDataComponent;
  let fixture: ComponentFixture<UploadDataComponent>;
  let schemaDetailsServiceSpy: SchemaDetailsService;
  let schemaService: SchemaService;

  const mockDialogRef = {
    close: jasmine.createSpy('close')
  };
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [AppMaterialModuleForSpec, MatIconModule, RouterTestingModule, FormsModule, ReactiveFormsModule],
      declarations: [ UploadDataComponent, BreadcrumbComponent, AddTileComponent ],
      providers: [
        {
          provide: MatDialogRef,
          useValue: mockDialogRef
        }, { provide: MAT_DIALOG_DATA, useValue: {}
        },
         SchemaDetailsService,
         SchemaService
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UploadDataComponent);
    component = fixture.componentInstance;
    schemaDetailsServiceSpy = fixture.debugElement.injector.get(SchemaDetailsService);
    schemaService = fixture.debugElement.injector.get(SchemaService);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('prepareDataSource(), should prepare datasource', async(()=>{
    const uploadedData = [[1,2],[4,7]]
    component.uploadedData = uploadedData;
    component.prepareDataSource();
    expect(component.prepareDataSource).toBeTruthy();
  }));

  it('updateMapFields(), should upate map fields', async(()=>{
    const data = {index: 0, execlFld: 'Test112', fieldId: 'objnr',fieldDesc: 'Objectnumber', excelFrstRow: null};
    component.excelMdoFieldMappedData =  [{columnIndex: 1, mdoFldId: 'Test'}as DataSource];
    component.updateMapFields(data);
    expect(component.excelMdoFieldMappedData.length).toEqual(2);

    const data1 = {index: 1, execlFld: 'Test112', fieldId: 'objnr',fieldDesc: 'Objectnumber', excelFrstRow: null};
    component.excelMdoFieldMappedData =  [{columnIndex: 1, mdoFldId: 'Test'}as DataSource];
    component.updateMapFields(data1);
    expect(component.excelMdoFieldMappedData.length).toEqual(1);

    const data2 = {index: 1, execlFld: 'Test112', fieldId: '',fieldDesc: 'Objectnumber', excelFrstRow: null};
    component.excelMdoFieldMappedData =  [{columnIndex: 1, mdoFldId: 'Test'}as DataSource];
    component.updateMapFields(data2);
    expect(component.excelMdoFieldMappedData.length).toEqual(0);

    const data3 = {index: 1, execlFld: 'Test112', fieldId: '',fieldDesc: 'Objectnumber', excelFrstRow: null};
    component.excelMdoFieldMappedData =  [{columnIndex: 0, mdoFldId: 'Test'}as DataSource];
    component.updateMapFields(data3);
    expect(component.excelMdoFieldMappedData.length).toEqual(1);
  }));

  it('controlStepChange(), should control the stepper', async(()=>{
    const event = {selectedIndex:0};
    component.controlStepChange(event);
    expect(component.controlStepChange).toBeTruthy();
  }));

  it('getMetadataFields(), get existing metadata fields', async(() =>{
    const moduleId = '6576576';
    spyOn(schemaDetailsServiceSpy,'getMetadataFields').withArgs(moduleId).and.returnValue(of())
    component.getMetadataFields(moduleId);
    expect(schemaDetailsServiceSpy.getMetadataFields).toHaveBeenCalledWith(moduleId);
  }));

  it('makeMetadataControle(), help to make metadata control for all header , hierarchy and grid field ', async(()=>{component.metadataFields = {
    gridFields:{ADDINFO:{ADD_HEIGHT:{fieldId:'ADD_HEIGHT'}}},
    grids:{ADDINFO:{fieldId: 'ADDINFO'}}, headers:{AACR:{fieldId: 'AACR'}},
    hierarchy: [{ heirarchyId: '1', heirarchyText: 'Plant DATA' ,fieldId: 'PLANT', objectType: '1005', objnr: 1, structureId: '0002', tableName: 'PLANTDATA_0002' }],
    hierarchyFields:{1:{ABC_INDIC:{fieldId:'ABC_INDIC'}}}
  }
    component.makeMetadataControle();
    expect(component.metaDataFieldList.length).toEqual(3);
  }));

  it('uploadFile(), should click on uploadFile input ', async(()=>{
    component.moduleInfo = {moduleId:'1005'} as SchemaListModuleList;
    component.uploadFile();
    expect(component.uploadFile).toBeTruthy();
  }));

  it('ngOnint()', (() => {
    component.moduleInfo = {moduleId:'1005'} as SchemaListModuleList;;
    spyOn(schemaDetailsServiceSpy,'getMetadataFields').withArgs(undefined).and.returnValue(of());
    component.ngOnInit();
    expect(component.ngOnInit).toBeTruthy();
  }));

  it('fileChange', async(()=>{
    component.fileChange(undefined);
    expect(component.fileChange).toBeTruthy();
  }));

  it('uploadDataHttpCall()  ', ()=>{
    const stepper: MatStepper = {next:null} as MatStepper;
    component.moduleInfo = {moduleId:'1005'} as SchemaListModuleList;
    component.excelMdoFieldMappedData = [{excelFld:'id',excelFrstRow:'3',mdoFldId:'1005',mdoFldDesc:'Material',columnIndex:1}];

    component.schemaId = '276822';
    component.runid = '87264528';

    spyOn(schemaService,'uploadData').withArgs(component.excelMdoFieldMappedData,'1005', component.fileSno).and.returnValue(of());

    spyOn(schemaService, 'uploadCorrectionData').withArgs(component.excelMdoFieldMappedData, '1005',component.schemaId, component.runid, component.plantCode, component.fileSno).and.returnValue(of());

    component.uploadDataHttpCall(stepper) ;

    component.importcorrectedRec = true;
    component.uploadDataHttpCall(stepper) ;

    expect(component.uploadDataHttpCall).toBeTruthy();

    expect(schemaService.uploadData).toHaveBeenCalledWith(component.excelMdoFieldMappedData,'1005', component.fileSno);
    expect(schemaService.uploadCorrectionData).toHaveBeenCalledWith(component.excelMdoFieldMappedData, '1005',component.schemaId, component.runid, component.plantCode, component.fileSno);

  });

  it('uploadFileData()  ', async(()=>{
    const stepper: MatStepper = {next:null} as MatStepper;
    component.dataTableCtrl = new FormGroup({
      dataTableFldCtrl: new FormControl('')
    });
    component.uploadFileStepCtrl = new FormGroup({
      uploadFileCtrl: new FormControl('')
    });
    spyOn(schemaService,'uploadUpdateFileData').withArgs(component.uploadFileStepCtrl.get('uploadFileCtrl').value, component.fileSno).and.returnValue(of());
    component.uploadFileData(stepper);

    component.excelMdoFieldMappedData = [{columnIndex:0,mdoFldId:'MATL_DEC'} as DataSource];

    component.uploadFileData(stepper);

    expect(component.uploadFileData).toBeTruthy();
  }));

  it('getSelectedFieldId()  ', async(()=>{
    component.excelMdoFieldMappedData =  [{columnIndex: 1, mdoFldId: 'Test'}as DataSource];
    expect('Test').toEqual(component.getSelectedFieldId(1));

    expect('').toEqual(component.getSelectedFieldId(0));
  }));

  it('suggestmatches(), get suggested rec ..', async(()=>{
    // mock data
    component.excelHeader = ['Module obj nr ', 'Material type'];

    component.dataSource = [{columnIndex:0} as DataSource, {columnIndex:1} as DataSource];

    component.metaDataFieldList = [{fieldId: 'MATL_TYPE', fieldDescri:'Material type'} as MetadataModel];

    // call actual method ..
    component.suggestmatches();

    // verify
    expect(component.excelMdoFieldMappedData.length).toEqual(2);
    expect(component.excelMdoFieldMappedData[1].mdoFldId).toEqual('MATL_TYPE');

  }));

});
