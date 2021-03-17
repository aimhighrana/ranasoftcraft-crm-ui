import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { SchemaListDetails } from '@models/schema/schemalist';
import { ListService } from '@services/list/list.service';
import { SchemalistService } from '@services/home/schema/schemalist.service';
import { of, throwError } from 'rxjs';
import { AppMaterialModuleForSpec } from 'src/app/app-material-for-spec.module';

import { ListDatatableComponent } from './list-datatable.component';
import { UserService } from '@services/user/userservice.service';
import { Userdetails } from '@models/userdetails';
import { SharedServiceService } from '@modules/shared/_services/shared-service.service';

describe('ListDatatableComponent', () => {
  let component: ListDatatableComponent;
  let fixture: ComponentFixture<ListDatatableComponent>;
  let schemaListService: SchemalistService;
  let userService: UserService;
  let listService: ListService;
  let router: Router;
  let sharedServices: SharedServiceService;
  const routeParams = {moduleId: '1005', schemaId: '1701' };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListDatatableComponent ],
      imports: [ AppMaterialModuleForSpec, RouterTestingModule ],
      providers: [
        { provide: ActivatedRoute, useValue: { params: of(routeParams)}}
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListDatatableComponent);
    component = fixture.componentInstance;

    schemaListService = fixture.debugElement.injector.get(SchemalistService);
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
    spyOn(component, 'getSchemaDetails');
    spyOn(userService, 'getUserDetails').and.returnValue(of());
    spyOn(sharedServices, 'getViewDetailsData').and.returnValue(of());
    component.ngOnInit();

    expect(component.getSchemaDetails).toHaveBeenCalled();
    expect(component.getViewsList).toHaveBeenCalled();

  });

  it('getSchemaDetails(), get schema details ', async(() => {

    component.schemaId = '1701';

    spyOn(schemaListService, 'getSchemaDetailsBySchemaId').withArgs(component.schemaId).and
      .returnValues(of({ schemaId: component.schemaId } as SchemaListDetails), throwError({message: 'api error'}));

    component.getSchemaDetails();
    expect(schemaListService.getSchemaDetailsBySchemaId).toHaveBeenCalledWith(component.schemaId);

    // api error
    spyOn(console, 'error');
    component.getSchemaDetails();
    expect(console.error).toHaveBeenCalled();

  }));

 it('getViewsList() ', async(() => {

    component.moduleId = '1005';

    spyOn(listService, 'getAllListPageViews')
      .and.returnValues(of([]), throwError({ message: 'api error'}));

    component.getViewsList();
    expect(listService.getAllListPageViews).toHaveBeenCalled();
    expect(component.viewsList).toEqual([component.defaultView]);

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

    component.currentViewId = '1701';
    component.openTableViewSettings(true);
    expect(router.navigate).toHaveBeenCalledWith([{ outlets: {sb: `sb/list/table-view-settings/${component.moduleId}/1701`}}], {queryParamsHandling: 'preserve'});

  });

  it('sould get each view category list', () => {

    expect(component.systemViews.length).toEqual(0);
    expect(component.userViews.length).toEqual(1);

  });

  it('should check if a column is static', () => {

    expect(component.isStaticCol('select')).toBeTrue();
    expect(component.isStaticCol('other')).toBeFalse();

  });

});
