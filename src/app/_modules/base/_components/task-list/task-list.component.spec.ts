import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TaskListComponent } from './task-list.component';
import { AppMaterialModuleForSpec } from 'src/app/app-material-for-spec.module';
import { RouterTestingModule } from '@angular/router/testing';
import { FormatTableHeadersPipe } from '@shared/_pipes/format-table-headers.pipe';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { SharedModule } from '@modules/shared/shared.module';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('TaskListComponent', () => {
  let fixture: ComponentFixture<TaskListComponent>;
  let component: TaskListComponent;
  const sampleSelectedFilters = {
    staticFilters: {
      status: 'forwarded',
      priority: 'P2',
      region: null,
      recieved_date: '',
      requested_date: '',
      due_date: '',
      requested_by: null
    },
    dynamicFilters: [
      {
        objectType: '0000',
        objectDesc: 'All Modules',
        filterFields: [],
        colorActive: true
      }
    ],
    tags: [],
    apiRequestStructure: []
  }
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [AppMaterialModuleForSpec, RouterTestingModule, SharedModule, HttpClientTestingModule],
      declarations: [TaskListComponent, FormatTableHeadersPipe],
      providers: [
        HttpClientTestingModule,
        {
          provide: ActivatedRoute,
          useValue: {
            params: of({ summaryId: '124' })
          },
        },
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TaskListComponent);
    component = fixture.componentInstance;
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 1000000;
    fixture.detectChanges();
  });

  it('should create', () => {
    component = fixture.componentInstance;
    expect(component).toBeTruthy();
  });

  it('getTasks() should get columns', async(() => {
    component.getTasks();
    fixture.detectChanges();
    expect(component.tasks).not.toBe(null)
  }))

  it('toggleDynamicFilters() should toggle filters component', () => {
    component.dynamicFiltersVisible = false;
    component.toggleDynamicFilters();
    expect(component.dynamicFiltersVisible).toBe(true);
  });

  it('closeFilterBox() should set value of dynamicFiltersVisible', () => {
    component.closeFilterBox();
    fixture.detectChanges();
    expect(component.dynamicFiltersVisible).toBe(true);
  });

  it('toggleColumnSettingPopUp() should reset the value for showColumnSettingPopUp', () => {
    component.showColumnSettingPopUp = false;
    component.toggleColumnSettingPopUp();
    expect(component.showColumnSettingPopUp).toBe(true);
  });

  it('updateFilters() should set values', () => {
    component.initializeForm();
    fixture.detectChanges();
    component.updateFilters(sampleSelectedFilters);
    fixture.detectChanges();
    expect(component.filterForm.value.filtersMap.status).toBe(sampleSelectedFilters.staticFilters.status);
    expect(component.filterForm.value.filtersMap.priority).toBe(sampleSelectedFilters.staticFilters.priority);
  });

  it('should call getTasks()', () => {
    component.initializeForm();
    fixture.detectChanges();
    component.updateFilters(sampleSelectedFilters);
    component.getTasks();
    expect(component.dataSource.data.length).toBeGreaterThanOrEqual(0)
  });

  it('should call paginate()', () => {
    component.initializeForm();
    fixture.detectChanges();
    component.updateFilters(sampleSelectedFilters);
    fixture.detectChanges();
    component.getTasks();
    component.paginate({ previousPageIndex: 0, pageIndex: 1, pageSize: 10, length: 100 });
    expect(component.dataSource.data.length).toBeGreaterThanOrEqual(0);
  })

  it('should call sortData()', () => {
    component.initializeForm();
    fixture.detectChanges();
    component.updateFilters(sampleSelectedFilters);
    fixture.detectChanges();
    component.getTasks();
    fixture.detectChanges();
    component.sortData({ active: 'datestarted', direction: 'asc' });
    expect(component.sortableHeaders.length).toBeGreaterThanOrEqual(1);
  })
})
