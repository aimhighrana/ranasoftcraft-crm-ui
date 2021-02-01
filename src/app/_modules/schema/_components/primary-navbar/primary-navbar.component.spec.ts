import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PrimaryNavbarComponent } from './primary-navbar.component';
import { AppMaterialModuleForSpec } from 'src/app/app-material-for-spec.module';
import { SearchInputComponent } from '@modules/shared/_components/search-input/search-input.component';
import { NavigationDropdownComponent } from '@modules/shared/_components/navigation-dropdown/navigation-dropdown.component';
import { RouterTestingModule } from '@angular/router/testing';
import { Router } from '@angular/router';
import { SharedModule } from '@modules/shared/shared.module';
import { HomeService } from '@services/home/home.service';
import { Userdetails } from '@models/userdetails';
import { of } from 'rxjs';
import { UserService } from '@services/user/userservice.service';

describe('PrimaryNavbarComponent', () => {
  let component: PrimaryNavbarComponent;
  let fixture: ComponentFixture<PrimaryNavbarComponent>;
  let router: Router;
  let homeService: HomeService;
  let userService: UserService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [PrimaryNavbarComponent, SearchInputComponent, NavigationDropdownComponent, NavigationDropdownComponent],
      imports: [AppMaterialModuleForSpec, RouterTestingModule, SharedModule],
    })
      .compileComponents();
    router = TestBed.inject(Router);
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PrimaryNavbarComponent);
    component = fixture.componentInstance;
    homeService = fixture.debugElement.injector.get(HomeService);
    userService = fixture.debugElement.injector.get(UserService);
    // fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('sendToParent(), should assign navigation value', async () => {
    const value = 'report';
    component.sendToParent(value);
    expect(component.isNavSelected).toEqual(value);

    const value2 = 'welcome';
    spyOn(router, 'navigate');
    component.sendToParent(value2);
    expect(router.navigate).toHaveBeenCalledWith(['/home/dash/welcome'])
  })

  it('checkNavOnReload(), should check primary navigation on page reload', async () => {
    let url = 'https://beta.mdoondemand.com/MDOSF/fuze/ngx-mdo/index.html#/home/dash/welcome';
    component.checkNavOnReload(url);
    expect(component.isNavSelected).toEqual('welcome');

    url = 'https://beta.mdoondemand.com/MDOSF/fuze/ngx-mdo/index.html#/home/report/dashboard/914055233326997382';
    component.checkNavOnReload(url);
    expect(component.isNavSelected).toEqual('report');

    url = 'https://beta.mdoondemand.com/MDOSF/fuze/ngx-mdo/index.html#/home/schema/1005';
    component.checkNavOnReload(url);
    expect(component.isNavSelected).toEqual('schema');

    url = 'https://beta.mdoondemand.com';
    component.isNavSelected = '';
    component.checkNavOnReload(url);
    expect(component.isNavSelected).toEqual('');
  })

  it(`createSchema() with args {moduleId: '123', schemaId: null}, should call createUpdateSchema`, async(() => {
    spyOn(router, 'navigate')
    component.createSchema({ moduleId: '123', schemaId: '456', moduleDesc: 'Material' });
    expect(router.navigate).toHaveBeenCalledWith([{ outlets: { sb: `sb/schema/check-data/123/456` } }], { queryParams: { name: 'Material' } });

    component.createSchema({ moduleId: '1002', schemaId: null, moduleDesc: 'Material' });
    expect(router.navigate).toHaveBeenCalledWith([{ outlets: { sb: `sb/schema/check-data/1002/new` } }], { queryParams: { name: 'Material' } });
  }));

  it('openSystemTray(), should open system tray', async () => {
    spyOn(router, 'navigate');
    component.openSystemTray();
    expect(router.navigate).toHaveBeenCalledWith([{ outlets: { sb: ['sb', 'system-tray'] } }])
  });

  it('signOut(), should delete tokens from local storage', async () => {
    localStorage.setItem('JWT-TOKEN', 'eyJpc1ByaW1hcnlPcGVuIjp0cnVlLCJpc1NlY29uZGFyeU9wZW4iOnRydWV9');
    localStorage.setItem('JWT-REFRESH-TOKEN', 'eyJpc1ByaW1hcnlPcGVuIjp0cnVlLCJpc1NlY29uZGFyeU9wZW4iOnRydWV9');

    spyOn(router, 'navigate');
    component.signOut();

    expect(localStorage.getItem('JWT-TOKEN')).toEqual(null);
    expect(router.navigate).toHaveBeenCalledWith(['auth', 'login']);
  });

  it('toggleSideBar(), should open close primary nav bar', async () => {
    spyOn(component.toggleEmitter, 'emit');

    component.toggleSideBar();
    expect(component.toggleEmitter.emit).toHaveBeenCalled();
  });

  it('getNotificationsCount(), should get notifications count for user', async () => {
    component.userDetails = {
      userName: 'mdo_refresh'
    } as Userdetails
    spyOn(homeService, 'getNotificationCount').withArgs(component.userDetails.userName).and.returnValue(of({}))
    component.getNotificationsCount();
    expect(homeService.getNotificationCount).toHaveBeenCalled();
  });

  it('ngOnInit(), should called ngOnInit', async () => {
    spyOn(component, 'getNotificationsCount');
    spyOn(userService, 'getUserDetails').and.returnValue(of({} as Userdetails));
    spyOn(component, 'checkNavOnReload');

    component.ngOnInit();
    expect(userService.getUserDetails).toHaveBeenCalled();
    expect(component.getNotificationsCount).toHaveBeenCalled();
    expect(component.checkNavOnReload).toHaveBeenCalled()
  })
});
