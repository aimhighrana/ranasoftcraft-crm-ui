import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { CreateNounModRequest } from '@models/schema/classification';
import { NounModifierService } from '@services/home/schema/noun-modifier.service';
import { SchemaDetailsService } from '@services/home/schema/schema-details.service';

@Component({
  selector: 'pros-noun',
  templateUrl: './noun.component.html',
  styleUrls: ['./noun.component.scss']
})
export class NounComponent implements OnInit {

  moduleId: string;
  matlGroup: string;

  nounForm: FormGroup;
  submitted = false;

  constructor(private router: Router,
    private activatedRoute: ActivatedRoute,
    private formBuilder: FormBuilder,
    private snackBar: MatSnackBar,
    private nounModifierService: NounModifierService,
    private schemaDetailService: SchemaDetailsService) { }

  ngOnInit(): void {
    this.buildForm();
    this.activatedRoute.params.subscribe(params => {
      this.moduleId = params.moduleId;
      this.matlGroup = params.matlGroup;
    })
  }

  buildForm() {
    this.nounForm = this.formBuilder.group({
      nounCode: ['', Validators.required],
      nounText: [''],
      nounNumCode: [''],
      nounModeSep: [''],
      shortDescActive: [false],
      active: [false],
    })
  }

  /**
   * function to return formField
   */
  formField(field: string){
      return this.nounForm.get(field);
  }

  /**
   * set form control value
   * @param controlName from control name
   * @param value value to be set
   */
  setControlValue(controlName: string, value) {
    this.nounForm.get(controlName).setValue(value);
  }

  /**
   * save new attribute details
   */
  save() {

    this.submitted = true;

    if (this.nounForm.invalid) {
      (Object).values(this.nounForm.controls).forEach(control => {
        if(control.invalid)
        control.markAsTouched()
      });
      this.snackBar.open('Please enter the missing fields !', 'close', { duration: 3000 });
      return;
    }

    console.log(this.nounForm.value);

    const request: CreateNounModRequest = {
      ...this.nounForm.value,
      shortDescActive: this.nounForm.value.shortDescActive ? '1': '0',
      active: this.nounForm.value.active ? '1': '0',
      plantCode: '0', objectType: this.moduleId
    } as CreateNounModRequest;

    this.nounModifierService.createNounModifier(request, this.matlGroup)
        .subscribe(resp => {
          this.snackBar.open('Successfully created !', 'close', { duration: 3000 });
          this.close();
        },
        error => {
          this.snackBar.open('Successfully created !', 'close', { duration: 3000 });
          console.log(error);
        })

  }

  close() {
    this.router.navigate([{ outlets: { outer: null } }]);
  }

}
