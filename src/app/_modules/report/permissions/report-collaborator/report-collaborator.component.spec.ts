import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportCollaboratorComponent } from './report-collaborator.component';
import { AppMaterialModuleForSpec } from 'src/app/app-material-for-spec.module';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ReactiveFormsModule, FormsModule, FormGroup, FormControl } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { ReportService } from '@modules/report/_service/report.service';
import { PermissionOn, UserMdoModel, RolesModel, GroupHeaderModel, ReportDashboardPermission, PermissionType } from '@models/collaborator';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { of } from 'rxjs';

describe('ReportCollaboratorComponent', () => {
  let component: ReportCollaboratorComponent;
  let fixture: ComponentFixture<ReportCollaboratorComponent>;
  let reportServieSpy: ReportService;
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReportCollaboratorComponent ],
      imports:[AppMaterialModuleForSpec, HttpClientTestingModule, ReactiveFormsModule, FormsModule, RouterTestingModule],
      providers:[
        ReportService
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReportCollaboratorComponent);
    component = fixture.componentInstance;
    reportServieSpy = fixture.debugElement.injector.get(ReportService);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('transformResponse(), should help for transform data',async(()=>{
    // mock data
    const users: UserMdoModel[] = [
      {userId:'srana',email:'srana@gmail.com'} as UserMdoModel,
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
    const selectedOption: ReportDashboardPermission = new ReportDashboardPermission();
    selectedOption.description = 'Sandeep Rana';
    selectedOption.userId = 'srana';

    // call actual method
    const actualRes =  component.displayWith(selectedOption);
    const nullRes = component.displayWith(null);

    expect(actualRes).toEqual(selectedOption.description, 'Description should equals');
    expect(nullRes).toEqual(null);

  }));

  it('onSelectCollaborator(), after select collaborator for add', async(()=>{
    // mock data
    const selectedOption: ReportDashboardPermission = new ReportDashboardPermission();
    selectedOption.description = 'Sandeep Rana';
    selectedOption.userId = 'srana'; selectedOption.permissionType = PermissionType.USER;
    component.addCollaboratorFrmGrp = new FormGroup({
      addCollaboratorCtrl:new FormControl('')
    });

    const event = {option:{value:{
      selectedOption
    }}} as MatAutocompleteSelectedEvent;

    const users: UserMdoModel[] = [
      {userId:'srana',email:'srana@gmail.com'} as UserMdoModel,
      {userId:'admin',email:'admin@gmail.com'} as UserMdoModel
    ];

    component.permissionOn = {users} as PermissionOn;

    // call actual method
    component.onSelectCollaborator(event);

    expect(component.selectedCollaborators.length).toEqual(1, 'After added successfully then length should be 1');

  }));

  it('paginateChip(), after pagination on chips', async(()=>{
    // mock data
    component.selectedCollaborators = [{userId:'srana'} as ReportDashboardPermission, {roleId:'developer'} as ReportDashboardPermission, {} as ReportDashboardPermission, {} as ReportDashboardPermission];

    // call actual function
    component.paginateChip('next');
    component.paginateChip('prev');
    expect(component.possibleChips.length).toEqual(2, 'Possible chips length should be 2');

  }));

  it('remove(), method call at time remove from selected chips', async(()=>{
    // mock data
    const removeAble = {userId:'srana', permissionType:PermissionType.USER} as ReportDashboardPermission;
    component.selectedCollaborators = [{userId:'srana'} as ReportDashboardPermission, {roleId:'developer'} as ReportDashboardPermission, {} as ReportDashboardPermission, {} as ReportDashboardPermission];
    component.possibleChips = [{userId:'srana'} as ReportDashboardPermission, {roleId:'developer'} as ReportDashboardPermission, {} as ReportDashboardPermission, {} as ReportDashboardPermission];

    // call actual componenet method
    component.remove(removeAble);

    expect(component.selectedCollaborators.length).toEqual(3, 'Selected item should remove from selected collaborators');
    expect(component.possibleChips.length).toEqual(2, 'PossibleChips item should remove after selected collaborators');

    const removeAblerole = {roleId:'srana', permissionType:PermissionType.ROLE} as ReportDashboardPermission;
    component.remove(removeAblerole);

    const removeAblegroup = {roleId:'Demo_init', permissionType:PermissionType.GROUP} as ReportDashboardPermission;
    component.remove(removeAblegroup);
  }));

  it('close(), should close the current router' , () => {
    component.close();
  });

  it('getCollaboratorPermission(), should return for get all user details', async(() =>{
    spyOn(reportServieSpy,'getCollaboratorPermission').and.returnValue(of({} as PermissionOn));
    component.getCollaboratorPermission('');
    expect(reportServieSpy.getCollaboratorPermission).toHaveBeenCalledWith('');
  }));

  it('getExitingCollaborators() , should return all collaborator detail by using schemaId ', async(()=>{
    const reportId = '87365726767288';
    component.reportId = reportId;
    const response: ReportDashboardPermission[] = [];
    spyOn(reportServieSpy, 'getCollaboratorsPermisison').withArgs(reportId).and.returnValue(of(response));
    component.getExitingCollaborators();
    expect(reportServieSpy.getCollaboratorsPermisison).toHaveBeenCalledWith(reportId);
  }));

  it('updatePermission(), should update collaborator detail', async(() =>{
    // mock data
    const permission: ReportDashboardPermission = new ReportDashboardPermission();
    permission.userId = 'srana';
    permission.isEditable=true;
    const response: ReportDashboardPermission[] = [];

    spyOn(reportServieSpy,'saveUpdateReportCollaborator').and.returnValue(of(response));

    // call actual method
    component.updatePermission(permission);
    expect(reportServieSpy.saveUpdateReportCollaborator).toHaveBeenCalledWith([permission]);
  }));

  it('deleteCollaborator(), should delete Collaborator details', async(() => {
    spyOn(reportServieSpy,'deleteCollaborator').withArgs('3555358571').and.returnValue(of({} as boolean));
    component.deleteCollaborator('3555358571');
    expect(reportServieSpy.deleteCollaborator).toHaveBeenCalledWith('3555358571');
  }));

  it('saveCollaborators(), should save Collaborator details', async(() => {
    // mock dta
    component.addCollaboratorFrmGrp = {value:{isEditable:true}} as FormGroup;
    component.selectedCollaborators = [{userId:'srana'} as ReportDashboardPermission];

    spyOn(reportServieSpy,'saveUpdateReportCollaborator').withArgs(component.selectedCollaborators).and.returnValue(of());

    // call actual method
    component.saveCollaborators();
    expect(component.saveCollaborators).toBeTruthy();

  }));

  it('ngOnInit, loaded pre required', (() =>{
    component.ngOnInit();
    expect(component.ngOnInit).toBeTruthy();
  }));
});
