import { Component, OnInit, ViewChild, AfterViewInit, ElementRef } from '@angular/core';
import { Breadcrumb } from 'src/app/_models/breadcrumb';
import { SchemaService } from 'src/app/_services/home/schema.service';
import { SchemaMappingListComponent } from './schema-mapping-list/schema-mapping-list.component';
import { ObjectTypeResponse, GetAllSchemabymoduleidsReq, GetAllSchemabymoduleidsRes, CreateSchemaGroupRequest } from 'src/app/_models/schema/schema';
import { FormControl } from '@angular/forms';
import { Observable, of } from 'rxjs';
import { startWith, map } from 'rxjs/operators';
import { MatAutocomplete, MatChipInputEvent, MatAutocompleteSelectedEvent } from '@angular/material';
import { ENTER, COMMA } from '@angular/cdk/keycodes';
import { Router } from '@angular/router';

@Component({
  selector: 'pros-schema-group-mapping',
  templateUrl: './schema-group-mapping.component.html',
  styleUrls: ['./schema-group-mapping.component.scss']
})
export class SchemaGroupMappingComponent implements OnInit, AfterViewInit {
  breadcrumb: Breadcrumb = {
    heading: 'Add a new schema group',
    links: [
      {
        link: '/home/schema',
        text: 'Schema group(s)'
      }
    ]
  };
  showNullState = true;
  moduleList: ObjectTypeResponse[] = [];
  selectedModules: ObjectTypeResponse[] = [];
  schemaList: GetAllSchemabymoduleidsRes[] = [];
  schemaListObservable: Observable<GetAllSchemabymoduleidsRes[]> = of([]);
  selectedSchemaId: number[] = [];
  groupNameFrmCtrl: FormControl;
  moduleInpCtrl = new FormControl();
  searchLodedSchemaCtrl: FormControl;
  removable = true;
  filteredModules: Observable<ObjectTypeResponse[]>;
  visible = true;
  selectable = true;
  addOnBlur = true;
  separatorKeysCodes: number[] = [ENTER, COMMA];

  @ViewChild(SchemaMappingListComponent, { static: false }) schemaMappingListComponent: SchemaMappingListComponent;
  @ViewChild('moduleSearchInp', {static: false}) moduleSearchInp: ElementRef<HTMLInputElement>;
  @ViewChild('auto', {static: false}) matAutocomplete: MatAutocomplete;
  constructor(
    private schemaService: SchemaService,
    private router: Router
  ) {
    this.groupNameFrmCtrl = new FormControl();
    this.searchLodedSchemaCtrl = new FormControl();
  }

  ngOnInit() {
     this.getAllModuleList();
     this.filteredModules = this.moduleInpCtrl.valueChanges.pipe(
        startWith(''),
        map((module: string | null) => module ? this._modulefilter(module) : this.moduleList.slice())
      );
     this.searchLodedSchemaCtrl.valueChanges.subscribe(
        data => {
          const filterData = this.schemaList.filter(schema => (schema.discription.toLowerCase().indexOf(data.toLowerCase()) === 0));
          this.schemaListObservable = of(filterData);
          filterData.length <= 0 ? this.showNullState = true : this.showNullState = false;

        }
      );
  }
  ngAfterViewInit() {

  }

  private _modulefilter(value: string): ObjectTypeResponse[] {
    const filterValue = value.toLowerCase();
    return this.moduleList.filter(module => module.objectdesc.toLowerCase().indexOf(filterValue) === 0);
  }
  add(event: MatChipInputEvent): void {
    if (!this.matAutocomplete.isOpen) {
      const input = event.input;
      const value = event.value;

      // Add our fruit
      if ((value || '').trim()) {
       // this.selectedModules.push(value);
      }

      // Reset the input value
      if (input) {
        input.value = '';
      }

      this.moduleInpCtrl.setValue(null);
    }
  }

  remove(fruit: ObjectTypeResponse): void {
    const index = this.selectedModules.indexOf(fruit);
    if (index >= 0) {
      this.selectedModules.splice(index, 1);
      this.getAllSchemaByModuleId();
    }
  }

  selected(event: MatAutocompleteSelectedEvent): void {
    const selData =  event.option.value;
    const exitData =  this.selectedModules.filter(data => data.objectid === selData.objectid);
    if (exitData.length === 0) {
      this.selectedModules.push(selData);
      this.moduleSearchInp.nativeElement.value = '';
      this.moduleInpCtrl.setValue(null);
      this.getAllSchemaByModuleId();
    }

  }

  private getAllModuleList() {
    this.schemaService.getAllObjectType().subscribe(data => {
      this.moduleList = data;
    }, error => {
      console.error('Error whiel fetching modules');
    });
  }
  displayFn(objectType: ObjectTypeResponse): string | undefined {
    return objectType ? objectType.objectdesc : '';
  }

  public getAllSchemaByModuleId() {
    const selSchemaId: string[] = [];
    this.selectedModules.forEach(module => {
      selSchemaId.push(module.objectid);
    });
    const getAllSchemabymoduleidsReq: GetAllSchemabymoduleidsReq = new GetAllSchemabymoduleidsReq();
    getAllSchemabymoduleidsReq.mosuleIds = selSchemaId;
    this.schemaService.getAllSchemabymoduleids(getAllSchemabymoduleidsReq).subscribe(
      data => {
        this.schemaList = data;
        this.schemaListObservable = of(this.schemaList);
        this.showNullState =  data.length > 0 ? false : true;
      }, error => {
        console.error('Error while fetching schema list');
      }
    );
  }

  public saveSchemaGroup() {
    const createSchemaGroup: CreateSchemaGroupRequest = new CreateSchemaGroupRequest();
    createSchemaGroup.moduleIds = this.selectedModules.map(data => data.objectid);
    createSchemaGroup.schemaGroupName = this.groupNameFrmCtrl.value;
    createSchemaGroup.schemaIds = this.selectedSchemaId;
    this.schemaService.createSchemaGroup(createSchemaGroup).subscribe(
      data => {
        this.router.navigate(['/home/schema']);
      },
      error => {
        console.error('Error while saving schema group !');
      }
    );
  }
  public manageSelectedSchemas(selectedSchemaData) {
    if (selectedSchemaData) {
      const index = this.selectedSchemaId.indexOf(selectedSchemaData.schemaId);
      if (index >= 0) {
        this.selectedSchemaId.splice(index, 0);
      } else {
        this.selectedSchemaId.push(selectedSchemaData.schemaId);
      }
    }
  }

}
