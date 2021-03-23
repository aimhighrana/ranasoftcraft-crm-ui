/* import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { ListPageViewDetails, ListPageViewFldMap } from '@models/list-page/listpage';
import { MetadataModel, MetadataModeleResponse } from '@models/schema/schemadetailstable';
import { Userdetails } from '@models/userdetails';
import { FormInputComponent } from '@modules/shared/_components/form-input/form-input.component';
import { SearchInputComponent } from '@modules/shared/_components/search-input/search-input.component';
import { SharedServiceService } from '@modules/shared/_services/shared-service.service';
import { ListService } from '@services/list/list.service';
import { SchemaDetailsService } from '@services/home/schema/schema-details.service';
import { UserService } from '@services/user/userservice.service';
import { of, throwError } from 'rxjs';
import { AppMaterialModuleForSpec } from 'src/app/app-material-for-spec.module';


import { TableViewSettingsComponent } from './table-view-settings.component';

describe('TableViewSettingsComponent', () => {
  let component: TableViewSettingsComponent;
  let fixture: ComponentFixture<TableViewSettingsComponent>;
  let userService: UserService;
  let listService: ListService;
  let schemaDetailsService: SchemaDetailsService;
  let router: Router;
  let sharedService: SharedServiceService;
  const pathPrams = { moduleId: '1005', viewId: '1701'};

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TableViewSettingsComponent, FormInputComponent, SearchInputComponent ],
      imports: [ AppMaterialModuleForSpec,  RouterTestingModule ],
      providers: [
        { provide: ActivatedRoute, useValue: { params: of(pathPrams)}}
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TableViewSettingsComponent);
    component = fixture.componentInstance;

    userService = fixture.debugElement.injector.get(UserService);
    listService = fixture.debugElement.injector.get(ListService);
    schemaDetailsService = fixture.debugElement.injector.get(SchemaDetailsService);
    router = TestBed.inject(Router);
    sharedService = fixture.debugElement.injector.get(SharedServiceService);
    // fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should init component', () => {

    spyOn(component, 'getFldMetadata');
    spyOn(component, 'getTableViewDetails');
    spyOn(userService, 'getUserDetails').and.returnValues(of(new Userdetails()), throwError({message: 'error resp'}));

    component.ngOnInit();
    expect(component.getFldMetadata).toHaveBeenCalled();
    expect(component.getTableViewDetails).toHaveBeenCalled();
    expect(component.userDetails).toBeDefined();


    pathPrams.viewId = 'new';
    spyOn(console, 'error');
    component.ngOnInit();
    expect(component.getFldMetadata).toHaveBeenCalled();
    expect(console.error).toHaveBeenCalled();

  });

  it('should getTableViewDetails', () => {

    component.viewId = '1701';
    spyOn(listService, 'getListPageViewDetails')
      .and.returnValues(of(new ListPageViewDetails()), throwError({message: 'api error'}));

    component.getTableViewDetails();
    expect(listService.getListPageViewDetails).toHaveBeenCalled();

    // api error
    spyOn(console, 'error');
    component.getTableViewDetails();
    expect(console.error).toHaveBeenCalled();

  });

  it('should getFldMetadata', () => {


    expect(() => component.getFldMetadata()).toThrowError('Module id cant be null or empty');

    const response = {
      headers: {
        name: {
          fieldId: 'name',
          fieldDescri: 'name'
        }
      }
    } as MetadataModeleResponse;

    component.moduleId = '1005';
    spyOn(schemaDetailsService, 'getMetadataFields').withArgs(component.moduleId)
      .and.returnValues(of(response), throwError({message: 'api error'}));

    spyOn(component, 'headerDetails');

    component.getFldMetadata();
    expect(schemaDetailsService.getMetadataFields).toHaveBeenCalledWith(component.moduleId);
    expect(component.metadataFldLst).toEqual(response);


    // api error
    spyOn(console, 'error');
    component.getFldMetadata();
    expect(console.error).toHaveBeenCalled();

  });

  it('should headerDetails', () => {

    component.headerDetails();
    expect(component.header.length).toEqual(0);

    component.metadataFldLst = {
      headers: {
        name: {
          fieldId: 'name',
          fieldDescri: 'name'
        }
      }
    } as MetadataModeleResponse;

    component.headerDetails();
    expect(component.header.length).toEqual(1);
    expect(component.headerArray[0]).toEqual('name');

  });

  it('should close sidesheet', () => {

    spyOn(router, 'navigate');
    component.close();
    expect(router.navigate).toHaveBeenCalledWith([{outlets: {sb: null}}], {queryParamsHandling: 'preserve'});

  });

  it('isChecked(), is checked ', async(()=>{
    component.viewDetails.fieldsReqList = [{fieldId: 'MATL_TYPE', fieldOrder: 0, isEditable: true} as ListPageViewFldMap];

    expect(component.isChecked({fieldId:'MATL_TYPE'} as MetadataModel)).toEqual(true);

    expect(component.isChecked({fieldId:'MATL_GRP'} as MetadataModel)).toBeFalse();
  }));

  it('should save', () => {

    spyOn(component, 'close');

    component.viewDetails.fieldsReqList = [
      {fieldId: 'MTL_Grp', fieldOrder: 0, isEditable: true} as ListPageViewFldMap
    ];

    const request = new ListPageViewDetails();
    request.fieldsReqList = [
      {fieldId: 'MTL_Grp', fieldOrder: 0, isEditable: true} as ListPageViewFldMap
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
      {fieldId: 'MTL_Grp', fieldOrder: 1, isEditable: false} as ListPageViewFldMap
    ];

    component.editableChange({fieldId: 'MTL_Grp'} as MetadataModel);
    expect(component.viewDetails.fieldsReqList[0].isEditable).toBeTrue();

    component.editableChange({fieldId: 'MTL_type'} as MetadataModel);
    expect(component.viewDetails.fieldsReqList[0].isEditable).toBeTrue();

  });

  it('should isEditEnabled', () => {

    component.viewDetails.fieldsReqList = [
      {fieldId: 'MTL_Grp', fieldOrder: 1, isEditable: true} as ListPageViewFldMap
    ];

    expect(component.isEditEnabled({fieldId: 'MTL_Grp'} as MetadataModel)).toBeTrue();
    expect(component.isEditEnabled({fieldId: 'MTL_Type'} as MetadataModel)).toBeFalse();

  });

  it('should selectionChange', () => {

    component.selectionChange({fieldId: 'MTL_Grp'} as MetadataModel);
    expect(component.viewDetails.fieldsReqList.length).toEqual(1);

    component.selectionChange({fieldId: 'MTL_Grp'} as MetadataModel);
    expect(component.viewDetails.fieldsReqList.length).toEqual(0);

  });

  it('should searchFld', () => {

    spyOn(component, 'getTableViewDetails');
    spyOn(component, 'getFldMetadata');
    spyOn(userService, 'getUserDetails').and.returnValue(of(new Userdetails()));

    fixture.detectChanges();

    component.header = [ { fieldId: 'name', fieldDescri: 'name' }] as MetadataModel[];
    component.searchFld('');
    expect(component.suggestedFlds.length).toEqual(0);

    component.searchFld('length');
    expect(component.suggestedFlds.length).toEqual(0);

  });

});
 */