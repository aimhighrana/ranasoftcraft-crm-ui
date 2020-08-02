import { Component, OnInit, Inject, OnDestroy } from '@angular/core';
import { BehaviorSubject, Subscription } from 'rxjs';
import { AbstractControl, FormArray, FormGroup, FormBuilder } from '@angular/forms';
import { WorkflowBuilderService } from '@services/workflow-builder.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';

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

  wfParams = {
    moduleId : '1005',
    pathName: 'WF72'
  }

  FIELD_TYPE = {
    Input: '0',
    Select: '1'
  }

  FIELD_DATA_TYPE = {
    NUMERIC : 'NUM',
    STRING: 'CHAR'
  }

  fieldOptionsParams = {
    plantCode: 'MDO1003',
    objectType:'1005',
    fieldId:'',
    fetchCount:'-1',
    // queryString:'',
    // from: 'WORKFLOW_DEFINITION',
    lang:'en'
  }

  STRING_OPERATORS = [
    { label : 'Equals', value: '==' },
    { label : 'Not Equal', value: '!=' },
    { label : 'Contains', value: '_contains_' },
    { label : 'Starts With', value: '_starts_with_' },
    { label : 'Ends With', value: '_ends_with_' },
    { label : 'Does Not Starts With', value: '_does_not_starts_with_' },
    { label : 'Does Not Ends With', value: '_does_not_ends_with_' }
  ];

  NUMERIC_OPERATORS = [
    { label : 'Equals', value: '==' },
    { label : 'Not Equal', value: '!=' },
    { label : 'Less Than Equal', value: '<=' },
    { label : 'Greater Than Equal', value: '>=' },
    { label : 'Less Than', value: '<' },
    { label : 'Greater Than', value: '>' }
  ];



  constructor(public dialogRef: MatDialogRef<ConnectionConditionModalComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any,
              private fb: FormBuilder,
              private workflowBuilderService: WorkflowBuilderService,
              private route: ActivatedRoute) { }


  ngOnInit() {

    // read moduleId from query params
    this.subscriptions.push(
      this.route.queryParams.subscribe(params => {
          this.fieldOptionsParams.objectType = params.moduleId;
          this.wfParams.moduleId = params.moduleId;
          this.wfParams.pathName = params.pathname;
          this.getWfFields();
          console.log(params.moduleId +  params.pathname );
      })
    )



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
      rowOperator: [ condition && condition.rowOperator ? condition.rowOperator : '&&'],
      picklist: [this.FIELD_TYPE.Input],
      options: [[]]
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

  getWfFields(){
    this.subscriptions.push(
      this.workflowBuilderService.getWorkflowFields(this.wfParams)
          .subscribe(fields => {
            this.workflowFields = fields.allWFfield || [];

            this.rows.controls.forEach(row => {
              const fieldId = row.value.field;
              if(!fieldId)
                return;
              const picklist = this.workflowFields.find(r => r.id === fieldId).picklist || this.FIELD_TYPE.Input;
              if(picklist === this.FIELD_TYPE.Select){
                this.subscriptions.push(this.getFieldOptions(fieldId)
                  .subscribe(resp => {
                    row.patchValue({
                      picklist,
                      options: resp.DATA || []
                    })
                  })
                )
              } else {
                row.patchValue({
                  picklist
                })
              }
            });


          })
    ) ;
  }

  getFieldOptions(id){

    return this.workflowBuilderService.getFieldOptions({
      ...this.fieldOptionsParams,
      fieldId: id
    }) ;
  }

  fieldSelected(event, field, row){

    if (field.picklist === this.FIELD_TYPE.Select){
      this.subscriptions.push(
        this.getFieldOptions(field.id)
            .subscribe(resp => {
              row.patchValue({options : resp.DATA || [], picklist : this.FIELD_TYPE.Select})
              console.log('Field options ', resp);
            })
      ) ;
    }

  }

  getFieldOperators(fieldId){

    if(!fieldId){
      return [];
    }

    const field = this.workflowFields.find(f => f.id === fieldId);
    if(!field)
      return;

    if (field.datatype === this.FIELD_DATA_TYPE.NUMERIC){
      return this.NUMERIC_OPERATORS;
    } else {
      return this.STRING_OPERATORS;
    }
  }


  ngOnDestroy() {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

}
