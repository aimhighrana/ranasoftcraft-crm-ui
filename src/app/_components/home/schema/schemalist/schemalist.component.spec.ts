import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SchemalistComponent } from './schemalist.component';
import { AppMaterialModuleForSpec } from 'src/app/app-material-for-spec.module';
import { RouterTestingModule } from '@angular/router/testing';
import { SchemaTileComponent } from '../schema-tile/schema-tile.component';
import { SchemaProgressbarComponent } from '../../schema-progressbar/schema-progressbar.component';
import { SubstringPipe } from 'src/app/_pipes/substringpipe.pipe';
import { SchemabadgeTileComponent } from '../schemabadge-tile/schemabadge-tile.component';
import { SchemaListModuleList, SchemaListDetails } from 'src/app/_models/schema/schemalist';
import { BreadcrumbComponent } from 'src/app/_modules/shared/_components/breadcrumb/breadcrumb.component';

describe('SchemalistComponent', () => {
  let component: SchemalistComponent;
  let fixture: ComponentFixture<SchemalistComponent>;
  let htmlNative: HTMLElement;
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        AppMaterialModuleForSpec,
        RouterTestingModule
      ],
      declarations: [SchemalistComponent, BreadcrumbComponent, SchemaTileComponent, SchemabadgeTileComponent, SchemaProgressbarComponent, SubstringPipe],

    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SchemalistComponent);
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

});
