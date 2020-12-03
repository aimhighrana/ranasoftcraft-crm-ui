import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NavigationDropdownComponent } from './navigation-dropdown.component';
import { AppMaterialModuleForSpec } from 'src/app/app-material-for-spec.module';
import { SchemalistService } from '@services/home/schema/schemalist.service';
import { SchemaListModuleList } from '@models/schema/schemalist';
import { of } from 'rxjs';

describe('NavigationDropdownComponent', () => {
  let component: NavigationDropdownComponent;
  let fixture: ComponentFixture<NavigationDropdownComponent>;
  let schemaListServiceSpy: SchemalistService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NavigationDropdownComponent ],
      imports: [AppMaterialModuleForSpec],
      providers:[ SchemalistService ]
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
});
