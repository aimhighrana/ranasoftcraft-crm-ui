import { Injectable } from '@angular/core';
import { Task } from '../_models/task';
import { TaskResponse } from '../_models/task-response';
@Injectable({
  providedIn: 'root'
})
export class Any2tsService {

  constructor() { }

  public anyToTask(contentItem: any): Task {
    const task: Task = new Task();
    // task.date = moment(contentItem.date);
    task.nextAgentType = contentItem.nextAgentType;
    task.eventId = contentItem.eventId;
    task.receiver = contentItem.receiver;
    task.claimed = contentItem.claimed;
    task.dueDate = contentItem.dueDate;
    task.stepId = contentItem.stepId;
    task.REQUESTOR_DATE = contentItem.REQUESTOR_DATE;
    task.REQUESTOR_NAME = contentItem.REQUESTOR_NAME;
    task.DATESTARTED = contentItem.DATESTARTED;
    task.entryStatus = contentItem.entryStatus;
    task.workflowpath = contentItem.workflowpath;
    task.sender = contentItem.sender;
    task.objectName = contentItem.objectName;
    task.claimable = contentItem.claimable;
    task.ROLEID = contentItem.ROLEID;
    task.objecttype = contentItem.objecttype;
    task.event = contentItem.event;
    task.wfId = contentItem.wfId;
    task.taskId = contentItem.taskId;
    task.objectId = contentItem.objectId;
    task.forwardEnabled = contentItem.forwardEnabled;
    task.status = contentItem.status;
    task.desc = contentItem.desc;
    return task;
  }

  public anyToTaskResponse(contentItem: any): TaskResponse {
    const tr: TaskResponse = new TaskResponse();
    const dataArr: Task[] = [];
    contentItem.data.forEach(taskItem => {
      dataArr.push(this.anyToTask(taskItem));
    });
    tr.data = dataArr;
    return tr;
  }
}
