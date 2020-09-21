import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { DiwTilesComponent } from './diw-tiles.component';
import { AppMaterialModuleForSpec } from 'src/app/app-material-for-spec.module';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { SchemaService } from '@services/home/schema.service';
import { of } from 'rxjs'
import { SchemaListModuleList } from '@models/schema/schemalist';

describe('DiwTilesComponent', () => {
  let component: DiwTilesComponent;
  let fixture: ComponentFixture<DiwTilesComponent>;
  let schemaServiceSpy: SchemaService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DiwTilesComponent ],
      imports: [AppMaterialModuleForSpec, RouterTestingModule, HttpClientTestingModule]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DiwTilesComponent);
    component = fixture.componentInstance;
    schemaServiceSpy = fixture.debugElement.injector.get(SchemaService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call getSchemaList() method', async() => {
      const moduleId = '1005';
      component.moduleId = moduleId;
      spyOn(schemaServiceSpy, 'getSchemaInfoByModuleId').withArgs(moduleId).and.returnValue(of({} as SchemaListModuleList));
      component.getSchemaList();
      expect(schemaServiceSpy.getSchemaInfoByModuleId).toHaveBeenCalledWith(moduleId);
  })

  it('should delete schema', async() => {
      const schemaId = '8763462838';
      spyOn(schemaServiceSpy, 'deleteSChema').withArgs(schemaId).and.returnValue(of(true));
      component.delete(schemaId);
      expect(schemaServiceSpy.deleteSChema).toHaveBeenCalledWith(schemaId);
  })
});
