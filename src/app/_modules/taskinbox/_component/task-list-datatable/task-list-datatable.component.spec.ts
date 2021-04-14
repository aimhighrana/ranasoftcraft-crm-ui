import { SharedServiceService } from '@modules/shared/_services/shared-service.service';
import { PageEvent } from '@angular/material/paginator';
import { of } from 'rxjs';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TaskListDatatableComponent } from './task-list-datatable.component';
import { SharedModule } from '@modules/shared/shared.module';
import { ActivatedRoute, Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { AppMaterialModuleForSpec } from 'src/app/app-material-for-spec.module';

describe('TaskListDatatableComponent', () => {
  let component: TaskListDatatableComponent;
  let fixture: ComponentFixture<TaskListDatatableComponent>;
  let router: Router;
  let sharedServices: SharedServiceService;
  const queryParams = { s: 'inbox', f: 'test' };
  const params = { node: 'inbox' };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [TaskListDatatableComponent],
      imports: [AppMaterialModuleForSpec, RouterTestingModule, SharedModule],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { queryParams: of(queryParams), params: of(params) },
        },
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TaskListDatatableComponent);
    component = fixture.componentInstance;
    sharedServices = fixture.debugElement.injector.get(SharedServiceService);
    router = TestBed.inject(Router);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('should have node inbox', () => {
    expect(component.node).toEqual('inbox');
  });
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

  it('setChipValue()', () => {
    component.currentNodeFilterChips = [
      {
        chip: 'Bookmarked',
        value: '2',
        icon: 'star',
        hasMenu: false,
      },
    ];
    component.setChipValue(
      {
        chip: 'Bookmarked',
        value: '2',
        icon: 'star',
        hasMenu: false,
      },
      5
    );

    expect(component.currentNodeFilterChips).toEqual([
      {
        chip: 'Bookmarked',
        value: '2,5',
        icon: 'star',
        hasMenu: false,
      },
    ]);
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
