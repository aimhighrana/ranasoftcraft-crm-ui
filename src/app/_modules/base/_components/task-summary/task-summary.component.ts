import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { TaskListService } from '@services/task-list.service';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'pros-task-summary',
  templateUrl: './task-summary.component.html',
  styleUrls: ['./task-summary.component.scss']
})
export class TaskSummaryComponent implements OnInit {
  /**
   * task id from the emitter
   */
  @Input() taskId: string;

  @Input() currentTab: string;

  /**
   * Task details are stored here
   */
  @Output() closeDetails = new EventEmitter();
  /**
   * This is used to store the details of the task from the service
   */
  taskDetails: object;

  /**
   * Constructor of @class DetailsComponent
   * @param taskListService Tasklist service description
   */
  constructor(private taskListService: TaskListService, private router: Router, private activatedRoute: ActivatedRoute) { }

  /**
   * Event hook
   */
  ngOnInit(): void {
    console.log(this.currentTab);
    this.getTaskDetails();
    // detect if page is being loaded from URL or from selector
    if (!this.taskId) {
      this.taskId = this.activatedRoute.snapshot.params.taskId;
    }
  }

  /**
   * function to call api to get task details
   */
  getTaskDetails() {
    this.taskListService.getTaskDetails(this.taskId).subscribe((details: object) => {
      this.taskDetails = details;
    })
  }

  closeDetailsModal() {
    this.closeDetails.emit(true)
  }

  openDetails() {
    this.router.navigate(['home', 'task-details', `${this.taskId}`])
  }
}
