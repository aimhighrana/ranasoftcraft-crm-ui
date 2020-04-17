import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UploadDataComponent } from './upload-data.component';
import { AppMaterialModuleForSpec } from 'src/app/app-material-for-spec.module';
import { MatIconModule } from '@angular/material/icon';
import { RouterTestingModule } from '@angular/router/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BreadcrumbComponent } from 'src/app/_modules/shared/_components/breadcrumb/breadcrumb.component';
import { AddTileComponent } from 'src/app/_modules/shared/_components/add-tile/add-tile.component';
import { MetadataModeleResponse } from 'src/app/_models/schema/schemadetailstable';
import { ObjectTypeResponse } from 'src/app/_models/schema/schema';

describe('UploadDataComponent', () => {
  let component: UploadDataComponent;
  let fixture: ComponentFixture<UploadDataComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [AppMaterialModuleForSpec, MatIconModule, RouterTestingModule, FormsModule, ReactiveFormsModule],
      declarations: [ UploadDataComponent, BreadcrumbComponent, AddTileComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UploadDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
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
    component.metadataFields = new MetadataModeleResponse();
    component.makeMetadataControle();
  }));

  it('uploadFile(), should click on uploadFile input ', async(()=>{
    component.uploadFile();
  }));

  it('moduleDisplayFn(), should return module desc..', async(()=>{
    const data = new ObjectTypeResponse();
    data.objectid = '1005';
    data.objectdesc = 'Material';
    expect(component.moduleDisplayFn(data)).toEqual(data.objectdesc);
  }));

  it('ngOnint()', async(() => {
    component.ngOnInit();
  }));

  it('getAllModules()', async(() =>{
    component.getAllModules();
  }));

  it('fileChange', async(()=>{
    component.fileChange(undefined);
  }));

  it('uploadDataHttpCall()  ', async(()=>{
    component.uploadDataHttpCall() ;
  }));

  it('uploadFileData()  ', async(()=>{
    component.uploadFileData();
  }));

  it('getSelectedFieldId()  ', async(()=>{
    component.getSelectedFieldId(0);
  }));


});
