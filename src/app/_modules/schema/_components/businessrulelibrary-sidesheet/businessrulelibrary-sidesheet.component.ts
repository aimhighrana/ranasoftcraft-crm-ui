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
  /**
   * selected schema id
   */
  schemaId: string;

  /**
   * selected module id
   */
  moduleId: string;

  /**
   * hold the business rules list
   */
  businessRulesList: CoreSchemaBrInfo[] = [];

  /**
   * hold the filtered business rules
   */
  filteredBusinessRulesList: CoreSchemaBrInfo[] = [];

  /**
   * hold the selected rules
   */
  selectedBusinessRule: CoreSchemaBrInfo[] = [];

  /**
   * selected business rule type
   */
  selectedRuleType: BusinessRules;

  /**
   * To hold the outlet name.
   */
  outlet: string;

  /**
   * fetch count to fetch business rule data.
   */
  fetchCount = 0;

  /**
   * hold the business rule types
   */
  businessRuleTypes: BusinessRules[] = RULE_TYPES;

  /**
   * To hold schema business rule details
   */
  schemaBusinessRulesList: CoreSchemaBrInfo[] = [];

  /**
   * To store bRs info which should be deleted
   */
  BusinessRulesToBeDelete: CoreSchemaBrInfo[] = [];

  /**
   * pre selected business rules
   */
  alreadySelectedBrs: CoreSchemaBrInfo[] = [];

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
    this.getBusinessRulesBySchemaId(this.schemaId);
    this.getBusinessRulesList(this.moduleId, '', '', String(this.fetchCount));
  }


  /**
   * Function to get business rules according to schema Id
   * @param schemaId : schema ID
   */
  getBusinessRulesBySchemaId(schemaId: string) {
    this.schemaService.getBusinessRulesBySchemaId(schemaId).subscribe((response) => {
      this.schemaBusinessRulesList = response;
      // this.selectedBusinessRule = [...this.schemaBusinessRulesList]
      this.alreadySelectedBrs = [...this.schemaBusinessRulesList];
    }, (error) => {
      console.log('Something went wrong while getting schema Brs', error.message);
    })
  }

  /**
   * function to select a business rule from the list.
   */
  selectBusinessRule(rule: CoreSchemaBrInfo, action: string) {
    if (action === this.constants.ADD) {
      this.selectedBusinessRule.push(rule);
    } else {
      const br = this.selectedBusinessRule.filter((businessRule) => businessRule.brId === rule.brId)[0];
      const index = this.selectedBusinessRule.indexOf(br);
      this.selectedBusinessRule.splice(index, 1)
    }
  }

  /**
   * Function to get constants(ADD/REMOVE)
   */
  get constants() {
    return GLOBALCONSTANTS;
  }


  /**
   * Check if a particular rule is selected
   */
  isSelected(rule: CoreSchemaBrInfo): boolean {
    const selected = this.selectedBusinessRule.filter((selectedRule: CoreSchemaBrInfo) => selectedRule.brId === rule.brId);
    const alreadySelected = this.alreadySelectedBrs.filter((selectedRule: CoreSchemaBrInfo) => selectedRule.brId === rule.brId);
    return (selected.length > 0 || alreadySelected.length > 0);
  }

  /**
   * Get business rule list from the api
   * @param moduleId moduleId
   * @param searchString string to be searched
   * @param brType type of busiess rule
   * @param fetchCount count of batch to be fetched
   */
  getBusinessRulesList(moduleId: string, searchString: string, brType: string, fetchCount: string) {
    this.schemaService.getBusinessRulesByModuleId(moduleId, searchString, brType, fetchCount).subscribe((rules: CoreSchemaBrInfo[]) => {
      this.businessRulesList = rules;
      if(this.fetchCount === 0) {
        this.filteredBusinessRulesList = rules;
      }
      else {
        this.filteredBusinessRulesList = [...this.filteredBusinessRulesList, ...rules];
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
    if (this.outlet === 'sb') {
      console.log('test  ' + this.selectedBusinessRule);
      this.selectedBusinessRule.forEach(businessRule => {
        const request: CoreSchemaBrInfo = new CoreSchemaBrInfo();

        request.brId = '';
        request.schemaId = this.schemaId;
        request.brInfo = businessRule.brInfo;
        request.brType = businessRule.brType;
        request.fields = businessRule.fields;
        request.message = businessRule.message;
        request.isCopied = true;
        request.moduleId = this.moduleId;
        request.copiedFrom = businessRule.brIdStr;

        if(businessRule.brType === 'BR_DUPLICATE_CHECK')
    {
       this.schemaService.copyDuplicateRule(request).subscribe((response) => {
        console.log(response);
      }, (error) => {
        console.log('Error while adding business rule', error.message);
      })
    }
    else
    {
      this.schemaService.createBusinessRule(request).subscribe((response) => {
        console.log(response);
      }, (error) => {
        console.log('Error while adding business rule', error.message);
      })


       }
    });
      this.sharedService.setAfterBrSave(true);
    }
    else {
      this.selectedBusinessRule.forEach((businessRule) => {
        businessRule.isCopied = true;
        businessRule.schemaId = null;
        businessRule.copiedFrom = null;
      })
      this.sharedService.setAfterBrSave(this.selectedBusinessRule);
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

  /**
   * Function to update fetchCount on scroll
   * @param event: scroll event object
   */
  onScroll(event) {
    const viewPortHeight = event.target.offsetHeight; // height of the complete viewport
    const scrollFromTop = event.target.scrollTop;     // height till user has scrolled
    const sideSheetHeight = event.target.scrollHeight; // complete scrollable height of the side sheet document

    const limit = sideSheetHeight - scrollFromTop;
    if (limit === viewPortHeight) {
      this.fetchCount++;
      this.getBusinessRulesList(this.moduleId, '', '', String(this.fetchCount))
    }
  }

}
