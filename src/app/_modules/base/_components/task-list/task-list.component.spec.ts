import { async, ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { TaskListComponent } from './task-list.component';
import { AppMaterialModuleForSpec } from 'src/app/app-material-for-spec.module';
import { RouterTestingModule } from '@angular/router/testing';
import { FormatTableHeadersPipe } from '@shared/_pipes/format-table-headers.pipe';
import { SharedModule } from '@modules/shared/shared.module';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TaskListService } from '@services/task-list.service';
import { FormGroup, FormControl } from '@angular/forms';
import { of, Subscription, Subject, BehaviorSubject } from 'rxjs';
import { Pagination } from '@models/task-list/pagination';
import { MatTabGroup } from '@angular/material/tabs';
import { UserService } from '@services/user/userservice.service';
import { By } from '@angular/platform-browser';
import { Userdetails } from '@models/userdetails';
import { SaveSearchDialogComponent } from '../save-search-dialog/save-search-dialog.component';


describe('TaskListComponent', () => {
  let fixture: ComponentFixture<TaskListComponent>;
  let component: TaskListComponent;
  const taskListResponse = [
    {
      wfid: '239806156229368596',
      status: 'REJ',
      taskid: '242554497793480912',
      uploadid: null,
      objectid: 'ERSA1889',
      objecttype: '1005',
      objectdesc: 'Material',
      rejecttext: '',
      rejectioncomment: '',
      emailtext: '<OBJECTNUMBER>ERSA1889  has been created and sent for your approval ',
      entrycheck: '1',
      fname: 'Demo Approver',
      imageurl: null,
      duedate: new Date(),
      datestarted: new Date(),
      claimable: 'false',
      stepId: '01',
      claimed: '',
      workflowPath: 'WF53',
      rejectionType: 'Rejection Type : 1--Material already exists- Duplicate Record',
      requestorName: 'Demo Initiator',
      requestorDate: new Date(),
      eventId: 'Create',
      senderRole: null,
      forwardEnabled: '0',
      profilePicSNO: '',
      massDumpDescription: '',
      staticPriority: 'P4',
      dynamicPriority: 'P5',
      priorityType: 'STATIC',
      roleid: null,
      guiActivate: 'off',
      priorityEditable: '0',
      eventCode: '1',
      delegateStatus: null,
      totalCount: null,
      tags: []
    }
  ]

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
      },
    ],
    tags: [],
    apiRequestStructure: [
      {
        objectId: '100',
        fieldData: {
          fieldId: 'BR103',
          filterList: []
        }
      }
    ]
  }

  const userDetailsobject: Userdetails = {
    userName: 'DemoApp',
    firstName: 'Demo',
    lastName: 'Approver',
    email: 'prostenant@gmail.com',
    plantCode: 'MDO1003',
    currentRoleId: '663065348460318692',
    dateformat: 'dd.mm.yy',
    fullName: 'Demo Approver',
    assignedRoles: [
      {
        defaultRole: '1',
        roleDesc: 'DemoApprover',
        roleId: '663065348460318692',
        sno: '521017956918018560',
        userId: 'DemoApp'
      },
      {
        defaultRole: '0',
        roleDesc: 'DemoApprover2',
        roleId: '143739996174018010',
        sno: '867216031918019200',
        userId: 'DemoApp'
      }
    ]
  }

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [AppMaterialModuleForSpec, RouterTestingModule, SharedModule, HttpClientTestingModule],
      declarations: [TaskListComponent, FormatTableHeadersPipe],
      providers: [
        HttpClientTestingModule,
        TaskListService,
        UserService,
        RouterTestingModule,
        {
          provide: MatTabGroup,
          useValues: {
            selectedIndex: 0,
          }
        }
      ]
    }).compileComponents();
    fixture = TestBed.createComponent(TaskListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    fixture.whenStable();
    spyOn(component.userService, 'getUserDetails').and.callFake(() => {
      return of(userDetailsobject)
    });
    component.taskListSubscription = new Subscription();
    component.userDetailSubscription = new Subscription();
    component.filterEmitter = new BehaviorSubject({});
    component.enableDragging = new Subject();
    component.routerSubscription = new Subscription();
  }));

  it('should create', async () => {
    component = fixture.componentInstance;
    expect(component).toBeTruthy();
  });

  it('should call ngOnInit', async () => {
    component.ngOnInit();
    expect(component.filterForm.controls).not.toBe(null)
  });

  it('should call service', async () => {
    component.initializeForm()
    const filter = {
      objectToLoad: ['ALL'],
      fetchSize: 10,
      fetchCount: 0,
      sortField: [],
      filtersMap: { wildCardSearch: '' }
    }

    component.filterForm.controls.objectToLoad.setValue(filter.objectToLoad);
    component.filterForm.controls.fetchSize.setValue(filter.fetchSize);
    component.filterForm.controls.sortField.setValue(filter.sortField);

    const taskListSpy = spyOn(component.taskListService, 'getTasks').and.callFake(() => {
      return of(taskListResponse);
    });
    const taskListCountSpy = spyOn(component.taskListService, 'getTaskListCount').and.callFake(() => {
      return of(49)
    });
    component.selectedTaskId = '242554497793480912'

    component.getTasks();
    expect(taskListSpy).toHaveBeenCalled()
    expect(taskListCountSpy).toHaveBeenCalled();
    expect(component.dataSource.data.length).toEqual(taskListResponse.length)
    expect(component.paginationLimit).toEqual(49);
    expect(component.currentTask).toBe(taskListResponse[0])
  });

  it('should call paginate()', async () => {
    component.initializeForm()
    const filter = {
      objectToLoad: ['ALL'],
      fetchSize: 10,
      fetchCount: 0,
      sortField: [],
      filtersMap: { wildCardSearch: '' }
    }

    component.filterForm.controls.objectToLoad.setValue(filter.objectToLoad);
    component.filterForm.controls.fetchSize.setValue(filter.fetchSize);
    component.filterForm.controls.sortField.setValue(filter.sortField);

    const taskListSpy = spyOn(component.taskListService, 'getTasks').and.callFake(() => {
      return of(taskListResponse);
    });
    const taskListCountSpy = spyOn(component.taskListService, 'getTaskListCount').and.callFake(() => {
      return of(49)
    });
    const event: Pagination = {
      length: 0,
      pageIndex: 10,
      pageSize: 100,
      previousPageIndex: 10
    }
    component.paginate(event);
    expect(taskListSpy).toHaveBeenCalled();
    expect(taskListCountSpy).toHaveBeenCalled();
  });

  it('toggleDynamicFilters() should toggle filters component', async () => {
    component.dynamicFiltersVisible = false;
    component.toggleDynamicFilters();
    expect(component.dynamicFiltersVisible).toBe(true);
  });

  it('should closeFilterBox', async () => {
    component.closeFilterBox();
    expect(component.dynamicFiltersVisible).toEqual(true)
  });

  it('should call toggleColumnSettingPopUp()', async () => {
    component.showColumnSettingPopUp = false;
    component.toggleColumnSettingPopUp();
    expect(component.showColumnSettingPopUp).toBe(true);
  });

  it('should call closeDetailsModal()', async () => {
    component.tableColumns = [{ visible: false }];
    component.closeDetailsModal();
    expect(component.showTaskDetails).toBe(false);
    expect(component.selectedTaskId).toBe(null);
  });


  it('should call sortData()', async () => {
    component.initializeForm();
    component.filterForm = new FormGroup({
      objectToLoad: new FormControl(['ALL']),
      fetchSize: new FormControl(10), // per page no of items
      fetchCount: new FormControl(0), // page id
      sortField: new FormControl([]),
      filtersMap: new FormControl({ wildCardSearch: '' })
    });
    component.updateFilters(sampleSelectedFilters);
    component.getTasks();
    component.sortData({ active: 'datestarted', direction: 'asc' });
    expect(component.sortableHeaders.length).toBeGreaterThanOrEqual(1);
  });


  it('updateFilters() should set values', async () => {
    component.initializeForm();
    fixture.detectChanges();
    component.updateFilters(sampleSelectedFilters);
    fixture.detectChanges();
    expect(component.filterForm.value.filtersMap.status).toBe(sampleSelectedFilters.staticFilters.status);
    expect(component.filterForm.value.filtersMap.priority).toBe(sampleSelectedFilters.staticFilters.priority);
  });


  it('should call performOperationOnViews()', async () => {
    TestBed.createComponent(TaskListComponent); // this is the trigger of constructor method
    fixture.detectChanges();
    const operationObject = {
      type: 'create',
      data: {
        viewId: '967589022265877187',
        viewName: 'top 6 only',
        fieldId: [
          'datestarted',
          'duedate',
          'requestorName',
          'taskid',
          'fname',
          'emailtext'
        ],
        fields: [],
        default: false,
        active: false
      }
    };

    /**
     * for Create
     */
    const taskListServiceSpy = spyOn(component.taskListService, 'saveTaskListView').and.callThrough();
    component.performOperationOnViews(operationObject);
    expect(taskListServiceSpy).toHaveBeenCalledWith(operationObject.data);

    /**
     * for Update
     */
    const updateListServiceSpy = spyOn(component.taskListService, 'updateTaskListView').and.callThrough();
    operationObject.type = 'update';
    component.performOperationOnViews(operationObject);
    expect(updateListServiceSpy).toHaveBeenCalledWith(operationObject.data);

    /**
     * for Delete
     */
    const deleteListServiceSpy = spyOn(component.taskListService, 'deleteTaskListItem').and.callThrough();
    operationObject.type = 'delete';
    component.performOperationOnViews(operationObject);
    expect(deleteListServiceSpy).toHaveBeenCalledWith(operationObject.data.viewId);
    /**
     * checking response should not be null, it can be 0 but not null
     * because initally user may not have any views
     */
    expect(component.taskListViews.length).toBeGreaterThanOrEqual(0);
  });

  it('should call getDefaultViews()', fakeAsync(() => {
    const taskListServiceObj = fixture.debugElement.injector.get(TaskListService);
    spyOn(taskListServiceObj, 'getTasklListViews').and.callFake(() => {
      return of([])
    });
    fixture.detectChanges();
    component.getDefaultViews();
    tick()
    expect(component.userDetails).not.toBe(null);
    expect(taskListServiceObj.getTasklListViews).toHaveBeenCalled();
    expect(component.taskListViews.length).toBeGreaterThanOrEqual(0);
  }));

  it('should set setActiveView', async () => {
    component.setActiveView('12');
    expect(component.activeViewId).toBe('12')
  });

  it('should call getTaskDetails()', async () => {
    component.tabGroup.selectedIndex = 0;
    component.getTaskDetails(taskListResponse[0]);
    expect(component.userDetails).not.toBe(null)
  });

  it('should call doWildSearch()', async () => {
    const wildcardSearchSpy = spyOn(component, 'doWildSearch');
    const txtField = fixture.debugElement.query(By.css('#wildSearchField'));
    txtField.triggerEventHandler('keyup', {
      target: {
        value: 'e'
      }
    });
    fixture.whenStable();
    expect(wildcardSearchSpy).toHaveBeenCalled();
  });

  it('should call getFilters()', fakeAsync(() => {
    component.getFilters();
    expect(component.dynamicFiltersVisible).toBe(false);

    component.dynamicFiltersVisible = false;
    const spy = spyOn(component.taskListService, 'getDynamicFilters').and.callFake(() => {
      return of([])
    })
    component.getFilters();
    tick(); // Add this
    expect(spy).toHaveBeenCalled();

  }));
  it('shoudl call openDialog', () => {
    const dialogSpy = spyOn(component.dialog,'open');
    component.openDialog();
    expect(dialogSpy).toHaveBeenCalledWith(SaveSearchDialogComponent)
  })
})
