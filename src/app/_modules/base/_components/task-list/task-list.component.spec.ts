import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { TaskListComponent } from './task-list.component';
import { AppMaterialModuleForSpec } from 'src/app/app-material-for-spec.module';
import { RouterTestingModule } from '@angular/router/testing';
import { FormatTableHeadersPipe } from '@shared/_pipes/format-table-headers.pipe';
import { SharedModule } from '@modules/shared/shared.module';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TaskListService } from '@services/task-list.service';

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
        TaskListService
      ]
    }).compileComponents();
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 200000;
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
  });

  it('should call closeDetailsModal()', () => {
    component.closeDetailsModal();
    expect(component.showTaskDetails).toBe(false);
    expect(component.selectedTaskId).toBe(null);
  });

  // it('should call performOperationOnViews()', inject([TaskListService], (taskListService: TaskListService) => {
  //   TestBed.createComponent(TaskListComponent); // this is the trigger of constructor method
  //   fixture.detectChanges();
  //   const operationObject = {
  //     type: 'create',
  //     data: {
  //       viewId: '967589022265877187',
  //       viewName: 'top 6 only',
  //       fieldId: [
  //         'datestarted',
  //         'duedate',
  //         'requestorName',
  //         'taskid',
  //         'fname',
  //         'emailtext'
  //       ],
  //       fields: [],
  //       default: false,
  //       active: false
  //     }
  //   };

  //   /**
  //    * for Create
  //    */
  //   const taskListServiceSpy = spyOn(taskListService, 'saveTaskListView').and.callThrough();
  //   component.performOperationOnViews(operationObject);
  //   expect(taskListServiceSpy).toHaveBeenCalledWith(operationObject.data);

  //   /**
  //    * for Update
  //    */
  //   const updateListServiceSpy = spyOn(taskListService, 'updateTaskListView').and.callThrough();
  //   operationObject.type = 'update';
  //   component.performOperationOnViews(operationObject);
  //   expect(updateListServiceSpy).toHaveBeenCalledWith(operationObject.data);

  //   /**
  //    * for Delete
  //    */
  //   const deleteListServiceSpy = spyOn(taskListService, 'deleteTaskListItem').and.callThrough();
  //   operationObject.type = 'delete';
  //   component.performOperationOnViews(operationObject);
  //   expect(deleteListServiceSpy).toHaveBeenCalledWith(operationObject.data.viewId);

  //   /**
  //    * checking response should not be null, it can be 0 but not null
  //    * because initally user may not have any views
  //    */
  //   expect(component.taskListViews.length).toBeGreaterThanOrEqual(0);
  // }));

  it('should call getDefaultViews()', () => {
    const taskListServiceObj = fixture.debugElement.injector.get(TaskListService);
    spyOn(taskListServiceObj, 'getTasklListViews');
    fixture.detectChanges();
    component.getDefaultViews();
    fixture.detectChanges();
    expect(component.userDetails).not.toBe(null);
    expect(taskListServiceObj.getTasklListViews).toHaveBeenCalled();
    expect(component.taskListViews.length).toBeGreaterThanOrEqual(0);
  })

})
