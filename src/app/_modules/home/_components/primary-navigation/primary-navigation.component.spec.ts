import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { Userdetails } from '@models/userdetails';
import { SharedModule } from '@modules/shared/shared.module';
import { SearchInputComponent } from '@modules/shared/_components/search-input/search-input.component';
import { SvgIconComponent } from '@modules/shared/_components/svg-icon/svg-icon.component';
import { UserService } from '@services/user/userservice.service';
import { of, Subscription } from 'rxjs';
import { AppMaterialModuleForSpec } from 'src/app/app-material-for-spec.module';
import { MatSidenavContainer } from '@angular/material/sidenav';
import { PrimaryNavigationComponent } from './primary-navigation.component';
import { SecondaryNavbarComponent } from '@modules/home/_components/secondary-navbar/secondary-navbar.component';
import { EndpointsClassicService } from '@services/_endpoints/endpoints-classic.service';
import { Router } from '@angular/router';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { HomeService } from '@services/home/home.service';
import { SharedServiceService } from '@modules/shared/_services/shared-service.service';

describe('PrimaryNavigationComponent', () => {
  let component: PrimaryNavigationComponent;
  let fixture: ComponentFixture<PrimaryNavigationComponent>;
  let userSvc: jasmine.SpyObj<UserService>;
  let router: Router;
  const mockDialogRef = {
    open: jasmine.createSpy('open'),
    afterClosed: jasmine.createSpy('close')
  };
  const userdetails: Userdetails = {
    userName: 'DemoApp',
    firstName: 'Demo',
    lastName: 'Approver',
    email: 'prostenant@gmail.com',
    plantCode: 'MDO1003',
    currentRoleId: '663065348460318692',
    dateformat: 'dd.mm.yy',
    fullName: 'Demo Approver',
    assignedRoles: [
      {
        defaultRole: '1',
        roleDesc: 'DemoApprover',
        roleId: '663065348460318692',
        sno: '521017956918018560',
        userId: 'DemoApp'
      },
      {
        defaultRole: '0',
        roleDesc: 'DemoApprover2',
        roleId: '143739996174018010',
        sno: '867216031918019200',
        userId: 'DemoApp'
      }
    ]
  };
  beforeEach(async(() => {
    const userSvcSpy = jasmine.createSpyObj('UserService', ['getUserDetails']);
    TestBed.configureTestingModule({
      declarations: [PrimaryNavigationComponent, SvgIconComponent, SearchInputComponent, SecondaryNavbarComponent],
      imports: [
        AppMaterialModuleForSpec,
        RouterTestingModule,
        SharedModule
      ],
      providers: [
        {
          provide: MatDialogRef,
          useValue: mockDialogRef
        },
        { provide: MAT_DIALOG_DATA, useValue: {} },
        MatSidenavContainer,
        EndpointsClassicService,
        HomeService,
        SharedServiceService,
        { provide: UserService, useValue: userSvcSpy }
      ],
    })
      .compileComponents();
    userSvc = TestBed.inject(UserService) as jasmine.SpyObj<UserService>;
    router = TestBed.inject(Router);
  }));
  beforeEach(() => {
    fixture = TestBed.createComponent(PrimaryNavigationComponent);
    component = fixture.componentInstance;
    component.udSub = new Subscription();
  });

  it('should create', () => {
    const mockUserD = userdetails;
    userSvc.getUserDetails.and.returnValue(of(mockUserD));
    spyOn(component, 'getNotificationsCount');
    component.ngOnInit();
    expect(component).toBeTruthy();
    expect(component.userDetails).toEqual(mockUserD);
  });

  it('should call selectedRoleDesc()', () => {
    component.userDetails = userdetails;
    expect(component.selectedRoleDesc).toBe('DemoApprover');
    component.userDetails.assignedRoles[0].roleId = '123';
    expect(component.selectedRoleDesc).toBe('663065348460318692');
    component.userDetails.currentRoleId = null;
    expect(component.selectedRoleDesc).toBe('');
  })

  it('sendToParent(), should assign navigation value', async() => {
    const value = 'report';
    component.sendToParent(value);
    expect(component.isNavSelected).toEqual(value);

    const value2 = 'welcome';
    spyOn(router, 'navigate');
    component.sendToParent(value2);
    expect(router.navigate).toHaveBeenCalledWith(['/home/dash/welcome'])
  })

  it(`createSchema() with args {moduleId: '123', schemaId: null}, should call createUpdateSchema`, async(() => {
      spyOn(router, 'navigate')
      component.createSchema({moduleId: '123', schemaId: '456', moduleDesc: 'Material'});
      expect(router.navigate).toHaveBeenCalledWith([{outlets: {sb: `sb/schema/check-data/123/456`}}], {queryParams: {name: 'Material'}});
      component.createSchema({moduleId: '1002', schemaId: null, moduleDesc: 'Material'});
      expect(router.navigate).toHaveBeenCalledWith([{outlets: {sb: `sb/schema/check-data/1002/new`}}], {queryParams: {name: 'Material'}});
  }));

  it('checkNavOnReload(), should check primary navigation on page reload', async()=>{
    let url = 'https://beta.mdoondemand.com/MDOSF/fuze/ngx-mdo/index.html#/home/dash/welcome';
    component.checkNavOnReload(url);
    expect(component.isNavSelected).toEqual('welcome');
    url = 'https://beta.mdoondemand.com/MDOSF/fuze/ngx-mdo/index.html#/home/report/dashboard/914055233326997382';
    component.checkNavOnReload(url);
    expect(component.isNavSelected).toEqual('report');
    url = 'https://beta.mdoondemand.com/MDOSF/fuze/ngx-mdo/index.html#/home/schema/1005';
    component.checkNavOnReload(url);
    expect(component.isNavSelected).toEqual('schema');
  })

  it('should call openSystemTray()', async () => {
    spyOn(router, 'navigate');
    component.openSystemTray();
    expect(router.navigate).toHaveBeenCalledWith([{ outlets: { sb: ['sb', 'system-tray'] } }]);
  });

  it('should call openSettings()', async () => {
    spyOn(router, 'navigate');
    component.openSettings();
    expect(router.navigate).toHaveBeenCalledWith([{ outlets: { sb: 'settings' }}]);
  });

  it('should call signout()', async () => {
    spyOn(router, 'navigate');
    component.signOut();
    expect(router.navigate).toHaveBeenCalledWith(['auth', 'login']);
  });

  it('should call selectedModule()', async () => {

    const param = {
      objectid: '1004',
      schemaId: '35343',
      objectdesc: 'Material'
    }
    spyOn(router, 'navigate');
    component.selectedModule(param);

    expect(router.navigate).toHaveBeenCalledWith([{outlets: {sb: `sb/schema/check-data/1004/35343`}}], {queryParams: {name: 'Material'}});
  });

  it('should call getMdoState()', async () => {
    localStorage.removeItem('mdo-state');
    component.getMdoState();
    expect(component.secondarySideBarOpened).toBeTruthy();

    localStorage.setItem('mdo-state', 'eyJpc1NlY29uZGFyeU9wZW4iOmZhbHNlfQ==');
    component.getMdoState();
    expect(component.secondarySideBarOpened).toBeFalsy();

    localStorage.setItem('mdo-state', 'eyJpc1NlY29uZGFyeU9wZW4iOnRydWV9');
    component.getMdoState();
    expect(component.secondarySideBarOpened).toBeTruthy();
  });

  it('should call toggleSecondarySideBar()', async () => {
    component.toggleSecondarySideBar();
    expect(component.secondarySideBarOpened).toBeFalsy();
    expect(document.getElementById('secondarySidenav').style.width='16px').toBeTruthy();
    expect(document.getElementById('secondaryContent').style.marginLeft='73px').toBeTruthy();

    component.toggleSecondarySideBar();
    expect(component.secondarySideBarOpened).toBeTruthy();
    expect(document.getElementById('secondarySidenav').style.width='260px').toBeTruthy();
    expect(document.getElementById('secondaryContent').style.marginLeft='200px').toBeTruthy();
  });

  it('should enable and disable grab prop', async () => {
    expect(component.grab).toBeFalsy();
    expect(component.grabCursor).toEqual('default');

    component.resizableMousedown({} as any);
    expect(component.grab).toBeTruthy();
    expect(component.grabCursor).toEqual('col-resize');

    component.resizableMouseup({} as any);
    expect(component.grab).toBeFalsy();
    expect(component.grabCursor).toEqual('default');
  });

});