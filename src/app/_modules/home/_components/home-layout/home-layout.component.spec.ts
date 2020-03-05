import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { HomeLayoutComponent } from './home-layout.component';
import { AppMaterialModuleForSpec } from 'src/app/app-material-for-spec.module';
import { RouterTestingModule } from '@angular/router/testing';
import { BreadcrumbComponent } from '../../../shared/_components/breadcrumb/breadcrumb.component';
import { LoadingService } from 'src/app/_services/loading.service';
import { UserService } from 'src/app/_services/user/userservice.service';
import { Userdetails } from 'src/app/_models/userdetails';
import { of } from 'rxjs';
import { EventEmitter } from '@angular/core';

describe('HomeLayoutComponent', () => {
  let component: HomeLayoutComponent;
  let fixture: ComponentFixture<HomeLayoutComponent>;
  let userSvc: jasmine.SpyObj<UserService>;
  let loadingSvc: jasmine.SpyObj<LoadingService>;

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
      declarations: [ HomeLayoutComponent, BreadcrumbComponent ]
    })
    .compileComponents();
    userSvc = TestBed.inject(UserService) as jasmine.SpyObj<UserService>;
    loadingSvc = TestBed.inject(LoadingService) as jasmine.SpyObj<LoadingService>;
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HomeLayoutComponent);
    component = fixture.componentInstance;
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
});
