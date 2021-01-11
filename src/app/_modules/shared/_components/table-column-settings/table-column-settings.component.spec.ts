// import { CdkDragDrop } from '@angular/cdk/drag-drop';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { TableColumnSettingsComponent } from './table-column-settings.component';
import { AppMaterialModuleForSpec } from 'src/app/app-material-for-spec.module';
import { MetadataModel, SchemaTableAction, SchemaTableViewRequest, TableActionViewType } from 'src/app/_models/schema/schemadetailstable';
import { RouterTestingModule } from '@angular/router/testing';
import { SchemaDetailsService } from '@services/home/schema/schema-details.service';
import { of } from 'rxjs';
import { SharedServiceService } from '@modules/shared/_services/shared-service.service';
import { SearchInputComponent } from '../search-input/search-input.component';
import { SchemaListDetails } from '@models/schema/schemalist';

describe('TableColumnSettingsComponent', () => {
  let component: TableColumnSettingsComponent;
  let fixture: ComponentFixture<TableColumnSettingsComponent>;
  let schemaDetailsService: SchemaDetailsService;

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
      providers: [SchemaDetailsService, SharedServiceService]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TableColumnSettingsComponent);
    component = fixture.componentInstance;
    schemaDetailsService = fixture.debugElement.injector.get(SchemaDetailsService);

    component.userDetails.userName = 'admin';
    component.schemaInfo = new SchemaListDetails();
    component.schemaInfo.createdBy = 'admin';
    component.data = {
      schemaId: 'schema'
    }

    spyOn(schemaDetailsService, 'createUpdateSchemaAction').and.returnValue(of(new SchemaTableAction()));
    spyOn(schemaDetailsService, 'deleteSchemaTableAction').and.returnValue(of());
  });


  it('persistenceTableView(), should call http for save table column ', async(()=>{
    component.data = {schemaId:'327', variantId:'736472'};
    const selFld = [{fieldId : 'id', order: 0, editable: true}];
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
    component.header = [{fieldId:'MATL_TYPE'} as MetadataModel];
    component.data = {selectedFields:[{fieldId: 'MATL_TYPE', order: 0, editable: true}]};

    component.manageStateOfCheckBox();
    expect(component.allChecked).toEqual(true);
    expect(component.allIndeterminate).toEqual(false);
  }));

  it('isChecked(), is checked ', async(()=>{
    component.data = {selectedFields:[{fieldId: 'MATL_TYPE', order: 0, editable: true}]};
    const res = component.isChecked({fieldId:'MATL_TYPE'} as MetadataModel);
    expect(res).toEqual(true);
  }));

  it('selectAll(), select all ', async(()=>{
    component.data = {};
    component.allChecked = true;
    component.selectAll();
    expect(component.allChecked).toEqual(true);

    component.allChecked = false;
    component.selectAll();
    expect(component.allChecked).toEqual(false);
  }));

  it('submitColumn(), submit selected columns ', async(()=>{
    component.header = [{
      fieldId:'MATL_TYPE'
    } as MetadataModel];

    const selFld = [{fieldId : 'MATL_TYPE', order: 0, editable: true}];
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

    const action = {schemaId: component.data.schemaId, actionText: `My custom action ${component.actionsList.length}`, isPrimaryAction: false,
      actionViewType: TableActionViewType.TEXT, isCustomAction: true, createdBy: component.userDetails.userName} as SchemaTableAction;

    component.addCustomAction();
    // expect(component.actionsList.length).toEqual(1);
    expect(schemaDetailsService.createUpdateSchemaAction).toHaveBeenCalledWith(action);


    component.actionsList[0].actionCode = 'code1701';

    component.removeCustomAction(0);
    expect(schemaDetailsService.deleteSchemaTableAction).toHaveBeenCalledWith(component.data.schemaId, 'code1701');

  }));

  it('should get action icon', () => {

    expect(component.getActionIcon('Approve')).toEqual('check-mark');

    expect(component.getActionIcon('Reject')).toEqual('declined');

    expect(component.getActionIcon('Delete')).toEqual('recycle-bin');

    expect(component.getActionIcon('other actions')).toEqual('plus');


  });


});