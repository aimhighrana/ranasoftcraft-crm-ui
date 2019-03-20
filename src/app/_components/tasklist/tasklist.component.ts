import { Component, OnInit } from '@angular/core';
import { TasklistService } from 'src/app/_services/tasklist.service';
import { TaskResponse } from 'src/app/_models/task-response';
import { Task } from 'src/app/_models/task';

@Component({
  selector: 'app-tasklist',
  templateUrl: './tasklist.component.html',
  styleUrls: ['./tasklist.component.scss']
})
export class TasklistComponent implements OnInit {

  taskResponse: TaskResponse;

  constructor(
    private taskListService: TasklistService
  ) { }

  ngOnInit() {
    this.taskResponse = new TaskResponse();
    const taskArr: Task[] = [];
    const task1: Task = new Task();
    task1.desc = 'Task1';
    const task2: Task = new Task();
    task2.desc = 'Task2';
    taskArr.push(task1);
    taskArr.push(task2);
    this.taskResponse.data = taskArr;
    this.taskListService.getAllMyTasks().subscribe(
      tr => {
        this.taskResponse = tr;
      },
      error => {
        console.log(error);
      }
    );
  }

}
