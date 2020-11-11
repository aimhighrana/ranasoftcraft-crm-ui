import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SchemaDetailsComponent } from './schema-details.component';
import { AppMaterialModuleForSpec } from 'src/app/app-material-for-spec.module';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { FilterValuesComponent } from '@modules/shared/_components/filter-values/filter-values.component';
import { SearchInputComponent } from '@modules/shared/_components/search-input/search-input.component';
import { AddFilterMenuComponent } from '@modules/shared/_components/add-filter-menu/add-filter-menu.component';
import { SchemalistService } from '@services/home/schema/schemalist.service';
import { BehaviorSubject, of } from 'rxjs';
import { SchemaListDetails, SchemaVariantsModel } from '@models/schema/schemalist';
import { SchemaService } from '@services/home/schema.service';
import { SchemaVariantService } from '@services/home/schema/schema-variant.service';
import { FilterCriteria, MetadataModel, MetadataModeleResponse, RequestForSchemaDetailsWithBr } from '@models/schema/schemadetailstable';
import { SchemaDetailsService } from '@services/home/schema/schema-details.service';
import { DropDownValue } from '@modules/admin/_components/module/business-rules/business-rules.modal';
import { SchemaDataSource } from '../../schema-details/schema-datatable/schema-data-source';
import { Router } from '@angular/router';
import { SimpleChanges } from '@angular/core';
import { EndpointService } from '@services/endpoint.service';

describe('SchemaDetailsComponent', () => {
  let component: SchemaDetailsComponent;
  let fixture: ComponentFixture<SchemaDetailsComponent>;
  let schemaListService: SchemalistService;
  let schemaService: SchemaService;
  let schemaVariantService: SchemaVariantService;
  let schemaDetailService: SchemaDetailsService;
  let router: Router;

  const dataSourceSpy= {
    getTableData: jasmine.createSpy('getTableData')
  };
  let endpointService: EndpointService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SchemaDetailsComponent, FilterValuesComponent, SearchInputComponent, AddFilterMenuComponent ],
      imports:[
        AppMaterialModuleForSpec,
        HttpClientTestingModule,
        RouterTestingModule
      ],providers:[
        {
          provide: SchemaDataSource,
          useValue: dataSourceSpy
        }
      ]
    })
    .compileComponents();
    router = TestBed.inject(Router);
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SchemaDetailsComponent);
    component = fixture.componentInstance;
    schemaListService = fixture.debugElement.injector.get(SchemalistService);
    schemaService = fixture.debugElement.injector.get(SchemaService);
    schemaVariantService = fixture.debugElement.injector.get(SchemaVariantService);
    schemaDetailService = fixture.debugElement.injector.get(SchemaDetailsService);
    endpointService = fixture.debugElement.injector.get(EndpointService);
    component.dataSource = new SchemaDataSource(schemaDetailService, endpointService, '274751');

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
  }));

  it('loadDropValues(), load current field .. ', async(()=>{
      // mock data
      const data: FilterCriteria = {fieldId:'MATL_TYPE',type:'DROPDOWN', values:['ZMRO','ALT']} as FilterCriteria;
      component.loadDropValues(data);
      expect(component.loadDopValuesFor.checkedValue.length).toEqual(2);
  }));

  it('updateFilterCriteria(), update filter criteria .. ', async(()=>{
    const dropValue: DropDownValue[] = [{
      CODE:'ZMRO',
      FIELDNAME:'MATL_TYPE',
      LANGU:'en',
      PLANTCODE:'0',
      SNO:'872372',
      TEXT:'Zmro Text'
    }];


    const exitingFilter: FilterCriteria[] = [{
      fieldId:'MATL_TYPE',
      type:'DROPDOWN',
      values:['TEST'],
      fldCtrl:{fieldId:'MATL_TYPE'} as MetadataModel,
      filterCtrl:{fldCtrl:{fieldId:'MATL_TYPE'} as MetadataModel,selectedValues:[]}
    }];

    component.filterCriteria.next(exitingFilter);

    component.loadDopValuesFor = {fieldId:'MATL_TYPE',checkedValue:[]};

    component.updateFilterCriteria(dropValue);

    const res = component.filterCriteria.getValue();

    expect(res.values.length).toEqual(0);

  }));

  /* it('should format date to MM/DD/YYYY', () => {
    const date = new Date(2020, 1, 15);
    const result = component.formatDate(date);
    expect(result).toEqual('02/15/2020');
  }) */

  it('should format cell data', () => {
    const metadataFldLst = {
        diw_15 : {
          isCheckList : 'false',
          picklist: '1',
          value : 'USA'
        }
      }

    component.metadataFldLst = metadataFldLst;
    let result = component.formatCellData('diw_15', 'USA');
    expect(result).toEqual('USA');

    metadataFldLst.diw_15.isCheckList = 'true';
    result = component.formatCellData('diw_15', ['USA', 'France']);
    expect(result).toEqual('USA,France');

  })

  /* it('should filter field options', () => {

    component.selectFieldOptions = [
      {CODE : 'option1', TEXT:'first option'} as DropDownValue,
      {CODE : 'option2', TEXT:'second option'} as DropDownValue
    ];

    const result = component.filterSelectFieldOptions('first');
    expect(result.length).toEqual(1);
    expect(result[0].CODE).toEqual('option1');
  }) */

  it('should get the input type', () => {

    const metadataFldLst = {
      diw_15 : {
        isCheckList : 'false',
        picklist: '0',
        dataType: 'NUMC'
      }
    }

  component.metadataFldLst = metadataFldLst;

  let result = component.getFieldInputType('diw_15');
  expect(result).toEqual(component.FIELD_TYPE.NUMBER);

  metadataFldLst.diw_15.dataType = 'DATS';
  result = component.getFieldInputType('diw_15');
  expect(result).toEqual(component.FIELD_TYPE.DATE);


  metadataFldLst.diw_15.picklist = '1';
  result = component.getFieldInputType('diw_15');
  expect(result).toEqual(component.FIELD_TYPE.SINGLE_SELECT);

  metadataFldLst.diw_15.isCheckList = 'true';
  result = component.getFieldInputType('diw_15');
  expect(result).toEqual(component.FIELD_TYPE.MULTI_SELECT);


  });

  it('should add/remove an inline filter', () => {

    component.inlineSearch('material');

    expect(component.filterCriteria.getValue().length).toEqual(1);

    component.inlineSearch('');
    expect(component.filterCriteria.getValue().length).toEqual(0);


    spyOn(component.filterCriteria, 'next');
    component.inlineSearch('material');
    expect(component.filterCriteria.next).toHaveBeenCalledTimes(1);
  });

  it('should return all rows selected', () => {
    expect(component.isAllSelected()).toEqual(true);
  });

  it('should clear selection', () => {
    spyOn(component.selection, 'clear');
    component.masterToggle();
    expect(component.selection.clear).toHaveBeenCalled();
  });

  it('should remove an applied filter', () => {

    component.inlineSearch('material');

    const filterCriteria = {
        fieldId: 'id',
        type: 'INLINE',
        values: ['material']
      } as FilterCriteria ;


    component.removeAppliedFilter(filterCriteria);
    expect(component.filterCriteria.getValue().length).toEqual(0);

  });

  it('should reset applied filter', () => {

    component.inlineSearch('material');
    expect(component.filterCriteria.getValue().length).toEqual(1);

    component.resetAppliedFilter();
    expect(component.filterCriteria.getValue().length).toEqual(0);

  });

  it('should change tab status', () => {

    spyOn(component, 'getData');

    component.changeTabStatus(component.activeTab);
    expect(component.getData).toHaveBeenCalledTimes(0);

  });

  it('getData(), get data ', async(()=>{
    // mock data
    const request: RequestForSchemaDetailsWithBr = new RequestForSchemaDetailsWithBr();
    request.schemaId = component.schemaId;
    request.variantId = component.variantId;
    request.fetchCount = 0
    request.fetchSize = 20;
    request.requestStatus = component.activeTab;
    request.filterCriterias = [];
    request.sort = null;
    request.isLoadMore = true;
    component.dataSource = new SchemaDataSource(schemaDetailService, null, component.schemaId);
    component.getData([], null, 0, true);

    expect(dataSourceSpy.getTableData).toBeTruthy();
  }));

  it('calculateDisplayFields(), calculate display fields based on user view', async(()=>{
    // mock data
    component.metadata.next({headers:{MATL_TYPE:{fieldId:'MATL_TYPE'}}} as MetadataModeleResponse);
    component.calculateDisplayFields();
    expect(component.calculateDisplayFields).toBeTruthy();
  }));


  it('changeTabStatus() , change the tab and get load data ', async(() =>{
    // mock data
    component.activeTab = 'error';
    const res = component.changeTabStatus('error');
    expect(res).toEqual(false);

    spyOn(router, 'navigate');
    component.metadata.next({headers:{MATL_TYPE:{fieldId:'MATL_TYPE'}}} as MetadataModeleResponse);
    component.dataSource = new SchemaDataSource(schemaDetailService, null, component.schemaId);
    component.changeTabStatus('success');
    expect(router.navigate).toHaveBeenCalledWith(['/home/schema/schema-details', component.moduleId, component.schemaId],{queryParams:{status:component.activeTab}} );

  }));

  it('openTableColumnSettings(), open table column setting ', async(()=>{
    spyOn(router, 'navigate');
    component.openTableColumnSettings();
    expect(router.navigate).toHaveBeenCalledWith(['', { outlets: { sb: 'sb/schema/table-column-settings' }, queryParams:{status:component.activeTab} } ]);
  }));

  it('inlineSearch(), inline search ', async(()=>{
    // mock data
    component.filterCriteria = new BehaviorSubject<FilterCriteria[]>([{fieldId:'MATL_TYPE', type:'INLINE'} as FilterCriteria]);
    component.inlineSearch('mat');
    expect(component.inlineSearch).toBeTruthy();
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

});
