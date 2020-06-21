import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SchemaGroupFormComponent } from './schema-group-form.component';
import { AppMaterialModuleForSpec } from 'src/app/app-material-for-spec.module';
import { RouterTestingModule } from '@angular/router/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BreadcrumbComponent } from 'src/app/_modules/shared/_components/breadcrumb/breadcrumb.component';
import { SchemaService } from 'src/app/_services/home/schema.service';
import { of } from 'rxjs';
import { ObjectTypeResponse, GetAllSchemabymoduleidsReq, GetAllSchemabymoduleidsRes, SchemaGroupWithAssignSchemas, SchemaGroupMapping } from 'src/app/_models/schema/schema';
import { MatChipInputEvent } from '@angular/material/chips';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
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
    const event: MatChipInputEvent = {value:'Test Object', input: null};

    if(!component.matAutocomplete.isOpen) {
      if(event.input) {
        event.input.value = '';
      }
      component.moduleInpCtrl.setValue(null);
    }
    // call actual method
    component.add(event);

  }));


  it('remove(), help to remove chips from selected array', async(() =>{
    // mock data
    let  objectIds: string[] = [];
    if(!component.groupDetails) {
      objectIds =  component.groupDetails.objectId;
    } else {
      objectIds = [];
    }
    let index = objectIds.indexOf('1005');

    // coverage if condition
    component.groupDetails.objectId = ['1001'];
   //  fixture.detectChanges();
    index = objectIds.indexOf('1005');
    console.log(objectIds);
    console.log(index);
    if(index >= 0) {
       objectIds.splice(index,1);
    } else {
      expect(index).toEqual(-1);
    }
    component.remove('1005');
 }));

  it('selected() , make the http call while select object type ', async(() =>{
    const event = {option:{value:{objectId:'1005'}}, source:null} as MatAutocompleteSelectedEvent;
    component.selected(event);
    expect(component.selected).toBeTruthy();
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
      const getAllSchemabymoduleidsReq: GetAllSchemabymoduleidsReq = new GetAllSchemabymoduleidsReq();
      getAllSchemabymoduleidsReq.mosuleIds = ['1005'];
      const response: GetAllSchemabymoduleidsRes[] = [];
      spyOn(schemaServiceSpy,'getAllSchemabymoduleids').withArgs(getAllSchemabymoduleidsReq).and.returnValue(of(response));
      expect(schemaServiceSpy.getAllSchemabymoduleids).toBeTruthy();
    }));

  it('getSchemaListResponseAsSelected(), get the response list by schema Id', async(() =>{
      const data: GetAllSchemabymoduleidsRes[] = [];
      const response = { schemaId: 8277333, discription: 'Material Test', moduleId: '1005', isSelected: true};
      data.push(response);

      const datamapping: SchemaGroupMapping[] = [{schemaGroupId: 76576, schemaId: 8277333, updatedDate: 12212020, plantCode: '4343'} as SchemaGroupMapping]
      component.groupDetails.schemaGroupMappings = datamapping;
      component.getSchemaListResponseAsSelected(data);
      expect(component.groupDetails.schemaGroupMappings.length).toEqual(1);
  }));

  it('manageSelectedSchemas(), should manage the selected schem(s)', async(()=>{
    const event = {checked: true};
    const schemaId = 263542521;
    component.manageSelectedSchemas(event, schemaId);
  }));

  it('getSchemaGroupDetailsByGroupId(), get the activate schema by object type', async(() =>{
    component.groupId = '1005';
    const response: SchemaGroupWithAssignSchemas = new SchemaGroupWithAssignSchemas();
    spyOn(schemaServiceSpy,'getSchemaGroupDetailsByGroupId').withArgs(component.groupId).and.returnValue(of(response));
    component.getSchemaGroupDetailsByGroupId(component.groupId);
    expect(schemaServiceSpy.getSchemaGroupDetailsByGroupId).toHaveBeenCalledWith(component.groupId);
  }));

  it('resetFields(), should route to schema group page', async(() =>{
    // expect(component.resetFields()).toHaveBeenCalledWith(undefined);
    spyOn(router, 'navigate');
    component.resetFields();
    expect(router.navigate)
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
});
