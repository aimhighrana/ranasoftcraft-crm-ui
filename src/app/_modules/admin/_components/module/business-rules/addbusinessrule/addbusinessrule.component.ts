import { Component, OnInit, Input, OnChanges, EventEmitter, Output } from '@angular/core';
import { Breadcrumb } from 'src/app/_models/breadcrumb';
import { FormControl } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { CoreSchemaBrInfo, BusinessRuleType } from '../business-rules.modal';

@Component({
  selector: 'pros-addbusinessrule',
  templateUrl: './addbusinessrule.component.html',
  styleUrls: ['./addbusinessrule.component.scss']
})
export class AddbusinessruleComponent implements OnInit, OnChanges {

  @Input()
  schemaId: string;

  @Input()
  moduleId: string;

  @Input()
  schemaGroupId: string;

  @Input()
  brId: string;

  @Input()
  fragment: string;

  @Output()
  evtSavedBrInfo: EventEmitter<CoreSchemaBrInfo> = new EventEmitter<CoreSchemaBrInfo>();

  ruleFrmCtrl: FormControl = new FormControl(this.fragment);

  brType = 'BR_MANDATORY_FIELDS'; // default missing rule is enable

  breadcrumb: Breadcrumb = {
    heading: 'Add Business Rule',
    links: [
      {
        link: '/home/schema/',
        text: 'Schema group(s)'
      },
      {
        link: `/home/schema/create-schema`,
        text: 'Create Schema'
      }
    ]
  };

  constructor(
    private router: Router,
    private activatedRouter: ActivatedRoute
  ) { }

  ngOnChanges(changes: import('@angular/core').SimpleChanges): void {
    if(changes.fragment) {
      this.updateBrTypeBasedOnFragement(changes.fragment.currentValue);
      this.ruleFrmCtrl.setValue(changes.fragment.currentValue);
    }
  }

  ngOnInit() {
    this.activatedRouter.queryParams.subscribe(params=>{
      this.brId = params.brId ? params.brId : '';
    });


    this.ruleFrmCtrl.valueChanges.subscribe(val=>{
      this.router.navigate(['/home/schema/create-schema', this.moduleId , this.schemaGroupId, this.schemaId], {fragment:val});

      // update br type
      this.updateBrTypeBasedOnFragement(val);
    });

    // update link
    this.breadcrumb.links[1].link = `/home/schema/create-schema/${this.moduleId}/${this.schemaGroupId}/${this.schemaId}`;
  }

  updateBrTypeBasedOnFragement(val: string) {
    switch (val) {
      case 'missing':
        this.brType = BusinessRuleType.BR_MANDATORY_FIELDS;
        break;

      case 'metadata':
        this.brType = BusinessRuleType.BR_METADATA_RULE;;
        break;

      case 'userdefined':
        this.brType = BusinessRuleType.BR_CUSTOM_SCRIPT;
        break;

      case 'dependency':
        this.brType = BusinessRuleType.BR_DEPENDANCY_RULE;
        break;

      case 'duplicate':
        this.brType = BusinessRuleType.BR_DUPLICATE_RULE;
        break;

      case 'api':
        this.brType = BusinessRuleType.BR_API_RULE;
        break;

      case 'external':
        this.brType = BusinessRuleType.BR_EXTERNALVALIDATION_RULE;
        break;

      case 'regex':
        this.brType = BusinessRuleType.BR_REGEX_RULE;
        break;

      default:
        break;
    }
  }

  /**
   * Use for send back to create schema - page
   * @param evt after saved successfully then should navigate to create schema page
   */
  afterSaved(evt: CoreSchemaBrInfo) {
    if(evt) {
      this.evtSavedBrInfo.emit(evt);
    }
    this.router.navigate(['/home/schema/create-schema', this.moduleId , this.schemaGroupId, this.schemaId]);
  }

}
