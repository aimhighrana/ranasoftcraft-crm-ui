import { Component, OnInit, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { SchemalistService } from '@services/home/schema/schemalist.service';

@Component({
  selector: 'pros-navigation-dropdown',
  templateUrl: './navigation-dropdown.component.html',
  styleUrls: ['./navigation-dropdown.component.scss']
})
export class NavigationDropdownComponent implements OnInit, OnChanges {

  /**
   * After option selection change event should be emit
   */
  @Output() selectedModule = new EventEmitter();

  /**
   * Modules list to pre-populate
   */
  modulesList = [];

  /**
   * Schema list to pre-populate
   */
  schemaLists = [];

  /**
   * save required data for upload-dataset
   */
  data : any = {};

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
      }
    });
  }

  /**
   * Open schemalist by using that objectId
   * @param objectId value selected oject
   */
  schemaList(objectId) {
    this.modulesList.forEach(module => {
      if(module.moduleId === objectId) {
        this.data.objectid = module.moduleId;
        this.data.objectdesc = module.moduleDesc;
        this.schemaLists = module.schemaLists;
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
   * should emit the selected data
   */
  emitSelection() {
    this.selectedModule.emit();
  }
}
