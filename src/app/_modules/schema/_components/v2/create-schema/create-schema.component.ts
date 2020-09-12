import { Component, OnInit } from '@angular/core';
import { ObjectTypeResponse } from '@models/schema/schema';
import { SchemaService } from '@services/home/schema.service';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CreateUpdateSchema } from '@modules/admin/_components/module/business-rules/business-rules.modal';

@Component({
  selector: 'pros-create-schema',
  templateUrl: './create-schema.component.html',
  styleUrls: ['./create-schema.component.scss']
})
export class CreateSchemaComponent implements OnInit {


  moduleList: ObjectTypeResponse[];

  form: FormGroup;

  constructor(
    private schemaSrevice: SchemaService,
    private formBuilder: FormBuilder,
    private router: Router,
    private matSnackBar: MatSnackBar
  ) { }

  ngOnInit(): void {

    this.form = this.formBuilder.group({
      moduleId: new FormControl('', Validators.required),
      schemaDescription: new FormControl('', Validators.required),
      threshold: new FormControl(0, Validators.required)
    });


    this.schemaSrevice.getAllObjectType().subscribe(res=>{
      this.moduleList = res;
    }, error=> console.error('Error : {}', error.message));


  }

  /**
   * Changed schema name ..
   * @param val change value of schema name ...
   */
  changedSchemaName(val: string) {
    this.form.get('schemaDescription').setValue(val);
  }

  /**
   * Close create schema side sheet
   */
  close() {
    this.router.navigate([{ outlets: { sb: null }}]);
  }

  /**
   * Create schema ..
   */
  save() {
    console.log(this.form.value);
    if(!this.form.valid) {
      this.matSnackBar.open(`Please fill form `, `Close`,{duration:5000});
      return;
    }
    const request: CreateUpdateSchema = new CreateUpdateSchema();
    request.moduleId = this.form.get('moduleId').value;
    request.discription = this.form.get('schemaDescription').value;
    request.schemaThreshold = this.form.get('threshold').value;
    this.schemaSrevice.createUpdateSchema(request).subscribe(res=>{
      this.close();
    }, error=>{
      this.matSnackBar.open(`Something went wrong`, `Close`,{duration:5000});
      console.error(`Error : ${error.message}`)
    });
  }


}
