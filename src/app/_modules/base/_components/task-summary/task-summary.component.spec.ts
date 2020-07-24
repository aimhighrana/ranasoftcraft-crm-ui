import { async, ComponentFixture, TestBed, tick, fakeAsync } from '@angular/core/testing';
import { TaskSummaryComponent } from './task-summary.component';
import { AppMaterialModuleForSpec } from 'src/app/app-material-for-spec.module';
import { RouterTestingModule } from '@angular/router/testing';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { TaskDetailsComponent } from '../task-details/task-details.component';
describe('TaskSummaryComponent', () => {
  let component: TaskSummaryComponent;
  let fixture: ComponentFixture<TaskSummaryComponent>;
  let location;
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
        AppMaterialModuleForSpec,
        RouterTestingModule.withRoutes([{ path: 'home/task-details/:wfid/:eventCode', component: TaskDetailsComponent }])
      ],
      declarations: [TaskSummaryComponent],
      providers: [Location]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TaskSummaryComponent);
    component = fixture.componentInstance;
    currentTask.taskid = '123';
    currentTask.wfid = '01919191991';
    currentTask.eventCode = '5';
    component.currentTask = currentTask;
    fixture.detectChanges();
    component.ngOnInit();
    TestBed.inject(Router);
    // router = TestBed.inject(Router);
    location = TestBed.inject(Location);
  });

  it('should call ngOnInit()', () => {
    expect(component.taskId).toBe('123');
    expect(component.wfid).toBe('01919191991')
    expect(component.eventCode).toBe('5')
  });

  it('should call navigateToDetailsPage()', fakeAsync(() => {
    component.navigateToDetailsPage();
    fixture.detectChanges();
    tick();
    expect(location.path()).toBe(`/home/task-details/${component.wfid}/${component.eventCode}`);
  }));

  it('should call closeDetails',()=>{
    const emiiter = spyOn(component.closeDetails,'emit');
    component.closeDetailsModal();
    expect(emiiter).toHaveBeenCalledWith(true)
  })
});
