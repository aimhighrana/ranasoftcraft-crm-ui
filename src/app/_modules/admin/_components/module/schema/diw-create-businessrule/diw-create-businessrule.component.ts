import { Component, OnInit, ViewChild } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import { MatStepper } from '@angular/material/stepper';
import { BusinessRuleType, CoreSchemaBrInfo } from '@modules/admin/_components/module/business-rules/business-rules.modal';

@Component({
  selector: 'pros-diw-create-businessrule',
  templateUrl: './diw-create-businessrule.component.html',
  styleUrls: ['./diw-create-businessrule.component.scss']
})
export class DiwCreateBusinessruleComponent implements OnInit {


  moduleId: string;

  schemaId: string;

  brId: string;

  selectedBrType: BusinessRuleType;

  @ViewChild(MatStepper) stepper: MatStepper;

  isLinear = false;
  selBrTypeGrp: FormGroup;
  brDetailsFrm: FormGroup;

  constructor(private _formBuilder: FormBuilder){}


  ngOnInit(): void {
    this.selBrTypeGrp = this._formBuilder.group({
      brType: ['', Validators.required]
    });
    this.brDetailsFrm = this._formBuilder.group({
      brDetails: ['', Validators.required]
    });
  }


  /**
   * Set br type and control creation steps.
   * @param brType clicked business rule type
   */
  selBrType(brType: string) {
    if(brType && brType !== 'BASIC') {
      this.selBrTypeGrp.setValue({brType});
      this.selectedBrType = brType as BusinessRuleType;
      this.stepper.next();
    }
  }

  /**
   * use for get business rule type defination
   */
  get businessRuleTypeDef(): string {
    const val = this.selBrTypeGrp.get('brType').value;
    let def = '';
    switch (val) {
      case BusinessRuleType.BR_MANDATORY_FIELDS:
        def= 'Missing Rule';
        break;

      case BusinessRuleType.BR_METADATA_RULE:
        def = 'Metadata Rule';
        break;

      case BusinessRuleType.BR_CUSTOM_SCRIPT:
        def = 'User Defined Rule';
        break;

      case BusinessRuleType.BR_DEPENDANCY_RULE:
        def = 'Dependency Rule';
        break;

      case BusinessRuleType.BR_DUPLICATE_RULE:
        def = 'Duplicate Rule';
        break;

      case BusinessRuleType.BR_API_RULE:
        def = 'API Rule';
        break;

      case BusinessRuleType.BR_EXTERNALVALIDATION_RULE:
        def = 'External Validation Rule';
        break;

      case BusinessRuleType.BR_REGEX_RULE:
        def = 'Regex Rule';
        break;
      default:
        break;
    }
    return def;
  }

  /**
   * After saved business rule should called this method
   * @param brInfo after saved br info
   */
  afterSaved(brInfo: CoreSchemaBrInfo) {
    console.log(brInfo);
  }
}
