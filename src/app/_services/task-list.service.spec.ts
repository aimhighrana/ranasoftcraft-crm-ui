import { TestBed, fakeAsync } from '@angular/core/testing';
import { TaskListService } from './task-list.service';
import { AppMaterialModuleForSpec } from '../app-material-for-spec.module';
import { HttpClientModule } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TaskListViewObject } from '@models/task-list/columnSetting';

describe('TaskListService', () => {
  let service: TaskListService;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [TaskListService, HttpClientModule, HttpClientTestingModule],
      imports: [AppMaterialModuleForSpec, HttpClientTestingModule, HttpClientModule],
    });
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  it('should be created', () => {
    service = TestBed.inject(TaskListService)
    expect(service).toBeTruthy();
  });

  it('should call getTasklListViews()', fakeAsync(() => {
    service = TestBed.inject(TaskListService);
    service.getTasklListViews('DemoApp').subscribe((response) => {
      // checking null as there can be do views as well
      expect(response).not.toBe(null)
    });

    const testurl = service.endpointService.getTaskListViewsUrl('DemoApp')
    const req = httpTestingController.expectOne(testurl);
    const mockhttpData = [] as TaskListViewObject[];
    expect(req.request.method).toEqual('GET');
    req.flush(mockhttpData);
    // verify http
    httpTestingController.verify();
  }));

  it('should call deleteTaskListItem()', () => {
    service = TestBed.inject(TaskListService);
    service.deleteTaskListItem('591446167348980453').subscribe((response) => {
      expect(response).not.toBe(null)
    });

    const testurl = service.endpointService.getDeleteTaskListViewUrl('591446167348980453')
    const req = httpTestingController.expectOne(testurl);
    expect(req.request.method).toEqual('DELETE');
    httpTestingController.verify();
  });


  it('should call saveTaskListView()', () => {
    service = TestBed.inject(TaskListService);

    const requestJSON = {
      userCreated: 'DemoApp',
      viewId: null,
      viewName: 'test for test case',
      plantCode: 'MDO1003',
      fieldId: [],
      default: null,
      fields: [
        {
          fieldId: 'fname',
          order: 1
        },
        {
          fieldId: 'duedate',
          order: 2
        },
        {
          fieldId: 'objectdesc',
          order: 3
        },
        {
          fieldId: 'taskid',
          order: 4
        },
        {
          fieldId: 'datestarted',
          order: 5
        },
        {
          fieldId: 'emailtext',
          order: 6
        }
      ]
    }
    service.saveTaskListView(requestJSON).subscribe((response) => {
      expect(response).toBe('Record is Successfully saved')
    });

    const testurl = service.endpointService.getSaveTaskListURL()
    const req = httpTestingController.expectOne(testurl);
    expect(req.request.method).toEqual('POST');
    httpTestingController.verify();
  });

  it('should call updateTaskListView()', () => {
    service = TestBed.inject(TaskListService);

    const requestJSON = {
      userCreated: 'DemoApp',
      viewId: '789050838156482977',
      viewName: 'test for test case',
      plantCode: 'MDO1003',
      fieldId: [],
      default: null,
      fields: [
        {
          fieldId: 'fname',
          order: 1
        },
        {
          fieldId: 'duedate',
          order: 2
        },
        {
          fieldId: 'objectdesc',
          order: 3
        },
        {
          fieldId: 'taskid',
          order: 4
        },
        {
          fieldId: 'datestarted',
          order: 5
        },
        {
          fieldId: 'emailtext',
          order: 6
        }
      ]
    }
    service.saveTaskListView(requestJSON).subscribe((response) => {
      expect(response).toBe('Record is Successfully saved')
    });

    const testurl = service.endpointService.getSaveTaskListURL()
    const req = httpTestingController.expectOne(testurl);
    expect(req.request.method).toEqual('POST');
    httpTestingController.verify();
  });
});
