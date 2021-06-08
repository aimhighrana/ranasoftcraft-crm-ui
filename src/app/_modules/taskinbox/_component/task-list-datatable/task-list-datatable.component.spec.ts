import { MdoUiLibraryModule } from 'mdo-ui-library';
import { SharedServiceService } from '@modules/shared/_services/shared-service.service';
import { PageEvent } from '@angular/material/paginator';
import { of, Subject } from 'rxjs';
import { async, ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';

import { TaskListDatatableComponent } from './task-list-datatable.component';
import { SharedModule } from '@modules/shared/shared.module';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { AppMaterialModuleForSpec } from 'src/app/app-material-for-spec.module';
import { TaskListService } from '@services/task-list.service';

describe('TaskListDatatableComponent', () => {
  let component: TaskListDatatableComponent;
  let fixture: ComponentFixture<TaskListDatatableComponent>;
  let router: Router;
  let sharedServices: SharedServiceService;
  let taskListService: TaskListService;
  let activatedRoute: ActivatedRoute;
  // const queryParams = { s: 'inbox', f: '' };
  let queryParams: Subject<Params>;
  const params = { node: 'inbox' };

  beforeEach(async(() => {
    queryParams = new Subject<Params>();
    // queryParams.next({ s: 'inbox', f: 'W29iamVjdCBPYmplY3Rd' });
    TestBed.configureTestingModule({
      declarations: [TaskListDatatableComponent],
      imports: [ MdoUiLibraryModule, AppMaterialModuleForSpec, RouterTestingModule, SharedModule],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { queryParams, params: of(params), snapshot: { queryParams: { f: 'test' } } },
        }
      ],
    })
      .compileComponents()
      .then(() => {
        activatedRoute = TestBed.inject(ActivatedRoute);
      });
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TaskListDatatableComponent);
    component = fixture.componentInstance;
    sharedServices = fixture.debugElement.injector.get(SharedServiceService);
    taskListService = fixture.debugElement.injector.get(TaskListService);
    router = TestBed.inject(Router);
    const fieldList = [
      { fldId: 'description', order: 1 },
      { fldId: 'labels', order: 2 },
      { fldId: 'sent', order: 3 },
      { fldId: 'dueby', order: 4 },
      { fldId: 'requestby', order: 5 },
      { fldId: 'sentby', order: 6 },
    ];
    const recordsList = {
      total: 0,
      _doc: [{
        setting: 1,
        Records: 'Hydrogen',
        description: 1.0079,
        labels: ['Pending'],
        sent: 'L',
        dueby: 'L',
        requestby: 'L',
        sentby: 'L',
      },
      {
        setting: 2,
        Records: 'Helium',
        description: 4.0026,
        labels: ['Forwarded'],
        sent: 'L',
        dueby: 'L',
        requestby: 'L',
        sentby: 'L',
      },],
      req_at: 1620206786475,
      to: 10,
      res_at: 1620206786489
  };
    spyOn(taskListService, 'getHeadersForNode')
      .withArgs('inbox')
      .and.callFake(() => of(fieldList));
    spyOn(taskListService, 'saveTasklistVisitByUser').and.callFake(() => of({}));
    spyOn(taskListService, 'getTaskListData').withArgs('inbox', 'en', component.recordsPageSize, 0).and.callFake(() => of(recordsList));
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('should have node inbox', () => {
    component.ngOnInit();
    expect(component.node).toEqual('inbox');
  });
  it('should have param', fakeAsync(() => {
    spyOn(component, 'filterLabels');
    component.ngOnInit();
    expect(activatedRoute.snapshot.queryParams.f).toEqual('test');

    component.labelSearchFieldSub.next('forwarded');
    tick(1500);
    expect(component.filterLabels).toHaveBeenCalledWith('forwarded');
  }));
  it('should have param and called other methods', async(() => {
    spyOn(component, 'saveTasklistVisitByUser');
    spyOn(component, 'getHeadersForNode');
    spyOn(component, 'updateNodeChips');
    component.ngOnInit();
    activatedRoute.params.subscribe((resp) => {
      expect(component.saveTasklistVisitByUser).toHaveBeenCalled();
      expect(component.getHeadersForNode).toHaveBeenCalled();
      expect(component.updateNodeChips).toHaveBeenCalled();
    });
  }));

  it('should have queryParam', fakeAsync(() => {
    // this calls ngOnInit and we subscribe
    spyOn(component, 'updateNodeChips');
    const settings = [
      {
        fldId: 'Bookmarked',
        value: ['2'],
        startvalue: [],
        endvalue: [],
        operator: 'equal',
        parentnode: '',
      },
    ];
    const f = btoa(JSON.stringify(settings));
    fixture.detectChanges();
    // component.ngOnInit();
    queryParams.next({ s: 'inbox', f });
    //
    // tick to make sure the async observable resolves
    expect(component.savedSearchParameters).toBe('inbox');
    expect(component.inlineFilters).toBe(f);
    expect(component.updateNodeChips).toHaveBeenCalledWith(settings);

    component.ngOnInit();
    queryParams.next({ s: null, f: null });
    //
    expect(component.savedSearchParameters).toEqual(null);
    expect(component.inlineFilters).toEqual(null);
  }));

  it('updateTableColumns()', fakeAsync(() => {
    spyOn(component, 'updateTableColumns');
    spyOn(component, 'updateNodeChips');
    spyOn(sharedServices, 'gettaskinboxViewDetailsData').and.returnValue(of({ node: 'inbox', viewDetails: [] }));
    component.ngOnInit();

    // expect(component.updateNodeChips).toHaveBeenCalled();
    expect(sharedServices.gettaskinboxViewDetailsData).toHaveBeenCalled();

    expect(component.updateTableColumns).toHaveBeenCalled();
  }));

  it('updateNodeChips()', () => {
    component.node = 'inbox';
    component.updateNodeChips();

    expect(component.currentNodeFilterChips.length).toBeGreaterThan(1);
  });
  it('updateNodeChips() with parameter', () => {
    component.node = 'inbox';
    component.updateNodeChips([
      {
        fldId: 'Bookmarked',
        value: [true],
        startvalue: [],
        endvalue: [],
        operator: 'equal',
        parentnode: '',
      },
    ]);
    const chip = component.currentNodeFilterChips.find((d) => d.fldId === 'Bookmarked');
    expect(chip.value).toEqual([true]);
  });

  it('setChipValue()', () => {
    spyOn(component, 'updateQueryParameter');
    component.currentNodeFilterChips = [
      {
        fldId: 'Bookmarked',
        value: ['2'],
        icon: 'star',
        hasMenu: false,
      },
    ];
    component.currentFilterSettings = [
      {
        fldId: 'Bookmarked',
        value: ['2'],
        startvalue: [],
        endvalue: [],
        operator: 'equal',
        parentnode: '',
      },
    ];
    component.setChipValue(
      {
        fldId: 'Bookmarked',
        value: ['2'],
        icon: 'star',
        hasMenu: false,
      },
      '5'
    );

    expect(component.currentNodeFilterChips).toEqual([
      {
        fldId: 'Bookmarked',
        value: ['2', '5'],
        icon: 'star',
        hasMenu: false,
      },
    ]);
    expect(component.currentFilterSettings).toEqual([
      {
        fldId: 'Bookmarked',
        value: ['2', '5'],
        startvalue: [],
        endvalue: [],
        operator: 'equal',
        parentnode: '',
      },
    ]);

    component.setChipValue(
      {
        fldId: 'Bookmarked',
        value: ['2'],
        icon: 'star',
        hasMenu: false,
      },
      '5'
    );
    expect(component.currentNodeFilterChips).toEqual([
      {
        fldId: 'Bookmarked',
        value: ['2'],
        icon: 'star',
        hasMenu: false,
      },
    ]);
    expect(component.currentFilterSettings).toEqual([
      {
        fldId: 'Bookmarked',
        value: ['2'],
        startvalue: [],
        endvalue: [],
        operator: 'equal',
        parentnode: '',
      },
    ]);
    component.setChipValue(
      {
        fldId: 'Bookmarked',
        value: ['2'],
        icon: 'star',
        hasMenu: false,
      },
      '2'
    );
    expect(component.currentNodeFilterChips).toEqual([
      {
        fldId: 'Bookmarked',
        value: [],
        icon: 'star',
        hasMenu: false,
      },
    ]);
    expect(component.currentFilterSettings).toEqual([]);

    component.setChipValue(
      {
        fldId: 'Bookmarked',
        value: ['2'],
        icon: 'star',
        hasMenu: false,
      },
      '2'
    );
    expect(component.currentFilterSettings).toEqual([
      {
        fldId: 'Bookmarked',
        value: ['2'],
        startvalue: [],
        endvalue: [],
        operator: 'equal',
        parentnode: '',
      },
    ]);

    expect(component.updateQueryParameter).toHaveBeenCalled();
  });

  it('updateQueryParameter()', () => {
    spyOn(router, 'navigate');
    component.node = 'inbox';
    component.currentFilterSettings = [
      {
        fldId: 'Bookmarked',
        value: ['2'],
        startvalue: [],
        endvalue: [],
        operator: 'equal',
        parentnode: '',
      },
    ];

    component.updateQueryParameter();
    let f = btoa(JSON.stringify(component.currentFilterSettings));
    expect(router.navigate).toHaveBeenCalledWith([`/home/task/${component.node}/feed`], {
      queryParams: { f },
      queryParamsHandling: 'merge',
    });

    component.currentFilterSettings = [];
    component.updateQueryParameter();
    f = '';
    expect(router.navigate).toHaveBeenCalledWith([`/home/task/${component.node}/feed`], {
      queryParams: { f },
      queryParamsHandling: 'merge',
    });
  });

  it('filterModulesMenu()', () => {
    component.filterModulesMenu('he', 'Label');
    expect(component.filteredNodeChipsMenuItems.Label).toEqual(['He']);

    component.filterModulesMenu('he', 'UnknownChip');
    expect(component.filteredNodeChipsMenuItems.UnknownChip).toEqual([]);
  });

  it('openTableViewSettings()', () => {
    spyOn(router, 'navigate');
    component.node = 'inbox';

    component.openTableViewSettings();
    expect(router.navigate).toHaveBeenCalledWith([{ outlets: { sb: `sb/task/view/${component.node}` } }], {
      queryParamsHandling: 'preserve',
    });
  });
  it('openFilterSettingsPanel()', () => {
    spyOn(router, 'navigate');
    component.node = 'inbox';

    component.openFilterSettingsPanel();
    expect(router.navigate).toHaveBeenCalledWith([{ outlets: { sb: `sb/task/filter/${component.node}` } }], {
      queryParamsHandling: 'preserve',
    });
  });

  it('getTableData())', () => {
    spyOn(component, 'getTableData');
    component.node = 'inbox';
    component.updateTableColumns();

    expect(component.getTableData).toHaveBeenCalled();
  });

  it('should check if a column is static', () => {
    expect(component.isStaticCol('select')).toBeTrue();
    expect(component.isStaticCol('other')).toBeFalse();
  });

  it('getFieldDesc()', () => {
    component.node = 'inbox';
    component.nodeColumns = [{ fldId: 'dueby', fldDesc: 'Due by' }];
    expect(component.getFieldDesc('dueby')).toEqual('Due by');
    component.nodeColumns = [{ fldId: 'dueby', fldDesc: '' }];
    expect(component.getFieldDesc('dueby')).toEqual('Unknown');
    component.nodeColumns = [];
    expect(component.getFieldDesc('dueby')).toEqual('dueby');
    component.nodeColumns = [];
    expect(component.getFieldDesc('')).toEqual('Unknown');

  });

  it('onPageChange()', () => {
    const pageEvent = new PageEvent();
    pageEvent.pageIndex = 5;
    component.onPageChange(pageEvent);

    expect(component.pageEvent.pageIndex).toBe(5);
  });
  it('saveTasklistVisitByUser()', async(() => {
    component.saveTasklistVisitByUser('inbox');
    expect(taskListService.saveTasklistVisitByUser).toHaveBeenCalled();
    taskListService.saveTasklistVisitByUser('inbox').subscribe((actualResponse) => {
      expect(actualResponse).toBeTruthy();
    });
  }));

  it('getHeadersForNode()', fakeAsync(() => {
    component.node = 'inbox';
    spyOn(component, 'updateTableColumns');
    component.getHeadersForNode('inbox');

    expect(taskListService.getHeadersForNode).toHaveBeenCalled();

    expect(component.nodeColumns.length).toBeGreaterThan(1);
    expect(component.updateTableColumns).toHaveBeenCalled();
  }));

  it('filterLabels(event)', () => {
    component.ngOnInit();
    component.filterLabels('forwarded');
    expect(component.filteredLabels.length).toBeGreaterThan(0);
  });

  it('removeLabel(element: PeriodicElement, label)', () => {
    component.ngOnInit();
    const element = {
      setting: 3,
      Records: 'Lithium',
      description: 6.941,
      labels: ['Delegated', 'Forwarded'],
      sent: 'L',
      dueby: 'L',
      requestby: 'L',
      sentby: 'L',
    };
    component.removeLabel(element, 'Forwarded');
    expect(element.labels.length).toEqual(1);
  });

  it('applyLabel(element: PeriodicElement, label)', () => {
    component.ngOnInit();
    const element = {
      setting: 3,
      Records: 'Lithium',
      description: 6.941,
      labels: ['Delegated', 'Forwarded'],
      sent: 'L',
      dueby: 'L',
      requestby: 'L',
      sentby: 'L',
    };
    component.applyLabel(element, 'Forwarded');
    expect(element.labels.length).toEqual(2);
    component.applyLabel(element, 'Completed');
    expect(element.labels.length).toEqual(3);
  });

  it('should get table data', () => {
    component.node = 'inbox';
    component.getTableData();
    expect(taskListService.getTaskListData).toHaveBeenCalled();
    expect(component.dataSource.docLength()).toEqual(2);
  });

  it('masterToggle()', () => {
    spyOn(component.selection, 'clear');
    spyOn(component.selection, 'select');
    component.masterToggle();
    expect(component.selection.clear).toHaveBeenCalled();

    component.node = 'inbox';
    component.getTableData();
    expect(taskListService.getTaskListData).toHaveBeenCalled();
    expect(component.dataSource.docValue().length).toEqual(2);
    component.masterToggle();
    expect(component.selection.select).toHaveBeenCalled();
  });

  it('checkboxLabel()', () => {
    component.node = 'inbox';
    component.getTableData();
    let label = component.checkboxLabel(null);
    expect(label).toEqual('deselect all');
    component.masterToggle();
    label = component.checkboxLabel(null);
    expect(label).toEqual('select all');
  });

  it('ngOnDestroy()', () => {
    spyOn(component.unsubscribeAll$, 'unsubscribe');
    component.ngOnDestroy();
    expect(component.unsubscribeAll$.unsubscribe).toHaveBeenCalled();
  });
});
