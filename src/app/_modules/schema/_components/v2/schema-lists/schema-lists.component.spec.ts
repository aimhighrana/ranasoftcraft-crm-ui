import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { SchemaListModuleList } from '@models/schema/schemalist';
import { SchemaService } from '@services/home/schema.service';
import { of } from 'rxjs';
import { AppMaterialModuleForSpec } from 'src/app/app-material-for-spec.module';

import { SchemaListsComponent } from './schema-lists.component';

describe('SchemaListsComponent', () => {
  let component: SchemaListsComponent;
  let fixture: ComponentFixture<SchemaListsComponent>;
  let SchemaServiceSpy: SchemaService;
  let router: Router

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SchemaListsComponent ],
      imports: [ AppMaterialModuleForSpec, RouterTestingModule ],
      providers: [ SchemaService ]
    })
    .compileComponents();
    router = TestBed.inject(Router);
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SchemaListsComponent);
    component = fixture.componentInstance;
    SchemaServiceSpy = fixture.debugElement.injector.get(SchemaService);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('getSchemaList(),get schema list according to module ID', async(()=> {
    component.moduleId = '1005';
    spyOn(SchemaServiceSpy,'getSchemaInfoByModuleId').withArgs(component.moduleId).and.returnValue(of({} as SchemaListModuleList));
    component.getSchemaList();
    expect(SchemaServiceSpy.getSchemaInfoByModuleId).toHaveBeenCalledWith(component.moduleId);
  }));

  it('openSchemaInfo(), function to open schema Info', async(() => {
    component.moduleId = '1005';
    const schemaId = '18765654554'
    spyOn(router, 'navigate');
    component.openSchemaInfo(schemaId);
    expect(router.navigate).toHaveBeenCalledWith([`/home/schema/schema-info/${component.moduleId}/${schemaId}`]);
  }));

  it('openUploadSideSheet(), should open the Upload data side sheet', async () => {
    component.moduleId = '1005';
    component.outlet = 'sb'
    spyOn(router, 'navigate');
    component.openUploadSideSheet();
    expect(router.navigate).toHaveBeenCalledWith([{ outlets: { sb: `sb/schema/upload-data/${component.moduleId}/${component.outlet}` } }])
  });
});
