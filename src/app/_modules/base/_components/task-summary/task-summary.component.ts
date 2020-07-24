import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { TaskListRow } from '@models/task-list/taskListRow';
import { Router, ActivatedRoute } from '@angular/router';


@Component({
  selector: 'pros-task-summary',
  templateUrl: './task-summary.component.html',
  styleUrls: ['./task-summary.component.scss']
})
export class TaskSummaryComponent implements OnInit {

  wfid: string;
  eventCode: string;
  taskId: string;

  /**
   * Task details are stored here
   */
  @Output() closeDetails = new EventEmitter();

  /**
   * The selected task
   */
  @Input() currentTask: TaskListRow;

  /**
   * Constructor of @class DetailsComponent
   * @param taskListService Tasklist service description
   */
  constructor(private router: Router,
    public activatedRoute: ActivatedRoute) { }

  /**
   * Event hook
   */
  ngOnInit(): void {
    if (this.currentTask) {
      this.taskId = this.currentTask.taskid;
      this.wfid = this.currentTask.wfid;
      this.eventCode = this.currentTask.eventCode;
    } else {
      this.wfid = this.activatedRoute.snapshot.params.wfid;
      this.eventCode = this.activatedRoute.snapshot.params.eventCode;
    }
    console.log(this.wfid, this.eventCode)
  }

  closeDetailsModal() {
    this.closeDetails.emit(true)
  }

  /**
   * This is used to navigate to details page
   */
  navigateToDetailsPage() {
    const url = `home/task-details/${this.wfid}/${this.eventCode}`
    this.router.navigateByUrl(url)
  }
}
