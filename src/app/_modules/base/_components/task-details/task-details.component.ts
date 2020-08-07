import { Component, OnInit, Input, ViewChild, OnDestroy, EventEmitter, Output } from '@angular/core';
import { TaskListRow } from '@models/task-list/taskListRow';
import { Userdetails } from '@models/userdetails';
import { Subscription, forkJoin } from 'rxjs';
import { UserService } from '@services/user/userservice.service';
import { TaskListService } from '@services/task-list.service';
import { TaskDetailsMetaData, TaskListSummaryRequestParams, TaskDetailsLayoutData, AuditLog, TaskMetaData, CommonGridRequestObject, GridMetaDataResponse, GridDataResponse } from '@models/task-list/taskListDetails';
import { ActivatedRoute, Router } from '@angular/router';
import { MatTabGroup, MatTabChangeEvent } from '@angular/material/tabs';
import { Utilities } from '@modules/base/common/utilities';


@Component({
  selector: 'pros-task-details',
  templateUrl: './task-details.component.html',
  styleUrls: ['./task-details.component.scss']
})
export class TaskDetailsComponent implements OnInit, OnDestroy {

  /**
   * The current task object
   */
  @Input() currentTask: TaskListRow
  /**
   * the logged in,
   * this is called here and not recieved as input
   * because this page can be used as stand alone page
   */
  userDetails: Userdetails

  /**
   * This is used to store the subsctions
   */
  userDetailSubscription: Subscription;

  /**
   * This is use to store the susbsction of task detail
   */
  taskDetailsSubscription: Subscription;

  /**
   * This stores the layout data
   */
  taskDetailsMetaData: TaskDetailsMetaData[] = [];

  commonSubscription: Subscription;
  /**
   * This stores the layout data
   */
  taskDetailsLayoutData: TaskDetailsLayoutData[] = [];

  detailsData: TaskDetailsMetaData[] = [];

  /**
   * Selected tab index,
   * this is required since the view child gets loaded later
   * so this is to make the DOM aware of the event to catch the selected tab
   */

  selectedTabIndex = 0;

  /**
   * This is a view child object to get the tabs data
   */
  @ViewChild('tabs', { static: false }) tabGroup: MatTabGroup;

  detailDataEmitter = new EventEmitter();
  /**
   * This is to store the history data
   */
  auditLogData: AuditLog[] = [];

  metadataByWfid: TaskMetaData = {
    roleId: '',
    objectNumber: '',
    plantCode: '',
    userName: '',
    taskId: '',
    objectType: '',
    wfid: '',
    eventCode: ''
  }
  editGI = false;

  /**
   * Reciver to update the GI
   */
  @Output() enableEditing: EventEmitter<boolean> = new EventEmitter<boolean>();

  /**
   * Wfid from url or from input
   */
  @Input() wfid: string;

  /**
   * EventCode from url or from input
   */
  @Input() eventCode: string;

  /**
   * subscription to get history
   */
  historySubscription: Subscription;

  /**
   * constructor of class
   * @param userService user service object
   * @param taskListService task list object
   */
  constructor(
    public userService: UserService,
    public taskListService: TaskListService,
    public utilities: Utilities,
    public router: Router,
    public activatedRoute: ActivatedRoute) {
    this.commonSubscription = new Subscription();
  }

  /**
   * Angular webhooks
   */
  ngOnInit(): void {
    if (!this.wfid && !this.eventCode) {
      this.wfid = this.activatedRoute.snapshot.params.wfid;
      this.eventCode = this.activatedRoute.snapshot.params.eventCode;
    }

    const userDetailSubscription = this.userService.getUserDetails().subscribe((userdetails: Userdetails) => {
      this.userDetails = userdetails;
      if (this.wfid && this.eventCode && this.userDetails) {
        this.getTaskMetaData();
      }
    });
    this.commonSubscription.add(userDetailSubscription)
  }

  /**
   * This is used to get the meta dat of the task
   */
  getTaskMetaData() {
    const taskDetailsSubscription = this.taskListService.getMetadataByWfid(this.wfid).subscribe((taskMetaData: TaskMetaData) => {
      this.metadataByWfid = taskMetaData;
      this.getMetaData();
    });
    this.commonSubscription.add(taskDetailsSubscription)
  }

  toggleTabs(tabChange: MatTabChangeEvent) {
    this.selectedTabIndex = tabChange.index;
    if (this.editGI) {
      this.utilities.showSnackBar('Information not saved', 'Okay');
      this.enableEditing.emit(false)
      this.editGI = false;
    }
    switch (tabChange.index) {
      case 0: this.getMetaData(); break;
      case 1: this.getHistoryData(); break;
      case 2: this.getAttachmentData(); break;
    }
  }


  /**
   * function get the audit logs
   */
  getHistoryData() {
    const historySubscription = this.taskListService.getAuditLogs(this.metadataByWfid.objectType, this.metadataByWfid.taskId, 'en').subscribe((auditLogs: AuditLog[]) => {
      this.auditLogData.length = 0;
      this.auditLogData.push(...auditLogs);
    });
    this.commonSubscription.add(historySubscription)
  }

  /**
   * This is used to get the response for change log
   * @param taskId the id of task
   * @param userName username of the selected user
   */
  getChangeLogDetails(taskId: string, userName: string) {
    return this.taskListService.getChangeAuditLogDetails(taskId, userName, 'en')
  }

  /**
   * This is used to get attachment datas
   */
  getAttachmentData() { }

  /**
   * This funcction calls the services to get the data
   */
  getMetaData() {
    const requestObject: TaskListSummaryRequestParams = {
      plantCode: this.userDetails.plantCode,
      userRole: this.userDetails.currentRoleId,
      userId: this.userDetails.userName,
      lang: 'en',
      taskId: this.metadataByWfid.taskId,
      wfId: this.wfid,
      objectnumber: this.metadataByWfid.objectNumber,
      objecttype: this.metadataByWfid.objectType,
      eventCode: this.metadataByWfid.eventCode,
    }

    const gridRequestObject: CommonGridRequestObject = {
      plantCode: this.userDetails.plantCode,
      userRole: this.userDetails.currentRoleId,
      userId: this.userDetails.userName,
      lang: 'en',
      taskId: this.metadataByWfid.taskId,
      wfId: this.wfid,
      objectNumber: this.metadataByWfid.objectNumber,
      objecttype: this.metadataByWfid.objectType,
      eventCode: this.eventCode,
      tabCode: '',
      tabId: '',
      fetchSize: 10,
      fetchCount: 0,
      gridId: ''
    }

    const tasks = this.taskListService.getCommonLayoutData(requestObject).subscribe((response: TaskDetailsMetaData[]) => {
      this.detailsData.length = 0;
      this.detailsData.push(...response);

      this.detailsData.forEach(async (data, index) => {
        if (data.fieldsList) {

          data.fieldsList.forEach((field) => {
            if (field.picklist === 15) {
              gridRequestObject.tabCode = field.fieldId;
              gridRequestObject.tabId = data.tabCode;
              gridRequestObject.gridId = field.fieldId;

              forkJoin([
                this.taskListService.getGridMetaData(gridRequestObject),
                this.taskListService.getGridData(gridRequestObject)
              ]).subscribe(([res1, res2]: [GridMetaDataResponse, GridDataResponse]) => {
                res2.HEADER = res1.allFields
                field.gridData = res2
              })
            }
          })
        }
      });
    }, (err) => {
      this.utilities.showSnackBar('Some error occured, please try again after sometime', 'Okay')
    });
    this.commonSubscription.add(tasks)
  }

  /**
   * WIP
   * @param edit flag to edit or not
   */
  enableGIEditing(edit: boolean) {
    this.editGI = edit;
    this.enableEditing.emit(this.editGI);
    if (this.editGI) {
      this.utilities.showSnackBar('Editing Enabled', 'Okay');
    } else {
      this.utilities.showSnackBar('Editing Saved!', 'Okay');
    }
  }

  /**
   * Angular Hooks
   */
  ngOnDestroy() {
    this.commonSubscription.unsubscribe();
  }

}