import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { AuditLog, ChangeAuditLog } from '@models/task-list/taskListDetails';
import { Utilities } from '@modules/base/common/utilities';
import { TaskDetailsComponent } from '../task-details/task-details.component';
import { Subscription } from 'rxjs';

@Component({
  selector: 'pros-history-tab',
  templateUrl: './history-tab.component.html',
  styleUrls: ['./history-tab.component.scss']
})
export class HistoryTabComponent implements OnInit, OnDestroy {

  /**
   * This this the input from parent component
   */
  @Input() auditLogData: AuditLog[];

  /**
   * flag to show more logs
   */
  activeMoreLogs: ChangeAuditLog[] = [];
  changeLogSubscription: Subscription;
  /**
   * Constructor of class
   * @param utilies Utilies class object
   * @param taskDetailsComponent Task detail component object
   */
  constructor(private utilies: Utilities, public taskDetailsComponent: TaskDetailsComponent) { }

  ngOnInit(): void {
  }

  /**
   * Function to get status on the basis of shortcode
   * @param shortCode the short from list
   */
  statusFromShortCode(shortCode): string {
    return this.utilies.statusFromShortCode(shortCode)
  }

  getChangeLogs(taskId: string, userId: string) {
    this.activeMoreLogs.length = 0;
    this.changeLogSubscription = this.taskDetailsComponent.getChangeLogDetails(taskId, userId).subscribe((response: ChangeAuditLog[]) => {
      if (response.length === 0) {
        this.utilies.showSnackBar('No change details available');
        return;
      }
      this.activeMoreLogs.push(...response);
      console.log(this.activeMoreLogs)
    }, () => {
      this.utilies.showSnackBar('Some error occured, please try after sometime.')
    })
  }

  ngOnDestroy() {
    if (this.changeLogSubscription) {
      this.changeLogSubscription.unsubscribe();
    }
  }
}
