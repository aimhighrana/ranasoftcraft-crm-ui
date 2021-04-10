import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FieldMetaData } from '@models/core/coreModel';
import { FilterCriteria, ListPageFilters } from '@models/list-page/listpage';
import { CoreService } from '@services/core/core.service';
import { GlobaldialogService } from '@services/globaldialog.service';
import { Subscription } from 'rxjs';
import { map } from 'rxjs/operators';

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
  suggestedFilters: string[] = [];

  subscriptionsList: Subscription[] = [];

  filtersList: ListPageFilters = new ListPageFilters();

  activeFilter: FilterCriteria;

  optionsList = [
    { label: 'Filters', value: 'filters' },
    { label: 'Classifications', value: 'value2' }
  ]

  fldMatadataPageIndex = 0;


  constructor(
    private activatedRouter: ActivatedRoute,
    private router: Router,
    private coreService: CoreService,
    private glocalDialogService: GlobaldialogService) { }

  ngOnInit(): void {
    this.activatedRouter.params.subscribe(params => {
      this.moduleId = params.moduleId;
      this.getFldMetadata();
    });

    this.activatedRouter.queryParams.pipe(
      map(params => {
        if(params.f) {
          try {
            const filters = JSON.parse(atob(params.f));
            return filters;
          } catch (err) {
            console.error(err);
            return new ListPageFilters();
          }
        } else {
          return new ListPageFilters();
        }
      })
    )
    .subscribe(filters => {
      this.filtersList = filters;
      console.log(this.filtersList);
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
    }, error => {
      console.error(`Error : ${error.message}`);
    });
    this.subscriptionsList.push(sub);
  }

  /**
   * Search field by value change
   * @param value changed input value
   */
   searchFilter(value: string) {
    if (value) {
      this.suggestedFilters = this.filtersList.filterCriteria
          .filter(fill => this.getFieldDescription(fill.fieldId).toLocaleLowerCase().indexOf(value.toLocaleLowerCase()) !== -1)
          .map(fltr => fltr.fieldId);
    } else {
      this.suggestedFilters = this.filtersList.filterCriteria.map(fltr => fltr.fieldId);
    }
  }

  /**
   * apply filter changes
   */
  upsertFilter() {
    const filter = JSON.parse(JSON.stringify(this.activeFilter));
    const index = this.filtersList.filterCriteria.findIndex(fc => fc.fieldId === this.activeFilter.fieldId);
    if(index !== -1) {
      this.filtersList.filterCriteria[index] = filter ;
    } else {
      this.filtersList.filterCriteria.push(filter);
    }
  }

  /**
   * edit filter details on field click
   * @param fieldId clicked field id
   */
   editFilter(fieldId) {
    const filter = this.filtersList.filterCriteria.find(f => f.fieldId === fieldId);
    if(filter) {
      this.activeFilter = JSON.parse(JSON.stringify(filter));
    } else {
      this.activeFilter = new FilterCriteria();
      this.activeFilter.fieldId = fieldId;
      this.activeFilter.operator = 'EQUAL';
      this.activeFilter.esFieldPath = `hdvs.${fieldId}`;
    }
  }

  /**
   * get field desc based on field id
   * @returns field description
   */
  getFieldDescription(fieldId) {
    const field = this.metadataFldLst.find(f => f.fieldId === fieldId) ;
    return field ? field.fieldDescri || 'Unkown' : 'Unkown';
  }

  updateFilterValue(event) {
    this.activeFilter.values = [event];
  }

  /**
   * Reset all filters
   */
  clearAllFilters() {
    this.glocalDialogService.confirm({label:'Are you sure to reset all filters ?'}, (resp) => {
      if (resp && resp === 'yes') {
        this.filtersList.filterCriteria = [];
        this.activeFilter = null;
      }
    });
  }

  /**
   * Remove an applied filter
   * @param index filter index
   */
  removeFilter(index, fieldId) {
    this.glocalDialogService.confirm({label:'Are you sure to remove this filter ?'}, (resp) => {
      if (resp && resp === 'yes') {
        if (this.activeFilter && this.activeFilter.fieldId === fieldId) {
          this.activeFilter = null;
        }
        this.filtersList.filterCriteria.splice(index, 1);
      }
    });
  }

  /**
   * close sidesheet
   */
  close() {
    if(this.filtersList.filterCriteria && this.filtersList.filterCriteria.length) {
      const filters = btoa(JSON.stringify(this.filtersList));
      this.router.navigate([{ outlets: { sb: null } }], { queryParams: {f: filters} });
    } else {
      this.router.navigate([{ outlets: { sb: null } }], { queryParams: {} });
    }
  }

}
