import { Component, OnInit, Inject, OnDestroy } from '@angular/core';
import { BehaviorSubject, Subscription } from 'rxjs';
import { AbstractControl, FormArray, FormGroup, FormBuilder } from '@angular/forms';
import { WorkflowBuilderService } from '@services/workflow-builder.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'pros-connection-condition-modal',
  templateUrl: './connection-condition-modal.component.html',
  styleUrls: ['./connection-condition-modal.component.scss']
})
export class ConnectionConditionModalComponent implements OnInit, OnDestroy {

  workflowFields = [] ;

  dataSource = new BehaviorSubject<AbstractControl[]>([]);
  displayColumns = ['action', 'field', 'operator', 'value'];
  rows: FormArray = this.fb.array([]);
  conditionsForm: FormGroup = this.fb.group({ conditions: this.rows });

  subscriptions : Subscription[] = [] ;

  constructor(public dialogRef: MatDialogRef<ConnectionConditionModalComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any,
              private fb: FormBuilder,
              private workflowBuilderService: WorkflowBuilderService) { }


  ngOnInit() {

    this.subscriptions.push(
      this.workflowBuilderService.getWorkflowFields()
          .subscribe(fields => this.workflowFields = fields)
    ) ;

    if (this.data.length){
      this.data.forEach(condition => {
        this.addCondition(condition) ;
      });
    } else {
      this.addCondition();
    }
    this.updateView();

  }


  /**
   * add a new condition
   * @param condition condition initial values
   */
  addCondition(condition?) {
    const row = this.fb.group({
      field : [ condition && condition.field ? condition.field : ''],
      operator: [ condition && condition.operator ? condition.operator : ''],
      value: [ condition && condition.value ? condition.value : ''],
      rowOperator: [ condition && condition.rowOperator ? condition.rowOperator : 'and']
    });
    this.rows.push(row);
    this.updateView();
  }

  /**
   * remove an existing condition
   * @param index the condition index
   */
  removeCondition(index){
    this.rows.removeAt(index) ;
    this.updateView() ;
  }

  updateView() {
    this.dataSource.next(this.rows.controls);
  }

  /**
   * close this modal
   */
  onCancelClick(): void {
    this.dialogRef.close();
  }


  ngOnDestroy() {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

}
