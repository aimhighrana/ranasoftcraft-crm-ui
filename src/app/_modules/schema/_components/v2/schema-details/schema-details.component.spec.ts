import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { SchemaDetailsComponent } from './schema-details.component';
import { AppMaterialModuleForSpec } from 'src/app/app-material-for-spec.module';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { FilterValuesComponent } from '@modules/shared/_components/filter-values/filter-values.component';
import { SearchInputComponent } from '@modules/shared/_components/search-input/search-input.component';
import { AddFilterMenuComponent } from '@modules/shared/_components/add-filter-menu/add-filter-menu.component';
import { SchemalistService } from '@services/home/schema/schemalist.service';
import { of, throwError } from 'rxjs';
import { ModuleInfo, SchemaDashboardPermission, SchemaListDetails, SchemaStaticThresholdRes, SchemaVariantsModel } from '@models/schema/schemalist';
import { SchemaService } from '@services/home/schema.service';
import { SchemaVariantService } from '@services/home/schema/schema-variant.service';
import { FilterCriteria, MetadataModel, MetadataModeleResponse, RequestForSchemaDetailsWithBr, SchemaTableAction, STANDARD_TABLE_ACTIONS, TableActionViewType } from '@models/schema/schemadetailstable';
import { SchemaDetailsService } from '@services/home/schema/schema-details.service';
import { DropDownValue } from '@modules/admin/_components/module/business-rules/business-rules.modal';
import { SchemaDataSource } from '../../schema-details/schema-datatable/schema-data-source';
import { Router } from '@angular/router';
import { SimpleChanges } from '@angular/core';
import { EndpointsClassicService } from '@services/_endpoints/endpoints-classic.service';
import { Userdetails } from '@models/userdetails';
import { SharedModule } from '@modules/shared/shared.module';
import { SharedServiceService } from '@modules/shared/_services/shared-service.service';
import { AddFilterOutput } from '@models/schema/schema';
import { MatSortable } from '@angular/material/sort';
import { SchemaExecutionNodeType, SchemaExecutionTree } from '@models/schema/schema-execution';

describe('SchemaDetailsComponent', () => {
  let component: SchemaDetailsComponent;
  let fixture: ComponentFixture<SchemaDetailsComponent>;
  let schemaListService: SchemalistService;
  let schemaService: SchemaService;
  let schemaVariantService: SchemaVariantService;
  let schemaDetailService: SchemaDetailsService;
  let router: Router;
  let sharedService: SharedServiceService;

  const dataSourceSpy= {
    getTableData: jasmine.createSpy('getTableData')
  };
  let endpointService: EndpointsClassicService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SchemaDetailsComponent, FilterValuesComponent, SearchInputComponent, AddFilterMenuComponent ],
      imports:[
        AppMaterialModuleForSpec,
        HttpClientTestingModule,
        RouterTestingModule,
        SharedModule
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
    endpointService = fixture.debugElement.injector.get(EndpointsClassicService);
    component.dataSource = new SchemaDataSource(schemaDetailService, endpointService, '274751');
    sharedService = fixture.debugElement.injector.get(SharedServiceService);

    // fixture.detectChanges();

    component.schemaId = '274751';
    component.variantId = '0';
    component.moduleId = '1005';
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('getSchemaDetails(), get schema details ', async(()=>{
    spyOn(schemaListService, 'getSchemaDetailsBySchemaId').withArgs(component.schemaId)
      .and.returnValues(of({schemaId: component.schemaId} as SchemaListDetails), throwError({message: 'api error'}));
    component.getSchemaDetails();
    expect(schemaListService.getSchemaDetailsBySchemaId).toHaveBeenCalledWith(component.schemaId);

    spyOn(console, 'error');
    component.getSchemaDetails();
    expect(console.error).toHaveBeenCalled();
  }));

  it('getSchemaStatics(), get schema statics .. ', async(()=>{

    spyOn(schemaService,'getSchemaThresholdStatics').withArgs(component.schemaId, component.variantId)
      .and.returnValues(of(new SchemaStaticThresholdRes()), throwError({message: 'api error'}));
    component.getSchemaStatics();
    expect(schemaService.getSchemaThresholdStatics).toHaveBeenCalledWith(component.schemaId, component.variantId);

    spyOn(console, 'error');
    component.getSchemaStatics();
    expect(console.error).toHaveBeenCalled();

  }));


  it('getVariantDetails(), get variant detaails ', async(()=>{
    component.userDetails = {
      currentRoleId: 'AD',
      userName: 'harshit',
      plantCode: '0'
    } as Userdetails

    spyOn(schemaVariantService,'getVariantdetailsByvariantId').withArgs(component.variantId, component.userDetails.currentRoleId, component.userDetails.plantCode, component.userDetails.userName)
      .and.returnValues(of({
      schemaId: component.schemaId,
      filterCriteria: [
        { fieldId: 'MATL_TYPE', type: 'DROPDOWN', values: ['67', '2'] },
        { fieldId: 'id', type: 'INLINE', values: ['search text'] }
      ]
    } as SchemaVariantsModel), of(null), throwError({message: 'api error'}));

    component.getVariantDetails();
    component.getVariantDetails();
    expect(schemaVariantService.getVariantdetailsByvariantId).toHaveBeenCalledWith(component.variantId, component.userDetails.currentRoleId, component.userDetails.plantCode, component.userDetails.userName);

    spyOn(console, 'error');
    component.getVariantDetails();
    expect(console.error).toHaveBeenCalled();
  }));

  it('getFldMetadata(), get field metadata ', async(()=>{

    component.moduleId = '';
    expect(() => component.getFldMetadata()).toThrowError('Module id cant be null or empty');

    component.moduleId = '1005';

    spyOn(schemaDetailService,'getMetadataFields').withArgs(component.moduleId)
      .and.returnValues(of(null), throwError({message: 'api error'}));

    component.getFldMetadata();
    expect(schemaDetailService.getMetadataFields).toHaveBeenCalledWith(component.moduleId);

    spyOn(console, 'error');
    component.getFldMetadata();
    expect(console.error).toHaveBeenCalled();
  }));

  it('loadDropValues(), load current field .. ', async(()=>{

      component.loadDropValues(null);
      expect(component.loadDopValuesFor).toBeFalsy();

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
  component.metadataFldLst.diw_15.dataType = 'DTMS';
  expect(component.getFieldInputType('diw_15')).toEqual(component.FIELD_TYPE.DATE);


  metadataFldLst.diw_15.picklist = '1';
  expect(component.getFieldInputType('diw_15')).toEqual(component.FIELD_TYPE.SINGLE_SELECT);
  metadataFldLst.diw_15.picklist = '30';
  expect(component.getFieldInputType('diw_15')).toEqual(component.FIELD_TYPE.SINGLE_SELECT);
  metadataFldLst.diw_15.picklist = '37';
  expect(component.getFieldInputType('diw_15')).toEqual(component.FIELD_TYPE.SINGLE_SELECT);


  metadataFldLst.diw_15.isCheckList = 'true';
  expect(component.getFieldInputType('diw_15')).toEqual(component.FIELD_TYPE.MULTI_SELECT);
  metadataFldLst.diw_15.picklist = '30';
  expect(component.getFieldInputType('diw_15')).toEqual(component.FIELD_TYPE.MULTI_SELECT);
  metadataFldLst.diw_15.picklist = '1';
  expect(component.getFieldInputType('diw_15')).toEqual(component.FIELD_TYPE.MULTI_SELECT);

  component.metadataFldLst.diw_15 = {};
  expect(component.getFieldInputType('diw_15')).toEqual(component.FIELD_TYPE.TEXT);


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

    spyOn(component.filterCriteria, 'next');
    component.removeAppliedFilter(filterCriteria);
    expect(component.filterCriteria.next).toHaveBeenCalledTimes(0);

  });

  it('should reset applied filter', () => {

    component.inlineSearch('material');
    expect(component.filterCriteria.getValue().length).toEqual(1);

    component.resetAppliedFilter();
    expect(component.filterCriteria.getValue().length).toEqual(0);

  });

  it('should change tab status', () => {

    component.userDetails = new Userdetails();
    component.userDetails.plantCode = 'test';
    component.userDetails.userName = 'test';

    spyOn(component, 'getData');
    spyOn(component, 'getSchemaExecutionTree');
    spyOn(component, 'calculateDisplayFields');
    spyOn(router, 'navigate');

    expect(component.changeTabStatus(component.activeTab)).toBeFalsy();

    component.changeTabStatus('success');
    expect(component.getData).toHaveBeenCalledWith(component.filterCriteria.getValue(), component.sortOrder);

    component.changeTabStatus('review');
    expect(component.getData).toHaveBeenCalled();

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

    component.userDetails = new Userdetails();
    component.userDetails.plantCode = 'test';
    component.userDetails.userName = 'test';

    spyOn(component, 'getSchemaExecutionTree');
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
    expect(router.navigate).toHaveBeenCalledWith(['', { outlets: { sb: 'sb/schema/table-column-settings' } }], {queryParamsHandling: 'preserve'});
  }));

  it('inlineSearch(), inline search ', async(()=>{
    // mock data to be removed
    /* component.filterCriteria = new BehaviorSubject<FilterCriteria[]>([{fieldId:'MATL_TYPE', type:'INLINE'} as FilterCriteria]);
    component.inlineSearch('mat');
    expect(component.inlineSearch).toBeTruthy(); */

    component.inlineSearch('material');

    expect(component.filterCriteria.getValue().length).toEqual(1);

    component.inlineSearch('');
    expect(component.filterCriteria.getValue().length).toEqual(0);

    spyOn(component.filterCriteria, 'next');
    component.inlineSearch('material');
    expect(component.filterCriteria.next).toHaveBeenCalledTimes(1);

    component.filterCriteria.next([{fieldId: 'region', type: 'INLINE', values: ['search text']}]);
    component.inlineSearch('new search text');
    expect(component.filterCriteria.getValue()[0].values).toEqual(['new search text']);

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
      },
      varinatId:{
        currentValue:'1',
        firstChange:true,
        isFirstChange:null,
        previousValue:'0'
      }
    } as SimpleChanges;

    spyOn(component, 'getDataScope');
    spyOn(component, 'getFldMetadata');
    spyOn(component, 'getSchemaStatics');
    spyOn(component, 'getSchemaDetails');
    spyOn(component, 'manageStaticColumns');
    spyOn(component, 'getData');
    spyOn(component, 'getVariantDetails');
    spyOn(component, 'getSchemaExecutionTree');

    component.userDetails = new Userdetails();
    component.userDetails.plantCode = '5454';
    component.userDetails.userName = 'Test';
    component.variantId = '1';
    component.ngOnChanges(changes);

    expect(component.getDataScope).toHaveBeenCalled();
    expect(component.getFldMetadata).toHaveBeenCalled();
    expect(component.getSchemaStatics).toHaveBeenCalled();
    expect(component.getSchemaDetails).toHaveBeenCalled();
    expect(component.manageStaticColumns).toHaveBeenCalled();
    expect(component.getVariantDetails).toHaveBeenCalled();
    expect(component.getSchemaExecutionTree).toHaveBeenCalled();
    component.dataSource.brMetadata.subscribe(res=> {
      if(res) {
        expect(component.getData).toHaveBeenCalled();
      }
    });

    const changes1 = {
      moduleId:{
        currentValue:'1005',
        firstChange:undefined,
        isFirstChange:null,
        previousValue:null
      },
      schemaId:{
        currentValue:'28467126471',
        firstChange:true,
        isFirstChange:null,
        previousValue:null
      },
      varinatId:{
        currentValue:'0',
        firstChange:true,
        isFirstChange:null,
        previousValue:null
      }
    } as SimpleChanges;
    component.ngOnChanges(changes1);
    expect(component.getDataScope).toHaveBeenCalled();
    expect(component.getSchemaStatics).toHaveBeenCalled();
    expect(component.getSchemaDetails).toHaveBeenCalled();
    expect(component.manageStaticColumns).toHaveBeenCalled();
    component.dataSource.brMetadata.subscribe(res2=> {
      if(res2) {
        expect(component.getData).toHaveBeenCalled();
      }
    });

    const changes2 = {
      moduleId:{
        currentValue:'1005',
        firstChange:true,
        isFirstChange:null,
        previousValue:null
      },
      schemaId:{
        currentValue:'28467126471',
        firstChange:undefined,
        isFirstChange:null,
        previousValue:null
      },
      varinatId:{
        currentValue:'0',
        firstChange:true,
        isFirstChange:null,
        previousValue:null
      }
    } as SimpleChanges;
    component.ngOnChanges(changes2);
    component.userDetails = null;
    component.variantId = '0';
    expect(component.getDataScope).toHaveBeenCalled();
    expect(component.getFldMetadata).toHaveBeenCalled();
    expect(component.getSchemaStatics).toHaveBeenCalled();
    expect(component.getSchemaDetails).toHaveBeenCalled();
    expect(component.manageStaticColumns).toHaveBeenCalled();
    expect(component.variantId).toEqual('0');
    expect(component.executionTreeHierarchy).toEqual(undefined);
    component.dataSource.brMetadata.subscribe(res2=> {
      if(res2) {
        expect(component.getData).toHaveBeenCalled();
      }
    });

    const changes3 = {
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
      },
      varinatId:{
        currentValue:'0',
        firstChange:undefined,
        isFirstChange:null,
        previousValue:null
      }
    } as SimpleChanges;
    component.ngOnChanges(changes3);
    expect(component.getDataScope).toHaveBeenCalled();
    expect(component.getFldMetadata).toHaveBeenCalled();
    expect(component.getSchemaStatics).toHaveBeenCalled();
    expect(component.getSchemaDetails).toHaveBeenCalled();
    expect(component.manageStaticColumns).toHaveBeenCalled();
    component.dataSource.brMetadata.subscribe(res3=> {
      if(res3) {
        expect(component.getData).toHaveBeenCalled();
      }
    });

    const changes4 = {
      moduleId:{
        currentValue:'1005',
        firstChange:undefined,
        isFirstChange:null,
        previousValue:null
      },
      schemaId:{
        currentValue:'28467126471',
        firstChange:undefined,
        isFirstChange:null,
        previousValue:null
      },
      varinatId:{
        currentValue:'0',
        firstChange:true,
        isFirstChange:null,
        previousValue:null
      }
    } as SimpleChanges;
    component.ngOnChanges(changes4);
    expect(component.getDataScope).toHaveBeenCalled();
    expect(component.getFldMetadata).toHaveBeenCalled();
    expect(component.getSchemaStatics).toHaveBeenCalled();
    expect(component.getSchemaDetails).toHaveBeenCalled();
    expect(component.manageStaticColumns).toHaveBeenCalled();
    component.dataSource.brMetadata.subscribe(res4=> {
      if(res4) {
        expect(component.getData).toHaveBeenCalled();
      }
    });

    const changes5 = {
      moduleId:{
        currentValue:'1005',
        firstChange:undefined,
        isFirstChange:null,
        previousValue:null
      },
      schemaId:{
        currentValue:'28467126471',
        firstChange:true,
        isFirstChange:null,
        previousValue:null
      },
      varinatId:{
        currentValue:'0',
        firstChange:undefined,
        isFirstChange:null,
        previousValue:null
      }
    } as SimpleChanges;
    component.ngOnChanges(changes5);
    expect(component.getDataScope).toHaveBeenCalled();
    expect(component.getFldMetadata).toHaveBeenCalled();
    expect(component.getSchemaStatics).toHaveBeenCalled();
    expect(component.getSchemaDetails).toHaveBeenCalled();
    expect(component.manageStaticColumns).toHaveBeenCalled();
    component.dataSource.brMetadata.subscribe(res5=> {
      if(res5) {
        expect(component.getData).toHaveBeenCalled();
      }
    });

    const changes6 = {
      moduleId:{
        currentValue:'1005',
        firstChange:undefined,
        isFirstChange:null,
        previousValue:null
      },
      schemaId:{
        currentValue:'28467126471',
        firstChange:undefined,
        isFirstChange:null,
        previousValue:null
      },
      varinatId:{
        currentValue:'0',
        firstChange:true,
        isFirstChange:null,
        previousValue:null
      }
    } as SimpleChanges;
    component.ngOnChanges(changes6);
    expect(component.getDataScope).toHaveBeenCalled();
    expect(component.getFldMetadata).toHaveBeenCalled();
    expect(component.getSchemaStatics).toHaveBeenCalled();
    expect(component.getSchemaDetails).toHaveBeenCalled();
    expect(component.manageStaticColumns).toHaveBeenCalled();
    component.dataSource.brMetadata.subscribe(res6=> {
      if(res6) {
        expect(component.getData).toHaveBeenCalled();
      }
    });

    spyOn(schemaDetailService, 'getSelectedFieldsByNodeIds').and.returnValues(of([]), throwError({message: 'api error'}));

    const changes7 = {
      moduleId:{
        currentValue:'1005',
        firstChange:true,
        isFirstChange:null,
        previousValue:null
      },
      schemaId:{
        currentValue:'28467126471',
        firstChange:undefined,
        isFirstChange:null,
        previousValue:null
      },
      varinatId:{
        currentValue:'0',
        firstChange:undefined,
        isFirstChange:null,
        previousValue:null
      }
    } as SimpleChanges;
    component.ngOnChanges(changes7);
    expect(component.getDataScope).toHaveBeenCalled();
    expect(component.getFldMetadata).toHaveBeenCalled();
    expect(component.getSchemaStatics).toHaveBeenCalled();
    expect(component.getSchemaDetails).toHaveBeenCalled();
    expect(component.manageStaticColumns).toHaveBeenCalled();
    component.dataSource.brMetadata.subscribe(res7=> {
      if(res7) {
        expect(component.getData).toHaveBeenCalled();
      }
    });

    const changes8 = {
      variantId:{
        currentValue:'1',
        firstChange:true,
        isFirstChange:null,
        previousValue:'0'
      },
      isInRunning:{
        currentValue:true,
        firstChange:true,
        isFirstChange:null,
        previousValue:false
      },
      activeTab:{
        currentValue:'success',
        firstChange:true,
        isFirstChange:null,
        previousValue:'error'
      }
    } as SimpleChanges;
    spyOn(console, 'error');
    component.ngOnChanges(changes8);
    expect(component.isInRunning).toBeTrue();
    expect(console.error).toHaveBeenCalled();
  }));

  it('openSummarySideSheet(), should navigate to schema summary side sheet', () => {
    spyOn(router, 'navigate');
    component.openSummarySideSheet();
    expect(router.navigate).toHaveBeenCalledWith([{ outlets: { sb: `sb/schema/check-data/${component.moduleId}/${component.schemaId}` } }], {queryParamsHandling: 'preserve'})
  })

  it('openDataScopeSideSheet(), should navigate to data scope side sheet', () => {
    spyOn(router, 'navigate');
    component.openDataScopeSideSheet();
    expect(router.navigate).toHaveBeenCalledWith([{ outlets: { sb: `sb/schema/data-scope/${component.moduleId}/${component.schemaId}/new/sb` } }], {queryParamsHandling: 'preserve'})
  })

  it('getDataScope(), should return all variants of a schema', async () => {
    component.schemaId = '1005';
    spyOn(schemaVariantService, 'getDataScope').withArgs(component.schemaId, 'RUNFOR').and.returnValue(of())
    component.getDataScope();
    expect(schemaVariantService.getDataScope).toHaveBeenCalledWith(component.schemaId, 'RUNFOR');
  });

  it(`approveRecords(), approve corrected records `, async(()=>{

    // mock data
    const row = {OBJECTNUMBER:{fieldData:'MAT001'}};
    component.schemaId = '246726532';
    component.userDetails  = {currentRoleId:'123'} as Userdetails;

    const apiResponse = true;

    spyOn(schemaDetailService,'approveCorrectedRecords').withArgs(component.schemaId, ['MAT001'] , component.userDetails.currentRoleId)
      .and.returnValues(of(apiResponse), of(apiResponse), throwError({message: 'api error'}));

    component.approveRecords('inline', row);
    expect(schemaDetailService.approveCorrectedRecords).toHaveBeenCalledWith(component.schemaId, ['MAT001'] , component.userDetails.currentRoleId);

    spyOn(component, 'getData');
    component.selection.select(row);
    component.approveRecords('all');
    expect(component.getData).toHaveBeenCalled();

    // error response
    spyOn(console, 'error');
    component.selection.select(row);
    component.approveRecords('all');
    expect(console.error).toHaveBeenCalled();

  }));

  it(`resetRec(), reset corrected records `, async(()=>{
    // mock data
    const row = {OBJECTNUMBER:{fieldData:'MAT001'}};
    component.schemaId = '246726532';
    component.schemaInfo  = {runId:'889321'} as SchemaListDetails;
    component.statics = {correctedCnt: 5} as SchemaStaticThresholdRes;
    const apiResponse = {acknowledge:false};


    spyOn(schemaDetailService,'resetCorrectionRecords').withArgs(component.schemaId, component.schemaInfo.runId,  ['MAT001'])
      .and.returnValues(of(apiResponse), of(apiResponse), throwError({message: 'api error'}));

    component.resetRec(row, 'inline');
    expect(schemaDetailService.resetCorrectionRecords).toHaveBeenCalledWith(component.schemaId, component.schemaInfo.runId,  ['MAT001']);

    spyOn(component, 'getData');
    component.selection.select(row);
    apiResponse.acknowledge = true;
    component.resetRec('', 'all');
    expect(component.getData).toHaveBeenCalled();
    expect(component.statics.correctedCnt).toEqual(0);

    // error response
    spyOn(console, 'error');
    component.selection.select(row);
    component.resetRec('', 'all');
    expect(console.error).toHaveBeenCalled();

  }));

  it('openExecutionTrendSideSheet ', async(() => {
    spyOn(router, 'navigate');
    component.openExecutionTrendSideSheet();
    expect(router.navigate).toHaveBeenCalledWith(['', { outlets: { sb: `sb/schema/execution-trend/${component.moduleId}/${component.schemaId}/${component.variantId}` } }], {queryParamsHandling: 'preserve'});
  }));

  it('should load more data on table scroll', async(() => {

    spyOn(component, 'getData');

    const event = {
      target: {
        offsetHeight: 20,
        scrollTop: 70,
        scrollHeight: 300
      }
    }

    component.onTableScroll(event);
    expect(component.scrollLimitReached).toBeFalse();

    event.target.scrollTop = 100;
    component.onTableScroll(event);
    component.onTableScroll(event);
    expect(component.scrollLimitReached).toBeTrue();
    expect(component.fetchCount).toEqual(1);

    event.target.scrollTop = 70;
    component.onTableScroll(event);
    expect(component.scrollLimitReached).toBeFalse();

  }));

  it('should get schema permissions', () => {

    component.schemaInfo  = {schemaId: 'schema1', runId:'889321'} as SchemaListDetails;
    expect(component.isEditer).toBeFalsy();
    expect(component.isReviewer).toBeFalsy();
    expect(component.isApprover).toBeFalsy();

    component.schemaInfo  = {schemaId: 'schema1', runId:'889321',
      collaboratorModels: {isEditer: true, isApprover: true, isReviewer: true}
      } as SchemaListDetails;
    expect(component.isEditer).toBeTrue()
    expect(component.isReviewer).toBeTrue();
    expect(component.isApprover).toBeTrue();

  });

  it('should filter primary and secondary actions', () => {
    expect(component.primaryActions.length).toEqual(2);
    expect(component.secondaryActions.length).toEqual(0);
  });

  it('should do table action', () => {

    component.schemaInfo  = {schemaId: 'schema1', runId:'889321',
      collaboratorModels: {isReviewer: true} as SchemaDashboardPermission} as SchemaListDetails;

    spyOn(component, 'approveRecords');
    spyOn(component, 'resetRec');
    spyOn(component, 'generateCrossEntry');

    component.doAction(component.tableActionsList[0], {});
    expect(component.approveRecords).toHaveBeenCalledWith('inline', {});

    component.doAction(component.tableActionsList[1], {});
    expect(component.resetRec).toHaveBeenCalledWith({}, 'inline');

    const action = {refBrId: '1701'} as SchemaTableAction;
    component.doAction(action, {});
    expect(component.generateCrossEntry).toHaveBeenCalledWith({}, '1701');
  });

  it('should check if global actions are enabled', () => {
    expect(component.isGlobalActionsEnabled).toEqual(false);
    const row = { OBJECTNUMBER: 'TMP1701'};
    component.selection.select(row);
    expect(component.isGlobalActionsEnabled).toBeTrue();
  });

  it('should get all user selected fields based on default view ..', (async () => {

    component.ngOnInit();
    expect(component.userDetails).toBeDefined();

    spyOn(component, 'getDataScope');
    sharedService.setDataScope(null);
    sharedService.setDataScope({});
    expect(component.getDataScope).toHaveBeenCalledTimes(1);

    spyOn(component, 'getData');
    component.filterCriteria.next([]);
    expect(component.getData).toHaveBeenCalledTimes(1);

    component.selection.select({objctNumber: '1701'});
    expect(component.tableHeaderActBtn.length).toEqual(1);
    component.selection.clear();
    expect(component.tableHeaderActBtn.length).toEqual(0);

    component.dataSource.brMetadata.next([]);
    expect(component.getData).toHaveBeenCalled();

    sharedService.setChooseColumnData(null);

    let columnsData = { selectedFields: null, tableActionsList: [{ actionText: 'Approve'} as SchemaTableAction]};
    spyOn(component, 'calculateDisplayFields');
    sharedService.setChooseColumnData(columnsData);
    expect(component.tableActionsList.length).toEqual(1);

    columnsData = {selectedFields: [], tableActionsList: [] };
    sharedService.setChooseColumnData(columnsData);
    expect(component.selectedFields.length).toEqual(0);

    spyOn(schemaDetailService, 'updateSchemaTableView').and.returnValue(of([]));
    component.metadata.next({headers: {}} as MetadataModeleResponse);
    component.selectedFieldsOb.next([]);
    expect(schemaDetailService.updateSchemaTableView).toHaveBeenCalled();

    const selectedFields = [{fieldId: 'mtl_grp', order:1, editable: false, isEditable:false}];
    component.selectedFieldsOb.next(selectedFields);
    component.metadata.next({headers: {}} as MetadataModeleResponse);
    expect(component.selectedFields).toEqual(selectedFields);

  }));

  it('should check if user has action permission', async (() => {

    component.schemaInfo  = {schemaId: 'schema1', runId:'889321'} as SchemaListDetails;

    const action = {schemaId: component.schemaId, isPrimaryAction: false, actionCode: STANDARD_TABLE_ACTIONS.APPROVE,
      actionViewType: TableActionViewType.TEXT, isCustomAction: true, createdBy: 'admin'} as SchemaTableAction;

    expect(component.hasActionPermission(action)).toBeFalsy();

    action.actionCode = STANDARD_TABLE_ACTIONS.REJECT;
    expect(component.hasActionPermission(action)).toBeFalsy();

    action.actionCode = 'other actions';
    expect(component.hasActionPermission(action)).toBeTruthy();


  }));

  it('generateCrossEntry() , generate cross module / create cross module ', async(()=>{
    // mock data
    const row = {
      OBJECTNUMBER:{
        fieldData:'TMP001'
      }
    }
    component.dataSource = new SchemaDataSource(schemaDetailService, null, component.schemaId);
    spyOn(schemaDetailService, 'generateCrossEntry').withArgs(component.schemaId, component.moduleId, row.OBJECTNUMBER.fieldData, '')
      .and.returnValues(of('data'), of('data'), of('data'), throwError({message: 'api error'}));

    spyOn(schemaDetailService, 'doCorrection').and
      .returnValues(of({acknowledge: false}), of({acknowledge: true}), throwError({message: 'api error'}));

    // no target field
    expect(() => component.generateCrossEntry(row, '')).toThrowError('Tragetfield cant be null or empty ');

    // no obj number
    component.dataSource.targetField = 'MATL_GRP';
    expect(() => component.generateCrossEntry({}, '')).toThrowError('Objectnumber must be required !!!');

    component.dataSource.setDocValue([row]);
    component.generateCrossEntry(row);
    expect(schemaDetailService.generateCrossEntry).toHaveBeenCalledWith(component.schemaId, component.moduleId, row.OBJECTNUMBER.fieldData, '');

    component.statics = {correctedCnt: 5} as SchemaStaticThresholdRes;
    component.generateCrossEntry(row);
    expect(component.statics.correctedCnt).toEqual(0);

    spyOn(console, 'error');
    // correction error api
    component.generateCrossEntry(row);
    expect(console.error).toHaveBeenCalled();

    // error api resp
    component.generateCrossEntry(row);
    expect(console.error).toHaveBeenCalled();
  }));

  it('uploadCorrectedData(), navigate for upload corrected rec ', async(()=>{
    spyOn(router, 'navigate');
    component.schemaInfo = {runId:'24243'} as SchemaListDetails;
    component.uploadCorrectedData();
    expect(router.navigate).toHaveBeenCalledWith([{outlets: { sb: `sb/schema/upload-data/${component.moduleId}/${component.outlet}`}}], {queryParams:{importcorrectedRec: true, schemaId: component.schemaId, runid: component.schemaInfo.runId}});
  }));

  it('should manageStaticColumns', () => {
    component.manageStaticColumns();
    expect(component.startColumns.includes('_score_weightage')).toBeTrue();

    component.activeTab = 'review';
    component.manageStaticColumns();
    expect(component.startColumns.includes('_score_weightage')).toBeFalse();
  });

  it('should makeFilterControl', () => {

    fixture.detectChanges();

    const criteria = {selectedValues: [{CODE: 'USA'}], fldCtrl: {fieldId: 'region'},  fieldId: 'region'} as AddFilterOutput;

    component.makeFilterControl(criteria);
    expect(component.filterCriteria.getValue().length).toEqual(1);

    criteria.selectedValues[0].CODE = 'Asia';

    component.makeFilterControl(criteria);
    expect(component.filterCriteria.getValue()[0].values).toEqual(['Asia']);

   });

   it('prepateTextToShow(), should prepare text to show over mat-chips', async () => {
    const ctrl: FilterCriteria = {
      fieldId: 'MaterialType',
      values: ['123', '456'],
      type: 'DROPDOWN',
      filterCtrl: {
        selectedValues: [
          {
            CODE: 'ABC',
            FIELDNAME: 'MaterialType'
          } as DropDownValue
        ]
      } as AddFilterOutput
    }

    const result = component.prepareTextToShow(ctrl);
    expect(result).toEqual('ABC');

    ctrl.filterCtrl.selectedValues[0].TEXT = 'first value';
    expect(component.prepareTextToShow(ctrl)).toEqual('first value');

    component.filterCriteria.next([ctrl]);
    ctrl.filterCtrl.selectedValues.push({ CODE: 'DEF', FIELDNAME: 'MaterialType'} as DropDownValue);
    expect(component.prepareTextToShow(ctrl)).toEqual('2');

    component.filterCriteria.next([]);
    expect(component.prepareTextToShow(ctrl)).toEqual('Unknown');

    ctrl.filterCtrl.selectedValues = [];
    expect(component.prepareTextToShow(ctrl)).toEqual('Unknown');

  });

  it('should refresh table data on new variantId', (async () => {

    spyOn(component, 'getVariantDetails');

    component.dataScope = [{ variantId: '1', schemaId: component.schemaId, variantName: 'first variant' } as SchemaVariantsModel];

    component.variantChange('1');
    expect(component.variantName).toEqual('first variant');
    component.variantChange('1');
    expect(component.getVariantDetails).toHaveBeenCalledTimes(1);

    component.variantChange('0');
    expect(component.filterCriteria.getValue()).toEqual([]);


  }));

  it('should getSchemaTableActions', () => {

    spyOn(schemaDetailService, 'getTableActionsBySchemaId').and.returnValues(of([]), of([{ actionText: 'Approve'} as SchemaTableAction]));

    component.getSchemaTableActions();
    expect(component.tableActionsList.length).toEqual(2);

    component.getSchemaTableActions();
    expect(component.tableActionsList.length).toEqual(1);

  });

  it('should get data on sort change', () => {

    spyOn(component, 'getData');

    fixture.detectChanges();
    component.sort.sort({id: 'status'} as MatSortable);
    expect(component.sortOrder).toEqual({status: 'asc'});

    component.sort.sort({id: 'status'} as MatSortable);
    expect(component.sortOrder).toEqual({status: 'desc'});

    component.sort.sort({id: 'status'} as MatSortable);
    expect(component.getData).toHaveBeenCalledTimes(2);

  });

  it('toggleSideBar(), toggle sidebar', () => {
    component.arrowIcon='chevron-left';
    fixture.detectChanges();
    component.navscroll=fixture.componentInstance.navscroll;
    component.toggleSideBar();
    expect(component.arrowIcon).toEqual('chevron-right');

    component.arrowIcon='chevron-right';
    component.toggleSideBar();
    expect(component.arrowIcon).toEqual('chevron-left');

  });

  it('resize(), resize sidebar', () => {
    component.mousePosition = {
      x: 8,
      y: 20
    }
    fixture.detectChanges();
    component.navscroll=fixture.componentInstance.navscroll;
    component.boxPosition = { left:10, top:20 };
    component.resize();
    expect(component.widthOfSchemaNav).toEqual(0)

    component.mousePosition = {
      x: 18,
      y: 20
    }
    component.boxPosition = { left:10, top:20 };
    component.resize();
    expect(component.widthOfSchemaNav).toEqual(8)

    component.mousePosition = {
      x: 400,
      y: 20
    }
    component.resize();
    expect(component.arrowIcon).toEqual('chevron-left')
  });

  it('setStatus(), setStatus sidebar', () => {
    const event = new MouseEvent('');
    spyOn(event, 'stopPropagation');
    spyOn(component, 'setNavDivPositions');
    component.setStatus(event, 1)
    expect(event.stopPropagation).toHaveBeenCalled();

    component.setStatus(event, 2)
    expect(component.setNavDivPositions).toHaveBeenCalled();
  });

  it('getSchemaExecutionTree(), get schema execution tree...', async(()=>{
    component.userDetails = new Userdetails();
    component.userDetails.plantCode = 'test';
    component.userDetails.userName = 'test';
    spyOn(schemaService,'getSchemaExecutionTree').withArgs(component.moduleId, component.schemaId, component.variantId, component.userDetails.plantCode, component.userDetails.userName, component.activeTab).and.returnValues(of(new SchemaExecutionTree()), throwError({message: 'api error'}));
    component.getSchemaExecutionTree(component.userDetails.plantCode, component.userDetails.userName);
    expect(schemaService.getSchemaExecutionTree).toHaveBeenCalledWith(component.moduleId, component.schemaId, component.variantId, component.userDetails.plantCode, component.userDetails.userName, component.activeTab);

    spyOn(console, 'error');
    component.getSchemaExecutionTree(component.userDetails.plantCode, component.userDetails.userName);
    expect(console.error).toHaveBeenCalled();
  }));

  it('nodeSelected()', async(()=>{

    component.executionTreeHierarchy = {
      nodeId: 'header',
      nodeType: SchemaExecutionNodeType.HEADER,
      childs: [
        {nodeId: '1', nodeType: SchemaExecutionNodeType.HEIRARCHY},
        {nodeId: '2', nodeType: SchemaExecutionNodeType.HEIRARCHY}
      ]
    } as SchemaExecutionTree;
    component.activeNode = component.executionTreeHierarchy;

    spyOn(component, 'calculateDisplayFields');
    spyOn(component, 'getNodeParentsHierarchy').and.returnValue(['header'])
    spyOn(schemaDetailService,'getSelectedFieldsByNodeIds').and.returnValues(of([]), throwError({message: 'api error'}));
    component.nodeSelected(component.activeNode);

    const newNode = new SchemaExecutionTree();
    newNode.nodeId = '1';
    component.nodeSelected(JSON.parse(JSON.stringify(newNode)));
    expect(component.calculateDisplayFields).toHaveBeenCalled();

    spyOn(console, 'error');
    newNode.nodeId = '2';
    component.nodeSelected(JSON.parse(JSON.stringify(newNode)));
    expect(console.error).toHaveBeenCalled();
  }));

  it('getExectionArray()', async(()=>{

    component.activeNode = {
      nodeId: 'header',
      nodeType: SchemaExecutionNodeType.HEADER,
      childs: [
        {nodeId: '1', nodeType: SchemaExecutionNodeType.HEIRARCHY}
      ]
    } as SchemaExecutionTree;

    const arr = component.getExectionArray(component.activeNode);
    expect(arr.length).toEqual(2);
  }));

  it('getNodeParentsHierarchy()', async(()=>{

    component.executionTreeHierarchy = {
      nodeId: 'header',
      nodeType: SchemaExecutionNodeType.HEADER,
      childs: [
        {nodeId: '1', nodeType: SchemaExecutionNodeType.HEIRARCHY}
      ]
    } as SchemaExecutionTree;

    expect(component.getNodeParentsHierarchy(null)).toEqual(['header']);

    component.activeNode = component.executionTreeHierarchy;

    expect(component.getNodeParentsHierarchy(component.activeNode.childs[0])).toEqual(['1','header']);
  }));

  it('uploadCorrectedDataCsv(), should open files', async(() => {
    expect(component.uploadCorrectedDataCsv()).toBeTruthy();
  }));

  it('fileUploaded(), should close upload progress', async(() => {
    component.fileUploaded('');
    component.fileUploaded('test');
    expect(component.isFileUploading).toBeFalse();
  }));

  it('fileChange(), upload csv file', async(() => {
    const ev: Event = new Event('file');
    spyOn(component, 'checkForValidFile').withArgs(ev).and.returnValue({errMsg: 'Error', file: null});
    spyOn(console, 'error');
    component.fileChange(ev);

    expect(console.error).toHaveBeenCalled();
  }));

  it('fileChange(), upload csv file', async(() => {
    const ev: Event = new Event('file');
    spyOn(component, 'checkForValidFile').withArgs(ev).and.returnValue({errMsg: '', file: null});
    spyOn(console, 'error');
    component.fileChange(ev);

    expect(console.error).toHaveBeenCalled();
  }));

  it('getModuleInfo(), should get module info', async(() => {
    spyOn(schemaService,'getModuleInfoByModuleId').and.returnValues(of([]), throwError({message: 'api error'}));
    component.getModuleInfo('');
    expect(component.moduleInfo).toBeUndefined();
  }));

  it('getModuleInfo(), should get module info', async(() => {
    const moduleInfo = new ModuleInfo();
    spyOn(schemaService,'getModuleInfoByModuleId').withArgs('12345').and.returnValues(of([moduleInfo]), throwError({message: 'api error'}));
    component.getModuleInfo('12345');
    expect(component.moduleInfo).toBeDefined();
  }));
});
