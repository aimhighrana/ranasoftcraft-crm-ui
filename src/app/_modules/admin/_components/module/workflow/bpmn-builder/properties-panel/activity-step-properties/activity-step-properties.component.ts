import { Component, OnInit, Input, Output, EventEmitter, OnChanges, OnDestroy } from '@angular/core';
import { FormGroup, FormControl, FormBuilder } from '@angular/forms';
import { Observable, Subscription } from 'rxjs';
import { WorkflowBuilderService } from '@services/workflow-builder.service';
import { MatDialog } from '@angular/material/dialog';
import { DecisionsModalComponent } from '../../decisions-modal/decisions-modal.component';

@Component({
  selector: 'pros-activity-step-properties',
  templateUrl: './activity-step-properties.component.html',
  styleUrls: ['./activity-step-properties.component.scss']
})
export class ActivityStepPropertiesComponent implements OnInit, OnChanges, OnDestroy {

  @Input() bpmnElement;

  activityFormGroup: FormGroup;
  filteredRecipients: Observable<any>;
  recipientSearchControl = new FormControl();
  selectedRecipients = [];
  possibleRecipients = [];
  recipientsList = [];
  currentPageIdx = 0;

  workflowFields = [];
  selectedWorkflowFields = [];
  connectionsList = [];

  subscriptionsList: Subscription[] = [];

  @Output() updateProperties = new EventEmitter<any>();

  // Bpmn step types
  ELEMENT_TYPES = {
    Activity: 'bpmn:UserTask'
  }

  constructor(private workflowBuilderService: WorkflowBuilderService,
    private fb: FormBuilder,
    public dialog: MatDialog) {

    this.initActivityForm();

  }

  ngOnInit(): void {

    this.subscriptionsList.push(this.workflowBuilderService.getRecipientList()
      .subscribe(recipients => this.recipientsList = recipients));

    this.subscriptionsList.push(this.workflowBuilderService.getWorkflowFields()
      .subscribe(fields => this.workflowFields = fields));

  }

  /**
   * init the activity step form group
   */
  initActivityForm() {

    this.activityFormGroup = this.fb.group({
      name: [''],
      recipientType: ['User'],
      approvedBy: ['0'],
      roleApprovalBy: ['0'],
      taskSubject: [''],
      agentDeterminationType: ['DEFAULT'],
      enhancementPoint: ['Select'],
      stepPriority: ['Low'],
      // recipients: [''],
      slaHrs: [''],
      reminderGracePeriode: [''],
      reminderInterval: [''],
      reminderOccurrences: [''],
      escalationGracePeriode: [''],
      escalationInterval: [''],
      escalationReoccurring: [false],
      escalationOccurrences: [''],
      rejectionActivate: [false],
      rejectionMessage: [''],
      rejectionEnhancementPoint: ['Select'],
      rejectionCriteria: ['off'],
      rejectionToStep: [{value :'', disabled : true}],
      rejectionTerminate: [false],
      rejectionSendMe: [false],
      addDecisions: [false],
      fieldOwnerStep: [false],
      reVerificationRequired: [false],
      skipUserAlreadyApproved: [false],
      showUsers: [false],
      priorityEditable: [false],
      // workflowFields: [[]]
    });

    this.selectedRecipients = [];
    this.possibleRecipients = [];
    this.connectionsList = [];
    this.selectedWorkflowFields = [] ;

    this.activityFormGroup.valueChanges
      .subscribe(values => {
        this.updateStepProperties();
      });
  }

  ngOnChanges(changes): void {
    // console.log(changes.bpmnElement);
    const selectedBpmn = changes.bpmnElement;
    if (selectedBpmn && selectedBpmn.currentValue) {
      if (Object.keys(selectedBpmn.currentValue.businessObject.$attrs).length === 0) {
        this.initActivityForm();
        this.updateStepProperties();
      } else {

        // get element configured attributes and map the name to description field
        let attrs = { ...selectedBpmn.currentValue.businessObject.$attrs, name: selectedBpmn.currentValue.businessObject.name };
        console.log(attrs);
        this.selectedRecipients = JSON.parse(attrs.recipients);
        this.paginateChip() ;
        // get the selected workflow fields
        this.selectedWorkflowFields = JSON.parse(attrs.workflowFields) ;
        // get the element outgoing connections in order to populate reject to step list
        this.connectionsList = selectedBpmn.currentValue.outgoing.map(out => {
          const connections = {
            id: out.target.businessObject.id,
            name: out.target.businessObject.name,
            rejection : out.businessObject.$attrs.rejection || false
          }
          return connections;
        });

        // reset the reject to step attribute if there is no outgoing connections
        if (!this.connectionsList.length || !this.connectionsList.some(con => con.rejection === true)) {
          attrs = { ...attrs, rejectionToStep: '' };
        } else {
          const rejectToStep = this.connectionsList.find(con => con.rejection === true).id ;
          console.log('Rejection to ', rejectToStep)
          attrs = { ...attrs, rejectionToStep: rejectToStep };
        }
        this.activityFormGroup.patchValue(attrs);
      }
    }
    else {
      this.initActivityForm();
    }
  }


  /**
   * handle recipients selection changes
   * @param event changes data
   */
  recipientSelected(event) {
    const selected = event.option.value;
    if (!this.selectedRecipients.some(r => r.recipient === selected)) {
      // const newRecipient = { recipient : selected, fields : this.selectedWorkflowFields} ;
      const newRecipient = JSON.parse(JSON.stringify({ recipient : selected, fields : this.selectedWorkflowFields})) ;
      // const newRecipient = { recipient : selected, fields : this.selectedWorkflowFields.map(field => Object.assign(field)).slice()} ;
      this.selectedRecipients.push(newRecipient);
      // open the fields config modal if there are some selected fields
      if (this.selectedWorkflowFields.length > 0){
        this.openDecisionsModal(newRecipient);
      }

      if (this.currentPageIdx === 0 && this.possibleRecipients.length < 2) {
        this.possibleRecipients.push(newRecipient);
        this.currentPageIdx = 0;
      }

      this.updateStepProperties();
    }
  }

  /**
   * remove a selected recipient
   * @param index the recipient index
   */
  removeRecipient(index) {
    this.selectedRecipients = this.selectedRecipients.filter(element => element.recipient !== this.possibleRecipients[index].recipient);
    this.updateStepProperties();
    this.possibleRecipients.splice(index, 1);
    this.paginateChip();
  }


  /**
   * emit an event in order to update the selected step properties
   */
  updateStepProperties() {

    const attributes = { ...this.activityFormGroup.getRawValue(),
                         stepDesc : this.activityFormGroup.value.name,
                         recipients: JSON.stringify(this.selectedRecipients),
                         workflowFields : JSON.stringify(this.selectedWorkflowFields)
                       };

    this.updateProperties.emit(attributes);
  }

  paginateChip(where?: string) {

    const reverseSelected = this.selectedRecipients;
    if (where === 'prev' && this.currentPageIdx > 0) {
      this.possibleRecipients = [];
      if (reverseSelected[(this.currentPageIdx * 2) - 2])
        this.possibleRecipients.push(reverseSelected[(this.currentPageIdx * 2) - 2]);
      if (reverseSelected[(this.currentPageIdx * 2) - 1])
        this.possibleRecipients.push(reverseSelected[(this.currentPageIdx * 2) - 1]);
      this.currentPageIdx--;
    }
    else if (where === 'next' && this.currentPageIdx < this.selectedRecipients.length) {
      this.possibleRecipients = [];
      this.currentPageIdx++;
      if (reverseSelected[this.currentPageIdx * 2])
        this.possibleRecipients.push(reverseSelected[this.currentPageIdx * 2]);
      if (reverseSelected[(this.currentPageIdx * 2) + 1])
        this.possibleRecipients.push(reverseSelected[(this.currentPageIdx * 2) + 1]);
    } else {
      this.possibleRecipients = [];
      if (reverseSelected[this.currentPageIdx * 2])
        this.possibleRecipients.push(reverseSelected[this.currentPageIdx * 2]);
      if (reverseSelected[(this.currentPageIdx * 2) + 1])
        this.possibleRecipients.push(reverseSelected[(this.currentPageIdx * 2) + 1]);
    }

  }

  /**
   * To check / enable previuos button
   */
  get enablePreBtn() {
    return this.currentPageIdx <= 0;
  }
  /**
   * To check / enable next button
   */
  get enableNextBtn() {
    return ((this.currentPageIdx * 2 + 2) < this.selectedRecipients.length && this.selectedRecipients.length > 2);
  }

  fieldSelectionChange(event){
    if(event.option.selected){
      const fieldAttributes = this.workflowFields.filter(field => field.id === event.option.value)[0] ;
      this.selectedWorkflowFields.push({...fieldAttributes, value : ''}) ;

      // add the selected field for all selected recipients
      this.selectedRecipients.forEach(element => {
        element.fields.push(Object.assign({...fieldAttributes, value : ''})) ;
      }) ;

    } else {
      this.selectedWorkflowFields = this.selectedWorkflowFields.filter(field => field.id !== event.option.value) ;

      // remove the unchecked field from all selected recipients
      this.selectedRecipients.forEach(element => {
        element.fields = element.fields.filter(field => field.id !== event.option.value) ;
      }) ;


    }

    this.updateStepProperties() ;
  }

  isFieldSelected(id){
    return this.selectedWorkflowFields.some(field => field.id === id) ;
  }

  openDecisionsModal(recipient) {

    if (!this.activityFormGroup.value.addDecisions || !this.selectedWorkflowFields.length)
      return;

    const dialogRef = this.dialog.open(DecisionsModalComponent, {
      width: '600px',
      data:   recipient
    });

    dialogRef.afterClosed().subscribe(result => {

      if (!result)
        return;

      recipient.fields.forEach(field => {
        field.value = result[field.id] || '' ;
      });
      console.log(this.selectedWorkflowFields ) ;
      this.updateStepProperties() ;


    });
  }

  ngOnDestroy() {
    this.subscriptionsList.forEach(sub => sub.unsubscribe());
  }

}
