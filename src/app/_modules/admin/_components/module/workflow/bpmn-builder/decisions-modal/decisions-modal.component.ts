import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'pros-decisions-modal',
  templateUrl: './decisions-modal.component.html',
  styleUrls: ['./decisions-modal.component.scss']
})
export class DecisionsModalComponent implements OnInit {

  FIELD_TYPE = {
    Input: 'input',
    Select: 'select'
  }

  decisionForm: FormGroup;

  constructor(private fb: FormBuilder,
    public dialogRef: MatDialogRef<DecisionsModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) { }

  onCancelClick(): void {
    this.dialogRef.close();
  }

  ngOnInit(): void {

    this.decisionForm = this.fb.group({});
    this.data.fields.forEach(field => {
      this.decisionForm.addControl(field.id, this.fb.control(field.value));
    });

  }

}
