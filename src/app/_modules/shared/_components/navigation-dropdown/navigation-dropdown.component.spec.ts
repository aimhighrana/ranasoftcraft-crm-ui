import { async, ComponentFixture, fakeAsync, TestBed } from '@angular/core/testing';

import { NavigationDropdownComponent } from './navigation-dropdown.component';
import { AppMaterialModuleForSpec } from 'src/app/app-material-for-spec.module';
import { SchemalistService } from '@services/home/schema/schemalist.service';
import { SchemaListModuleList } from '@models/schema/schemalist';
import { of } from 'rxjs';
import { SearchInputComponent } from '../search-input/search-input.component';
import { SimpleChanges } from '@angular/core';

describe('NavigationDropdownComponent', () => {
  let component: NavigationDropdownComponent;
  let fixture: ComponentFixture<NavigationDropdownComponent>;
  let schemaListServiceSpy: SchemalistService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NavigationDropdownComponent, SearchInputComponent ],
      imports: [AppMaterialModuleForSpec],
      providers:[ SchemalistService]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NavigationDropdownComponent);
    component = fixture.componentInstance;
    schemaListServiceSpy = fixture.debugElement.injector.get(SchemalistService);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('selectschema(), Should open Upload data of selected schemaId or for new schema', async(() => {
    const schema = {schemaId:'123',schemaDescription:'test'};
    component.selectschema(schema);
    expect(component.data.schemaId).toEqual('123');

    component.selectschema();
    expect(component.data.schemaId).toEqual(null);
  }));

  it('schemaList(), should open schemalist by using that objectId', async(() => {
    const searchInputfixture = TestBed.createComponent(SearchInputComponent);
    component.searchInput = searchInputfixture.componentInstance;
    component.modulesList = [{moduleId:'1005',objectdesc:'material',schemaLists:[{}]}];
    const objectId = '1005';
    component.schemaList(objectId);
    expect(component.data.objectid).toEqual('1005');
  }));

  it('getObjectTypes(), should return all the modules with their schemas', async(() => {
    spyOn(schemaListServiceSpy,'getSchemaList').and.returnValue(of({} as SchemaListModuleList[]));
    component.getObjectTypes();
    expect(schemaListServiceSpy.getSchemaList).toHaveBeenCalled();
  }));

  it('searchModule() with args searchTerm, should call searchFilter', fakeAsync(() => {
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

  it('searchSchema() with args searchTerm, should call searchFilter', fakeAsync(() => {
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

  it('should update on input change', () => {
    spyOn(component.selectedModule, 'emit');

    const changes: SimpleChanges = {value: {currentValue: 'new value', previousValue: null, firstChange: null, isFirstChange: null}};
    component.ngOnChanges(changes);
    expect(component.selectedModule.emit).toHaveBeenCalled();

  });

  it('should init component', () => {
    spyOn(component, 'getObjectTypes');
    component.ngOnInit();
    expect(component.getObjectTypes).toHaveBeenCalled();
  })
});
