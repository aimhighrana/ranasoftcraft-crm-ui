import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportCollaboratorComponent } from './report-collaborator.component';
import { AppMaterialModuleForSpec } from 'src/app/app-material-for-spec.module';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { ReportService } from '@modules/report/_service/report.service';
import { PermissionOn, UserMdoModel, RolesModel, GroupHeaderModel, ReportDashboardPermission, PermissionType } from '@models/collaborator';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';

describe('ReportCollaboratorComponent', () => {
  let component: ReportCollaboratorComponent;
  let fixture: ComponentFixture<ReportCollaboratorComponent>;
  beforeEach(async(() => {
    const reportServieSpy = jasmine.createSpyObj(ReportService, ['getCollaboratorPermission']);
    TestBed.configureTestingModule({
      declarations: [ ReportCollaboratorComponent ],
      imports:[AppMaterialModuleForSpec, HttpClientTestingModule, ReactiveFormsModule, FormsModule, RouterTestingModule],
      providers:[
        { provide: ReportService, useValue: reportServieSpy },
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReportCollaboratorComponent);
    component = fixture.componentInstance;
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

    expect(actualRes).toEqual(selectedOption.description, 'Description should equals');

  }));

  it('onSelectCollaborator(), after select collaborator for add', async(()=>{
    // mock data
    const selectedOption: ReportDashboardPermission = new ReportDashboardPermission();
    selectedOption.description = 'Sandeep Rana';
    selectedOption.userId = 'srana'; selectedOption.permissionType = PermissionType.USER;

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
  }));

});
