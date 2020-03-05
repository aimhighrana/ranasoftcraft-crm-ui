import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SchemaListComponent } from './schema-list.component';
import { AppMaterialModuleForSpec } from 'src/app/app-material-for-spec.module';
import { RouterTestingModule } from '@angular/router/testing';
import { SchemaTileComponent } from '../schema-tile/schema-tile.component';
import { SubstringPipe } from 'src/app/_pipes/substringpipe.pipe';
import { SchemaListModuleList, SchemaListDetails } from 'src/app/_models/schema/schemalist';
import { BreadcrumbComponent } from 'src/app/_modules/shared/_components/breadcrumb/breadcrumb.component';
import { AddTileComponent } from 'src/app/_modules/shared/_components/add-tile/add-tile.component';
import { Router } from '@angular/router';

describe('SchemaListComponent', () => {
  let component: SchemaListComponent;
  let fixture: ComponentFixture<SchemaListComponent>;
  let htmlNative: HTMLElement;
  let router: Router;
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        AppMaterialModuleForSpec,
        RouterTestingModule
      ],
      declarations: [SchemaListComponent, BreadcrumbComponent, SchemaTileComponent, AddTileComponent, SubstringPipe],

    }).compileComponents();
    router = TestBed.inject(Router);
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SchemaListComponent);
    component = fixture.componentInstance;
    htmlNative = fixture.debugElement.nativeElement;
  });

  const mockData: SchemaListModuleList[] = [];
  const mockDataObj1: SchemaListModuleList = new SchemaListModuleList();
  mockDataObj1.moduleDesc = 'Function Location';
  mockDataObj1.moduleId = '1006';
  const mockDataObj1Schema1: SchemaListDetails = new SchemaListDetails();
  mockDataObj1Schema1.schemaDescription = 'Check Function Location Installation';
  mockDataObj1Schema1.schemaId = '27348729347';
  mockDataObj1.schemaLists = [];
  mockDataObj1.schemaLists.push(mockDataObj1Schema1);
  const mockDataObj2: SchemaListModuleList = new SchemaListModuleList();
  mockDataObj2.moduleDesc = 'Material Module';
  mockDataObj2.moduleId = '1005';
  const mockDataObj2Schema1: SchemaListDetails = new SchemaListDetails();
  mockDataObj2Schema1.schemaDescription = 'Check ZMRO Type';
  mockDataObj2Schema1.schemaId = '986902';
  const mockDataObj2Schema2: SchemaListDetails = new SchemaListDetails();
  mockDataObj2Schema2.schemaDescription = 'Check HRSH Type';
  mockDataObj2Schema2.schemaId = '10927907';
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
    expect(htmlNative.getElementsByClassName('flex-row-container').length).toEqual(mockData.length);
    expect(htmlNative.getElementsByClassName('flex-row-container').item(0).firstChild.textContent).toEqual(mockData[0].moduleDesc);
    expect(htmlNative.getElementsByClassName('flex-row-container').item(0).getElementsByTagName('pros-schema-tile').length).toEqual(mockData[0].schemaLists.length);


    expect(htmlNative.getElementsByClassName('flex-row-container').item(1).firstChild.textContent).toEqual(mockData[1].moduleDesc);
    expect(htmlNative.getElementsByClassName('flex-row-container').item(1).getElementsByTagName('pros-schema-tile').length).toEqual(mockData[1].schemaLists.length);



  });

  it('showSchemaDetails(), should navigate schema detail page', () => {
    const schemaDetails  = {schemaId: 87234687264862};
    component.schemaGroupId = '732864726783';
    fixture.detectChanges();
    spyOn(router, 'navigate');
    component.showSchemaDetails(schemaDetails, '1005');
    expect(router.navigate).toHaveBeenCalledWith(['/home/schema/schema-details', '1005', component.schemaGroupId, schemaDetails.schemaId]);
  });

  it('variants(), should navigate to schema variant  page', () => {
    const schemaId  = '87234687264862';
    component.schemaGroupId = '732864726783';
    fixture.detectChanges();
    spyOn(router, 'navigate');
    component.variants('1005', schemaId);
    expect(router.navigate).toHaveBeenCalledWith(['/home/schema/schema-variants', '1005', component.schemaGroupId, schemaId]);
  });

  it('run(), should navigate to schema execution  page', () => {
    const schemaId  = '87234687264862';
    component.schemaGroupId = '732864726783';
    fixture.detectChanges();
    spyOn(router, 'navigate');
    component.run(schemaId);
    expect(router.navigate).toHaveBeenCalledWith(['/home/schema/schema-execution', component.schemaGroupId, schemaId]);
  });



});
