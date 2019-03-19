import { Injectable } from '@angular/core';
import * as moment from 'moment';
import { Task } from '../_models/task';
@Injectable({
  providedIn: 'root'
})
export class Any2tsService {

  constructor() { }

  public anyToTask(contentItem: any): Task {
    const task: Task = new Task();
    task.msg = contentItem.msg;
    task.date = moment(contentItem.date);
    return task;
  }
}
