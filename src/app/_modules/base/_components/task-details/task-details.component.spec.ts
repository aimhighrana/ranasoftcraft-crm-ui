import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';

import { TaskDetailsComponent } from './task-details.component';
import { AppMaterialModuleForSpec } from 'src/app/app-material-for-spec.module';
import { RouterTestingModule } from '@angular/router/testing';
import { SharedModule } from '@modules/shared/shared.module';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TaskListService } from '@services/task-list.service';
import { ActivatedRoute } from '@angular/router';

import { TaskListComponent } from '../task-list/task-list.component';
import { UserService } from '@services/user/userservice.service';
import { TaskMetaData, TaskListSummaryRequestParams } from '@models/task-list/taskListDetails';
import { of } from 'rxjs/internal/observable/of';
import { Userdetails } from '@models/userdetails';
import { MatTabGroup, MatTabChangeEvent } from '@angular/material/tabs';
import { By } from '@angular/platform-browser';
import { GeneralInformationTabComponent } from '../general-information-tab/general-information-tab.component';
import { AttachmentTabComponent } from '../attachment-tab/attachment-tab.component';
import { HistoryTabComponent } from '../history-tab/history-tab.component';

describe('TaskDetailsComponent', () => {
    let component: TaskDetailsComponent;
    let fixture: ComponentFixture<TaskDetailsComponent>;
    let editSpy;
    let snackbarSpy;
    let layoutDataSpy;
    let historyServiceSpy;
    let getChangeAuditLogDetailsSpy;
    const responseFromServiceForTaskMetadata: TaskMetaData = {
        objectNumber: 'ERSA2528',
        objectType: '1005',
        plantCode: 'MDO1003',
        roleId: '663065348460318692',
        taskId: '685400050146256611',
        userName: 'DemoApp',
        wfid: '663065348460310000',
        eventCode: '5'
    }

    const sampleHistoryData = [{
        taskId: '685400050146256611',
        crId: null,
        description: null,
        stepDetails: {
            wfId: '634110100146256775',
            user: 'DemoRev',
            role: '653452338460307756',
            receivedOn: '06.25.2020 10:25:27',
            actionedOn: '06.25.2020 10:25:27',
            status: 'APP',
            workflowPath: 'WF38',
            stepId: '02',
            slaHours: '8',
            workflowDescription: 'Prospecta Tenant- Material Process',
            stepText: 'Material Review',
            eventId: null
        }
    }]
    const routeValue = {
        snapshot: {
            params: {
                wfid: '663065348460310000',
                eventCode: '5'
            }
        },
        routeConfig: {
            path: 'home/task-list/myTasks/685400050146256611'
        }
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

    beforeEach(fakeAsync(() => {
        // userSvcSpy = jasmine.createSpyObj('UserService', ['getUserDetails'])
        TestBed.configureTestingModule({
            imports: [
                AppMaterialModuleForSpec,
                RouterTestingModule,
                SharedModule,
                HttpClientTestingModule,
                RouterTestingModule.withRoutes([])
            ],
            declarations: [
                TaskDetailsComponent,
                GeneralInformationTabComponent,
                HistoryTabComponent,
                AttachmentTabComponent
            ],
            providers: [
                HttpClientTestingModule,
                TaskListService,
                TaskDetailsComponent,
                TaskListComponent,
                UserService,
                {
                    provide: ActivatedRoute,
                    useValue: routeValue
                }, {
                    provide: MatTabGroup,
                    useValues: {
                        selectedIndex: 0,
                    }
                }
            ]
        }).compileComponents();
        fixture = TestBed.createComponent(TaskDetailsComponent);
        component = fixture.componentInstance;
        component.metadataByWfid = responseFromServiceForTaskMetadata;
        editSpy = spyOn(component.enableEditing, 'emit').and.callFake(() => {
            return of([])
        })
        snackbarSpy = spyOn(component.utilities, 'showSnackBar').and.callFake(() => {
            return of([])
        })
        layoutDataSpy = spyOn(component.taskListService, 'getCommonLayoutData').and.callFake(() => {
            return of(sampleHistoryData)
        });
        historyServiceSpy = spyOn(component.taskListService, 'getAuditLogs').and.callFake(() => {
            return of(sampleHistoryData)
        })
        getChangeAuditLogDetailsSpy = spyOn(component.taskListService, 'getChangeAuditLogDetails').and.callFake(() => {
            return of([])
        })
        spyOn(component.userService, 'getUserDetails').and.callFake(() => {
            return of(userDetailsobject)
        });
        component.userDetails = userDetailsobject;
        tick();
    }));

    it('should call getTaskMetaData()', async () => {
        component.userDetails = userDetailsobject
        fixture = TestBed.createComponent(TaskDetailsComponent);
        component = fixture.componentInstance;
        component.wfid = '585034355227355208';
        const metaDataSpy = spyOn(component.taskListService, 'getMetadataByWfid').and.callFake(() => {
            return of(responseFromServiceForTaskMetadata)
        });
        component.getTaskMetaData();
        expect(metaDataSpy).toHaveBeenCalledWith(component.wfid);
        expect(component.metadataByWfid).toEqual(responseFromServiceForTaskMetadata)
    });

    it('should call getHistoryData()', async () => {
        component.getHistoryData();
        expect(historyServiceSpy).toHaveBeenCalledWith(component.metadataByWfid.objectType, component.metadataByWfid.taskId, 'en')
        expect(component.auditLogData).not.toBe(null);
    });

    it('should call getChangeLogDetails()', async () => {
        const requestParams = {
            taskId: '123',
            userName: 'demoapp',
            language: 'en'
        }
        component.getChangeLogDetails(requestParams.taskId, requestParams.userName);
        expect(getChangeAuditLogDetailsSpy).toHaveBeenCalledWith(requestParams.taskId, requestParams.userName, requestParams.language)
    });

    it('should enable editing', async () => {
        component.userDetails = userDetailsobject;
        component.enableGIEditing(true);
        expect(editSpy).toHaveBeenCalledWith(true);
        expect(snackbarSpy).toHaveBeenCalledWith('Editing Enabled', 'Okay')
        component.userDetails = userDetailsobject;
        component.enableGIEditing(false);
        expect(editSpy).toHaveBeenCalledWith(false);
        expect(snackbarSpy).toHaveBeenCalledWith('Editing Saved!', 'Okay')
    });

    it('should call getMetaData', async () => {
        component.userDetails = userDetailsobject;
        component.wfid = responseFromServiceForTaskMetadata.wfid;

        const requestObject: TaskListSummaryRequestParams = {
            plantCode: 'MDO1003',
            userRole: '663065348460318692',
            userId: 'DemoApp',
            lang: 'en',
            taskId: '685400050146256611',
            wfId: responseFromServiceForTaskMetadata.wfid,
            objectnumber: 'ERSA2528',
            objecttype: '1005',
            eventCode: '5',
        }
        component.getMetaData();
        expect(layoutDataSpy).toHaveBeenCalledWith(requestObject);
    });

    it('should change tabs', async () => {
        let tabGroup;
        if (fixture.debugElement.query(By.css('mat-tab-group'))) {
            tabGroup = fixture.debugElement.query(By.css('mat-tab-group')).componentInstance;
        }
        component.userDetails = userDetailsobject;
        const tabs = tabGroup._elementRef.nativeElement.children;
        tabs[0].click();
        expect(component.selectedTabIndex).toBe(0);
    });

    it('should call ngAfterViewInit', async () => {
        const e = new MatTabChangeEvent();
        /** metadata */
        e.index = 0
        const getMetaDataSpy = spyOn(component, 'getMetaData');
        component.toggleTabs(e);
        expect(getMetaDataSpy).toHaveBeenCalled();

        /**
         * history
         */
        e.index = 1;
        const historySpy = spyOn(component, 'getHistoryData');
        component.toggleTabs(e);
        expect(historySpy).toHaveBeenCalled();

        // call for attachment will be added once attachment api is added
    })
});
