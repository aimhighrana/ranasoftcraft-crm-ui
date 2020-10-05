// import { CdkDragDrop } from '@angular/cdk/drag-drop';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { TableColumnSettingsComponent } from './table-column-settings.component';
import { AppMaterialModuleForSpec } from 'src/app/app-material-for-spec.module';
import { MetadataModel, SchemaTableViewFldMap, SchemaTableViewRequest } from 'src/app/_models/schema/schemadetailstable';
import { RouterTestingModule } from '@angular/router/testing';
import { SchemaDetailsService } from '@services/home/schema/schema-details.service';
import { of } from 'rxjs';
import { SharedServiceService } from '@modules/shared/_services/shared-service.service';
import { Router } from '@angular/router';
import { SearchInputComponent } from '../search-input/search-input.component';

describe('TableColumnSettingsComponent', () => {
  let component: TableColumnSettingsComponent;
  let fixture: ComponentFixture<TableColumnSettingsComponent>;
  let schemaDetailsService: SchemaDetailsService;
  let router: Router;

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
      router = TestBed.inject(Router);
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TableColumnSettingsComponent);
    component = fixture.componentInstance;
    schemaDetailsService = fixture.debugElement.injector.get(SchemaDetailsService);
  });


  it('persistenceTableView(), should call http for save table column ', async(()=>{
    component.data = {schemaId:'327', variantId:'736472'};
    const selFld = ['id','TEST','MATL_TYPE'];
    // mock data
    const schemaTableViewRequest: SchemaTableViewRequest = new SchemaTableViewRequest();
    schemaTableViewRequest.schemaId = component.data.schemaId;
    schemaTableViewRequest.variantId = component.data.variantId;
    const fldObj: SchemaTableViewFldMap[] = [];
    let order = 0;
    selFld.forEach(fld => {
      const schemaTableVMap: SchemaTableViewFldMap = new SchemaTableViewFldMap();
      schemaTableVMap.fieldId = fld;
      schemaTableVMap.order = order;
      order ++;
      fldObj.push(schemaTableVMap);
    });
    schemaTableViewRequest.schemaTableViewMapping = fldObj;

    spyOn(schemaDetailsService,'updateSchemaTableView').withArgs(schemaTableViewRequest).and.returnValue(of({}));
    spyOn(router, 'navigate');

    component.persistenceTableView(selFld);
    expect(schemaDetailsService.updateSchemaTableView).toHaveBeenCalledWith(schemaTableViewRequest);
    expect(router.navigate).toHaveBeenCalledWith([{ outlets: { sb: null }}]);
  }));


  it('manageStateOfCheckBox(), manage state of columns ', async(()=>{
    component.header = [{fieldId:'MATL_TYPE'} as MetadataModel];
    component.data = {selectedFields:['MATL_TYPE']};

    component.manageStateOfCheckBox();
    expect(component.allChecked).toEqual(true);
    expect(component.allIndeterminate).toEqual(false);
  }));

  it('isChecked(), is checked ', async(()=>{
    component.data = {selectedFields:['MATL_TYPE']};
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

    component.data  = {selectedFields:['MATL_TYPE'], schemaId:'72356742', variantId:'67242'};


    const selFld = ['MATL_TYPE'];
    // mock data
    const schemaTableViewRequest: SchemaTableViewRequest = new SchemaTableViewRequest();
    schemaTableViewRequest.schemaId = component.data.schemaId;
    schemaTableViewRequest.variantId = component.data.variantId;
    const fldObj: SchemaTableViewFldMap[] = [];
    let order = 0;
    selFld.forEach(fld => {
      const schemaTableVMap: SchemaTableViewFldMap = new SchemaTableViewFldMap();
      schemaTableVMap.fieldId = fld;
      schemaTableVMap.order = order;
      order ++;
      fldObj.push(schemaTableVMap);
    });
    schemaTableViewRequest.schemaTableViewMapping = fldObj;

    spyOn(schemaDetailsService,'updateSchemaTableView').withArgs(schemaTableViewRequest).and.returnValue(of({}));
    spyOn(router, 'navigate');


    component.submitColumn();

    expect(schemaDetailsService.updateSchemaTableView).toHaveBeenCalledWith(schemaTableViewRequest);
    expect(router.navigate).toHaveBeenCalledWith([{ outlets: { sb: null }}]);



  }));
});