import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SchemaDetailsComponent } from './schema-details.component';
import { AppMaterialModuleForSpec } from 'src/app/app-material-for-spec.module';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { FilterValuesComponent } from '@modules/shared/_components/filter-values/filter-values.component';
import { SearchInputComponent } from '@modules/shared/_components/search-input/search-input.component';
import { AddFilterMenuComponent } from '@modules/shared/_components/add-filter-menu/add-filter-menu.component';
import { SchemalistService } from '@services/home/schema/schemalist.service';
import { of } from 'rxjs';
import { SchemaListDetails, SchemaVariantsModel } from '@models/schema/schemalist';
import { SchemaService } from '@services/home/schema.service';
import { SchemaVariantService } from '@services/home/schema/schema-variant.service';
import { FilterCriteria } from '@models/schema/schemadetailstable';
import { SchemaDetailsService } from '@services/home/schema/schema-details.service';

describe('SchemaDetailsComponent', () => {
  let component: SchemaDetailsComponent;
  let fixture: ComponentFixture<SchemaDetailsComponent>;
  let schemaListService: SchemalistService;
  let schemaService: SchemaService;
  let schemaVariantService: SchemaVariantService;
  let schemaDetailService: SchemaDetailsService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SchemaDetailsComponent, FilterValuesComponent, SearchInputComponent, AddFilterMenuComponent ],
      imports:[
        AppMaterialModuleForSpec,
        HttpClientTestingModule,
        RouterTestingModule
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SchemaDetailsComponent);
    component = fixture.componentInstance;
    schemaListService = fixture.debugElement.injector.get(SchemalistService);
    schemaService = fixture.debugElement.injector.get(SchemaService);
    schemaVariantService = fixture.debugElement.injector.get(SchemaVariantService);
    schemaDetailService = fixture.debugElement.injector.get(SchemaDetailsService);

    // fixture.detectChanges();

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


  it('getVariantDetails(), get variant detaails ', async(()=>{
    spyOn(schemaVariantService,'getVariantdetailsByvariantId').withArgs(component.variantId).and.returnValue(of({
      schemaId: component.schemaId,
      filterCriteria:[
        {
          fieldId: 'MATL_TYPE',
          type:'DROPDOWN',
          values:['67','2']
        } as FilterCriteria
      ]
    } as SchemaVariantsModel));

    component.getVariantDetails();
    expect(schemaVariantService.getVariantdetailsByvariantId).toHaveBeenCalledWith(component.variantId);
  }));

  it('getFldMetadata(), get field metadata ', async(()=>{
      spyOn(schemaDetailService,'getMetadataFields').withArgs(component.moduleId).and.returnValue(of());
      component.getFldMetadata();

      expect(schemaDetailService.getMetadataFields).toHaveBeenCalledWith(component.moduleId);
  }))
});
