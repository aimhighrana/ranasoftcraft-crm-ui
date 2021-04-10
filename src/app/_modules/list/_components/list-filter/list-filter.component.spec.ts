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

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListFilterComponent ],
      imports: [ AppMaterialModuleForSpec,  RouterTestingModule, SharedModule ],
      providers: [
        { provide: ActivatedRoute, useValue: { params: of(pathPrams), queryParams: of({f: ''})}}
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

  it('should getFldMetadata', () => {


    expect(() => component.getFldMetadata()).toThrowError('Module id cant be null or empty');

    const response = [{
          fieldId: 'name',
          fieldDescri: 'name'
    }] as FieldMetaData[];

    component.moduleId = '1005';
    spyOn(coreService, 'getAllFieldsForView').withArgs(component.moduleId)
      .and.returnValues(of(response), throwError({message: 'api error'}));


    component.getFldMetadata();
    expect(coreService.getAllFieldsForView).toHaveBeenCalledWith(component.moduleId);
    expect(component.metadataFldLst).toEqual(response);


    // api error
    spyOn(console, 'error');
    component.getFldMetadata();
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

  it('should upsertFilter', () => {

    component.activeFilter = new FilterCriteria();
    component.activeFilter.fieldId = 'MTL_GROUP';

    component.upsertFilter();
    component.upsertFilter();
    expect(component.filtersList.filterCriteria.length).toEqual(1);

  });

  it('should editFilter', () => {

    component.editFilter('MTL_GROUP');
    expect(component.activeFilter.fieldId).toEqual('MTL_GROUP');

    component.upsertFilter();
    component.filtersList.filterCriteria[0].values = ['grp1'];
    component.editFilter('MTL_GROUP');
    expect(component.activeFilter.values).toEqual(['grp1']);

  });

  it('should getFieldDescription', () => {

    expect(component.getFieldDescription('any')).toEqual('Unkown');

    component.metadataFldLst = [
      {fieldId: 'MTL_GRP', fieldDescri: 'Material groupe'}
    ] as FieldMetaData[];

    expect(component.getFieldDescription('MTL_GRP')).toEqual('Material groupe');

  });

  it('should updateFilterValue', () => {

    component.activeFilter = new FilterCriteria();
    component.updateFilterValue('new value');
    expect(component.activeFilter.values).toEqual(['new value']);

  });

  it('should init component', () => {

    spyOn(component, 'getFldMetadata');

    component.ngOnInit();

    expect(component.moduleId).toEqual('1005');
    expect(component.filtersList).toEqual(new ListPageFilters());

  });

});
