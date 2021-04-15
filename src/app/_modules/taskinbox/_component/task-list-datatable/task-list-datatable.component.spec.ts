import { SharedServiceService } from '@modules/shared/_services/shared-service.service';
import { PageEvent } from '@angular/material/paginator';
import { of, Subject } from 'rxjs';
import { async, ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';

import { TaskListDatatableComponent } from './task-list-datatable.component';
import { SharedModule } from '@modules/shared/shared.module';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { AppMaterialModuleForSpec } from 'src/app/app-material-for-spec.module';

describe('TaskListDatatableComponent', () => {
  let component: TaskListDatatableComponent;
  let fixture: ComponentFixture<TaskListDatatableComponent>;
  let router: Router;
  let sharedServices: SharedServiceService;
  let activatedRoute: ActivatedRoute;
  // const queryParams = { s: 'inbox', f: '' };
  let queryParams: Subject<Params>;
  const params = { node: 'inbox' };

  beforeEach(async(() => {
    queryParams = new Subject<Params>();
    queryParams.next({ s: 'inbox', f: 'W29iamVjdCBPYmplY3Rd' });
    TestBed.configureTestingModule({
      declarations: [TaskListDatatableComponent],
      imports: [AppMaterialModuleForSpec, RouterTestingModule, SharedModule],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { queryParams, params: of(params), snapshot: { queryParams: { f: 'test' } } },
        },
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
    router = TestBed.inject(Router);
    // activatedRoute = TestBed.inject(ActivatedRoute);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('should have node inbox', () => {
    expect(component.node).toEqual('inbox');
  });
  it('should have queryParam', async () => {
    expect(activatedRoute.snapshot.queryParams.f).toEqual('test');
  });
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
    queryParams.next({ s: 'inbox', f });

    // tick to make sure the async observable resolves
    tick();
    expect(component.savedSearchParameters).toBe('inbox');
    expect(component.inlineFilters).toBe(f);
    expect(component.updateNodeChips).toHaveBeenCalledWith(settings);
  }));
  it('updateTableColumns()', () => {
    spyOn(component, 'updateTableColumns');
    spyOn(component, 'updateNodeChips');
    spyOn(sharedServices, 'gettaskinboxViewDetailsData').and.returnValue(of());
    component.ngOnInit();

    expect(component.updateTableColumns).toHaveBeenCalled();
    expect(component.updateNodeChips).toHaveBeenCalled();
    expect(sharedServices.gettaskinboxViewDetailsData).toHaveBeenCalled();
  });

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
  });

  it('openTableViewSettings()', () => {
    spyOn(router, 'navigate');
    component.node = 'inbox';

    component.openTableViewSettings();
    expect(router.navigate).toHaveBeenCalledWith([{ outlets: { sb: `sb/task/view/${component.node}` } }], {
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
    expect(component.getFieldDesc('dueby')).toEqual('Due by');
  });

  it('onPageChange()', () => {
    const pageEvent = new PageEvent();
    pageEvent.pageIndex = 5;
    component.onPageChange(pageEvent);

    expect(component.pageEvent.pageIndex).toBe(5);
  });

  it('ngOnDestroy()', () => {
    spyOn(component.unsubscribeAll$, 'unsubscribe');
    component.ngOnDestroy();
    expect(component.unsubscribeAll$.unsubscribe).toHaveBeenCalled();
  });
});
