import { TaskListService } from '@services/task-list.service';
import { of } from 'rxjs';
import { SharedModule } from '@modules/shared/shared.module';
import { RouterTestingModule } from '@angular/router/testing';
import { AppMaterialModuleForSpec } from 'src/app/app-material-for-spec.module';

import { SharedServiceService } from '@modules/shared/_services/shared-service.service';
import { Router, ActivatedRoute } from '@angular/router';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TaskListTableViewSettingsComponent } from './task-list-table-view-settings.component';

describe('TaskListTableViewSettingsComponent', () => {
  let component: TaskListTableViewSettingsComponent;
  let fixture: ComponentFixture<TaskListTableViewSettingsComponent>;
  let router: Router;
  let sharedServices: SharedServiceService;
  let taskListService: TaskListService;
  const params = { node: 'inbox' };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [TaskListTableViewSettingsComponent],
      imports: [AppMaterialModuleForSpec, RouterTestingModule, SharedModule],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { params: of(params) },
        },
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TaskListTableViewSettingsComponent);
    component = fixture.componentInstance;
    sharedServices = fixture.debugElement.injector.get(SharedServiceService);
    taskListService = fixture.debugElement.injector.get(TaskListService);
    router = TestBed.inject(Router);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have node inbox', () => {
    component.ngOnInit();
    expect(component.node).toEqual('inbox');
  });

  it('getTableViewDetails()', () => {
    spyOn(component, 'getTableViewDetails');
    component.ngOnInit();

    expect(component.getTableViewDetails).toHaveBeenCalled();
  });

  it('getTableViewDetails()', () => {
    spyOn(sharedServices, 'gettaskinboxViewDetailsData').and.returnValues(
      of({ node: 'inbox', viewDetails: [{ fldId: 'dueby', order: '0', fldDesc: 'Due by' }] })
    );
    component.node = 'inbox';
    component.getTableViewDetails();

    expect(sharedServices.gettaskinboxViewDetailsData).toHaveBeenCalled();
    expect(component.viewDetails).toEqual([{ fldId: 'dueby', order: '0', fldDesc: 'Due by' }]);
    expect(component.viewDetails.length).toBe(1);
  });
  it('gettaskinboxViewDetailsData() with null return', () => {
    spyOn(sharedServices, 'gettaskinboxViewDetailsData').and.returnValues(of(null));
    component.node = 'inbox';
    component.getTableViewDetails();

    expect(sharedServices.gettaskinboxViewDetailsData).toHaveBeenCalled();
    expect(component.viewDetails.length).toBeGreaterThan(1);
  });

  it('getFldMetadata())', () => {
    spyOn(component, 'getFldMetadata');
    component.ngOnInit();

    expect(component.getFldMetadata).toHaveBeenCalled();
  });

  it('metadataFldLst suggestedFlds length exist', () => {
    component.node = 'inbox';
    component.getFldMetadata();

    expect(component.metadataFldLst.length).toBeGreaterThan(1);
    expect(component.suggestedFlds.length).toBeGreaterThan(1);
  });

  it('close()', () => {
    spyOn(router, 'navigate');
    component.close();
    expect(router.navigate).toHaveBeenCalledWith([{ outlets: { sb: null } }], {
      queryParamsHandling: 'preserve',
    });
  });

  it('isChecked(), is checked ', async(() => {
    component.viewDetails = [{ fldId: 'dueby', order: '0', fldDesc: 'Due by' }];

    expect(component.isChecked({ fldId: 'dueby', fldDesc: 'Due by' })).toEqual(true);

    expect(component.isChecked({ fldId: 'sent', fldDesc: 'Sent' })).toBeFalse();
  }));

  it('should selectionChange', () => {
    component.selectionChange({ fldId: 'sent', fldDesc: 'Sent' });
    expect(component.viewDetails.length).toEqual(5);

    component.selectionChange({ fldId: 'new', fldDesc: 'New' });
    expect(component.viewDetails.length).toEqual(6);
  });

  it('throw error when node is undefined', () => {
    component.node = '';
    expect(() => component.getFldMetadata()).toThrowError('node cant be null or empty');
  });

  it('should save', () => {
    spyOn(component, 'close');
    spyOn(sharedServices, 'settaskinboxViewDetailsData');
    spyOn(taskListService, 'saveOrUpdateTasklistHeaders').and.returnValue(of({
      acknowledge: true,
      errorMsg: null
    }));

    component.viewDetails = [{ fldId: 'dueby', fldDesc: 'Due by', order: '0' }];
    component.metadataFldLst = [{ fldId: 'dueby', fldDesc: 'Due by' }];

    component.save();

    expect(sharedServices.settaskinboxViewDetailsData).toHaveBeenCalledWith({
      node: 'inbox',
      viewDetails: [{ fldId: 'dueby', fldDesc: 'Due by', order: '1' }],
    });

    const payload = [{fldId: 'dueby', order: 1}];
    expect(taskListService.saveOrUpdateTasklistHeaders).toHaveBeenCalledWith(component.node, payload);
    taskListService.saveOrUpdateTasklistHeaders(component.node, payload).subscribe((actualResponse) => {
      expect(actualResponse).not.toBeNull();
      expect(component.close).toHaveBeenCalled();
    });
  });

  it('ngOnDestroy()', () => {
    spyOn(component.unsubscribeAll$, 'unsubscribe');
    component.ngOnDestroy();
    expect(component.unsubscribeAll$.unsubscribe).toHaveBeenCalled();
  });
});
