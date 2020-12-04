import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { SchemaListDetails, SchemaStaticThresholdRes, SchemaVariantsModel } from '@models/schema/schemalist';
import { SearchInputComponent } from '@modules/shared/_components/search-input/search-input.component';
import { GroupDataTableComponent } from '@modules/schema/_components/v2/duplicacy/group-data-table/group-data-table.component';

import { SchemaService } from '@services/home/schema.service';
import { SchemalistService } from '@services/home/schema/schemalist.service';
import { of } from 'rxjs';
import { AppMaterialModuleForSpec } from 'src/app/app-material-for-spec.module';

import { SchemaVariantService } from '@services/home/schema/schema-variant.service';
import { SchemaDetailsService } from '@services/home/schema/schema-details.service';
import { CatalogCheckService } from '@services/home/schema/catalog-check.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FilterCriteria, MetadataModel } from '@models/schema/schemadetailstable';
import { DropDownValue } from '@modules/admin/_components/module/business-rules/business-rules.modal';
import { RequestForCatalogCheckData } from '@models/schema/duplicacy';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DuplicacyDataSource } from './duplicacy-data-source';

import { DuplicacyComponent } from './duplicacy.component';
import { Router } from '@angular/router';

describe('DuplicacyComponent', () => {
  let component: DuplicacyComponent;
  let fixture: ComponentFixture<DuplicacyComponent>;
  let schemaListService: SchemalistService;
  let schemaService: SchemaService;
  let schemaVariantService: SchemaVariantService;
  let schemaDetailService: SchemaDetailsService;
  let catalogService: CatalogCheckService;
  let snackBar : MatSnackBar;
  let router: Router

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DuplicacyComponent, SearchInputComponent, GroupDataTableComponent ],
      imports: [AppMaterialModuleForSpec, RouterTestingModule, HttpClientTestingModule]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DuplicacyComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
    schemaListService = fixture.debugElement.injector.get(SchemalistService);
    schemaService = fixture.debugElement.injector.get(SchemaService);
    component.schemaId = '1';
    component.variantId = '0';
    component.moduleId = '1';
    component.schemaInfo = {runId: '123'} as SchemaListDetails;

    schemaVariantService = fixture.debugElement.injector.get(SchemaVariantService);
    schemaDetailService = fixture.debugElement.injector.get(SchemaDetailsService);
    catalogService = fixture.debugElement.injector.get(CatalogCheckService);
    snackBar = fixture.debugElement.injector.get(MatSnackBar);

    component.dataSource = new DuplicacyDataSource(catalogService, snackBar);

    // fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('getSchemaDetails(), get schema details ', async(() => {
    spyOn(schemaListService, 'getSchemaDetailsBySchemaId').withArgs(component.schemaId).
      and.returnValue(of({ schemaId: component.schemaId } as SchemaListDetails));

    component.getSchemaDetails();

    expect(schemaListService.getSchemaDetailsBySchemaId).toHaveBeenCalledWith(component.schemaId);
  }));

  it('should get schema statistics', async(() => {

    spyOn(schemaService, 'getSchemaThresholdStatics').withArgs(component.schemaId, component.variantId)
      .and.returnValue(of({ schemaId: component.schemaId } as SchemaStaticThresholdRes));

    component.getSchemaStatics();

    expect(schemaService.getSchemaThresholdStatics).toHaveBeenCalledWith(component.schemaId, component.variantId);
  }));

  it('should get variant details', async(() => {

    spyOn(schemaVariantService, 'getVariantdetailsByvariantId').withArgs(component.variantId).and.returnValue(of({
      schemaId: component.schemaId,
      filterCriteria: [
        {
          fieldId: 'MATL_TYPE',
          type: 'DROPDOWN',
          values: ['67', '2']
        } as FilterCriteria
      ]
    } as SchemaVariantsModel));

    component.getVariantDetails();

    expect(schemaVariantService.getVariantdetailsByvariantId).toHaveBeenCalledWith(component.variantId);

  }));


  it('loadDropValues(), load current field .. ', async(() => {
    // mock data
    const data: FilterCriteria = { fieldId: 'MATL_TYPE', type: 'DROPDOWN', values: ['ZMRO', 'ALT'] } as FilterCriteria;
    component.loadDropValues(data);
    expect(component.loadDopValuesFor.checkedValue.length).toEqual(2);
  }));

  it('updateFilterCriteria(), update filter criteria .. ', async(() => {
    const dropValue: DropDownValue[] = [{
      CODE: 'ZMRO',
      FIELDNAME: 'MATL_TYPE',
      LANGU: 'en',
      PLANTCODE: '0',
      SNO: '872372',
      TEXT: 'Zmro Text'
    }];


    const exitingFilter: FilterCriteria[] = [{
      fieldId: 'MATL_TYPE',
      type: 'DROPDOWN',
      values: ['TEST'],
      fldCtrl: { fieldId: 'MATL_TYPE' } as MetadataModel,
      filterCtrl: { fldCtrl: { fieldId: 'MATL_TYPE' } as MetadataModel, selectedValues: [] }
    }];

    component.filterCriteria.next(exitingFilter);

    component.loadDopValuesFor = { fieldId: 'MATL_TYPE', checkedValue: [] };

    component.updateFilterCriteria(dropValue);

    const res = component.filterCriteria.getValue();

    expect(res.values.length).toEqual(0);

  }));


  it('should get data table headers', (async() => {


    spyOn(schemaDetailService, 'getMetadataFields').withArgs(component.moduleId)
      .and.returnValue(of());

    spyOn(schemaDetailService, 'getAllSelectedFields').withArgs(component.schemaId, component.variantId)
        .and.returnValue(of([]));

    component.getTableHeaders();

    expect(schemaDetailService.getMetadataFields).toHaveBeenCalledWith(component.moduleId);
    expect(schemaDetailService.getAllSelectedFields).toHaveBeenCalledWith(component.schemaId, component.variantId);
  }));


  it('should fetch table data', async(() => {

    const request = new RequestForCatalogCheckData();
    request.schemaId = component.schemaId;
    request.groupId = component.groupId;
    request.from = 1;
    request.size = 20;
    request.key = component.groupKey;
    request.runId = '';
    // request.runId = component.schemaInfo.runId;


    spyOn(catalogService, 'getCatalogCheckRecords').withArgs(request)
      .and.returnValue(of());

    component.getData();
    expect(catalogService.getCatalogCheckRecords).toHaveBeenCalledWith(request);

  }));

  it('should check static columns', () => {
    expect(component.isStaticColumn('select')).toEqual(true);
  });

  it('should refresh table data on new variantId', (async() => {

    spyOn(schemaVariantService, 'getVariantdetailsByvariantId').withArgs('1').and.returnValue(of({
      schemaId: component.schemaId,
      filterCriteria: [
        {
          fieldId: 'MATL_TYPE',
          type: 'DROPDOWN',
          values: ['67', '2']
        } as FilterCriteria
      ]
    } as SchemaVariantsModel));

    component.schemaInfo = {
      schemaId: component.schemaId, runId:'123',
      variants: [{variantId: '1', schemaId: component.schemaId, variantName: 'first variant'} as SchemaVariantsModel]
    } as SchemaListDetails;

    const request = new RequestForCatalogCheckData();
    request.schemaId = component.schemaId;
    request.groupId = component.groupId;
    request.schemaId = component.schemaId;
    request.groupId = component.groupId;
    request.from = 1;
    request.size = 20;
    request.key = component.groupKey;
    request.runId = '';
    // request.runId = component.schemaInfo.runId;

    spyOn(catalogService, 'getCatalogCheckRecords').withArgs(request)
      .and.returnValue(of());

    component.refreshData('1');
    expect(component.variantName).toEqual('first variant');

    component.refreshData('1');
    expect(catalogService.getCatalogCheckRecords).toHaveBeenCalledTimes(1);
    expect(schemaVariantService.getVariantdetailsByvariantId).toHaveBeenCalledTimes(1);


  }));

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

  it('should update table data after group change', () => {

    const group = {
      groupId: 'group1',
      groupKey: 'exact'
    }

    spyOn(component, 'getData');

    component.updateSelectedGroup(group);
    expect(component.groupId).toEqual(group.groupId);
    expect(component.groupKey).toEqual(group.groupKey);

    component.updateSelectedGroup(group);

    expect(component.getData).toHaveBeenCalledTimes(1);


  });

  it('should load more data on table scroll end', () => {

    const event = {
      target : {
        clientHeight : 20,
        scrollTop : 70,
        scrollHeight: 100
      }
    }

    spyOn(component, 'getData');

    component.onScroll(event);
    expect(component.lastScrollTop).toEqual(event.target.scrollTop);

    event.target.scrollTop = 80;

    component.onScroll(event);

    expect(component.getData).toHaveBeenCalledTimes(1);

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
    component.changeTabStatus('warning');
    expect(component.activeTab).toEqual('warning');
    expect(component.getData).toHaveBeenCalledTimes(1);

  });

  it('should get checkbox label', () => {
    expect(component.checkboxLabel()).toContain('select');
  });

  it('openSummarySideSheet(), should navigate to schema summary side sheet', () => {
    component.moduleId = '1005';
    component.schemaId = '2563145';

    spyOn(router, 'navigate');
    component.openSummarySideSheet();
    expect(router.navigate).toHaveBeenCalledWith([{ outlets: { sb: `sb/schema/check-data/${component.moduleId}/${component.schemaId}` } }])
  })

  it('getDataScope(), should return all variants of a schema', async () => {
    component.schemaId = '1005';
    spyOn(schemaVariantService, 'getDataScope').withArgs(component.schemaId, 'RUNFOR').and.returnValue(of())
    component.getDataScope();
    expect(schemaVariantService.getDataScope).toHaveBeenCalledWith(component.schemaId, 'RUNFOR');
  })

  it('openSummarySideSheet(), should navigate to schema summary side sheet', () => {
    spyOn(router, 'navigate');
    component.openSummarySideSheet();
    expect(router.navigate).toHaveBeenCalledWith([{ outlets: { sb: `sb/schema/check-data/${component.moduleId}/${component.schemaId}` } }])
  })

  it('openDataScopeSideSheet(), should navigate to data scope side sheet', () => {
    spyOn(router, 'navigate');
    component.openDataScopeSideSheet();
    expect(router.navigate).toHaveBeenCalledWith([{ outlets: { sb: `sb/schema/data-scope/${component.moduleId}/${component.schemaId}/new` } }])
  })
});
