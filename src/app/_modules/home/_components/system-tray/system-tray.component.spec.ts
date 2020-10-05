import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';
import { AppMaterialModuleForSpec } from 'src/app/app-material-for-spec.module';

import { SystemTrayComponent } from './system-tray.component';

describe('SystemTrayComponent', () => {
  let component: SystemTrayComponent;
  let fixture: ComponentFixture<SystemTrayComponent>;
  let userSpy;
  let notificationSpy;
  let updateNotiticationSpy;
  let deleteNotificationSpy;
  let jobqueueSpy;
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [SystemTrayComponent],
      imports: [AppMaterialModuleForSpec, RouterTestingModule]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SystemTrayComponent);
    component = fixture.componentInstance;
    userSpy = spyOn(component.userService, 'getUserDetails').and.callFake(() => {
      return of({
        firstName: '',
        lastName: '',
        currentRoleId: '',
        fullName: '',
        plantCode: '',
        userName: '',
        dateformat: '',
        email: '',
        assignedRoles: []
      })
    });
    notificationSpy = spyOn(component.homeService, 'getNotifications').and.callFake(() => {
      return of([])
    });

    updateNotiticationSpy = spyOn(component.homeService, 'updateNotification').and.callFake(() => {
      return of({
        id: '1',
        senderUid: '',
        recieversUid: [],
        recieversMail: '',
        senderMail: '',
        sendTime: '',
        headerText: '',
        contentText: '',
        msgUnread: '',
        isShortenedText: '',
        objectId: '',
        objectType: '',
        acknowledgementRequired: '',
        acknowledmentStatus: '',
        downloadLink: 'abcd'
      })
    })

    deleteNotificationSpy = spyOn(component.homeService, 'deleteNotification').and.callFake(() => {
      return of([])
    });

    jobqueueSpy = spyOn(component.homeService, 'getJobQueue').and.callFake(() => {
      return of([
        {
          jobPk: {
            jobId: '',
            status: '',
          },
          initiatedBy: 'Admin',
          processType: '',
          startDate: '',
          endDate: '',
          logMessage: '',
          plantCode: '',
        }
      ])
    })
    component.userDetails = {
      firstName: '',
      lastName: '',
      currentRoleId: '',
      fullName: '',
      plantCode: '',
      userName: '',
      dateformat: '',
      email: '',
      assignedRoles: []
    }
  });

  it('should create', async () => {
    expect(component).toBeTruthy();
    component.ngOnInit();
    expect(userSpy).toHaveBeenCalled();
    expect(notificationSpy).toHaveBeenCalled();
  });

  it('should call updateNotification', async () => {
    const notification = {
      id: '',
      senderUid: 'Admin',
      recieversUid: [],
      recieversMail: '',
      senderMail: '',
      sendTime: '',
      headerText: '',
      contentText: '',
      msgUnread: '',
      isShortenedText: '',
      objectId: '',
      objectType: '',
      acknowledgementRequired: '',
      acknowledmentStatus: '',
      downloadLink: ''
    }
    component.updateNotification(notification);
    expect(notification.msgUnread).toBe('1');
    expect(updateNotiticationSpy).toHaveBeenCalled();
  });

  it('should call paginateNotification', async () => {
    component.notificationPagination.from = 0;
    component.notificationPagination.to = 0;
    component.paginateNotification();
    expect(notificationSpy).toHaveBeenCalled();
  });

  it('should delete notification', async () => {
    component.deleteNotification('1');
    expect(component.jobQueueData.length).toEqual(0)
    expect(deleteNotificationSpy).toHaveBeenCalled();
  });

  it('should call jobqueue', async () => {
    component.getJobsQueue();
    expect(jobqueueSpy).toHaveBeenCalled();
    expect(component.jobQueueData[0].initiatedBy).toEqual('A');
    expect(component.jobQueueData.length).toEqual(1)
  });
});