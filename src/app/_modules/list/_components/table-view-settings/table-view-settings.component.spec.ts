import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { ListPageViewDetails, ListPageViewFldMap } from '@models/list-page/listpage';
import { FormInputComponent } from '@modules/shared/_components/form-input/form-input.component';
import { SearchInputComponent } from '@modules/shared/_components/search-input/search-input.component';
import { SharedServiceService } from '@modules/shared/_services/shared-service.service';
import { ListService } from '@services/list/list.service';
import { of, throwError } from 'rxjs';
import { AppMaterialModuleForSpec } from 'src/app/app-material-for-spec.module';


import { TableViewSettingsComponent } from './table-view-settings.component';
import { SharedModule } from '@modules/shared/shared.module';
import { FieldMetaData } from '@models/core/coreModel';
import { CoreService } from '@services/core/core.service';

describe('TableViewSettingsComponent', () => {
  let component: TableViewSettingsComponent;
  let fixture: ComponentFixture<TableViewSettingsComponent>;
  let listService: ListService;
  let coreService: CoreService;
  let router: Router;
  let sharedService: SharedServiceService;
  const pathPrams = { moduleId: '1005', viewId: '1701'};

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TableViewSettingsComponent, FormInputComponent, SearchInputComponent ],
      imports: [ AppMaterialModuleForSpec,  RouterTestingModule, SharedModule ],
      providers: [
        { provide: ActivatedRoute, useValue: { params: of(pathPrams)}}
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TableViewSettingsComponent);
    component = fixture.componentInstance;

    listService = fixture.debugElement.injector.get(ListService);
    coreService = fixture.debugElement.injector.get(CoreService);
    router = TestBed.inject(Router);
    sharedService = fixture.debugElement.injector.get(SharedServiceService);
    // fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should init component', () => {

    spyOn(component, 'getModuleFldMetadata');
    spyOn(component, 'getTableViewDetails');
    spyOn(component, 'mergeFieldsMetadata');

    component.ngOnInit();
    expect(component.getModuleFldMetadata).toHaveBeenCalled();
    expect(component.getTableViewDetails).toHaveBeenCalled();

    component.fldMetadataObs.next([]);
    expect(component.mergeFieldsMetadata).toHaveBeenCalled();

  });

  it('should getTableViewDetails', () => {

    spyOn(component,'getViewFieldsMetadata');

    component.viewId = '1701';
    spyOn(listService, 'getListPageViewDetails')
      .and.returnValues(of(new ListPageViewDetails()), throwError({message: 'api error'}));

    component.getTableViewDetails();
    expect(listService.getListPageViewDetails).toHaveBeenCalled();
    expect(component.getViewFieldsMetadata).toHaveBeenCalled();

    // api error
    spyOn(console, 'error');
    component.getTableViewDetails();
    expect(console.error).toHaveBeenCalled();

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

  it('should close sidesheet', () => {

    spyOn(router, 'navigate');
    component.close();
    expect(router.navigate).toHaveBeenCalledWith([{outlets: {sb: null}}], {queryParamsHandling: 'preserve'});

  });

  it('isChecked(), is checked ', async(()=>{
    component.viewDetails.fieldsReqList = [{fieldId: 'MATL_TYPE', fieldOrder: '0', isEditable: true} as ListPageViewFldMap];

    expect(component.isChecked({fieldId:'MATL_TYPE'} as FieldMetaData)).toEqual(true);

    expect(component.isChecked({fieldId:'MATL_GRP'} as FieldMetaData)).toBeFalse();
  }));

  it('should save', () => {

    spyOn(component, 'close');

    component.viewDetails.fieldsReqList = [
      {fieldId: 'MTL_Grp', fieldOrder: '0', isEditable: true} as ListPageViewFldMap
    ];

    component.mergedFieldsMetadata = [
      {fieldId: 'MTL_Grp', fieldDescri: 'Material group'}
    ] as FieldMetaData[];

    component.save();
    expect(component.submitted).toBeTrue();

    component.viewDetails.viewName = 'test view';
    component.viewDetails.viewId = '1701';

    const request = new ListPageViewDetails();
    request.fieldsReqList = [
      {fieldId: 'MTL_Grp', fieldOrder: '0', isEditable: true} as ListPageViewFldMap
    ];

    spyOn(listService, 'upsertListPageViewDetails')
      .and.returnValues(of(new ListPageViewDetails()), throwError({message: 'api error'}));

    spyOn(sharedService, 'setViewDetailsData');

    component.save();
    expect(listService.upsertListPageViewDetails).toHaveBeenCalled();
    expect(sharedService.setViewDetailsData).toHaveBeenCalled();
    expect(component.close).toHaveBeenCalled();

    // api error
    spyOn(console, 'error');
    component.save();
    expect(console.error).toHaveBeenCalled();

  });

  it('should editableChange', () => {

    component.viewDetails.fieldsReqList = [
      {fieldId: 'MTL_Grp', fieldOrder: '1', isEditable: false} as ListPageViewFldMap
    ];

    component.editableChange({fieldId: 'MTL_Grp'} as FieldMetaData);
    expect(component.viewDetails.fieldsReqList[0].isEditable).toBeTrue();

    component.editableChange({fieldId: 'MTL_type'} as FieldMetaData);
    expect(component.viewDetails.fieldsReqList[0].isEditable).toBeTrue();

  });

  it('should isEditEnabled', () => {

    component.viewDetails.fieldsReqList = [
      {fieldId: 'MTL_Grp', fieldOrder: '1', isEditable: true} as ListPageViewFldMap
    ];

    expect(component.isEditEnabled({fieldId: 'MTL_Grp'} as FieldMetaData)).toBeTrue();
    expect(component.isEditEnabled({fieldId: 'MTL_Type'} as FieldMetaData)).toBeFalse();

  });

  it('should selectionChange', () => {

    component.selectionChange({fieldId: 'MTL_Grp'} as FieldMetaData);
    expect(component.viewDetails.fieldsReqList.length).toEqual(1);

    component.selectionChange({fieldId: 'MTL_Grp'} as FieldMetaData);
    expect(component.viewDetails.fieldsReqList.length).toEqual(0);

  });

  it('should getViewFieldsMetadata', () => {

    component.getViewFieldsMetadata([]);

    const response = [{
          fieldId: 'name',
          fieldDescri: 'name'
    }] as FieldMetaData[];

    spyOn(coreService, 'getMetadataByFields').withArgs(['name'])
      .and.returnValues(of(response), throwError({message: 'api error'}));


    component.getViewFieldsMetadata(['name']);
    expect(coreService.getMetadataByFields).toHaveBeenCalledWith(['name']);
    expect(component.viewFieldsMetadata).toEqual(response);


    // api error
    spyOn(console, 'error');
    component.getViewFieldsMetadata(['name']);
    expect(console.error).toHaveBeenCalled();

  });

  it('should mergeFieldsMetadata', () => {
    component.moduleFieldsMetatdata = [{
      fieldId: 'name',
      fieldDescri: 'name'
    }] as FieldMetaData[];

    component.mergeFieldsMetadata();
    expect(component.mergedFieldsMetadata.length).toEqual(1);

  });

});
