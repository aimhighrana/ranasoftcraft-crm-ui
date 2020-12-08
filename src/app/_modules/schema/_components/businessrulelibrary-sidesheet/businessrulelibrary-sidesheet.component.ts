import { Component, OnInit } from '@angular/core';
import { CoreSchemaBrInfo } from '@modules/admin/_components/module/business-rules/business-rules.modal';
import { BusinessRules } from '@modules/admin/_components/module/schema/diw-create-businessrule/diw-create-businessrule.component';
import { RULE_TYPES } from '@modules/admin/_components/module/business-rules/business-rules.modal';
import { SchemaService } from '@services/home/schema.service';
import { GLOBALCONSTANTS } from '../../../../_constants';
import { ActivatedRoute, Router } from '@angular/router';
import { SharedServiceService } from '@modules/shared/_services/shared-service.service';

@Component({
  selector: 'pros-businessrulelibrary-sidesheet',
  templateUrl: './businessrulelibrary-sidesheet.component.html',
  styleUrls: ['./businessrulelibrary-sidesheet.component.scss']
})
export class BusinessrulelibrarySidesheetComponent implements OnInit {
  schemaId: string;
  moduleId: string;
  businessRulesList: CoreSchemaBrInfo[] = [];
  filteredBusinessRulesList: CoreSchemaBrInfo[] = [];
  selectedBusinessRule: CoreSchemaBrInfo[] = [];
  selectedBusinessRuleCopy: CoreSchemaBrInfo[] = [];
  selectedBusinessRuleIds: string[] = [];
  loader = false;
  selectedRuleType: BusinessRules;

  /**
   * To hold the outlet name.
   */
  outlet: string;

  /**
   * fetch count to fetch business rule data.
   */
  fetchCount = 0;

  businessRuleTypes: BusinessRules[] = RULE_TYPES;

  constructor(
    private schemaService: SchemaService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private sharedService: SharedServiceService
  ) { }


  /**
   * Angular hook
   */
  ngOnInit(): void {
    console.log(this.router);
    this.activatedRoute.params.subscribe((params) => {
      this.outlet = params.outlet;
      this.schemaId = params.schemaId;
      this.moduleId = params.moduleId;
    })
    this.getBusinessRulesList(this.moduleId, '', '', String(this.fetchCount));
  }

  // function to select a business rule from the list.
  selectBusinessRule(rule: CoreSchemaBrInfo, action: string) {
    if (action === this.constants.ADD) {
      this.selectedBusinessRule.push(rule);
      this.selectedBusinessRuleCopy.push(rule);
    } else {
      const br = this.selectedBusinessRuleCopy.filter((businessRule) => businessRule.brId === rule.brId)[0];
      const index = this.selectedBusinessRuleCopy.indexOf(br);
      this.selectedBusinessRuleCopy.splice(index, 1)
    }
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
  getBusinessRulesList(moduleId: string, searchString: string, brType: string, fetchCount: string) {
    this.loader = true;
    this.schemaService.getBusinessRulesByModuleId(moduleId, searchString, brType, fetchCount).subscribe((rules: CoreSchemaBrInfo[]) => {
      this.loader = false;
      if (rules && rules.length > 0) {
        this.businessRulesList = rules;
        this.filteredBusinessRulesList = rules;
      }
    });
  }

  /**
   * function to close the dialog
   */
  closeDialogComponent() {
    this.router.navigate([{ outlets: { [`${this.outlet}`]: null } }])
  }

  /**
   * save data and close the dialog
   */
  saveSelection() {
    console.log(this.selectedBusinessRuleCopy);
    if (this.outlet === 'sb') {
      this.selectedBusinessRuleCopy.forEach(businessRule => {
        const request: CoreSchemaBrInfo = new CoreSchemaBrInfo();

        request.brId = businessRule.brIdStr;
        request.schemaId = this.schemaId;
        request.brInfo = businessRule.brInfo;
        request.brType = businessRule.brType;
        request.fields = businessRule.fields;
        request.message = businessRule.message;

        this.schemaService.createBusinessRule(request).subscribe((response) => {
          console.log(response);
        }, (error) => {
          console.log('Error while adding business rule', error.message);
        })
      });
      this.sharedService.setAfterBrSave(true);
    }
    else {
      this.sharedService.setAfterBrSave(this.selectedBusinessRuleCopy);
    }
    this.closeDialogComponent();
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
