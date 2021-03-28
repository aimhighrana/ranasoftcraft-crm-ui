import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { ListService } from '@services/list/list.service';
import { of, throwError } from 'rxjs';
import { AppMaterialModuleForSpec } from 'src/app/app-material-for-spec.module';

import { ListDatatableComponent } from './list-datatable.component';
import { UserService } from '@services/user/userservice.service';
import { Userdetails } from '@models/userdetails';
import { SharedServiceService } from '@modules/shared/_services/shared-service.service';
import { PageEvent } from '@angular/material/paginator';
import { SharedModule } from '@modules/shared/shared.module';
import { ViewsPage } from '@models/list-page/listpage';

describe('ListDatatableComponent', () => {
  let component: ListDatatableComponent;
  let fixture: ComponentFixture<ListDatatableComponent>;
  let userService: UserService;
  let listService: ListService;
  let router: Router;
  let sharedServices: SharedServiceService;
  const routeParams = { moduleId: '1005' };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListDatatableComponent ],
      imports: [ AppMaterialModuleForSpec, RouterTestingModule, SharedModule ],
      providers: [
        { provide: ActivatedRoute, useValue: { params: of(routeParams)}}
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListDatatableComponent);
    component = fixture.componentInstance;

    userService = fixture.debugElement.injector.get(UserService);
    listService = fixture.debugElement.injector.get(ListService);
    sharedServices = fixture.debugElement.injector.get(SharedServiceService);
    router = TestBed.inject(Router);
    // fixture.detectChanges();

    component.userDetails = new Userdetails();
    component.userDetails.userName = 'Admin';
    component.userDetails.currentRoleId = 'Admin';
    component.userDetails.plantCode = '0';

  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should init component', () => {

    spyOn(component, 'getViewsList');
    spyOn(component, 'getTotalCount');
    spyOn(userService, 'getUserDetails').and.returnValue(of());
    spyOn(sharedServices, 'getViewDetailsData').and.returnValue(of());
    component.ngOnInit();

    expect(component.getViewsList).toHaveBeenCalled();

  });

 it('getViewsList() ', async(() => {

    component.moduleId = '1005';

    spyOn(listService, 'getAllListPageViews')
      .and.returnValues(of(new ViewsPage()), throwError({ message: 'api error'}));

    component.getViewsList();
    expect(listService.getAllListPageViews).toHaveBeenCalled();
    expect(component.currentView).toEqual(component.defaultView);

    // api error
    spyOn(console, 'error');
    component.getViewsList();
    expect(console.error).toHaveBeenCalled();

  }));

  it('should openTableViewSettings for new view', () => {

    spyOn(router, 'navigate');
    component.moduleId = '1005';

    component.openTableViewSettings();
    expect(router.navigate).toHaveBeenCalledWith([{ outlets: {sb: `sb/list/table-view-settings/${component.moduleId}/new`}}], {queryParamsHandling: 'preserve'});

  });

  it('should openTableViewSettings for edit', () => {

    spyOn(router, 'navigate');
    component.moduleId = '1005';

    component.currentView.viewId = '1701';
    component.openTableViewSettings(true);
    expect(router.navigate).toHaveBeenCalledWith([{ outlets: {sb: `sb/list/table-view-settings/${component.moduleId}/1701`}}], {queryParamsHandling: 'preserve'});

  });

  it('sould get each view category list', () => {

    expect(component.systemViews.length).toEqual(0);
    expect(component.userViews.length).toEqual(0);

  });

  it('should check if a column is static', () => {

    expect(component.isStaticCol('_select')).toBeTrue();
    expect(component.isStaticCol('other')).toBeFalse();

  });

  it('should get total records count', () => {

    spyOn(listService, 'getDataCount').and.returnValues(of(100), throwError({message: 'api error'}));

    component.getTotalCount();
    expect(component.totalCount).toEqual(100);
    expect(listService.getDataCount).toHaveBeenCalledWith(component.moduleId, []);

    // api error
    spyOn(console, 'error');
    component.getTotalCount();
    expect(console.error).toHaveBeenCalled();

  })

  it('should get table data', () => {

    const recordsList = [
      {hdvs:{APPDATE:{vc:[{c:'1598857068858'}]}}, id:'20060856'},
      {hdvs:{APPDATE:{vc:[{c:'1598857068858'}]}}, id:'20060857'}
    ]
    spyOn(listService, 'getTableData').and.returnValues(of(recordsList), throwError({message: 'api error'}));

    component.getTableData();
    expect(component.dataSource.docLength()).toEqual(2);
    expect(listService.getTableData).toHaveBeenCalledWith(component.moduleId, '', component.recordsPageIndex, []);

    // api error
    spyOn(console, 'error');
    component.getTableData();
    expect(console.error).toHaveBeenCalled();

  });

  it('should get table page records', () => {

    spyOn(component.dataSource, 'getData');

    const pageEvent = new PageEvent();
    pageEvent.pageIndex = 5;

    component.onPageChange(pageEvent);
    expect(component.dataSource.getData).toHaveBeenCalledWith(component.moduleId, '', 5);
  });

});
