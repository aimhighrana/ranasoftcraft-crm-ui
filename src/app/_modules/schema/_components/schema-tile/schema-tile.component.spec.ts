import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SchemaTileComponent } from './schema-tile.component';
import { AppMaterialModuleForSpec } from 'src/app/app-material-for-spec.module';
import { RouterTestingModule } from '@angular/router/testing';
import { BreadcrumbComponent } from 'src/app/_modules/shared/_components/breadcrumb/breadcrumb.component';
import { SubstringPipe } from 'src/app/_modules/shared/_pipes/substringpipe.pipe';
import { SchemaService } from '@services/home/schema.service';
import { SchemaStaticThresholdRes } from '@models/schema/schemalist';
import { of } from 'rxjs';

describe('SchemaTileComponent', () => {
  let component: SchemaTileComponent;
  let fixture: ComponentFixture<SchemaTileComponent>;
  let schemaService: SchemaService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        AppMaterialModuleForSpec,
        RouterTestingModule
      ],
      declarations: [SchemaTileComponent, BreadcrumbComponent, SubstringPipe],
      providers:[
        SchemaService
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SchemaTileComponent);
    component = fixture.componentInstance;
    schemaService = fixture.debugElement.injector.get(SchemaService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });


  it('getSchemaThresholdStatics(), get schema threshold static', async(()=>{
    // mock data
    const res: SchemaStaticThresholdRes = new SchemaStaticThresholdRes();
    res.successCnt = 10;
    res.schemaId = '35235235334634';
    res.thresHoldStatus = 'GOOD';
    res.threshold = 23.3534543523;

    component.schemaId = '62546256563';
    component.variantId = '2736472637';


    spyOn(schemaService,'getSchemaThresholdStatics').withArgs(component.schemaId, component.variantId).and.returnValue(of(res));

    component.getSchemaThresholdStatics();

    expect(schemaService.getSchemaThresholdStatics).toHaveBeenCalledWith(component.schemaId, component.variantId);
    expect(component.thresholdRes.threshold).toEqual(Math.round((res.threshold + Number.EPSILON) * 100) / 100);
  }));

});
