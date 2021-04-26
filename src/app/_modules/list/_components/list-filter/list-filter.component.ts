import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatAutocomplete, MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { ActivatedRoute, Router } from '@angular/router';
import { FieldMetaData } from '@models/core/coreModel';
import { DATE_FILTERS_METADATA, FieldControlType, FilterCriteria, ListPageFilters } from '@models/list-page/listpage';
import { CoreService } from '@services/core/core.service';
import { GlobaldialogService } from '@services/globaldialog.service';
import { Observable, Subject, Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged, map, startWith } from 'rxjs/operators';
import * as moment from 'moment';

@Component({
  selector: 'pros-list-filter',
  templateUrl: './list-filter.component.html',
  styleUrls: ['./list-filter.component.scss']
})
export class ListFilterComponent implements OnInit {

  /**
   * Form control for the input
   */
  optionCtrl2 = new FormControl();

  /**
   * hold the list of filtered options
   */
  filteredOptions: Observable<string[]>;

  /**
   * Available options list
   */
  allOptions: string[] = ['One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine', 'Ten'];

  /**
   * Reference to the input
   */
  @ViewChild('optionInput2') optionInput2: ElementRef<HTMLInputElement>;

  /**
   * reference to auto-complete
   */
  @ViewChild('auto') matAutocomplete: MatAutocomplete;
  selectedValue: any;

  selected: any;


  periods = [
    { value: 'Daily', key: 1 },
    { value: 'Weekly', key: 2 },
    { value: 'Monthly', key: 3 },
    { value: 'Quarterly', key: 4 },
    { value: 'Yearly', key: 5 },
  ];

  rulelist = [
    { label: 'Is', value: 'EQUAL' },
    { label: 'Is not', value: 'NOT_EQUAL' }
  ]

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

  dateFilterOptions: any[] = [];

  DATE_FILTERS_METADATA = DATE_FILTERS_METADATA;

  dropdownValues: any[] = [
    {key: 'Tunisia', value: 'Tunisia'},
    {key: 'India', value: 'India'}
  ];

  constructor(
    private activatedRouter: ActivatedRoute,
    private router: Router,
    private coreService: CoreService,
    private glocalDialogService: GlobaldialogService) {

    this.filteredOptions = this.optionCtrl2.valueChanges.pipe(
      startWith(''),
      map((num: string | null) => num ? this._filter(num) : this.allOptions.slice()));
  }

  /**
   * mehtod to filter items based on the searchterm
   * @param value searchTerm
   * @returns string[]
   */
  _filter(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.allOptions.filter(num => num.toLowerCase().indexOf(filterValue) === 0);
  }

  /**
   * method to add item to selected items
   * for single sleect
   * @param event item
   */
  selectSingle(event: MatAutocompleteSelectedEvent): void {
    this.selectedValue = event.option.value;
  }

  ngOnInit(): void {
    let sub = this.activatedRouter.params.subscribe(params => {
      this.moduleId = params.moduleId;
      this.getModuleFldMetadata();
    });
    this.subscriptionsList.push(sub);

    sub = this.activatedRouter.queryParams.pipe(
      map(params => {
        if (params.f) {
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
        this.suggestedFilters = JSON.parse(JSON.stringify(this.filtersList.filterCriteria));
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
        this.activeFilter = null;
        this.suggestedFilters = this.filtersList.filterCriteria
          .filter(field => this.getFieldDescription(field.fieldId).toLowerCase().includes(this.fieldsSearchString.toLowerCase()));
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

    if (loadMore) {
      this.fieldsPageIndex++;
    } else {
      this.fieldsPageIndex = 0;
    }
    const sub = this.coreService.searchFieldsMetadata(this.moduleId, this.fieldsPageIndex, this.fieldsSearchString, 20).subscribe(response => {
      if (response && response.length) {
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
    const allFiltersIndex = this.filtersList.filterCriteria.findIndex(fc => fc.fieldId === this.activeFilter.fieldId);
    if (allFiltersIndex !== -1) {
      this.filtersList.filterCriteria[allFiltersIndex] = filter;
      const suggFiltersIndex = this.filtersList.filterCriteria.findIndex(fc => fc.fieldId === this.activeFilter.fieldId);
      this.suggestedFilters[suggFiltersIndex] = filter;
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
    if (filter) {
      this.activeFilter = JSON.parse(JSON.stringify(filter));
      if(this.getFieldControlType(fieldId) === FieldControlType.DATE) {
        if(!['static_date','static_range'].includes(this.activeFilter.unit)) {
          this.dateFilterOptions = this.DATE_FILTERS_METADATA.find(metadata => metadata.options.some(op => op.value === this.activeFilter.unit))
            .options.map(option => {return {key:option.value,value:option.value}});
        }
      }
    } else {
      this.activeFilter = new FilterCriteria();
      this.activeFilter.fieldId = fieldId;
      this.activeFilter.operator = 'EQUAL';
      this.activeFilter.values = [];
      this.activeFilter.esFieldPath = `hdvs.${fieldId}`;

      if(this.getFieldControlType(fieldId) === FieldControlType.DATE) {
        this.dateFilterOptions = this.DATE_FILTERS_METADATA[0].options.map(option => {return {key:option.value,value:option.value}});
        this.activeFilter.unit = this.dateFilterOptions[0].value;
      }
    }
  }

  /**
   * get field desc based on field id
   * @returns field description
   */
  getFieldDescription(fieldId) {
    const field = this.moduleFieldsMetatdata.find(f => f.fieldId === fieldId) || this.filterFieldsMetadata.find(f => f.fieldId === fieldId);
    return field ? field.fieldDescri || 'Unknown' : 'Unknown';
  }

  /**
   * Format filter value based on field metadata
   * @param fieldId field id
   * @returns string
   */
  FormatFilterValue(filterCriteria: FilterCriteria) {

    const filtercontrolType = this.getFieldControlType(filterCriteria.fieldId);

    if ([FieldControlType.TEXT, FieldControlType.EMAIL, FieldControlType.PASSWORD, FieldControlType.TEXT_AREA].includes(filtercontrolType)) {
      return filterCriteria.values ? filterCriteria.values.toString() : '';
    } else if (filtercontrolType === FieldControlType.NUMBER) {
      return `From ${filterCriteria.startValue || '0'} to ${filterCriteria.endValue || '0'}`;
    } else if ([FieldControlType.SINGLE_SELECT, FieldControlType.MULTI_SELECT].includes(filtercontrolType)) {
      return `${filterCriteria.operator === 'EQUAL' ? 'Is' : 'Is not'} ${filterCriteria.values.toString()}`;
    } else if (filtercontrolType === FieldControlType.DATE) {
      if(filterCriteria.unit === 'static_date') {
        return moment(+filterCriteria.startValue).format('MM/DD/YYYY');
      } else if(filterCriteria.unit === 'static_range') {
        return `${moment(+filterCriteria.startValue).format('MM/DD/YYYY')} to ${moment(+filterCriteria.endValue).format('MM/DD/YYYY')}`;
      }
      return filterCriteria.unit;
    } else if (filtercontrolType === FieldControlType.TIME) {
      const start = moment(+filterCriteria.startValue).format('HH:mm')
      const end = moment(+filterCriteria.endValue).format('HH:mm');
      return  `from ${start} to ${end}`;
    }

    return filterCriteria.values ? filterCriteria.values.toString() : '';
  }

  /**
   * get filter value based on field metadata
   * @param fieldId field id
   * @returns any
   */
   getFilterValue(filterCriteria: FilterCriteria) {

    const filtercontrolType = this.getFieldControlType(filterCriteria.fieldId);

    if (filtercontrolType === FieldControlType.DATE) {
      if(filterCriteria.unit === 'static_date') {
        return moment(+filterCriteria.startValue).toDate();
      } else if(filterCriteria.unit === 'static_range') {
        return {start: moment(+filterCriteria.startValue).toDate(), end: moment(+filterCriteria.endValue).toDate()};
      } else {
        return this.dateFilterOptions.find(op => op.key === filterCriteria.unit) || '';
      }
    }

    if(filtercontrolType === FieldControlType.SINGLE_SELECT) {
      return  this.dropdownValues.find(option => option.key === this.activeFilter.values.toString()) || '';
    }

    if(filtercontrolType === FieldControlType.TIME) {
      const startHour = moment(+(filterCriteria.startValue||0)).hours();
      const startMinutes = moment(+(filterCriteria.startValue||0)).minutes() || 0;
      let endHour = moment(+(filterCriteria.endValue||1)).hours() || 0;
      let endMinutes = moment(+(filterCriteria.endValue||0)).minutes() || 0;
      if(startHour >= endHour) {
        endHour = startHour;
        endMinutes = endMinutes >= startMinutes ? endMinutes : startMinutes;
      }
      return  { startHour, startMinutes, endHour, endMinutes };
    }

    return filterCriteria.values ? filterCriteria.values.toString() : '';
  }

  /**
   * update filter value
   * @param event new value
   * @returns void
   */
  updateFilterValue(event) {

    const filtercontrolType = this.getFieldControlType(this.activeFilter.fieldId);

    if ([FieldControlType.TEXT, FieldControlType.EMAIL, FieldControlType.PASSWORD, FieldControlType.TEXT_AREA].includes(filtercontrolType)) {
      this.activeFilter.values = [event];
      return;
    } else if (filtercontrolType === FieldControlType.NUMBER) {
      this.activeFilter.startValue = event.min || 0;
      this.activeFilter.endValue = event.max || 1;
      return;
    } else if (filtercontrolType === FieldControlType.SINGLE_SELECT) {
      this.activeFilter.values = [event.key];
      return;
    } else if (filtercontrolType === FieldControlType.MULTI_SELECT) {
      const index = this.activeFilter.values.findIndex(v => v === event);
      if(index !== -1) {
        this.activeFilter.values.splice(index, 1);
      } else {
        this.activeFilter.values.push(event);
      }
      return;
    } else if (filtercontrolType === FieldControlType.DATE) {
      console.log(event);
      if(this.activeFilter.unit === 'static_date') {
        this.activeFilter.startValue = moment(event).startOf('day').toDate().getTime().toString();
        this.activeFilter.endValue = moment(event).endOf('day').toDate().getTime().toString();
      } else if(this.activeFilter.unit === 'static_range') {
        this.activeFilter.startValue = moment(event.start).startOf('day').toDate().getTime().toString();
        this.activeFilter.endValue = moment(event.end).endOf('day').toDate().getTime().toString();
      } else {
        this.activeFilter.unit = event;
      }
      console.log(this.activeFilter);
      return;
    } else if (filtercontrolType === FieldControlType.TIME) {
      console.log(event);
    }

    this.activeFilter.values = [event];
  }

  timefilterChange(value, from) {
    switch(from) {
      case 'startHour': this.activeFilter.startValue = moment(+(this.activeFilter.startValue || 0)).set('hour',value).toDate().getTime().toString(); //
        break;
      case 'startMinutes': this.activeFilter.startValue = moment(+(this.activeFilter.startValue || 0)).set('minute',value).toDate().getTime().toString();
      break;
      case 'endHour': this.activeFilter.endValue = moment(+(this.activeFilter.endValue || 0)).set('hour',value).toDate().getTime().toString();
      break;
      case 'endMinutes': this.activeFilter.endValue = moment(+(this.activeFilter.endValue || 0)).set('minute',value).toDate().getTime().toString();
      break;
    }
  }

  /**
   * Reset all filters
   */
  clearAllFilters() {
    this.glocalDialogService.confirm({ label: 'Are you sure to reset all filters ?' }, (resp) => {
      if (resp && resp === 'yes') {
        this.filtersList.filterCriteria = [];
        this.suggestedFilters = [];
        this.activeFilter = null;
      }
    });
  }

  /**
   * Remove an applied filter
   * @param index filter index
   */
  removeFilter(index, fieldId) {
    this.glocalDialogService.confirm({ label: 'Are you sure to remove this filter ?' }, (resp) => {
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
    const field = this.moduleFieldsMetatdata.find(f => f.fieldId === fieldId) || this.filterFieldsMetadata.find(f => f.fieldId === fieldId);
    if (field) {

      if (field.picklist === '0' && field.dataType === 'CHAR') {
        return FieldControlType.TEXT;
      }

      if (field.picklist === '0' && field.dataType === 'PASS') {
        return FieldControlType.PASSWORD;
      }

      if (field.picklist === '0' && field.dataType === 'EMAIL') {
        return FieldControlType.EMAIL;
      }

      if (field.picklist === '22' && field.dataType === 'CHAR') {
        return FieldControlType.TEXT_AREA;
      }

      if (field.picklist === '0' && field.dataType === 'NUMC') {
        return FieldControlType.NUMBER;
      }

      if(['1', '30', '37'].includes(field.picklist)) {
        return field.isMultiselect === 'true' ? FieldControlType.MULTI_SELECT : FieldControlType.SINGLE_SELECT;
      }

      if(field.picklist === '0' && field.dataType === 'DATS') {
        return FieldControlType.DATE;
      }

      if(field.picklist === '0' && field.dataType === 'TIMS') {
        return FieldControlType.TIME;
      }

    }

    return FieldControlType.TEXT;
  }

  dateFilterSelected(filterMetadata) {
    this.dateFilterOptions = filterMetadata.options.map(op => { return {key:op.value, value:op.value}});
    if(['static_date', 'static_range'].includes(filterMetadata.category)) {
      this.activeFilter.unit = filterMetadata.category;
    } else {
      this.activeFilter.unit = this.dateFilterOptions[0].value;
    }
  }

  /**
   * close sidesheet
   */
  close() {
    if (this.filtersList.filterCriteria && this.filtersList.filterCriteria.length) {
      const filters = btoa(JSON.stringify(this.filtersList));
      this.router.navigate([{ outlets: { sb: null } }], { queryParams: { f: filters } });
    } else {
      this.router.navigate([{ outlets: { sb: null } }], { queryParams: {} });
    }
  }

}
