import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { Utilities } from '@modules/base/common/utilities';
import { BehaviorSubject, Subscription } from 'rxjs';
import { FormGroup, FormControl } from '@angular/forms';

@Component({
  selector: 'pros-general-information-tab',
  templateUrl: './general-information-tab.component.html',
  styleUrls: ['./general-information-tab.component.scss']
})
export class GeneralInformationTabComponent implements OnInit, OnDestroy {

  fieldDataForm: FormGroup;
  /**
   * This recieves the current active tab
   */
  @Input() currentTab: string;
  editingSubscription: Subscription;
  allDetailsData = []

  /**
   * The selected task
   */
  @Input() set detailsData(value: any) {
    this.allDetailsData = value;
  }

  @Input() viewingObj = new BehaviorSubject({})
  /**
   * This is the listener that allows user to edit general information
   */
  @Input() enableEditing = new BehaviorSubject<boolean>(false);
  isEditMode = false;

  constructor(public utilities: Utilities) { }

  ngOnInit(): void {
    this.editingSubscription = this.enableEditing.subscribe((enableFieldsToEdit) => {
      this.isEditMode = enableFieldsToEdit;
    });
    this.fieldDataForm = new FormGroup({})
    this.viewingObj.subscribe((data: []) => {
      if (data) {
        this.allDetailsData.length = 0;
        this.allDetailsData.push(...data)
        this.createForm()
      }
    })
  }

  createForm() {
    this.allDetailsData.forEach((item) => {
      if (item.fieldData) {
        item.fieldData.forEach((field) => {
          this.fieldDataForm.addControl(field.fieldId, new FormControl(field.textToShow))
        })
      }
    })
  }

  /**
   * Convert the picklist id to text
   * @param object the current looping object
   */
  getDOMElement(object) {
    if (object.picklist === 5) { object.picklist = 0 } // tree structure
    return this.utilities.getPickList(object.picklist) ? this.utilities.getPickList(object.picklist).type : ''
  }


  setDynamicHeight(event) {
    if (event.fieldsList) {
      const hasGrid = event.fieldsList.find(item => item.picklist === 15)
      if (hasGrid) {
        return '100%'
      }
    }
    return '77px'
  }

  ngOnDestroy() {
    this.editingSubscription.unsubscribe();
  }
}
