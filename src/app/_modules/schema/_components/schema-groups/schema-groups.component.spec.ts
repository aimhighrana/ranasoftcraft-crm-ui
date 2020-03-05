import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { SchemaGroupsComponent } from './schema-groups.component';
import { SchemaTileComponent } from '../schema-tile/schema-tile.component';
import { AppMaterialModuleForSpec } from 'src/app/app-material-for-spec.module';
import { RouterTestingModule } from '@angular/router/testing';
import { SubstringPipe } from 'src/app/_pipes/substringpipe.pipe';
import { SchemaGroupResponse, SchemaGroupCountResponse } from 'src/app/_models/schema/schema';
import { SchemaService } from 'src/app/_services/home/schema.service';
import { of } from 'rxjs';
import { BreadcrumbComponent } from 'src/app/_modules/shared/_components/breadcrumb/breadcrumb.component';
import { AddTileComponent } from 'src/app/_modules/shared/_components/add-tile/add-tile.component';
import { Router } from '@angular/router';

describe('SchemaGroupsComponent', () => {
  let component: SchemaGroupsComponent;
  let fixture: ComponentFixture<SchemaGroupsComponent>;
  let htmlnative: HTMLElement;
  let schemaServiceSpy: jasmine.SpyObj<SchemaService>;
  let router: Router;
  beforeEach(async(() => {
    const schemaSerSpy = jasmine.createSpyObj('SchemaService', ['getAllSchemaGroup']);
    TestBed.configureTestingModule({
      imports: [
        AppMaterialModuleForSpec,
        RouterTestingModule
      ],
      declarations: [SchemaGroupsComponent, BreadcrumbComponent, SchemaTileComponent, AddTileComponent, SubstringPipe],
      providers: [
        {provide: SchemaService, useValue: schemaSerSpy}
      ]
    })
      .compileComponents();
    schemaServiceSpy = TestBed.inject(SchemaService) as jasmine.SpyObj<SchemaService>;
    router = TestBed.inject(Router);
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SchemaGroupsComponent);
    component = fixture.componentInstance;
    htmlnative = fixture.nativeElement;
  });

  const mockData: SchemaGroupResponse[] = [];
  const schemaRes1: SchemaGroupResponse = new SchemaGroupResponse();
  const runCount: SchemaGroupCountResponse = new SchemaGroupCountResponse();
  schemaRes1.groupName = 'Function Location';
  schemaRes1.groupId = '87346923798423';
  runCount.total = 0;
  schemaRes1.runCount = runCount;

  const schemaRes2: SchemaGroupResponse = new SchemaGroupResponse();
  const runCount1: SchemaGroupCountResponse = new SchemaGroupCountResponse();
  schemaRes2.groupName = 'Material 100';
  schemaRes2.groupId = '8757825782';
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
    expect(htmlnative.getElementsByTagName('pros-schema-tile').item(0).getElementsByTagName('h3').item(0).textContent).toEqual(mockData[0].groupName);
    expect(htmlnative.getElementsByTagName('pros-schema-tile').item(1).getElementsByTagName('h3').item(0).textContent).toEqual(mockData[1].groupName);

  }));

  it('pros-add-tile: should create', () => {
    expect(htmlnative.getElementsByTagName('pros-add-tile').length).toEqual(1);
  });

  it('edit: function should navigate', () => {
    schemaServiceSpy.getAllSchemaGroup.and.returnValue(of(mockData));
    fixture.detectChanges();
    spyOn(router, 'navigate');
    component.edit(mockData[0]);
    expect(router.navigate).toHaveBeenCalledWith(['/home/schema/group', mockData[0].groupId]);
  });

});
