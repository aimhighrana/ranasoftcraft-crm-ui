import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SchemaListComponent } from './schema-list.component';
import { AppMaterialModuleForSpec } from 'src/app/app-material-for-spec.module';
import { RouterTestingModule } from '@angular/router/testing';
import { SchemaTileComponent } from '../schema-tile/schema-tile.component';
import { SchemaListModuleList, SchemaListDetails, SchemaDashboardPermission } from 'src/app/_models/schema/schemalist';
import { BreadcrumbComponent } from 'src/app/_modules/shared/_components/breadcrumb/breadcrumb.component';
import { AddTileComponent } from 'src/app/_modules/shared/_components/add-tile/add-tile.component';
import { Router } from '@angular/router';
import { SubstringPipe } from 'src/app/_modules/shared/_pipes/substringpipe.pipe';
import { SchemaService } from '@services/home/schema.service';
import { SchemaGroupDetailsResponse } from '@models/schema/schema';
import { of } from 'rxjs';
import { SchemalistService } from '@services/home/schema/schemalist.service';

describe('SchemaListComponent', () => {
  let component: SchemaListComponent;
  let fixture: ComponentFixture<SchemaListComponent>;
  let router: Router;
  let SchemaServiceSpy: SchemaService;
  let schemaListServiceSpy: SchemalistService;
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        AppMaterialModuleForSpec,
        RouterTestingModule
      ],
      declarations: [SchemaListComponent, BreadcrumbComponent, SchemaTileComponent, AddTileComponent, SubstringPipe],
      providers:[ SchemaService, SchemalistService ]

    }).compileComponents();
    router = TestBed.inject(Router);
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SchemaListComponent);
    component = fixture.componentInstance;
    SchemaServiceSpy = fixture.debugElement.injector.get(SchemaService);
    schemaListServiceSpy = fixture.debugElement.injector.get(SchemalistService);
  });

  const mockData: SchemaListModuleList[] = [];
  const mockDataObj1: SchemaListModuleList = new SchemaListModuleList();
  mockDataObj1.moduleDesc = 'Function Location';
  mockDataObj1.moduleId = '1006';
  const mockDataObj1Schema1: SchemaListDetails = new SchemaListDetails();
  mockDataObj1Schema1.schemaDescription = 'Check Function Location Installation';
  mockDataObj1Schema1.schemaId = '27348729347';
  const mockDataObj1Schema1coll: SchemaDashboardPermission = new SchemaDashboardPermission();
  mockDataObj1Schema1coll.isAdmin = true;
  mockDataObj1Schema1coll.isEditer = true;
  mockDataObj1Schema1.collaboratorModels = mockDataObj1Schema1coll;
  mockDataObj1.schemaLists = [];
  const mockDataObj2: SchemaListModuleList = new SchemaListModuleList();
  mockDataObj2.moduleDesc = 'Material Module';
  mockDataObj2.moduleId = '1005';
  const mockDataObj2Schema1: SchemaListDetails = new SchemaListDetails();
  mockDataObj2Schema1.schemaDescription = 'Check ZMRO Type';
  mockDataObj2Schema1.schemaId = '986902';
  const mockDataObj2Schema1coll: SchemaDashboardPermission = new SchemaDashboardPermission();
  mockDataObj2Schema1coll.isAdmin = true;
  mockDataObj2Schema1coll.isEditer = true;
  mockDataObj2Schema1.collaboratorModels = mockDataObj2Schema1coll;
  const mockDataObj2Schema2: SchemaListDetails = new SchemaListDetails();
  mockDataObj2Schema2.schemaDescription = 'Check HRSH Type';
  mockDataObj2Schema2.schemaId = '10927907';
  const mockDataObj2Schema2coll: SchemaDashboardPermission = new SchemaDashboardPermission();
  mockDataObj2Schema2coll.isAdmin = true;
  mockDataObj2Schema2coll.isEditer = true;
  mockDataObj2Schema1.collaboratorModels = mockDataObj2Schema2coll;
  mockDataObj2.schemaLists = [];
  mockDataObj2.schemaLists.push(mockDataObj2Schema1);
  mockDataObj2.schemaLists.push(mockDataObj2Schema2);
  mockData.push(mockDataObj1);
  mockData.push(mockDataObj2);

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('flex-row-container: module list should create', () => {
    component.schemaListDetails = mockData;
    fixture.detectChanges();
    // expect(htmlNative.getElementsByClassName('flex-row-container').length).toEqual(mockData.length);
    // expect(htmlNative.getElementsByClassName('flex-row-container').item(0).firstChild.textContent).toEqual(mockData[0].moduleDesc);
    // expect(htmlNative.getElementsByClassName('flex-row-container').item(0).getElementsByTagName('pros-schema-tile').length).toEqual(mockData[0].schemaLists.length);


    // expect(htmlNative.getElementsByClassName('flex-row-container').item(1).firstChild.textContent).toEqual(mockData[1].moduleDesc);
    // expect(htmlNative.getElementsByClassName('flex-row-container').item(1).getElementsByTagName('pros-schema-tile').length).toEqual(mockData[1].schemaLists.length);



  });

  it('showSchemaDetails(), should navigate schema detail page', () => {
    const schemaDetails  = {schemaId: 87234687264862};
    fixture.detectChanges();
    spyOn(router, 'navigate');
    component.showSchemaDetails(schemaDetails, '1005');
    expect(router.navigate).toHaveBeenCalledWith(['/home/schema/schema-details', '1005', schemaDetails.schemaId]);
  });

  it('variants(), should navigate to schema variant  page', () => {
    const schemaId  = '87234687264862';
    fixture.detectChanges();
    spyOn(router, 'navigate');
    component.variants('1005', schemaId);
    expect(router.navigate).toHaveBeenCalledWith(['/home/schema/schema-variants', '1005', schemaId]);
  });

  it('run(), should navigate to schema execution  page', () => {
    const schemaId  = '87234687264862';
    fixture.detectChanges();
    spyOn(router, 'navigate');
    component.run(schemaId);
    expect(router.navigate).toHaveBeenCalledWith(['/home/schema/schema-execution', schemaId]);
  });

  it('edit(), should navigate to schema edit  page', () => {
    const schemaDetails : SchemaListDetails = new SchemaListDetails();
    schemaDetails.schemaId = '87234687264862';
    fixture.detectChanges();
    spyOn(router, 'navigate');
    component.edit('1005', schemaDetails);
    expect(router.navigate).toHaveBeenCalledWith(['/home/schema/create-schema', '1005', schemaDetails.schemaId]);
  });

  it('schemaDetails(), should navigate to schema detail  page', () => {
    const schemaDetails : SchemaListDetails = new SchemaListDetails();
    schemaDetails.schemaId = '87234687264862';
    schemaDetails.variantId = '0';
    const data: SchemaDashboardPermission = new SchemaDashboardPermission();
    data.isAdmin = true;
    schemaDetails.collaboratorModels = data;
    fixture.detectChanges();
    spyOn(router, 'navigate');
    component.schemaDetails('1005', schemaDetails);

    const schema : SchemaListDetails = new SchemaListDetails();
    const Data: SchemaDashboardPermission = new SchemaDashboardPermission();
    Data.isViewer = true;
    schema.collaboratorModels = Data;
    component.schemaDetails('1005', schema);

    const schema1 : SchemaListDetails = new SchemaListDetails();
    schema1.createdBy = 'guest';
    component.schemaDetails('1005', schema1);

    const schema2 : SchemaListDetails = new SchemaListDetails();
    const Data1: SchemaDashboardPermission = new SchemaDashboardPermission();
    Data1.isEditer = true;
    schema2.collaboratorModels = Data1;
    component.schemaDetails('1005', schema2);
    expect(router.navigate).toHaveBeenCalledWith(['/home/schema/schema-details', '1005', schemaDetails.schemaId, schemaDetails.variantId]);
  });

  it('groupDetails(), should get schema group detail by schema group Id', async(() => {
    component.schemaGroupId = '732864726783';
    spyOn(SchemaServiceSpy,'getSchemaGroupDetailsBySchemaGrpId').withArgs(component.schemaGroupId).and.returnValue(of({} as SchemaGroupDetailsResponse));
    component.groupDetails();
    expect(SchemaServiceSpy.getSchemaGroupDetailsBySchemaGrpId).toHaveBeenCalledWith(component.schemaGroupId);
  }));

  it('onLoadSchemaList(), should load the schema by schema group Id', async(() => {
    const response: SchemaListModuleList[] = [];
    component.schemaGroupId = '732864726783';
    spyOn(schemaListServiceSpy,'getSchemaList').and.returnValue(of(response));
    component.onLoadSchemaList();
    expect(schemaListServiceSpy.getSchemaList).toHaveBeenCalled();
  }));

});
