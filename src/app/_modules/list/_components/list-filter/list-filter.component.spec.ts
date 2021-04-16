import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { FieldMetaData } from '@models/core/coreModel';
import { FilterCriteria, ListPageFilters } from '@models/list-page/listpage';
import { SharedModule } from '@modules/shared/shared.module';
import { CoreService } from '@services/core/core.service';
import { of, throwError } from 'rxjs';
import { AppMaterialModuleForSpec } from 'src/app/app-material-for-spec.module';

import { ListFilterComponent } from './list-filter.component';

describe('ListFilterComponent', () => {
  let component: ListFilterComponent;
  let fixture: ComponentFixture<ListFilterComponent>;
  let coreService: CoreService;
  let router: Router;
  const pathPrams = { moduleId: '1005'};
  const queryParams = { f: '' };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListFilterComponent ],
      imports: [ AppMaterialModuleForSpec,  RouterTestingModule, SharedModule ],
      providers: [
        { provide: ActivatedRoute, useValue: { params: of(pathPrams), queryParams: of(queryParams)}}
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListFilterComponent);
    component = fixture.componentInstance;
    coreService = fixture.debugElement.injector.get(CoreService);
    router = TestBed.inject(Router);
    // fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should getModuleFldMetadata', () => {


    expect(() => component.getModuleFldMetadata()).toThrowError('Module id cant be null or empty');

    const response = [{
          fieldId: 'name',
          fieldDescri: 'name'
    }] as FieldMetaData[];

    component.moduleId = '1005';
    spyOn(coreService, 'searchFieldsMetadata')
      .and.returnValues(of(response), of(response), of([]),throwError({message: 'api error'}));


    component.getModuleFldMetadata();
    expect(coreService.searchFieldsMetadata).toHaveBeenCalledWith(component.moduleId, component.fieldsPageIndex, component.fieldsSearchString,20);
    expect(component.moduleFieldsMetatdata).toEqual(response);

    // load more
    component.getModuleFldMetadata(true);
    expect(coreService.searchFieldsMetadata).toHaveBeenCalledWith(component.moduleId, 1, component.fieldsSearchString,20);
    expect(component.moduleFieldsMetatdata.length).toEqual(2);

    // load more empty response
    component.getModuleFldMetadata(true);
    expect(coreService.searchFieldsMetadata).toHaveBeenCalledWith(component.moduleId, 2, component.fieldsSearchString,20);
    expect(component.moduleFieldsMetatdata.length).toEqual(2);
    expect(component.fieldsPageIndex).toEqual(1);


    // api error
    spyOn(console, 'error');
    component.getModuleFldMetadata();
    expect(console.error).toHaveBeenCalled();

  });

  it('should getfilterFieldsMetadata', () => {

    component.getfilterFieldsMetadata([]);

    const response = [{
          fieldId: 'name',
          fieldDescri: 'name'
    }] as FieldMetaData[];

    spyOn(coreService, 'getMetadataByFields').withArgs(['name'])
      .and.returnValues(of(response), throwError({message: 'api error'}));


    component.getfilterFieldsMetadata(['name']);
    expect(coreService.getMetadataByFields).toHaveBeenCalledWith(['name']);
    expect(component.filterFieldsMetadata).toEqual(response);


    // api error
    spyOn(console, 'error');
    component.getfilterFieldsMetadata(['name']);
    expect(console.error).toHaveBeenCalled();

  });

  it('should close sidesheet', () => {

    spyOn(router, 'navigate');
    component.close();
    expect(router.navigate).toHaveBeenCalledWith([{ outlets: { sb: null } }], { queryParams: {} });

    component.filtersList.filterCriteria.push(
      { fieldId: 'MTL_TYPE', values: ['pen']} as FilterCriteria
    );
    const filters = btoa(JSON.stringify(component.filtersList));
    component.close();
    expect(router.navigate).toHaveBeenCalledWith([{ outlets: { sb: null } }], { queryParams: {f: filters} });


  });

  it('should applyFilter', () => {

    component.activeFilter = new FilterCriteria();
    component.activeFilter.fieldId = 'MTL_GROUP';

    component.applyFilter();
    component.applyFilter();
    expect(component.filtersList.filterCriteria.length).toEqual(1);

  });

  it('should upsertFilter', () => {

    component.upsertFilter('MTL_GROUP');
    expect(component.activeFilter.fieldId).toEqual('MTL_GROUP');

    component.applyFilter();
    component.filtersList.filterCriteria[0].values = ['grp1'];
    component.upsertFilter('MTL_GROUP');
    expect(component.activeFilter.values).toEqual(['grp1']);

  });

  it('should getFieldDescription', () => {

    expect(component.getFieldDescription('any')).toEqual('Unknown');

    component.moduleFieldsMetatdata = [
      {fieldId: 'MTL_GRP', fieldDescri: 'Material groupe'}
    ] as FieldMetaData[];

    expect(component.getFieldDescription('MTL_GRP')).toEqual('Material groupe');

  });

  it('should getFilterDescription', () => {

    expect(component.getFilterDescription('any')).toEqual('Unknown');

    component.filterFieldsMetadata = [
      {fieldId: 'MTL_GRP', fieldDescri: 'Material groupe'}
    ] as FieldMetaData[];

    expect(component.getFilterDescription('MTL_GRP')).toEqual('Material groupe');

  });

  it('should updateFilterValue', () => {

    component.activeFilter = new FilterCriteria();
    component.updateFilterValue('new value');
    expect(component.activeFilter.values).toEqual(['new value']);

  });

  it('should init component', () => {

    spyOn(component, 'getfilterFieldsMetadata');
    spyOn(component, 'getModuleFldMetadata');

    component.ngOnInit();

    expect(component.moduleId).toEqual('1005');
    expect(component.filtersList).toEqual(new ListPageFilters());

    const filters = new ListPageFilters();
    filters.filterCriteria.push(
      {fieldId: 'region', values: ['TN']} as FilterCriteria
    );

    queryParams.f = btoa(JSON.stringify(filters));
    component.ngOnInit();
    expect(component.filtersList.filterCriteria[0].fieldId).toEqual('region');

    component.searchFieldSub.next('material');
    expect(component.suggestedFilters.length).toEqual(0);

  });

});
