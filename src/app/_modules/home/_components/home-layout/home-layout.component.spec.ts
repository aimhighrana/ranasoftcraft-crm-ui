import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { HomeLayoutComponent } from './home-layout.component';
import { AppMaterialModuleForSpec } from 'src/app/app-material-for-spec.module';
import { RouterTestingModule } from '@angular/router/testing';
import { BreadcrumbComponent } from '../../../shared/_components/breadcrumb/breadcrumb.component';
import { LoadingService } from 'src/app/_services/loading.service';
import { UserService } from 'src/app/_services/user/userservice.service';
import { Userdetails } from 'src/app/_models/userdetails';
import { of, Subscription } from 'rxjs';
import { EventEmitter } from '@angular/core';
import { PrimaryNavbarComponent } from '@modules/schema/_components/primary-navbar/primary-navbar.component';
import { SecondaryNavbarComponent } from '@modules/schema/_components/secondary-navbar/secondary-navbar.component';
import { SearchInputComponent } from '@modules/shared/_components/search-input/search-input.component';
import { NavigationDropdownComponent } from '@modules/shared/_components/navigation-dropdown/navigation-dropdown.component';

describe('HomeLayoutComponent', () => {
  let component: HomeLayoutComponent;
  let fixture: ComponentFixture<HomeLayoutComponent>;
  let userSvc: jasmine.SpyObj<UserService>;
  let loadingSvc: jasmine.SpyObj<LoadingService>;
  const userDetailsobject: Userdetails = {
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
  }
  beforeEach(async(() => {
    const userSvcSpy = jasmine.createSpyObj('UserService', ['getUserDetails']);
    const loadingSvcSpy = jasmine.createSpyObj('LoadingService', ['isLoading']);
    TestBed.configureTestingModule({
      imports: [
        AppMaterialModuleForSpec,
        RouterTestingModule
      ],
      providers: [
        { provide: UserService, useValue: userSvcSpy },
        { provide: LoadingService, useValue: loadingSvcSpy },
      ],
      declarations: [HomeLayoutComponent, BreadcrumbComponent, PrimaryNavbarComponent, SecondaryNavbarComponent,
        SearchInputComponent, NavigationDropdownComponent ]
    })
      .compileComponents();
    userSvc = TestBed.inject(UserService) as jasmine.SpyObj<UserService>;
    loadingSvc = TestBed.inject(LoadingService) as jasmine.SpyObj<LoadingService>;
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HomeLayoutComponent);
    component = fixture.componentInstance;
    component.udSub = new Subscription();
  });

  it('should create', () => {
    const mockUserD = new Userdetails();
    mockUserD.fullName = 'TEST';
    userSvc.getUserDetails.and.returnValue(of(mockUserD));
    fixture.detectChanges();
    expect(component).toBeTruthy();
    expect(component.userDetails).toEqual(mockUserD);
    expect(component.userDetails.fullName === mockUserD.fullName).toBeTruthy();
  });

  it('should return loadingSvc.isLoading()', () => {
    const evtEmitter = new EventEmitter<boolean>();
    loadingSvc.isLoading.and.returnValue(evtEmitter);
    userSvc.getUserDetails.and.returnValue(of(new Userdetails()));
    fixture.detectChanges();
    expect(component.isLoading()).toEqual(evtEmitter);
  });

  it('should call selectedRoleDesc()', () => {
    component.userDetails = userDetailsobject;
    expect(component.selectedRoleDesc).toBe('DemoApprover');
    component.userDetails.assignedRoles[0].roleId = '123';
    expect(component.selectedRoleDesc).toBe('663065348460318692');
    component.userDetails.currentRoleId = null;
    expect(component.selectedRoleDesc).toBe('');
  })
});
