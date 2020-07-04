import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UploadDataComponent } from './upload-data.component';
import { AppMaterialModuleForSpec } from 'src/app/app-material-for-spec.module';
import { MatIconModule } from '@angular/material/icon';
import { RouterTestingModule } from '@angular/router/testing';
import { FormsModule, ReactiveFormsModule, FormGroup, FormControl } from '@angular/forms';
import { BreadcrumbComponent } from 'src/app/_modules/shared/_components/breadcrumb/breadcrumb.component';
import { AddTileComponent } from 'src/app/_modules/shared/_components/add-tile/add-tile.component';
import { MetadataModeleResponse } from 'src/app/_models/schema/schemadetailstable';
import { MatStepper } from '@angular/material/stepper';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

describe('UploadDataComponent', () => {
  let component: UploadDataComponent;
  let fixture: ComponentFixture<UploadDataComponent>;
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
        }
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UploadDataComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('prepareDataSource(), should prepare datasource', async(()=>{
    const uploadedData = [[1,2],[4,7]]
    component.uploadedData = uploadedData;
     component.prepareDataSource();
  }));

  it('updateMapFields(), should upate map fields', async(()=>{
     const data = {index: 0, execlFld: 'Test112', fieldId: 'objnr',fieldDesc: 'Objectnumber', excelFrstRow: null};
     component.updateMapFields(data);
  }));

  it('controlStepChange(), should control the stepper', async(()=>{
    const event = {selectedIndex:0};
    component.controlStepChange(event);
  }));

  it('makeMetadataControle(), help to make metadata control for all header , hierarchy and grid field ', async(()=>{
    component.moduleInfo = {module:'1005'};
    component.metadataFields = new MetadataModeleResponse();
    component.makeMetadataControle();
  }));

  it('uploadFile(), should click on uploadFile input ', async(()=>{
    component.moduleInfo = {module:'1005'};
    component.uploadFile();
  }));

  it('ngOnint()', async(() => {
    component.moduleInfo = {module:'1005'};
    component.ngOnInit();
  }));


  it('fileChange', async(()=>{
    component.fileChange(undefined);
  }));

  it('uploadDataHttpCall()  ', async(()=>{
    const stepper: MatStepper = {next:null} as MatStepper;
    component.moduleInfo = {module:'1005'};
    component.uploadDataHttpCall(stepper) ;
  }));

  it('uploadFileData()  ', async(()=>{
    const stepper: MatStepper = {next:null} as MatStepper;
    component.dataTableCtrl = new FormGroup({
      dataTableFldCtrl: new FormControl('')
    });
    component.uploadFileData(stepper);
  }));

  it('getSelectedFieldId()  ', async(()=>{
    component.getSelectedFieldId(0);
  }));


});
