import { Component, OnInit } from '@angular/core';
import { CoreSchemaBrInfo } from '@modules/admin/_components/module/business-rules/business-rules.modal';
import { BusinessRules } from '@modules/admin/_components/module/schema/diw-create-businessrule/diw-create-businessrule.component';
import { RULE_TYPES } from '@modules/admin/_components/module/business-rules/business-rules.modal';
import { SchemaService } from '@services/home/schema.service';
import { GLOBALCONSTANTS } from '../../../../_constants';
import { ActivatedRoute, Router } from '@angular/router';
import { SharedServiceService } from '@modules/shared/_services/shared-service.service';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

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
  selectedRuleType = '';

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

  brSearchSubject: Subject<string> = new Subject();

  /**
   * search string
   */
  searchString = '';

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
    this.getBusinessRulesList(this.moduleId, this.searchString, this.selectedRuleType);

    this.brSearchSubject.pipe(
      debounceTime(1000),
      distinctUntilChanged()
    ).subscribe(searchTxt => {
      this.searchString = searchTxt || '';
      this.getBusinessRulesList(this.moduleId, this.searchString, this.selectedRuleType);
    })
  }


  /**
   * Function to get business rules according to schema Id
   * @param schemaId : schema ID
   */
  getBusinessRulesBySchemaId(schemaId: string) {
    this.schemaService.getBusinessRulesBySchemaId(schemaId).subscribe((response) => {
      this.schemaBusinessRulesList = response;
      this.alreadySelectedBrs = [...this.schemaBusinessRulesList];
    }, (error) => {
      console.log('Something went wrong while getting schema Brs', error.message);
    })
  }

  /**
   * function to select a business rule from the list.
   */
  selectBusinessRule(rule: CoreSchemaBrInfo, action: string) {
    const findBR = (list: Array<CoreSchemaBrInfo>) => list.find(br => br.brId === rule.brId);
    const deletedBR = findBR(this.BusinessRulesToBeDelete);
    if(deletedBR) {
      this.BusinessRulesToBeDelete.splice(this.BusinessRulesToBeDelete.indexOf(deletedBR), 1);
      return;
    }
    const existingBR = findBR(this.alreadySelectedBrs);
    if (existingBR) {
      this.BusinessRulesToBeDelete.push(existingBR);
      return;
    }
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
    const deletedBRs = this.BusinessRulesToBeDelete.filter((selectedRule: CoreSchemaBrInfo) => selectedRule.brId === rule.brId);
    return (selected.length > 0 || alreadySelected.length > 0 && !deletedBRs.length);
  }

  /**
   * Get business rule list from the api
   * @param moduleId moduleId
   * @param searchString string to be searched
   * @param brType type of busiess rule
   * @param loadMore load more
   */
  getBusinessRulesList(moduleId: string, searchString: string, brType: string, loadMore?: boolean) {
    if(loadMore) {
      this.fetchCount++;
    } else {
      this.fetchCount = 0;
    }
    this.schemaService.getBusinessRulesByModuleId(moduleId, searchString, brType, `${this.fetchCount}`).subscribe((rules: CoreSchemaBrInfo[]) => {
      if(loadMore) {
        if(rules && rules.length) {
          this.businessRulesList = [...this.businessRulesList, ...rules];
        } else {
          this.fetchCount--;
        }
      } else {
        this.businessRulesList = rules || [];
      }
    });
  }

  /**
   * function to close the dialog
   */
  closeDialogComponent() {
    this.router.navigate([{ outlets: { [`${this.outlet}`]: null } }], { queryParamsHandling: 'preserve'})
  }

  /**
   * save data and close the dialog
   */
  saveSelection() {
    if (this.outlet === 'sb') {
      let count = 0;
      console.log('test  ' + this.selectedBusinessRule);
      const forkObj= {};
      this.BusinessRulesToBeDelete.forEach((businessRule) => {
        forkObj[count++] = this.schemaService.deleteBr(businessRule.brIdStr);
      });
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

        if(businessRule.brType === 'BR_DUPLICATE_CHECK') {
          forkObj[count++] = this.schemaService.copyDuplicateRule(request);
        } else {
          forkObj[count++] = this.schemaService.createBusinessRule(request);
        }
      });
      forkJoin(forkObj).subscribe(() => {
        this.sharedService.setAfterBrSave(true);
        this.closeDialogComponent();
      });
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
  selectCurrentRuleType(ruleType: string) {
    if(ruleType !== this.selectedRuleType) {
      this.selectedRuleType = ruleType;
      this.getBusinessRulesList(this.moduleId, this.searchString, this.selectedRuleType);
    }
  }

  /**
   * to optimize long dynamic list rendering
   */
  trackByFn(index: number) {
    return index; // or item.id
  }

  /**
   * load more rules on scroll end
   */
  onScrollEnd() {
    this.getBusinessRulesList(this.moduleId, this.searchString, this.selectedRuleType, true);
  }

}
