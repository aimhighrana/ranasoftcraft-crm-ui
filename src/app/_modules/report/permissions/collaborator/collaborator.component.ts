import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { ReportDashboardPermission } from '@models/collaborator';
import { FormGroup, FormBuilder } from '@angular/forms';

@Component({
  selector: 'pros-collaborator',
  templateUrl: './collaborator.component.html',
  styleUrls: ['./collaborator.component.scss']
})
export class CollaboratorComponent implements OnInit {

  /**
   * report id , that permission assigned on.
   */
  @Input()
  reportId: string;

  /**
   * Permission information
   */
  @Input()
  collaborator: ReportDashboardPermission;

  /**
   * After click saved button
   */
  @Output()
  saveClicked: EventEmitter<ReportDashboardPermission> = new EventEmitter<ReportDashboardPermission>();

  /**
   * After click delete button
   */
  @Output()
  deleteClicked: EventEmitter<string> = new EventEmitter<string>();

  isEditMode = false;

  permissionFrmGrp: FormGroup;

  constructor(
    private formBuilder: FormBuilder
  ) { }

  ngOnInit(): void {
    this.permissionFrmGrp = this.formBuilder.group({
      isViewable:[this.collaborator.isViewable ? this.collaborator.isViewable : false],
      isEditable:[this.collaborator.isEditable ? this.collaborator.isEditable : false],
      isDeleteable:[this.collaborator.isDeleteable ? this.collaborator.isDeleteable : false]
    });

    this.permissionFrmGrp.valueChanges.subscribe(val=>{
      if(val) {
        this.collaborator.isViewable = val.isViewable ? val.isViewable : false;
        this.collaborator.isEditable = val.isEditable ? val.isEditable : false;
        this.collaborator.isDeleteable = val.isDeleteable ? val.isDeleteable : false;
      }
    });
  }

  /**
   * After click save button should emit
   */
  updateEmit() {
    this.isEditMode = false;
    this.saveClicked.emit(this.collaborator);
  }

  /**
   * After click on delete button should emit
   */
  deleteEmit() {
    this.deleteClicked.emit(String(this.collaborator.permissionId));
  }
}
