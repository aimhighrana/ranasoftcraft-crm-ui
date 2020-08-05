import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SchemaGroupFormComponent } from './schema-group-form.component';
import { AppMaterialModuleForSpec } from 'src/app/app-material-for-spec.module';
import { RouterTestingModule } from '@angular/router/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BreadcrumbComponent } from 'src/app/_modules/shared/_components/breadcrumb/breadcrumb.component';
import { SchemaService } from 'src/app/_services/home/schema.service';
import { of } from 'rxjs';
import { ObjectTypeResponse, GetAllSchemabymoduleidsReq, GetAllSchemabymoduleidsRes, SchemaGroupWithAssignSchemas, SchemaGroupMapping, CreateSchemaGroupRequest } from 'src/app/_models/schema/schema';
import { MatChipInputEvent } from '@angular/material/chips';
import { MatAutocompleteSelectedEvent, MatAutocomplete } from '@angular/material/autocomplete';
import { Router } from '@angular/router';

describe('SchemaGroupFormComponent', () => {
  let component: SchemaGroupFormComponent;
  let fixture: ComponentFixture<SchemaGroupFormComponent>;
  let schemaServiceSpy: SchemaService;
  let router: Router;
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SchemaGroupFormComponent, BreadcrumbComponent],
      imports: [
        AppMaterialModuleForSpec,
        RouterTestingModule,
        FormsModule,
        ReactiveFormsModule
      ],
      providers: [ SchemaService ]
    })
    .compileComponents();
    router = TestBed.inject(Router);
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SchemaGroupFormComponent);
    component = fixture.componentInstance;
    schemaServiceSpy = fixture.debugElement.injector.get(SchemaService);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('add(), while search and enter then value should be set ', async(()=>{
    const event = {value:'Test Object', input:{value:''}} as MatChipInputEvent;

    if(!component.matAutocomplete.isOpen) {
      if(event.input) {
        event.input.value = '';
      }
      component.moduleInpCtrl.setValue(null);
    }
    // call actual method
    component.add(event);
    expect(component.add).toBeTruthy();

    const event1 = {value:''} as MatChipInputEvent;

    if(!component.matAutocomplete.isOpen) {
      component.moduleInpCtrl.setValue(null);
    }
    // call actual method
    component.add(event1);
    expect(component.add).toBeTruthy();

    const event2 = {value:''} as MatChipInputEvent;
    component.matAutocomplete = {isOpen: true} as MatAutocomplete;
    // call actual method
    component.add(event2);
    expect(component.add).toBeTruthy();
  }));


  it('remove(), help to remove chips from selected array', async(() =>{
    // mock data
    const selSchemaId: string[] = [];
    const getAllSchemabymoduleidsReq: GetAllSchemabymoduleidsReq = new GetAllSchemabymoduleidsReq();
    getAllSchemabymoduleidsReq.mosuleIds = selSchemaId;

    spyOn(schemaServiceSpy,'getAllSchemabymoduleids').withArgs(getAllSchemabymoduleidsReq).and.returnValue(of());

    const objectId = '1005';
    component.groupDetails.objectId = ['1005'];
    component.remove(objectId);
    expect(component.remove).toBeTruthy();

    const objectId1 = null;
    component.groupDetails.objectId = null;
    component.remove(objectId1);
    expect(component.remove).toBeTruthy();
 }));

  it('selected() , make the http call while select object type ', async(() =>{
    const event = {option:{value:{objectId:'1005'}}, source:null} as MatAutocompleteSelectedEvent;
    component.groupDetails.objectId = ['1005'];

    const selSchemaId: string[] = ['1006', undefined];
    const getAllSchemabymoduleidsReq: GetAllSchemabymoduleidsReq = new GetAllSchemabymoduleidsReq();
    getAllSchemabymoduleidsReq.mosuleIds = selSchemaId;

    spyOn(schemaServiceSpy,'getAllSchemabymoduleids').withArgs(getAllSchemabymoduleidsReq).and.returnValue(of());


    component.selected(event);
    expect(component.selected).toBeTruthy();

    const event1 = {option:null, source:null} as MatAutocompleteSelectedEvent;
    component.groupDetails.objectId = ['1006'];
    component.selected(event1);
    expect(component.groupDetails.objectId.length).toEqual(2);
    expect(schemaServiceSpy.getAllSchemabymoduleids).toHaveBeenCalledWith(getAllSchemabymoduleidsReq);

  }));

  it('getAllModuleList(), should invoke for get all module', async(() =>{
    const response: ObjectTypeResponse[] = [];
    spyOn(schemaServiceSpy,'getAllObjectType').and.returnValue(of(response));
    component.getAllModuleList();
    expect(schemaServiceSpy.getAllObjectType).toHaveBeenCalled();
  }));

  it('displayFn(), to display object description ', async(()=>{
    // mock data
    const objectType: ObjectTypeResponse = new ObjectTypeResponse();
    objectType.objectdesc = 'Material';
    objectType.objectid = '1005';

    // call actual method
    const actualRes = component.displayFn(objectType);
    const nullRes = component.displayFn(null);

    expect(actualRes).toEqual(objectType.objectdesc, 'Description should equals');
    expect(nullRes).toEqual('');
  }));

  it('getAllSchemaByModuleId(), get the activate schema by object type', async(() =>{
    const getAllSchemabymoduleidsReq = {mosuleIds: ['1005'], plantCode:'76765'} as GetAllSchemabymoduleidsReq;
    const response =  [{schemaId:9889789, discription:'test', isSelected: true, moduleId:'1005'} as GetAllSchemabymoduleidsRes];
    spyOn(schemaServiceSpy,'getAllSchemabymoduleids').withArgs(getAllSchemabymoduleidsReq).and.returnValue(of(response));
    expect(schemaServiceSpy.getAllSchemabymoduleids).toBeTruthy();
  }));

  it('getSchemaListResponseAsSelected(), get the response list by schema Id', async(() =>{
    const data = [{ schemaId: 8277333, discription: 'Material Test', moduleId: '1005', isSelected: true} as GetAllSchemabymoduleidsRes, { schemaId: 827733, discription: 'Material Test', moduleId: '1005', isSelected: true} as GetAllSchemabymoduleidsRes];
    const datamapping = [{schemaGroupId: 76576, schemaId: 8277333, updatedDate: 12212020, plantCode: '4343'} as SchemaGroupMapping]
    component.groupDetails.schemaGroupMappings = datamapping;
    component.getSchemaListResponseAsSelected(data);
    expect(component.groupDetails.schemaGroupMappings.length).toEqual(1);

    const data1 = [{ schemaId: 8277333, discription: 'Material Test', moduleId: '1005', isSelected: true} as GetAllSchemabymoduleidsRes];
    component.groupDetails.schemaGroupMappings = null;
    component.getSchemaListResponseAsSelected(data1)
    expect(component.getSchemaListResponseAsSelected).toBeTruthy();
  }));

  it('manageSelectedSchemas(), should manage the selected schem(s)', async(()=>{
    const event = {checked: true};
    const schemaId = 263542521;
    const datamapping = [{schemaGroupId: 76576, schemaId: 263542521, updatedDate: 12212020, plantCode: '4343'} as SchemaGroupMapping]
    component.groupDetails.schemaGroupMappings = datamapping;
    component.manageSelectedSchemas(event, schemaId);
    expect(component.groupDetails.schemaGroupMappings.length).toEqual(0);

    const event1 = {checked: true};
    const schemaId1 = 263542521;
    component.groupDetails.schemaGroupMappings = null;
    component.manageSelectedSchemas(event1, schemaId1);
    expect(component.groupDetails.schemaGroupMappings.length).toEqual(1);

    const event2 = {checked: true};
    const schemaId2 = null;
    const datamapping2 = [{schemaGroupId: 76576, schemaId: 263542571, updatedDate: 12212020, plantCode: '4343'} as SchemaGroupMapping]
    component.groupDetails.schemaGroupMappings = datamapping2;
    component.manageSelectedSchemas(event2, schemaId2);
    expect(component.groupDetails.schemaGroupMappings.length).toEqual(1);

    const event3 = {checked: false};
    const schemaId3 = 263542521;
    const datamapping3 = [{schemaGroupId: 76576, schemaId: 263542571, updatedDate: 12212020, plantCode: '4343'} as SchemaGroupMapping]
    component.groupDetails.schemaGroupMappings = datamapping3;
    component.manageSelectedSchemas(event3, schemaId3);
    expect(component.groupDetails.schemaGroupMappings.length).toEqual(1);
  }));

  it('getSchemaGroupDetailsByGroupId(), get the activate schema by object type', async(() =>{
    component.groupId = '1005';
    const selSchemaId: string[] = component.groupDetails.objectId;
    const getAllSchemabymoduleidsReq: GetAllSchemabymoduleidsReq = new GetAllSchemabymoduleidsReq();
    getAllSchemabymoduleidsReq.mosuleIds = selSchemaId;

    spyOn(schemaServiceSpy,'getAllSchemabymoduleids').withArgs(getAllSchemabymoduleidsReq).and.returnValue(of());
    const response: SchemaGroupWithAssignSchemas = new SchemaGroupWithAssignSchemas();

    spyOn(schemaServiceSpy,'getSchemaGroupDetailsByGroupId').withArgs(component.groupId).and.returnValue(of(response));
    component.getSchemaGroupDetailsByGroupId(component.groupId);
    expect(schemaServiceSpy.getSchemaGroupDetailsByGroupId).toHaveBeenCalledWith(component.groupId);

    expect(schemaServiceSpy.getAllSchemabymoduleids).toHaveBeenCalledWith(getAllSchemabymoduleidsReq);
  }));

  it('resetFields(), should route to schema group page', async(() =>{
    spyOn(router, 'navigate');
    component.resetFields();
    expect(router.navigate).toHaveBeenCalledWith(['/home/schema']);
  }));

  it('displayObjectDescription() , should ', async(()=>{
    // mock data
    const objectId = '1005';
    const objectTypeRes: ObjectTypeResponse = new ObjectTypeResponse();
    objectTypeRes.objectdesc = 'Material';
    objectTypeRes.objectid = '1005';
    component.moduleList = [objectTypeRes];

    // call actual method
    const actualRes = component.displayObjectDescription(objectId);
    expect(actualRes).toEqual(objectTypeRes.objectdesc);

  }));

  it('saveSchemaGroup, save the schema details', async(() => {
    component.groupDetails = {objectId:['1005'], groupId: 76576 ,groupName:'Material', schemaGroupMappings: [{schemaGroupId: 76576, schemaId: 263542521, updatedDate: 12212020, plantCode: '4343'} as SchemaGroupMapping]} as SchemaGroupWithAssignSchemas;
    component.groupId = '7566';
    const createSchemaGroup: CreateSchemaGroupRequest = new CreateSchemaGroupRequest();
    createSchemaGroup.moduleIds = component.groupDetails.objectId;
    createSchemaGroup.schemaGroupName = component.groupDetails.groupName;
    createSchemaGroup.schemaIds = component.groupDetails.schemaGroupMappings ? component.groupDetails.schemaGroupMappings.map(grp => grp.schemaId) : [];
    createSchemaGroup.groupId = (component.groupId && component.groupId !== 'new') ? component.groupId : '';
    spyOn(schemaServiceSpy,'createSchemaGroup').withArgs(createSchemaGroup).and.returnValue(of());
    component.saveSchemaGroup();
    expect(component.saveSchemaGroup).toBeTruthy();
    expect(schemaServiceSpy.createSchemaGroup).toHaveBeenCalledWith(createSchemaGroup);
  }));

  it('ngoninit(), should call ngoninit', async(() => {
    spyOn(schemaServiceSpy,'getAllObjectType').and.returnValue(of());
    component.ngOnInit();
    expect(component.ngOnInit).toBeTruthy();
    expect(schemaServiceSpy.getAllObjectType).toHaveBeenCalled();
  }));
});
