// import { CdkDragDrop } from '@angular/cdk/drag-drop';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { TableColumnSettingsComponent } from './table-column-settings.component';
import { AppMaterialModuleForSpec } from 'src/app/app-material-for-spec.module';
import { CrossMappingRule, DetailView, MetadataModel, SchemaTableAction, SchemaTableViewRequest, TableActionViewType } from 'src/app/_models/schema/schemadetailstable';
import { RouterTestingModule } from '@angular/router/testing';
import { SchemaDetailsService } from '@services/home/schema/schema-details.service';
import { of } from 'rxjs';
import { SharedServiceService } from '@modules/shared/_services/shared-service.service';
import { SearchInputComponent } from '../search-input/search-input.component';
import { SchemaListDetails } from '@models/schema/schemalist';
import { Router } from '@angular/router';
import { UserService } from '@services/user/userservice.service';
import { SchemalistService } from '@services/home/schema/schemalist.service';
import { Userdetails } from '@models/userdetails';
import { CdkDragDrop, CdkDropList } from '@angular/cdk/drag-drop';

describe('TableColumnSettingsComponent', () => {
  let component: TableColumnSettingsComponent;
  let fixture: ComponentFixture<TableColumnSettingsComponent>;
  let schemaDetailsService: SchemaDetailsService;
  let router: Router;
  let userService: UserService;
  let sharedService: SharedServiceService;
  let schemalistService: SchemalistService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        TableColumnSettingsComponent,
        SearchInputComponent
      ],
      imports: [
        AppMaterialModuleForSpec,
        RouterTestingModule,
      ],
      providers: [SchemaDetailsService]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TableColumnSettingsComponent);
    component = fixture.componentInstance;
    schemaDetailsService = fixture.debugElement.injector.get(SchemaDetailsService);
    router = TestBed.inject(Router);
    userService = fixture.debugElement.injector.get(UserService);
    sharedService = fixture.debugElement.injector.get(SharedServiceService);
    schemalistService = fixture.debugElement.injector.get(SchemalistService);

    component.userDetails.userName = 'admin';
    component.schemaInfo = new SchemaListDetails();
    component.schemaInfo.createdBy = 'admin';
    component.data = {
      schemaId: 'schema'
    }

  });


  it('persistenceTableView(), should call http for save table column ', async(()=>{
    component.data = {schemaId:'327', variantId:'736472'};
    const selFld = [{fieldId : 'id', order: 0, editable: true, isEditable:true}];
    // mock data
    const schemaTableViewRequest: SchemaTableViewRequest = new SchemaTableViewRequest();
    schemaTableViewRequest.schemaId = component.data.schemaId;
    schemaTableViewRequest.variantId = component.data.variantId;
    schemaTableViewRequest.schemaTableViewMapping = selFld;

    spyOn(schemaDetailsService,'updateSchemaTableView').withArgs(schemaTableViewRequest).and.returnValue(of({}));
    // spyOn(router, 'navigate');

    component.persistenceTableView(selFld);
    expect(schemaDetailsService.updateSchemaTableView).toHaveBeenCalledWith(schemaTableViewRequest);
    // expect(router.navigate).toHaveBeenCalledWith([{ outlets: { sb: null }}]);
  }));


  it('manageStateOfCheckBox(), manage state of columns ', async(()=>{

    component.data = {selectedFields:[{fieldId: 'MATL_TYPE', order: 0, editable: true}]};

    component.header = [{fieldId:'MATL_TYPE'} as MetadataModel];
    component.manageStateOfCheckBox();
    expect(component.allChecked).toEqual(true);

    component.header = [{fieldId:'MATL_TYPE'}, {fieldId: 'region'} ] as MetadataModel[];
    component.manageStateOfCheckBox();
    expect(component.allChecked).toEqual(false);

    component.data.selectedFields = [];
    component.manageStateOfCheckBox();
    expect(component.allChecked).toEqual(false);

  }));

  it('isChecked(), is checked ', async(()=>{
    component.data = {selectedFields:[{fieldId: 'MATL_TYPE', order: 0, editable: true}]};
    const res = component.isChecked({fieldId:'MATL_TYPE'} as MetadataModel);
    expect(res).toEqual(true);
    expect(component.isChecked({fieldId: 'region'} as MetadataModel)).toBeFalsy();
  }));

  it('selectAll(), select all ', async(()=>{
    component.data = {};
    component.allChecked = true;
    component.selectAll();
    expect(component.allChecked).toEqual(true);

    component.headerArray = ['matl_grp'];
    component.selectAll();
    expect(component.data.selectedFields.length).toEqual(1);


    component.allChecked = false;
    component.selectAll();
    expect(component.allChecked).toEqual(false);
  }));

  it('submitColumn(), submit selected columns ', async(()=>{
    component.header = [{
      fieldId:'MATL_TYPE'
    } as MetadataModel];

    const selFld = [{fieldId : 'MATL_TYPE', order: 0, editable: true,isEditable:true}];
    component.data  = {selectedFields:selFld, schemaId:'72356742', variantId:'67242'};


    // mock data
    const schemaTableViewRequest: SchemaTableViewRequest = new SchemaTableViewRequest();
    schemaTableViewRequest.schemaId = component.data.schemaId;
    schemaTableViewRequest.variantId = component.data.variantId;
    schemaTableViewRequest.schemaTableViewMapping = selFld;

    spyOn(schemaDetailsService,'updateSchemaTableView').withArgs(schemaTableViewRequest).and.returnValue(of({}));
    // spyOn(router, 'navigate');


    component.submitColumn();

    expect(schemaDetailsService.updateSchemaTableView).toHaveBeenCalledWith(schemaTableViewRequest);
    // expect(router.navigate).toHaveBeenCalledWith([{ outlets: { sb: null }}]);

  }));

  it('should check if user has action config permission', () => {
    expect(component.isActionConfigAllowed).toEqual(true);
  });

  it('should get action view type description', () => {
    expect(component.getActionViewTypeDesc(TableActionViewType.ICON)).toEqual('Icon only');
    expect(component.getActionViewTypeDesc(TableActionViewType.ICON_TEXT)).toEqual('Icon and text');
    expect(component.getActionViewTypeDesc(TableActionViewType.TEXT)).toEqual('Text only');
  });

  it('should get primary actions', () => {
    component.actionsList = [
      {isPrimaryAction: true},
      {isPrimaryAction: false},
    ] as SchemaTableAction[];

    expect(component.primaryActions.length).toEqual(1);
    expect(component.secondaryActions.length).toEqual(1);
  });

  it('should add/remove custom action', async(() => {

    component.addCustomAction();
    expect(component.actionsList.length).toEqual(1);

  }));

  it('should save actions config', () => {

    spyOn(component, 'submitColumn');
    spyOn(schemaDetailsService, 'createUpdateSchemaActionsList').and.returnValue(of([]));

    let activeTabIndex = 2; // nop
    component.save(activeTabIndex);

    activeTabIndex = 0; // columns tab
    component.save(activeTabIndex);
    expect(component.submitColumn).toHaveBeenCalledTimes(1);

    activeTabIndex = 1; // actions tab
    component.save(activeTabIndex);
    expect(schemaDetailsService.createUpdateSchemaActionsList).toHaveBeenCalledWith(component.actionsList);

  });

  it('should close sidesheet', () => {
    spyOn(router, 'navigate');
    component.close();
    expect(router.navigate).toHaveBeenCalledWith([{ outlets: { sb: null }}],  {queryParamsHandling: 'preserve'});
  })

  it('should close on init component', () => {

    spyOn(component, 'close');

    spyOn(userService, 'getUserDetails').and.returnValue(of(new Userdetails()))

    spyOn(sharedService, 'getChooseColumnData').and.returnValue(of(null));
    component.ngOnInit();


    expect(component.close).toHaveBeenCalledTimes(1);
    expect(userService.getUserDetails).toHaveBeenCalledTimes(1);

  });

  it('should not update on init component', () => {

    spyOn(component, 'getSchemaDetails');

    spyOn(userService, 'getUserDetails').and.returnValue(of(new Userdetails()));

    spyOn(sharedService, 'getChooseColumnData').and.returnValue(of({}));
    component.ngOnInit();

    expect(component.getSchemaDetails).toHaveBeenCalledTimes(0);
  });

  it('should update on init component', () => {

    spyOn(component, 'getSchemaDetails');
    spyOn(component, 'headerDetails');
    spyOn(component, 'manageStateOfCheckBox');

    spyOn(userService, 'getUserDetails').and.returnValue(of(new Userdetails()))


    spyOn(sharedService, 'getChooseColumnData').and.returnValue(of({editActive: true, selectedFields: [], tableActionsList: []}));
    component.ngOnInit();

    expect(component.getSchemaDetails).toHaveBeenCalledTimes(1);
    /* expect(component.headerDetails).toHaveBeenCalledTimes(1);
    expect(component.manageStateOfCheckBox).toHaveBeenCalledTimes(1); */

  });

  it('should set headers details', () => {

    component.headerDetails();
    expect(component.header.length).toEqual(0);

    component.data = {schemaId: 'schema1', selectedFields: [], fields: {headers: {region: {fieldId: 'region'}}}};
    component.headerDetails();
    expect(component.header.length).toEqual(1);

    component.data.selectedFields = [{fieldId: 'region'}, {fieldId: 'mtl_grp'}];
    component.headerDetails();
    expect(component.header.length).toEqual(1);

    component.data.selectedFields = [{fieldId: 'mtl_grp'}];
    component.headerDetails();
    expect(component.header.length).toEqual(1);

  });

  it('should search for header field', () => {

    component.header = [{fieldId: 'region', fieldDescri: 'region'}] as MetadataModel[];
    component.searchFld('priority');
    expect(component.suggestedFlds.length).toEqual(0);

    component.searchFld('re');
    expect(component.suggestedFlds.length).toEqual(1);

  });

  it('should update on field selection change', () => {

    spyOn(component, 'manageStateOfCheckBox');
    component.data = {selectedFields: [{fieldId: 'region'}]};

    component.selectionChange({fieldId: 'region'} as MetadataModel);
    expect(component.data.selectedFields.length).toEqual(0);

    component.selectionChange({fieldId: 'region'} as MetadataModel);
    expect(component.data.selectedFields.length).toEqual(1);

    expect(component.manageStateOfCheckBox).toHaveBeenCalledTimes(2);

  })

  it('should update on field editable change', () => {

    component.data = {selectedFields: [{fieldId: 'region', editable: false}]};

    component.editableChange({fieldId: 'region'} as MetadataModel);
    component.editableChange({fieldId: 'matl_grp'} as MetadataModel);

    expect(component.data.selectedFields[0].editable).toBeTrue();
  });

  it('should check if field is editable', () => {

    component.data = {selectedFields: [{fieldId: 'region', editable: true}]};
    expect(component.isEditEnabled({fieldId: 'region'} as MetadataModel)).toBeTrue();

  });

  it('should get schema details', async(() => {

    const schemaInfo = new SchemaListDetails();
    schemaInfo.schemaId = 'schema';
    spyOn(schemalistService, 'getSchemaDetailsBySchemaId').and.returnValue(of(schemaInfo));

    component.getSchemaDetails();
    expect(component.schemaInfo.schemaId).toEqual('schema');

  }));

  it('should get schema details', async(() => {

    const schemaInfo = new SchemaListDetails();
    schemaInfo.schemaId = 'schema';
    schemaInfo.createdBy = 'admin';

    spyOn(component, 'getSchemaActions');
    spyOn(component, 'getCrossMappingRules');

    spyOn(schemalistService, 'getSchemaDetailsBySchemaId').and.returnValue(of(schemaInfo));
    component.getSchemaDetails();

    expect(component.getSchemaActions).toHaveBeenCalledTimes(1);
    expect(component.getCrossMappingRules).toHaveBeenCalledTimes(1);
  }));

  it('should get cross mapping rules', async(() => {

    const resp = [{sno: '1701'} as CrossMappingRule];
    spyOn(schemaDetailsService, 'getCrossMappingRules').and.returnValue(of(resp));

    component.getCrossMappingRules();
    expect(component.crossMappingRules).toEqual(resp);

  }));

  it('should get schema actions', async(() => {

    const resp = [{sno: '1701'} as SchemaTableAction];
    spyOn(schemaDetailsService, 'getTableActionsBySchemaId').and.returnValue(of(resp));

    component.getSchemaActions();
    expect(component.actionsList).toEqual(resp);

  }));

  it('should get schema actions', async(() => {

    spyOn(component, 'addCommonActions');
    spyOn(schemaDetailsService, 'getTableActionsBySchemaId').and.returnValue(of([]));
    component.getSchemaActions();

    expect(component.addCommonActions).toHaveBeenCalledTimes(1);

  }));

  it('should add common actions', () => {

    component.schemaInfo.schemaCategory = DetailView.DATAQUALITY_VIEW;
    component.addCommonActions();
    expect(component.actionsList.length).toEqual(2);
  });

  it('should update on action change', () => {
    component.addCustomAction();
    component.actionChanged(0, 'actionText', 'new text');
    expect(component.actionsList[0].actionText).toEqual('new text');
  });

  it('should save actions config', async(() => {

    spyOn(component, 'close');
    spyOn(schemaDetailsService, 'createUpdateSchemaActionsList').and.returnValue(of([]));

    component.saveTableActionsConfig();
    expect(component.close).toHaveBeenCalledTimes(1);

  }));

  it('should remove actions after confirmation', () => {

    spyOn(schemaDetailsService, 'deleteSchemaTableAction').and.returnValue(of());

    component.addCustomAction();
    component.removeActionAfterConfirm('no', 0);
    expect(component.actionsList.length).toEqual(1);

    component.removeActionAfterConfirm('yes', 0);
    expect(component.actionsList.length).toEqual(0);

    component.addCustomAction();
    component.actionsList[0].sno = '1701';
    component.removeActionAfterConfirm('yes', 0);
    expect(schemaDetailsService.deleteSchemaTableAction).toHaveBeenCalledTimes(1);

  });

  it('should not edit primary action text', () => {
    component.actionsList = [{actionText: 'Approve', isCustomAction: false} as SchemaTableAction];
    component.editActionText(0);
    expect(component.previousActionText).toBeFalsy();
  });

  it('should handle drop event', () => {

    const previousContainer = {data: ['fields']} as CdkDropList<string[]>;
    const event = {
      previousIndex: 0,
      currentIndex: 1,
      item: undefined,
      container: undefined,
      previousContainer,
      isPointerOverContainer: true,
      distance: { x: 0, y: 0 }} as CdkDragDrop<string[]>;

      component.drop(event);
      expect(event.previousContainer).toEqual(previousContainer);

  })

});