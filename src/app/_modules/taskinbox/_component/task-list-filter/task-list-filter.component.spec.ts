import { Subject, of } from 'rxjs';
import { SharedModule } from '@modules/shared/shared.module';
import { RouterTestingModule } from '@angular/router/testing';
import { AppMaterialModuleForSpec } from 'src/app/app-material-for-spec.module';
import { async, ComponentFixture, TestBed, fakeAsync, tick, discardPeriodicTasks } from '@angular/core/testing';

import { TaskListFilterComponent } from './task-list-filter.component';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { GlobaldialogService } from '@services/globaldialog.service';
import { By } from '@angular/platform-browser';

describe('TaskListFilterComponent', () => {
  let component: TaskListFilterComponent;
  let fixture: ComponentFixture<TaskListFilterComponent>;
  let router: Router;
  let globalDialogService: GlobaldialogService;
  let queryParams: Subject<Params>;
  const params = { node: 'inbox' };

  beforeEach(async(() => {
    queryParams = new Subject<Params>();
    TestBed.configureTestingModule({
      declarations: [TaskListFilterComponent],
      imports: [AppMaterialModuleForSpec, RouterTestingModule, SharedModule],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { queryParams, params: of(params) },
        },
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TaskListFilterComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
    globalDialogService = fixture.debugElement.injector.get(GlobaldialogService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('should have node inbox', () => {
    spyOn(component, 'loadData');
    component.ngOnInit();
    expect(component.node).toEqual('inbox');
    expect(component.loadData).toHaveBeenCalledWith([]);
  });
  it('getLazyData', (done: DoneFn) => {
    component.ngOnInit();
    component.getLazyData(0, 10).subscribe((resp) => {
      expect(resp.data.length).toEqual(10);
      done();
    });
    component.getLazyData(0, 10, 'cust').subscribe((resp) => {
      expect(resp.data.length).toEqual(1);
      done();
    });
  });
  it('filterNode(treeNode: TreeNode, value: string)', () => {
    component.ngOnInit();
    const result = component.filterNode(
      { fieldId: 'Customer', fieldDesc: 'customer Order', picklist: '0', dataType: 'CHAR', fields: [] },
      'cust'
    );
    expect(result.fieldId).toEqual('Customer');

    const result2 = component.filterNode(
      { fieldId: 'Customer', fieldDesc: 'customer Order', picklist: '0', dataType: 'CHAR', fields: [] },
      'emp'
    );
    expect(result2).toEqual(null);
  });

  it('filterFields(treeNodes: TreeNode[], value: string)', () => {
    component.ngOnInit();
    const result = component.filterFields(
      [
        {
          fieldId: 'Customer',
          fieldDesc: 'Customer Order',
          picklist: '0',
          dataType: 'CHAR',
          fields: [{ fieldId: 'CustomerAddress', fieldDesc: 'Customer Address', picklist: '0', dataType: 'CHAR', fields: [] }],
        },
      ],
      'cust'
    );
    expect(result[0].fields.length).toEqual(1);

    const result2 = component.filterFields(
      [
        {
          fieldId: 'Customer',
          fieldDesc: 'Customer Order',
          picklist: '0',
          dataType: 'CHAR',
          fields: [{ fieldId: 'OrderItem', fieldDesc: 'Order Item', picklist: '0', dataType: 'CHAR', fields: [] }],
        },
      ],
      'cust'
    );
    const count = result2 && result2[0] && result2[0].fields ? result2[0].fields.length : 0;
    expect(count).toEqual(0);
  });

  it('searchInput valuechange', async(() => {
    spyOn(component, 'resetPageEvent');
    component.ngOnInit();
    const field = fixture.debugElement.query(By.css('lib-search:first-of-type'));
    const input = field.query(By.css('input')).nativeElement;
    input.value = 'someValue';
    input.dispatchEvent(new Event('keyup'));
    fixture.detectChanges();
    expect(input.value).toBe('someValue');
  }));
  it('scroll($event)', () => {
    spyOn(component, 'loadData');
    component.ngOnInit();
    const event = { target: { offsetHeight: 450, scrollTop: 20, scrollHeight: 480 } };
    component.scroll(event);
    expect(component.loadData).toHaveBeenCalled();

    component.pageEvent.pageIndex = 1;
    component.scroll(event);
    expect(component.infinteScrollLoading).toBe(false);
  });
  it('loadData()', () => {
    spyOn(component, 'getLazyData').and.returnValue(of({ data: [], totalCount: 0 }));
    component.ngOnInit();
    component.searchKey = 'cust';
    component.loadData([]);
    expect(component.getLazyData).toHaveBeenCalledWith(0, 10, component.searchKey);
    expect(component.infinteScrollLoading).toBeFalse();
  });
  it('resetPageEvent()', () => {
    component.ngOnInit();
    component.resetPageEvent();
    expect(component.pageEvent.pageIndex).toEqual(0);
    expect(component.pageEvent.pageSize).toEqual(10);
    expect(component.pageEvent.totalCount).toEqual(0);
  });
  it('should have queryParam', fakeAsync(() => {
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
    discardPeriodicTasks();
    expect(component.currentFilterSettings.length).toBe(1);
  }));

  it('close()', () => {
    spyOn(router, 'navigate');
    component.close();
    expect(router.navigate).toHaveBeenCalledWith([{ outlets: { sb: null } }], {
      queryParamsHandling: 'preserve',
    });
  });

  it('clearAllFilters()', async () => {
    spyOn(globalDialogService, 'confirm');
    component.clearAllFilters();

    expect(globalDialogService.confirm).toHaveBeenCalled();
  });
});
