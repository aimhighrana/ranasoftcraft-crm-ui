import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TaskListComponent } from './task-list.component';
import { AppMaterialModuleForSpec } from 'src/app/app-material-for-spec.module';
import { RouterTestingModule } from '@angular/router/testing';
import { FormatTableHeadersPipe } from '@shared/_pipes/format-table-headers.pipe';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

describe('TaskListComponent', () => {
  let fixture: ComponentFixture<TaskListComponent>;
  let component: TaskListComponent;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [AppMaterialModuleForSpec, RouterTestingModule],
      declarations: [TaskListComponent, FormatTableHeadersPipe],
      providers: [
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

  it('getColumns() should get columns', async(() => {
    component.getColumns();
    fixture.detectChanges();
    expect(component.getColumns).not.toBe(null)
  }))

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

  it('checkForSummaryTaskId() should have summary id in url and set value to true', () => {
    component.checkForSummaryTaskId();
    expect(component.showTaskDetails).toBe(true);
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

  it('updateColumns() should changw columns', () => {
    component.updateColumns([]);
    expect(component.tableColumns).toEqual([])
  });

  it('updateFilters() should return', () => {
    expect(component.updateFilters(true)).toBe(true);
  });
})
