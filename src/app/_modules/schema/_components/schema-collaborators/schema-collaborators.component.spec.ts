import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SchemaCollaboratorsComponent } from './schema-collaborators.component';
import { AppMaterialModuleForSpec } from 'src/app/app-material-for-spec.module';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormsModule, ReactiveFormsModule, FormGroup, FormControl } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { SchemaDetailsService } from '@services/home/schema/schema-details.service';
import { UserMdoModel, RolesModel, GroupHeaderModel, PermissionType, PermissionOn, SchemaDashboardPermission } from '@models/collaborator';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { of } from 'rxjs';
import { Router } from '@angular/router';
import { SharedModule } from '@modules/shared/shared.module';

describe('SchemaCollaboratorsComponent', () => {
  let component: SchemaCollaboratorsComponent;
  let fixture: ComponentFixture<SchemaCollaboratorsComponent>;
  let schemaDetailsSer: SchemaDetailsService;
  let router: Router;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SchemaCollaboratorsComponent ],
      imports: [ AppMaterialModuleForSpec, HttpClientTestingModule, ReactiveFormsModule, FormsModule, RouterTestingModule, SharedModule ],
      providers:[
        SchemaDetailsService
      ]
    })
    .compileComponents();
    router = TestBed.inject(Router);
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SchemaCollaboratorsComponent);
    component = fixture.componentInstance;
    schemaDetailsSer = fixture.debugElement.injector.get(SchemaDetailsService);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('ngOnInit, loaded pre required', (() =>{
    component.ngOnInit();
    expect(component.ngOnInit).toBeTruthy();
  }));

  it('getCollaboratorPermission(), should return for get all user details', async(() =>{
    spyOn(schemaDetailsSer,'getAllUserDetails').and.returnValue(of({} as PermissionOn));
    component.getCollaboratorPermission('',0);
    expect(schemaDetailsSer.getAllUserDetails).toHaveBeenCalledWith('',0);
  }));

  it('transformResponse(), should help for transform data',async(()=>{
    // mock data
    const users: UserMdoModel[] = [
      {userId:'harshit',email:'harshit@gmail.com'} as UserMdoModel,
      {userId:'admin',email:'admin@gmail.com'} as UserMdoModel
    ];

    const roles: RolesModel[] = [
      {roleId:'23764782874',roleDesc:'Developer'},
      {roleId:'2753745715',roleDesc:'admin'}
    ];

    const groups: GroupHeaderModel[] = [
      {groupId:267364727, description:'Core Developer', groupIdAsStr:'267364727'}
    ];

    // call actual method
    const actualRes =  component.transformResponse({groups,roles, users});
    expect(actualRes.length).toEqual(3, 'Length should be 3 mean three groups user,roles and groups')
    expect(actualRes[0].childs.length).toEqual(users.length, 'User groups child length should be 2');
    expect(actualRes[1].childs.length).toEqual(roles.length, 'Roles groups child length should be 2');
    expect(actualRes[2].childs.length).toEqual(groups.length, 'Groups groups child length should be 1');
  }));

  it('displayWith(), should return selected collaborators description', async(()=>{
    // mock data
    const selectedOption: SchemaDashboardPermission = new SchemaDashboardPermission();
    selectedOption.description = 'Harshit Jain';
    selectedOption.userid = 'harshit';

    // call actual method
    const actualRes =  component.displaywith(selectedOption);
    const nullRes = component.displaywith(null);

    expect(actualRes).toEqual(selectedOption.description, 'Description should equals');
    expect(nullRes).toEqual(null);

  }));

  it('onSelectCollaborator(), after select collaborator for add', async(()=>{
    // mock data
    component.addCollaboratorFrmGrp = new FormGroup({
      addCollaboratorCtrl:new FormControl('')
    });
    const selectedOption: SchemaDashboardPermission = new SchemaDashboardPermission();
    selectedOption.description = 'Harshit Jain';
    selectedOption.userid = 'harshit';
    selectedOption.permissionType = PermissionType.USER;

    const event = {option:{value:{
      selectedOption
    }}} as MatAutocompleteSelectedEvent;

    const users: UserMdoModel[] = [
      {userId:'harshit',email:'harshit@gmail.com'} as UserMdoModel,
      {userId:'admin',email:'admin@gmail.com'} as UserMdoModel
    ];

    component.permissionOn = {users} as PermissionOn;

    // call actual method
    component.onSelectCollaborator(event);

   expect(component.selectedCollaborators.length).toEqual(1, 'After added successfully then length should be 1');

  }));

  it('getExistingCollaboratorDetails() , should return all collaborator detail by using schemaId ', async(()=>{
    const schemaId = '87365726767288';
    component.schemaId = schemaId;
    const response: SchemaDashboardPermission[] = [];
    spyOn(schemaDetailsSer, 'getCollaboratorDetails').withArgs(schemaId).and.returnValue(of(response));
    component.getExistingCollaboratorDetails();
    expect(schemaDetailsSer.getCollaboratorDetails).toHaveBeenCalledWith(schemaId);
  }));

  it('paginateChip(), after pagination on chips', async(()=>{
    // mock data
    component.selectedCollaborators = [{userid:'harshit'} as SchemaDashboardPermission, {roleId:'developer'} as SchemaDashboardPermission, {} as SchemaDashboardPermission, {} as SchemaDashboardPermission];

    // call actual function
    component.paginateChip('next');
    component.paginateChip('prev');
    expect(component.possibleChips.length).toEqual(2, 'Possible chips length should be 2');

  }));

  it('remove(), method call at time remove from selected chips', async(()=>{
    // mock data
    const removeAble = {userid:'harshit', permissionType:PermissionType.USER} as SchemaDashboardPermission;
    component.selectedCollaborators = [{userid:'harshit'} as SchemaDashboardPermission, {roleId:'developer'} as SchemaDashboardPermission, {} as SchemaDashboardPermission, {} as SchemaDashboardPermission];
    component.possibleChips = [{userid:'harshit'} as SchemaDashboardPermission, {roleId:'developer'} as SchemaDashboardPermission, {} as SchemaDashboardPermission, {} as SchemaDashboardPermission];

    // call actual componenet method
    component.remove(removeAble);

    expect(component.selectedCollaborators.length).toEqual(3, 'Selected item should remove from selected collaborators');
    expect(component.possibleChips.length).toEqual(2, 'PossibleChips item should remove after selected collaborators');

    const removeAblerole = {roleId:'harshit', permissionType:PermissionType.ROLE} as SchemaDashboardPermission;
    component.remove(removeAblerole);

    const removeAblegroup = {roleId:'Demo_init', permissionType:PermissionType.GROUP} as SchemaDashboardPermission;
    component.remove(removeAblegroup);
  }));

  it('close(), should close the current router' , () => {
    spyOn(router, 'navigate');
    component.close();
    expect(component.close).toBeTruthy();
    expect(router.navigate).toHaveBeenCalledWith([{ outlets: { sb: null }}]);
  });

  it('updatePermission(), should update collaborator detail', async(() =>{
    // mock data
    const permission: SchemaDashboardPermission = new SchemaDashboardPermission();
    permission.userid='harshit';
    permission.isAdmin=true;
    const response: number[] = [];

    spyOn(schemaDetailsSer,'createUpdateUserDetails').and.returnValue(of(response));

    // call actual method
    component.updatePermission(permission);
    expect(schemaDetailsSer.createUpdateUserDetails).toHaveBeenCalledWith([permission]);
  }));

  it('deleteCollaborator(), should delete Collaborator details', async(() => {
    spyOn(schemaDetailsSer,'deleteCollaborator').withArgs([3555358571]).and.returnValue(of({} as boolean));
    component.deleteCollaborator(3555358571);
    expect(schemaDetailsSer.deleteCollaborator).toHaveBeenCalledWith([3555358571]);
  }));

  it('saveCollaborators(), should save Collaborator details', async(() => {
    // mock dta
    component.addCollaboratorFrmGrp = {value:{isAdmin:true}} as FormGroup;
    component.selectedCollaborators = [{userid:'harshit'} as SchemaDashboardPermission];

    spyOn(schemaDetailsSer,'createUpdateUserDetails').withArgs(component.selectedCollaborators).and.returnValue(of());

    // call actual method
    component.saveCollaborators();
    expect(component.saveCollaborators).toBeTruthy();

  }));
});
