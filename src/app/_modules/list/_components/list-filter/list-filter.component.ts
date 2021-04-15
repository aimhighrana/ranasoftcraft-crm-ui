import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FieldMetaData } from '@models/core/coreModel';
import { FieldControlType, FilterCriteria, ListPageFilters } from '@models/list-page/listpage';
import { CoreService } from '@services/core/core.service';
import { GlobaldialogService } from '@services/globaldialog.service';
import { Subject, Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged, map } from 'rxjs/operators';

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
  moduleFieldsMetatdata: FieldMetaData[] = [];

  filterFieldsMetadata: FieldMetaData[] = [];

  /**
   * filtered fields list
   */
  suggestedFilters: FilterCriteria[] = [];

  subscriptionsList: Subscription[] = [];

  filtersList: ListPageFilters = new ListPageFilters();

  activeFilter: FilterCriteria;

  optionsList = [
    { label: 'Filters', value: 'filters' },
    { label: 'Classifications', value: 'value2' }
  ]

  fldMatadataPageIndex = 0;

  FieldControlType = FieldControlType;

  fieldsPageIndex = 0;

  fieldsSearchString = '';

  searchFieldSub: Subject<string> = new Subject();

  constructor(
    private activatedRouter: ActivatedRoute,
    private router: Router,
    private coreService: CoreService,
    private glocalDialogService: GlobaldialogService) { }

  ngOnInit(): void {

    let sub = this.activatedRouter.params.subscribe(params => {
      this.moduleId = params.moduleId;
      this.getModuleFldMetadata();
    });
    this.subscriptionsList.push(sub);

    sub = this.activatedRouter.queryParams.pipe(
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
      const fieldsList = this.filtersList.filterCriteria.map(fc => fc.fieldId);
      this.getfilterFieldsMetadata(fieldsList);
    });
    this.subscriptionsList.push(sub);

    sub = this.searchFieldSub.pipe(
      debounceTime(1000),
      distinctUntilChanged()
    )
    .subscribe(searchString => {
      this.fieldsSearchString = searchString || '';
      this.suggestedFilters = this.filtersList.filterCriteria
              .filter(field => this.getFilterDescription(field.fieldId).toLowerCase().includes(this.fieldsSearchString.toLowerCase()));
      this.getModuleFldMetadata();
    });
    this.subscriptionsList.push(sub);
  }

  /**
   * Get module fields metadata
   */
   getModuleFldMetadata(loadMore?: boolean) {
    if (this.moduleId === undefined || this.moduleId.trim() === '') {
      throw new Error('Module id cant be null or empty');
    }

    if(loadMore) {
      this.fieldsPageIndex++;
    } else {
      this.fieldsPageIndex = 0;
    }
    const sub = this.coreService.searchFieldsMetadata(this.moduleId, this.fieldsPageIndex, this.fieldsSearchString, 20).subscribe(response => {
      if(response && response.length) {
        loadMore ? this.moduleFieldsMetatdata = this.moduleFieldsMetatdata.concat(response) : this.moduleFieldsMetatdata = response;
      } else if (loadMore) {
        this.fieldsPageIndex--;
      }
    }, error => {
      console.error(`Error : ${error.message}`);
    });
    this.subscriptionsList.push(sub);
  }

  /**
   * Get filters fields metadata
   */
   getfilterFieldsMetadata(fieldsList: string[]) {
    if (!fieldsList || !fieldsList.length) {
      return;
    }
    const sub = this.coreService.getMetadataByFields(fieldsList).subscribe(response => {
      this.filterFieldsMetadata = fieldsList.map(field => response.find(f => f.fieldId === field));
    }, error => {
      console.error(`Error : ${error.message}`);
    });
    this.subscriptionsList.push(sub);
  }

  /**
   * apply filter changes
   */
  applyFilter() {
    const filter = JSON.parse(JSON.stringify(this.activeFilter));
    const index = this.filtersList.filterCriteria.findIndex(fc => fc.fieldId === this.activeFilter.fieldId);
    if(index !== -1) {
      this.filtersList.filterCriteria[index] = filter ;
    } else {
      this.filtersList.filterCriteria.push(filter);
      this.suggestedFilters.push(filter);
      const fldMetadata = this.moduleFieldsMetatdata.find(f => f.fieldId === filter.fieldId);
      this.filterFieldsMetadata.push(fldMetadata);
    }
  }

  /**
   * edit filter details on field click
   * @param fieldId clicked field id
   */
   upsertFilter(fieldId) {
    const filter = this.filtersList.filterCriteria.find(f => f.fieldId === fieldId);
    if(filter) {
      this.activeFilter = JSON.parse(JSON.stringify(filter));
    } else {
      this.activeFilter = new FilterCriteria();
      this.activeFilter.fieldId = fieldId;
      this.activeFilter.operator = 'EQUAL';
      this.activeFilter.values = [];
      this.activeFilter.esFieldPath = `hdvs.${fieldId}`;
    }
  }

  /**
   * get field desc based on field id
   * @returns field description
   */
  getFieldDescription(fieldId) {
    const field = this.moduleFieldsMetatdata.find(f => f.fieldId === fieldId) ;
    return field ? field.fieldDescri || 'Unkown' : 'Unkown';
  }

  /**
   * get field desc based on field id
   * @returns field description
   */
   getFilterDescription(fieldId) {
    const field = this.filterFieldsMetadata.find(f => f.fieldId === fieldId) ;
    return field ? field.fieldDescri || 'Unkown' : 'Unkown';
  }

  /**
   * Format filter value based on field metadata
   * @param fieldId field id
   * @returns string
   */
  getFilterValue(fieldId) {
    const criteria = this.filtersList.filterCriteria.find(field => field.fieldId === fieldId);
    if( !criteria ) {
      return;
    }
    const filtercontrolType = this.getFieldControlType(fieldId);

    if([FieldControlType.TEXT, FieldControlType.EMAIL, FieldControlType.PASSWORD, FieldControlType.TEXT_AREA]
      .includes(filtercontrolType)) {
        return criteria.values ? criteria.values.toString() : '';
    } else if (filtercontrolType === FieldControlType.NUMBER) {
      return `From ${this.activeFilter.startValue || '0'} to ${this.activeFilter.endValue || '0'}`;
    }
    return criteria.values ? criteria.values.toString() : '';
  }

  /**
   * update filter value
   * @param event new value
   * @returns void
   */
  updateFilterValue(event) {

    const filtercontrolType = this.getFieldControlType(this.activeFilter.fieldId);

    if([FieldControlType.TEXT, FieldControlType.EMAIL, FieldControlType.PASSWORD, FieldControlType.TEXT_AREA]
        .includes(filtercontrolType)) {
          this.activeFilter.values = [event];
          return;
    } else if (filtercontrolType === FieldControlType.NUMBER) {
      console.log(event, ' ', this.activeFilter.values);
        this.activeFilter.startValue = event.min;
        this.activeFilter.endValue = event.max;
        return;
    }

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
        this.filterFieldsMetadata = this.filterFieldsMetadata.filter(f => f.fieldId !== fieldId);
        this.suggestedFilters = this.suggestedFilters.filter(f => f.fieldId !== fieldId);
      }
    });
  }

  /**
   * get field control type based on field metadata
   * @param fieldId field id
   * @returns control type for filter value
   */
  getFieldControlType(fieldId) {
    const field = this.moduleFieldsMetatdata.find(f => f.fieldId === fieldId);
    if(field) {

      if(field.picklist === '0' && field.dataType === 'CHAR') {
        return FieldControlType.TEXT;
      }

      if(field.picklist === '0' && field.dataType === 'PASS') {
        return FieldControlType.PASSWORD;
      }

      if(field.picklist === '0' && field.dataType === 'EMAIL') {
        return FieldControlType.EMAIL;
      }

      if(field.picklist === '22' && field.dataType === 'CHAR') {
        return FieldControlType.TEXT_AREA;
      }

      if(field.picklist === '0' && field.dataType === 'NUMC') {
        return FieldControlType.NUMBER;
      }

    }

    return FieldControlType.TEXT;
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
