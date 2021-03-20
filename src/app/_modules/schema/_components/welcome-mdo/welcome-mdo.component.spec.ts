import { async, ComponentFixture, fakeAsync, TestBed } from '@angular/core/testing';

import { WelcomeMdoComponent } from './welcome-mdo.component';
import { AppMaterialModuleForSpec } from 'src/app/app-material-for-spec.module';
import { SchemalistService } from '@services/home/schema/schemalist.service';
import { of } from 'rxjs';
import { SchemaListModuleList } from '@models/schema/schemalist';
import { SvgIconComponent } from '@modules/shared/_components/svg-icon/svg-icon.component';
import { SchemaService } from '@services/home/schema.service';
import { RouterTestingModule } from '@angular/router/testing';
import { RouterModule } from '@angular/router';
import { Router } from '@angular/router';
import { SearchInputComponent } from '@modules/shared/_components/search-input/search-input.component';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { SharedModule } from '@modules/shared/shared.module';

describe('WelcomeMdoComponent', () => {
  let component: WelcomeMdoComponent;
  let fixture: ComponentFixture<WelcomeMdoComponent>;
  let schemaListServiceSpy: SchemalistService;
  let schemaServiceSpy: SchemaService;
  let router: Router;
  const mockDialogRef = {
    open: jasmine.createSpy('open'),
    close: jasmine.createSpy('close'),
    afterClosed: jasmine.createSpy('afterClosed')
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [WelcomeMdoComponent, SvgIconComponent, SearchInputComponent],
      imports: [AppMaterialModuleForSpec, RouterTestingModule, SharedModule],
      providers: [
        SchemalistService,
        SchemaService,
        RouterModule,
        {
          provide: MatDialogRef,
          useValue: mockDialogRef
        },
        MatDialog
      ]
    })
      .compileComponents();
    router = TestBed.inject(Router);
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WelcomeMdoComponent);
    component = fixture.componentInstance;
    schemaListServiceSpy = fixture.debugElement.injector.get(SchemalistService);
    schemaServiceSpy = fixture.debugElement.injector.get(SchemaService);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('schemaList(), should open schemalist by using that objectId', async(() => {
    const searchInputfixture = TestBed.createComponent(SearchInputComponent);
    component.searchInput = searchInputfixture.componentInstance;
    component.modulesList = [{ moduleId: '1005', objectdesc: 'material', schemaLists: [{}] }, { moduleId: '1006'}];
    const objectId = '1005';
    component.schemaList(objectId);
    expect(component.data.objectid).toEqual('1005');
  }));

  it('getObjectTypes(), should return all the modules with their schemas', async(() => {

    const response = [{moduleId: '1005'}] as SchemaListModuleList[];
    spyOn(schemaListServiceSpy, 'getSchemaList').and.returnValues(of([]), of(response));
    component.getObjectTypes();
    expect(component.modulesList).toEqual([]);

    component.getObjectTypes();
    expect(component.modulesList).toEqual(response);
    expect(schemaListServiceSpy.getSchemaList).toHaveBeenCalledTimes(2);
  }));

  it('searchModule() with args searchTerm, should filter modules', fakeAsync(() => {


    component.searchModule('');
    expect(component.filteredModulesList.length).toEqual(0);

    component.modulesList = [
      {
        moduleId: '1',
        moduleDesc: 'One'
      },
      {
        moduleId: '2',
        moduleDesc: 'Two'
      },
      {
        moduleId: '3',
        moduleDesc: 'Three'
      },
    ];
    component.filteredModulesList = component.modulesList;
    component.searchModule('three');
    expect(component.filteredModulesList.length).toEqual(1);

    component.filteredModulesList = component.modulesList;
    component.searchModule('');
    expect(component.filteredModulesList.length).toEqual(3);
  }));

  it('searchSchema() with args searchTerm, should filter schema', fakeAsync(() => {
    component.schemaLists = [
      {
        schemaId: '1',
        schemaDescription: 'One'
      },
      {
        schemaId: '2',
        schemaDescription: 'Two'
      },
      {
        schemaId: '3',
        schemaDescription: 'Three'
      },
    ];
    component.filteredSchemaList = component.schemaLists;
    component.searchSchema('three');
    expect(component.filteredSchemaList.length).toEqual(1);

    component.filteredSchemaList = component.schemaLists;
    component.searchSchema('');
    expect(component.filteredSchemaList.length).toEqual(3);

    component.filteredSchemaList = component.schemaLists;
    component.searchSchema('t');
    expect(component.filteredSchemaList.length).toEqual(2);
  }));

  it(`selectschema() with args {schemaId: '123', schemaDescription: null}, should call createUpdateSchema`, async(() => {

    spyOn(router, 'navigate')
    spyOn(schemaServiceSpy, 'createUpdateSchema').and.returnValue(of('456'));
    spyOn(component, 'openUploadScreen');

    component.selectschema();
    expect(component.openUploadScreen).toHaveBeenCalled();

    component.data.objectid = '123';
    component.selectschema({ schemaId: null, schemaDescription: null });
    expect(schemaServiceSpy.createUpdateSchema).toHaveBeenCalled();
    expect(router.navigate).toHaveBeenCalledWith([{ outlets: { sb: `sb/schema/check-data/123/456` } }]);

    component.selectschema({ schemaId: '789', schemaDescription: null });
    expect(router.navigate).toHaveBeenCalledWith([{ outlets: { sb: `sb/schema/check-data/123/789` } }]);
  }));

  it('should init component', () => {

    spyOn(component, 'getObjectTypes');
    component.ngOnInit();
    expect(component.getObjectTypes).toHaveBeenCalled();
  });

  it('should schemaTrackBy', () => {
    expect(component.schemaTrackBy(1, '123')).toEqual(1);
  });

  it('should moduleTrackBy', () => {
    expect(component.moduleTrackBy(1, '123')).toEqual(1);
  });

});
