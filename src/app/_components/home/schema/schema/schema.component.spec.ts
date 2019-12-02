import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SchemaComponent } from './schema.component';
import { BreadcrumbComponent } from 'src/app/_components/breadcrumb/breadcrumb.component';
import { SchemaTileComponent } from '../schema-tile/schema-tile.component';
import { SchemaProgressbarComponent } from '../../schema-progressbar/schema-progressbar.component';
import { AppMaterialModuleForSpec } from 'src/app/app-material-for-spec.module';
import { RouterTestingModule } from '@angular/router/testing';
import { SubstringPipe } from 'src/app/_pipes/substringpipe.pipe';
import { SchemabadgeTileComponent } from '../schemabadge-tile/schemabadge-tile.component';
import { SchemaGroupResponse, SchemaGroupCountResponse } from 'src/app/_models/schema/schema';
import { SchemaService } from 'src/app/_services/home/schema.service';
import { of } from 'rxjs';

describe('SchemaComponent', () => {
  let component: SchemaComponent;
  let fixture: ComponentFixture<SchemaComponent>;
  let htmlnative: HTMLElement;
  let schemaServiceSpy: jasmine.SpyObj<SchemaService>;
  beforeEach(async(() => {
    const schemaSerSpy = jasmine.createSpyObj('SchemaService', ['getAllSchemaGroup']);
    TestBed.configureTestingModule({
      imports: [
        AppMaterialModuleForSpec,
        RouterTestingModule
      ],
      declarations: [SchemaComponent, BreadcrumbComponent, SchemaTileComponent, SchemabadgeTileComponent, SchemaProgressbarComponent, SubstringPipe],
      providers: [
        {provide: SchemaService, useValue: schemaSerSpy}
      ]
    })
      .compileComponents();
    schemaServiceSpy = TestBed.get(SchemaService);
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SchemaComponent);
    component = fixture.componentInstance;
    htmlnative = fixture.nativeElement;
  });

  const mockData: SchemaGroupResponse[] = [];
  const schemaRes1: SchemaGroupResponse = new SchemaGroupResponse();
  const runCount: SchemaGroupCountResponse = new SchemaGroupCountResponse();
  schemaRes1.groupName = 'Function Location';
  schemaRes1.groupId = 87346923798423;
  runCount.total = 0;
  schemaRes1.runCount = runCount;

  const schemaRes2: SchemaGroupResponse = new SchemaGroupResponse();
  const runCount1: SchemaGroupCountResponse = new SchemaGroupCountResponse();
  schemaRes2.groupName = 'Material 100';
  schemaRes2.groupId = 8757825782;
  runCount1.total = 0;
  schemaRes2.runCount = runCount1;

  mockData.push(schemaRes1);
  mockData.push(schemaRes2);

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('pros-schema-tile: should cteate', async(() => {
    schemaServiceSpy.getAllSchemaGroup.and.returnValue(of(mockData));
    expect(htmlnative.getElementsByTagName('pros-schema-tile').length).toEqual(0);
    fixture.detectChanges();
    expect(htmlnative.getElementsByTagName('pros-schema-tile').length).toEqual(mockData.length);
    expect(htmlnative.getElementsByTagName('pros-schema-tile').item(0).getElementsByTagName('mat-card-title').item(0).textContent).toEqual(mockData[0].groupName);
    expect(htmlnative.getElementsByTagName('pros-schema-tile').item(1).getElementsByTagName('mat-card-title').item(0).textContent).toEqual(mockData[1].groupName);

  }));

  it('pros-schemabadge-tile: should create', () => {
    expect(htmlnative.getElementsByTagName('pros-schemabadge-tile').length).toEqual(1);
  });

});
