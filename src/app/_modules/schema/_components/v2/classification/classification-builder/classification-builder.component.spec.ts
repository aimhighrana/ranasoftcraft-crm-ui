import { HttpClientTestingModule } from '@angular/common/http/testing';
import { SimpleChanges } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { SchemaDashboardPermission, SchemaListDetails } from '@models/schema/schemalist';
import { SharedModule } from '@modules/shared/shared.module';
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
  let router: Router;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ClassificationBuilderComponent, SearchInputComponent ],
      imports:[
        HttpClientTestingModule,
        RouterTestingModule,
        AppMaterialModuleForSpec,
        SharedModule
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
    router = TestBed.inject(Router);

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
    const res = component.transformData(row,'mro_local_lib');
    expect(res.length).toEqual(1);

  }));

  it('getDataScope(), should return all variants of a schema', async () => {
    component.schemaId = '1005';
    spyOn(schemavariantService, 'getDataScope').withArgs(component.schemaId, 'RUNFOR').and.returnValue(of())
    component.getDataScope();
    expect(schemavariantService.getDataScope).toHaveBeenCalledWith(component.schemaId, 'RUNFOR');
  })

  it('openSummarySideSheet(), should navigate to schema summary side sheet', () => {
    spyOn(router, 'navigate');
    component.openSummarySideSheet();
    expect(router.navigate).toHaveBeenCalledWith([{ outlets: { sb: `sb/schema/check-data/${component.moduleId}/${component.schemaId}` } }], {queryParamsHandling: 'preserve'})
  })

  it('openDataScopeSideSheet(), should navigate to data scope side sheet', () => {
    spyOn(router, 'navigate');
    component.openDataScopeSideSheet();
    expect(router.navigate).toHaveBeenCalledWith([{ outlets: { sb: `sb/schema/data-scope/${component.moduleId}/${component.schemaId}/new/sb` } }], {queryParamsHandling: 'preserve'})
  });


  it(`approveRec(), approve mro classification data `, async(()=>{
    // mock data
    const row = {OBJECTNUMBER:{fieldValue:'MAT001'}, __aditionalProp: { isReviewed: false}};
    component.schemaId = '234238';
    component.schemaInfo = {runId:'32423432'} as SchemaListDetails;

    spyOn(schemaDetailService,'approveClassification').withArgs(component.schemaId, component.schemaInfo.runId, ['MAT001']).and.returnValue(of(true));

    component.approveRec(row, 0);

    expect(component.approveRec).toBeTruthy();

  }));

  it(`rejectRec(), reset or reject mro classification data `, async(()=>{
    // mock data
    const row = {OBJECTNUMBER:{fieldValue:'MAT001'}};
    component.schemaId = '234238';
    component.schemaInfo = {runId:'32423432'} as SchemaListDetails;

    spyOn(schemaDetailService,'rejectClassification').withArgs(component.schemaId, component.schemaInfo.runId, ['MAT001']).and.returnValue(of(true));

    component.rejectRec(row, 0);

    expect(component.rejectRec).toBeTruthy();

  }));

  it('openExecutionTrendSideSheet ', async(() => {
    spyOn(router, 'navigate');
    component.openExecutionTrendSideSheet();
    expect(router.navigate).toHaveBeenCalledWith(['', { outlets: { sb: `sb/schema/execution-trend/${component.moduleId}/${component.schemaId}/${component.variantId}` } }], {queryParamsHandling: 'preserve'});
  }));

  it(`generateDesc(), generate description mro classification data `, async(()=>{
    // mock data
    const row = {OBJECTNUMBER:{fieldValue:'MAT001'}};
    component.schemaId = '234238';
    component.schemaInfo = {runId:'32423432'} as SchemaListDetails;
    component.dataFrm ='mro_local_lib';

    spyOn(schemaDetailService,'generateMroClassificationDescription').withArgs(component.schemaId, component.schemaInfo.runId, ['MAT001'], true).and.returnValue(of(null));

    component.generateDesc(row, 0);

    expect(schemaDetailService.generateMroClassificationDescription).toHaveBeenCalledWith(component.schemaId, component.schemaInfo.runId, ['MAT001'], true);
    expect(component.generateDesc).toBeTruthy();

  }));
  it('should get schema permissions', () => {

    component.schemaInfo  = {schemaId: 'schema1', runId:'889321'} as SchemaListDetails;
    expect(component.isEditer).toBeFalsy();
    expect(component.isReviewer).toBeFalsy();
    expect(component.isApprover).toBeFalsy();

  });

  it('should filter primary and secondary actions', () => {
    expect(component.primaryActions.length).toEqual(2);
    expect(component.secondaryActions.length).toEqual(0);

  });

  it('should do table action', () => {

    component.schemaInfo  = {schemaId: 'schema1', runId:'889321',
      collaboratorModels: {isReviewer: true} as SchemaDashboardPermission} as SchemaListDetails;

    spyOn(component, 'approveRec');
    spyOn(component, 'rejectRec');

    component.doAction(component.tableActionsList[0], {}, 0);
    expect(component.approveRec).toHaveBeenCalledWith({}, 0);

    component.doAction(component.tableActionsList[1], {}, 0);
    expect(component.rejectRec).toHaveBeenCalledWith({}, 0);

  });

  it('should get table action icon', () => {
    expect(component.getActionIcon('Approve')).toEqual('check-mark');
    expect(component.getActionIcon('Reject')).toEqual('declined')
    expect(component.getActionIcon('Delete')).toEqual('recycle-bin');
  });

  it('should check if global actions are enabled', () => {
    expect(component.isGlobalActionsEnabled).toEqual(false);
  });

  it('should open column settings sidesheet', () => {
    spyOn(router, 'navigate');
    component.openTableColumnSettings();
    expect(router.navigate).toHaveBeenCalledWith(['', { outlets: { sb: 'sb/schema/table-column-settings' } }], {queryParamsHandling: 'preserve'});
  })

});
