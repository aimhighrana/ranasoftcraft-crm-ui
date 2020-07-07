import { Component, OnInit, Input, Output, EventEmitter, OnChanges, OnDestroy } from '@angular/core';
import { FormGroup, FormControl, FormBuilder } from '@angular/forms';
import { Observable, Subscription } from 'rxjs';
import { WorkflowBuilderService } from '@services/workflow-builder.service';

@Component({
  selector: 'pros-email-escalation-properties',
  templateUrl: './email-escalation-properties.component.html',
  styleUrls: ['./email-escalation-properties.component.scss']
})
export class EmailEscalationPropertiesComponent implements OnInit, OnChanges, OnDestroy {

  @Input() bpmnElement;

  emailForm: FormGroup;
  oldFormValue;
  filteredRecipients: Observable<any>;
  recipientSearchControl = new FormControl();
  selectedRecipients = [];
  possibleRecipients = [];
  recipientsList = [];
  currentPageIdx = 0;

  subscriptionsList: Subscription[] = [];

  @Output() updateProperties = new EventEmitter<any>();

  constructor(private workflowBuilderService: WorkflowBuilderService,
    private fb: FormBuilder) {

    this.initForm();

  }

  ngOnInit(): void {

    this.subscriptionsList.push(this.workflowBuilderService.getRecipientList()
      .subscribe(recipients => this.recipientsList = recipients));

  }

  /**
   * init the email escalation step form group
   */
  initForm(value?) {

    this.emailForm = this.fb.group({
      name: [value && value.name ? value.name : ''],
      recipientType: [value && value.recipientType ? value.recipientType : 'User'],
    });

    this.selectedRecipients = [];
    this.possibleRecipients = [];

    this.emailForm.valueChanges
      .subscribe(values => {
        // init the recipients list if the recipient type changes
        if(this.oldFormValue && (this.oldFormValue.recipientType !== values.recipientType)){
          this.selectedRecipients = [];
          this.possibleRecipients = [];
        }
        this.oldFormValue = values;

        // emit an update event
        this.updateStepProperties();
      });
  }

  ngOnChanges(changes): void {
    console.log(changes.bpmnElement);
    const selectedBpmn = changes.bpmnElement;
    if (selectedBpmn && selectedBpmn.currentValue) {
      if (Object.keys(selectedBpmn.currentValue.businessObject.$attrs).length === 0) {
        this.initForm();
        this.updateStepProperties();
      } else {
        // get element configured attributes and map the name to description field
        const attrs = { ...selectedBpmn.currentValue.businessObject.$attrs, name: selectedBpmn.currentValue.businessObject.name };
        console.log('Configured attributes: ', attrs);
        this.initForm(attrs) ;
        this.selectedRecipients = JSON.parse(attrs.recipients);
        this.paginateChip() ;

      }
    }

  }


  /**
   * handle recipients selection changes
   * @param event changes data
   */
  recipientSelected(event) {
    const selected = event.option.value;
    if (!this.selectedRecipients.some(r => r === selected)) {
      this.selectedRecipients.push(selected);
      if (this.currentPageIdx === 0 && this.possibleRecipients.length < 2) {
        this.possibleRecipients.push(selected);
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
    this.selectedRecipients = this.selectedRecipients.filter(recipient => recipient !== this.possibleRecipients[index]);
    this.updateStepProperties();
    this.possibleRecipients.splice(index, 1);
    this.paginateChip();
  }


  /**
   * emit an event in order to update the selected step properties
   */
  updateStepProperties() {

    const attributes = { ...this.emailForm.value,
                         recipients: JSON.stringify(this.selectedRecipients)
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

  ngOnDestroy() {
    this.subscriptionsList.forEach(sub => sub.unsubscribe());
  }


}