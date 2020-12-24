import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { Attribute, AttributeDataType } from '@models/schema/classification';
import { NounModifierService } from '@services/home/schema/noun-modifier.service';
import { SchemaDetailsService } from '@services/home/schema/schema-details.service';

@Component({
  selector: 'pros-attribute',
  templateUrl: './attribute.component.html',
  styleUrls: ['./attribute.component.scss']
})
export class AttributeComponent implements OnInit {

  attributeForm: FormGroup;

  ATTRIBUTE_DATA_TYPE = AttributeDataType;

  submitted = false;

  nounSno: string;

  constructor(private router: Router,
    private formBuilder: FormBuilder,
    private snackBar: MatSnackBar,
    private nounModifierService: NounModifierService,
    private schemaDetailsService: SchemaDetailsService,
    private activatedRoute: ActivatedRoute) { }

  ngOnInit(): void {

    this.buildAttributeForm();

    this.activatedRoute.params.subscribe(params => {
      this.nounSno = params.nounSno;
    });

  }

  /**
   * Build attribute form
   */
  buildAttributeForm() {
    this.attributeForm = this.formBuilder.group({
      attrCode: ['', Validators.required],
      attrDesc: ['', Validators.required],
      type: [this.ATTRIBUTE_DATA_TYPE.TEXT],
      attFieldLen: [''],
      prefix: ['']
    })
  }

  /**
   * set form control value
   * @param controlName from control name
   * @param value value to be set
   */
  setControlValue(controlName: string, value) {
    this.attributeForm.get(controlName).setValue(value);
  }

  /**
   * save new attribute details
   */
  save() {

    this.submitted = true;

    if (this.attributeForm.invalid) {
      this.snackBar.open('Please enter the missing fields !', 'close', { duration: 3000 });
      return;
    }

    console.log(this.attributeForm.value);

    const request: Attribute[] = [{ ...this.attributeForm.value } as Attribute];

    this.nounModifierService.addAttribute(request, this.nounSno)
      .subscribe(resp => {
        this.snackBar.open('Successfully created!', 'close', { duration: 3000 });
        this.close();
      },
        error => {
          this.snackBar.open('Something went wrong!', 'close', { duration: 3000 });
        });
  }

  close() {
    this.router.navigate([{ outlets: { outer: null } }]);
  }

}