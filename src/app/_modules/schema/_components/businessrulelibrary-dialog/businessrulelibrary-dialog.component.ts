import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CoreSchemaBrInfo } from '@modules/admin/_components/module/business-rules/business-rules.modal';
import { BusinessRules } from '@modules/admin/_components/module/schema/diw-create-businessrule/diw-create-businessrule.component';
import { BusinessRuleType } from '@modules/admin/_components/module/business-rules/business-rules.modal';
import { SchemaService } from '@services/home/schema.service';
import { GLOBALCONSTANTS } from '../../../../_constants';

@Component({
  selector: 'pros-businessrulelibrary-dialog',
  templateUrl: './businessrulelibrary-dialog.component.html',
  styleUrls: ['./businessrulelibrary-dialog.component.scss']
})
export class BusinessrulelibraryDialogComponent implements OnInit {
  businessRulesList: CoreSchemaBrInfo[] = [];
  filteredBusinessRulesList: CoreSchemaBrInfo[] = [];
  selectedBusinessRule: CoreSchemaBrInfo[] = [];
  selectedBusinessRuleCopy: CoreSchemaBrInfo[] = [];
  selectedBusinessRuleIds: string[] = [];
  loader = false;
  selectedRuleType: BusinessRules;
  businessRuleTypes: BusinessRules[] = [
    { ruleDesc: 'API Rule', ruleId: '', ruleType: BusinessRuleType.BR_API_RULE, isImplemented: false },
    { ruleDesc: 'Basic', ruleId: '', ruleType: null, isImplemented: false },
    { ruleDesc: 'Dependency Rule', ruleId: '', ruleType: BusinessRuleType.BR_DEPENDANCY_RULE, isImplemented: false },
    { ruleDesc: 'Duplicate Rule', ruleId: '', ruleType: BusinessRuleType.BR_DUPLICATE_RULE, isImplemented: false },
    { ruleDesc: 'External Validation Rule', ruleId: '', ruleType: BusinessRuleType.BR_EXTERNALVALIDATION_RULE, isImplemented: false },
    { ruleDesc: 'Metadata Rule', ruleId: '', ruleType: BusinessRuleType.BR_METADATA_RULE, isImplemented: true },
    { ruleDesc: 'Missing Rule', ruleId: '', ruleType: BusinessRuleType.BR_MANDATORY_FIELDS, isImplemented: true },
    { ruleDesc: 'Regex Rule', ruleId: '', ruleType: BusinessRuleType.BR_REGEX_RULE, isImplemented: true },
    { ruleDesc: 'User Defined Rule', ruleId: '', ruleType: BusinessRuleType.BR_CUSTOM_SCRIPT, isImplemented: true },
  ];
  constructor(
    private dialogRef: MatDialogRef<Component>,
    @Inject(MAT_DIALOG_DATA) public data,
    private schemaService: SchemaService
  ) { }


  /**
   * Angular hook
   */
  ngOnInit(): void {
    this.getBusinessRulesList();
  }

  // function to select a business rule from the list
  selectBusinessRule(rule: CoreSchemaBrInfo, action: string) {
    if (action === this.constants.ADD) {
      this.selectedBusinessRule.push(rule);
      this.selectedBusinessRuleCopy.push(rule);
    }
    // if (action === this.constants.REMOVE) {
    //   this.selectedBusinessRule.splice(this.selectedBusinessRule.findIndex((bRule) => bRule.brId === rule.brId), 1);
    //   this.selectedBusinessRuleCopy.splice(this.selectedBusinessRuleCopy.findIndex((bRule) => bRule.brId === rule.brId), 1);
    // }
  }

  // getter for GlobalConstants
  get constants() {
    return GLOBALCONSTANTS;
  }

  /**
   * Method to search through a rule from a list
   * using the ruleInfo as searchTerm
   */
  search(searchTerm: string) {
    if (searchTerm && searchTerm.trim()) {
      this.filteredBusinessRulesList =
        this.businessRulesList.filter((rule: CoreSchemaBrInfo) => {
          if (rule.brInfo) {
            return rule.brInfo.toLowerCase().includes(searchTerm.toLowerCase());
          }
        }
        );
    } else {
      this.filteredBusinessRulesList = this.businessRulesList;
    }
  }

  /**
   * Check if a particular rule is selected
   */
  isSelected(rule: CoreSchemaBrInfo): boolean {
    const selected: CoreSchemaBrInfo[] =
      this.selectedBusinessRuleCopy.filter((selectedRule: CoreSchemaBrInfo) => selectedRule.brId === rule.brId);
    return (selected.length > 0);
  }

  /**
   * Get business rule list from the api
   */
  getBusinessRulesList() {
    this.loader = true;
    this.schemaService.getAllBusinessRules().subscribe((rules: CoreSchemaBrInfo[]) => {
      this.loader = false;
      if (rules && rules.length > 0) {
        this.businessRulesList = rules;
        this.filteredBusinessRulesList = rules;
        if (this.data && this.data.selectedRules && this.data.selectedRules.length > 0) {
          this.selectedBusinessRuleCopy = [...this.data.selectedRules];
        }
      }
    });
  }

  /**
   * function to close the dialog
   */
  closeDialogComponent() {
    this.dialogRef.close();
  }

  /**
   * save data and close the dialog
   */
  saveSelection() {
    this.dialogRef.close(this.selectedBusinessRule);
  }

 /**
  * select a business rule type
  */
  selectCurrentRuleType(ruleType: BusinessRules) {
    this.selectedRuleType = ruleType;
    this.filterRuleByType(ruleType);
  }

  /**
   * filter business rules by rule type
   */
  filterRuleByType(selectedRuleType: BusinessRules) {
    const existingRules = this.businessRulesList;
    this.filteredBusinessRulesList = existingRules.filter((rule) => rule.brType === selectedRuleType.ruleType);
  }

  /**
   * to optimize long dynamic list rendering
   */
  trackByFn(index: number) {
    return index; // or item.id
  }
}
