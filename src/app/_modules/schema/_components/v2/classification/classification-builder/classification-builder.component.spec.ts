import { HttpClientTestingModule } from '@angular/common/http/testing';
import { SimpleChanges } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { SchemaListDetails } from '@models/schema/schemalist';
import { SearchInputComponent } from '@modules/shared/_components/search-input/search-input.component';
import { SchemaService } from '@services/home/schema.service';
import { SchemaDetailsService } from '@services/home/schema/schema-details.service';
import { SchemaVariantService } from '@services/home/schema/schema-variant.service';
import { SchemalistService } from '@services/home/schema/schemalist.service';
import { of } from 'rxjs';
import { AppMaterialModuleForSpec } from 'src/app/app-material-for-spec.module';

import { ClassificationBuilderComponent } from './classification-builder.component';

describe('ClassificationBuilderComponent', () => {
  let component: ClassificationBuilderComponent;
  let fixture: ComponentFixture<ClassificationBuilderComponent>;

  let schemaListService: SchemalistService;
  let schemaService: SchemaService;
  let schemaDetailService: SchemaDetailsService;
  let schemavariantService: SchemaVariantService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ClassificationBuilderComponent, SearchInputComponent ],
      imports:[
        HttpClientTestingModule,
        RouterTestingModule,
        AppMaterialModuleForSpec
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClassificationBuilderComponent);
    component = fixture.componentInstance;
    // fixture.detectChanges();
    schemaListService = fixture.debugElement.injector.get(SchemalistService);
    schemaService = fixture.debugElement.injector.get(SchemaService);
    schemaDetailService = fixture.debugElement.injector.get(SchemaDetailsService);
    schemavariantService = fixture.debugElement.injector.get(SchemaVariantService);

    component.schemaId = '274751';
    component.variantId = '0';
    component.moduleId = '1005';
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('getSchemaDetails(), get schema details ', async(()=>{
    spyOn(schemaListService, 'getSchemaDetailsBySchemaId').withArgs(component.schemaId).and.returnValue(of({schemaId: component.schemaId} as SchemaListDetails));
    component.getSchemaDetails();
    expect(schemaListService.getSchemaDetailsBySchemaId).toHaveBeenCalledWith(component.schemaId);
  }));

  it('getSchemaStatics(), get schema statics .. ', async(()=>{

    spyOn(schemaService,'getSchemaThresholdStatics').withArgs(component.schemaId, component.variantId).and.returnValue(of());
    component.getSchemaStatics();
    expect(schemaService.getSchemaThresholdStatics).toHaveBeenCalledWith(component.schemaId, component.variantId);
  }));

  it('getFldMetadata(), get field metadata ', async(()=>{
    spyOn(schemaDetailService,'getMetadataFields').withArgs(component.moduleId).and.returnValue(of());
    component.getFldMetadata();

    expect(schemaDetailService.getMetadataFields).toHaveBeenCalledWith(component.moduleId);
}));

it('ngOnChanges(), ngonchange component hooks ', async(()=>{
  const changes = {
    moduleId:{
      currentValue:'1005',
      firstChange:true,
      isFirstChange:null,
      previousValue:null
    },
    schemaId:{
      currentValue:'28467126471',
      firstChange:true,
      isFirstChange:null,
      previousValue:null
    },varinatId:{
      currentValue:'0',
      firstChange:true,
      isFirstChange:null,
      previousValue:null
    }
  } as SimpleChanges;

  component.ngOnChanges(changes);
  expect(component.ngOnChanges).toBeTruthy();
}));

  it('getDataScope(), get data scope', async(()=>{
    spyOn(schemavariantService, 'getDataScope').withArgs(component.schemaId, 'RUNFOR').and.returnValue(of());
    component.getDataScope();
    expect(schemavariantService.getDataScope).toHaveBeenCalledWith(component.schemaId, 'RUNFOR');
  }));

  it('transformData(), transform data ', async(()=>{
    // mock data
    const row = {1001:[
      {NOUN_CODE:'26462'},
      {OBJECTNUMBER:'236462'},
      {LONG_DESC:'8234762187'}
    ]};
    const res = component.transformData(row);
    expect(res.length).toEqual(1);

  }));
});
