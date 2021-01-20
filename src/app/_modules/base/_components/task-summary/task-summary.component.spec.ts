import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { TaskSummaryComponent } from './task-summary.component';
import { AppMaterialModuleForSpec } from 'src/app/app-material-for-spec.module';
import { RouterTestingModule } from '@angular/router/testing';
import { Location } from '@angular/common';
import { TaskDetailsComponent } from '../task-details/task-details.component';
import { GeneralInformationTabComponent } from '../general-information-tab/general-information-tab.component';
import { AttachmentTabComponent } from '../attachment-tab/attachment-tab.component';
import { HistoryTabComponent } from '../history-tab/history-tab.component';
import { SharedModule } from '@modules/shared/shared.module';
describe('TaskSummaryComponent', () => {
  let component: TaskSummaryComponent;
  let fixture: ComponentFixture<TaskSummaryComponent>;
  const currentTask = {
    wfid: '',
    uploadid: '',
    status: '',
    rejecttext: '',
    rejectioncomment: '',
    entrycheck: '',
    fname: '',
    imageurl: '',
    claimable: '',
    stepId: '',
    claimed: '',
    workflowPath: '',
    rejectionType: '',
    eventId: '',
    senderRole: '',
    forwardEnabled: '',
    profilePicSNO: '',
    massDumpDescription: '',
    staticPriority: '',
    dynamicPriority: '',
    roleid: '',
    guiActivate: '',
    priorityEditable: '',
    eventCode: '',
    delegateStatus: '',
    totalCount: '',
    taskid: '',
    objectid: '',
    objecttype: '',
    objectdesc: '',
    duedate: new Date(),
    datestarted: new Date(),
    requestorName: '',
    requestorDate: new Date(),
    priorityType: '',
    emailtext: '',
    tags: []
  }

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        AppMaterialModuleForSpec, SharedModule,
        RouterTestingModule.withRoutes([{ path: 'home/task-details/:wfid/:eventCode', component: TaskDetailsComponent }])
      ],
      declarations: [TaskSummaryComponent, TaskDetailsComponent, GeneralInformationTabComponent, AttachmentTabComponent, HistoryTabComponent],
      providers: [Location]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TaskSummaryComponent);
    component = fixture.componentInstance;
    currentTask.taskid = '123';
    currentTask.wfid = '585034355227355208';
    currentTask.eventCode = '5';
    component.currentTask = currentTask;
    component.ngOnInit();
  });

  it('should call ngOnInit()', async () => {
    expect(component.taskId).toBe('123');
    expect(component.wfid).toBe('585034355227355208')
    expect(component.eventCode).toBe('5')
  });

  it('should call navigateToDetailsPage()', async () => {
    const routeSpy = spyOn(component.router, 'navigateByUrl');
    component.navigateToDetailsPage();
    const url = routeSpy.calls.first().args[0];
    expect(url).toBe(`home/task-details/${component.wfid}/${component.eventCode}`);
  });

  it('should call closeDetails', async () => {
    const emiiter = spyOn(component.closeDetails, 'emit');
    component.closeDetailsModal();
    expect(emiiter).toHaveBeenCalledWith(true)
  })
});
