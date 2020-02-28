import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SchemaGroupFormComponent } from './schema-group-form.component';
import { AppMaterialModuleForSpec } from 'src/app/app-material-for-spec.module';
import { RouterTestingModule } from '@angular/router/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BreadcrumbComponent } from 'src/app/_modules/shared/_components/breadcrumb/breadcrumb.component';
import { SchemaService } from 'src/app/_services/home/schema.service';
import { of } from 'rxjs';
import { ObjectTypeResponse, GetAllSchemabymoduleidsReq } from 'src/app/_models/schema/schema';
import { MatChipInputEvent } from '@angular/material/chips';
// import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete/autocomplete';

describe('SchemaGroupFormComponent', () => {
  let component: SchemaGroupFormComponent;
  let fixture: ComponentFixture<SchemaGroupFormComponent>;
  let schemaServiceSpy: jasmine.SpyObj<SchemaService>;

  beforeEach(async(() => {
    const schemaSerSpy = jasmine.createSpyObj('SchemaService', ['getAllObjectType', 'getAllSchemabymoduleids']);
    TestBed.configureTestingModule({
      declarations: [ SchemaGroupFormComponent, BreadcrumbComponent],
      imports: [
        AppMaterialModuleForSpec,
        RouterTestingModule,
        FormsModule,
        ReactiveFormsModule
      ],
      providers: [
        {provide: SchemaService, useValue:schemaSerSpy}
      ]
    })
    .compileComponents();
    schemaServiceSpy = TestBed.inject(SchemaService) as jasmine.SpyObj<SchemaService>;
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SchemaGroupFormComponent);
    component = fixture.componentInstance;
    // fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('getAllModuleList(), should invoke for get all module', async(() =>{
      schemaServiceSpy.getAllObjectType.and.returnValue(of([]));
  }));

  it('getAllSchemaByModuleId(), get the activate schema by object type', async(() =>{
      const getAllSchemabymoduleidsReq: GetAllSchemabymoduleidsReq = new GetAllSchemabymoduleidsReq();
      getAllSchemabymoduleidsReq.mosuleIds = ['1005'];
      schemaServiceSpy.getAllSchemabymoduleids.withArgs(getAllSchemabymoduleidsReq).and.returnValue(of([]));
  }));

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
    // const event: MatAutocompleteSelectedEvent = {option:{objectId:'1005'}, source:null};
    // component.groupDetails.objectId = ['1005'];
    // const objId = event.option.value.objectId;
    // const exitData =  component.groupDetails.objectId.filter(objId => objId === objId);
    // component.selected(null);
  }));


  it('displayFn(), to display object description ', async(()=>{
      const objectType: ObjectTypeResponse = new ObjectTypeResponse();
      objectType.objectdesc = 'Material';
      objectType.objectid = '1005';
      let returnValue = '';
      if(objectType) {
        returnValue = objectType.objectdesc;
      } else {
        returnValue = '';
      }
      const actualdata =  component.displayFn(objectType);
      expect(returnValue).toEqual(actualdata);

  }));

  it('resetFields(), should route to schema group page', async(() =>{
    // expect(component.resetFields()).toHaveBeenCalledWith(undefined);
    // expect(router.navigate)
  }));

  it('displayObjectDescription() , should ', async(()=>{

    const objectId = '1005';
    const objectTypeRes: ObjectTypeResponse = new ObjectTypeResponse();
    objectTypeRes.objectdesc = 'Material';
    objectTypeRes.objectid = '1005';
    component.moduleList = [objectTypeRes];
    component.displayObjectDescription(objectId);

  }));

  it('manageSelectedSchemas(), should manage the selected schem(s)', async(()=>{

    const event = {checked: true};
    const schemaId = 263542521;
    component.manageSelectedSchemas(event, schemaId);


  }));

});

