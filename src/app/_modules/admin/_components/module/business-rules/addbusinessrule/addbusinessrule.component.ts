import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Breadcrumb } from 'src/app/_models/breadcrumb';
import { BusinessRuleType } from '../business-rules.modal';

@Component({
  selector: 'pros-addbusinessrule',
  templateUrl: './addbusinessrule.component.html',
  styleUrls: ['./addbusinessrule.component.scss']
})
export class AddbusinessruleComponent implements OnInit {

  breadcrumb: Breadcrumb = {
    heading: 'Add Business Rule',
    links: [
      {
        link: '/home/schema/',
        text: 'Schema group(s)'
      },
      {
        link: '/home/schema/create-schema/',
        text: 'Create Schema'
      }
    ]
  };
  showMissingRuleSection = false;
  showMetaDataSection = false;
  showUserDefinedSection = false;
  showDependencySection = false;
  selectRadioBtn = false;
  brType: string;

  @Input() brData;
  @Input() brLength;
  @Input() paramsData;
  @Output() valueChange = new EventEmitter();

  constructor() { }

  ngOnInit() {
    this.getBrdata();
  }

  getBrdata() {
    console.log(this.brData);
    if (this.brData) {

      if (this.brData.brType === BusinessRuleType.missingRuleBrType) {
        this.showMissingRuleSection = true;
      }
      else if (this.brData.brType === BusinessRuleType.meteDataRuleType) {
        this.showMetaDataSection = true;
      }

    }
  }

  onChangeRadioButton(event) {
    if (event.value === 'missing') {
      this.brType = 'missingRule';
      this.showMissingRuleSection = true;
      this.showMetaDataSection = false;
      this.showUserDefinedSection = false;
      this.showDependencySection = false;
    }

    if (event.value === 'metadata') {
      this.brType = 'metaDataRule';
      this.showMetaDataSection = true;
      this.showMissingRuleSection = true;
      this.showUserDefinedSection = false;
      this.showDependencySection = false;
    }
    else if (event.value === 'userdefined') {
      this.showUserDefinedSection = true;
      this.showMissingRuleSection = false;
      this.showMetaDataSection = false;
      this.showDependencySection = false;
    }
    else if (event.value === 'dependency') {
      this.showDependencySection = true;
      this.showMissingRuleSection = false;
      this.showMetaDataSection = false;
      this.showUserDefinedSection = false;
    }
  }

  addNewBusiness() {
    this.valueChange.emit();
  }

}
