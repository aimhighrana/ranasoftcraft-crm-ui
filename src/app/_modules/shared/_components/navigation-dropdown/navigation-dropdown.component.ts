import { Component, OnInit, Output, EventEmitter, OnChanges, SimpleChanges, ViewChild } from '@angular/core';
import { SchemalistService } from '@services/home/schema/schemalist.service';
import { Observable, Subscriber } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { SearchInputComponent } from '../search-input/search-input.component';

@Component({
  selector: 'pros-navigation-dropdown',
  templateUrl: './navigation-dropdown.component.html',
  styleUrls: ['./navigation-dropdown.component.scss']
})
export class NavigationDropdownComponent implements OnInit, OnChanges {
  /**
   * Reference to the search input component for schema
   */
  @ViewChild('searchInput') searchInput: SearchInputComponent;

  /**
   * After option selection change event should be emit
   */
  @Output() selectedModule = new EventEmitter();

  /**
   * Modules list to pre-populate
   */
  modulesList = [];

  /**
   * Filtered Modules list to pre-populate
   */
  filteredModulesList = [];

  /**
   * Schema list to pre-populate
   */
  schemaLists = [];

  /**
   * Filtered Schema list to pre-populate
   */
  filteredSchemaList = [];

  /**
   * save required data for upload-dataset
   */
  data: any = {};

  enteredItem = false;
  isMatMenuOpen = false;
  isMatMenu2Open = false;
  prevItemTrigger;

  /**
   * constructor of class
   * @param schemaListService Instance the Schema List service class
   */
  constructor(
    private schemaListService: SchemalistService
  ) { }

  ngOnChanges(changes: SimpleChanges) {
    if (changes && changes.value && changes.value.previousValue !== changes.value.currentValue) {
      this.selectedModule.emit(changes.value)
    }
  }

  /**
   * load pre loaded function
   */
  ngOnInit(): void {
    this.getObjectTypes();
  }

  /**
   * return all the modules with their schemas
   */
  getObjectTypes() {
    this.schemaListService.getSchemaList().subscribe((modules: []) => {
      if (modules && modules.length > 0) {
        this.modulesList.push(...modules);
        this.filteredModulesList = this.modulesList;
      }
    });
  }

  /**
   * Open schemalist by using that objectId
   * @param objectId value selected oject
   */
  schemaList(objectId) {
    this.searchInput.clearSearch();
    this.modulesList.forEach(module => {
      if (module.moduleId === objectId) {
        this.data.objectid = module.moduleId;
        this.data.objectdesc = module.moduleDesc;
        this.schemaLists = module.schemaLists;
        this.filteredSchemaList = module.schemaLists;
      }
    })
  }

  /**
   * set data of selected schemaId or for new schema
   * @param schema value when existing schema selected
   */
  selectschema(schema?) {
    this.data.schemaId = schema ? schema.schemaId : null;
    this.data.schemadesc = schema ? schema.schemaDescription : null;
    this.selectedModule.emit(this.data);
  }

  /**
   * filter modules based on searchTerm
   * @param searchTerm pass the search text
   */
  searchModule(searchTerm: string) {
    if (this.modulesList && this.modulesList.length > 0) {
      this.searchFilter(this.modulesList, searchTerm, 'moduleDesc')
      .pipe(debounceTime(100))
      .subscribe((filteredresult) => {
        this.filteredModulesList = filteredresult;
      });
    }
  }

  /**
   * filter schemas based on searchTerm
   * @param searchTerm pass the search text
   */
  searchSchema(searchTerm: string) {
    if (this.schemaLists && this.schemaLists.length > 0) {
      this.searchFilter(this.schemaLists, searchTerm, 'schemaDescription')
      .pipe(debounceTime(100))
      .subscribe((filteredresult) => {
        this.filteredSchemaList = filteredresult;
      });
    }
  }

  /**
   * Track items in a list while rendering
   * @param index pass the index of the item
   * @param itemId optionally pass the item id
   */
  schemaTrackBy(index: any, itemId: any) {
    return index;
  }

  /**
   * Track items in a list while rendering
   * @param index pass the index of the item
   * @param itemId optionally pass the item id
   */
  moduleTrackBy(index: any, itemId: any) {
    return index;
  }

  /**
   * should emit the selected data
   */
  emitSelection() {
    this.selectedModule.emit();
  }


  /**
   * Method to filter results from an object array
   * based on search string
   * @param values array of available values
   * @param searchTerm text to search
   * @param key property name to map the search string to
   */
  searchFilter(values: any[], searchTerm: string, key: string): Observable<any[]> {
    let returnValues = null;
    return new Observable((subscriber: Subscriber<any[]>) => {
      if (!values || values.length === 0 || !searchTerm) {
        returnValues = values;
      }
      if (key !== null && typeof key !== 'undefined') {
        returnValues = values.filter((val) => {
          return val && val[key]? val[key].toLowerCase().indexOf(searchTerm.toLowerCase()) !== -1
            : false;
        });
      }
      subscriber.next(returnValues);
    })
  }
}
