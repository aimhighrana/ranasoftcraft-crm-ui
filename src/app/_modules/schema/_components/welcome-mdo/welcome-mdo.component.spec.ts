import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WelcomeMdoComponent } from './welcome-mdo.component';
import { AppMaterialModuleForSpec } from 'src/app/app-material-for-spec.module';
import { SchemalistService } from '@services/home/schema/schemalist.service';
import { of } from 'rxjs';
import { SchemaListModuleList } from '@models/schema/schemalist';
import { SvgIconComponent } from '@modules/shared/_components/svg-icon/svg-icon.component';

describe('WelcomeMdoComponent', () => {
  let component: WelcomeMdoComponent;
  let fixture: ComponentFixture<WelcomeMdoComponent>;
  let schemaListServiceSpy: SchemalistService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WelcomeMdoComponent, SvgIconComponent ],
      imports: [AppMaterialModuleForSpec],
      providers:[ SchemalistService ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WelcomeMdoComponent);
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
