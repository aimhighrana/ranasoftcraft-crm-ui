import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FieldMetaData } from '@models/core/coreModel';
import { CoreService } from '@services/core/core.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'pros-list-filter',
  templateUrl: './list-filter.component.html',
  styleUrls: ['./list-filter.component.scss']
})
export class ListFilterComponent implements OnInit {

  /**
   * hold current  id
   */
  moduleId: string;

  /**
   * fields metatdata
   */
  metadataFldLst: FieldMetaData[] = [];

  /**
   * filtered fields list
   */
  suggestedFlds: FieldMetaData[] = [];

  subscriptionsList: Subscription[] = [];

  optionsList = [
    { label: 'Filters', value: 'value1' },
    { label: 'Classifications', value: 'value2' }
  ]

  rulelist = [
    { label: 'Is', value: 'value1' },
    { label: 'Is not', value: 'value2' }
  ]

  options = [
    { value: 'Today', key: 1 },
    { value: 'Yesterday', key: 2 },
    { value: 'Last 2 days', key: 3 },
    { value: 'Last 3 days', key: 4 },
    { value: 'Last 4 days', key: 5 },
    { value: 'Last 5 days', key: 6 },
    { value: 'Last 6 days', key: 8 },
  ];

  constructor(
    private activatedRouter: ActivatedRoute,
    private router: Router,
    private coreService: CoreService) { }

  ngOnInit(): void {
    this.activatedRouter.params.subscribe(params => {
      this.moduleId = params.moduleId;
      this.getFldMetadata();
    });
  }

  /**
   * Get all fld metada based on module of schema
   */
  getFldMetadata() {
    if (this.moduleId === undefined || this.moduleId.trim() === '') {
      throw new Error('Module id cant be null or empty');
    }
    const sub = this.coreService.getAllFieldsForView(this.moduleId).subscribe(response => {
      this.metadataFldLst = response;
      this.suggestedFlds = response;
    }, error => {
      console.error(`Error : ${error.message}`);
    });
    this.subscriptionsList.push(sub);
  }

  /**
   * Search field by value change
   * @param value changed input value
   */
  searchFld(value: string) {
    if (value) {
      this.suggestedFlds = this.metadataFldLst.filter(fill => fill.fieldDescri.toLocaleLowerCase().indexOf(value.toLocaleLowerCase()) !== -1)
    } else {
      this.suggestedFlds = this.metadataFldLst;
    }
  }

  /**
   * close sidesheet
   */
  close() {
    this.router.navigate([{ outlets: { sb: null } }], { queryParamsHandling: 'preserve' });
  }

}
