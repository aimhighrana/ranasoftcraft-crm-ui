import { Component, OnInit, ViewChild, AfterViewInit, ElementRef } from '@angular/core';
import { Breadcrumb } from 'src/app/_models/breadcrumb';
import { SchemaService } from 'src/app/_services/home/schema.service';
import { ObjectTypeResponse, GetAllSchemabymoduleidsReq, GetAllSchemabymoduleidsRes, CreateSchemaGroupRequest, SchemaGroupWithAssignSchemas } from 'src/app/_models/schema/schema';
import { FormControl } from '@angular/forms';
import { Observable, of } from 'rxjs';
import { MatAutocomplete, MatChipInputEvent, MatAutocompleteSelectedEvent } from '@angular/material';
import { ENTER, COMMA } from '@angular/cdk/keycodes';
import { Router, ActivatedRoute } from '@angular/router';

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
  groupId: string;
  groupDetails: SchemaGroupWithAssignSchemas;
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

  @ViewChild('moduleSearchInp', {static: false}) moduleSearchInp: ElementRef<HTMLInputElement>;
  @ViewChild('auto', {static: false}) matAutocomplete: MatAutocomplete;
  constructor(
    private schemaService: SchemaService,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {
    this.groupNameFrmCtrl = new FormControl();
    this.searchLodedSchemaCtrl = new FormControl();
    this.groupDetails = new SchemaGroupWithAssignSchemas();
    this.filteredModules = of([]);
  }

  ngOnInit() {
      /**
       * get all obejct type on load the component
       */
      this.getAllModuleList();

      /**
       * Subscribe the Activated router for group id
       */
      this.activatedRoute.params.subscribe(params => {
          if (this.groupId !== params.groupId && params.groupId !== 'new') {
            this.groupId = params.groupId;
            this.getSchemaGroupDetailsByGroupId(this.groupId);
          }
      });
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
  /**
   * add while search click on object type   *
   */
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

  /**
   * This method will help us for remove object type from selected objects
   *  objectType
   */
  remove(objectType: ObjectTypeResponse): void {
    const index = this.selectedModules.indexOf(objectType);
    if (index >= 0) {
      this.selectedModules.splice(index, 1);
      this.getAllSchemaByModuleId();
    }
  }
  /**
   * While selection object from object type this method will help us to get assigned schema(s)
   *  event
   */
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

  /**
   * Make a service call for getting all modules
   */
  private getAllModuleList() {
    this.schemaService.getAllObjectType().subscribe(data => {
      this.moduleList = data;
    }, error => {
      console.error('Error whiel fetching modules');
    });
  }

  /**
   * Will help us for display the object decsription from objectType object
   *  objectType
   */
  displayFn(objectType: ObjectTypeResponse): string | undefined {
    return objectType ? objectType.objectdesc : '';
  }

  /**
   * While this component open in edit mode , push all selected object to selectedModules
   */
  private editGroupSelectedObjects() {
    this.selectedModules = [];
    this.groupDetails.objectId.forEach(objId => {
      this.selectedModules.push(this.moduleList.filter(module => module.objectid === objId)[0]);
    });
  }

  /**
   * Getting all schema(s) based on object ids
   * If there is no schema(s) on selected object then the null state will be visiable
   */
  public getAllSchemaByModuleId() {
    const selSchemaId: string[] = [];
    this.selectedModules.forEach(module => {
      selSchemaId.push(module.objectid);
    });
    const getAllSchemabymoduleidsReq: GetAllSchemabymoduleidsReq = new GetAllSchemabymoduleidsReq();
    getAllSchemabymoduleidsReq.mosuleIds = selSchemaId;
    this.schemaService.getAllSchemabymoduleids(getAllSchemabymoduleidsReq).subscribe(
      data => {
        const resData = this.getSchemaListResponseAsSelected(data);
        this.schemaList = resData;
        this.schemaListObservable = of(resData);
        this.showNullState =  data.length > 0 ? false : true;
      }, error => {
        console.error('Error while fetching schema list');
      }
    );
  }

  /**
   * Will be called when we getting some schema from selected object ids and make as pre selected
   *  data get all schema response
   */
  private getSchemaListResponseAsSelected(data: GetAllSchemabymoduleidsRes[]) {
    let returnData: GetAllSchemabymoduleidsRes[] = [];
    if (this.selectedSchemaId && this.selectedSchemaId.length > 0) {
      data.forEach(schema => {
        const selSchema = this.selectedSchemaId.filter(selSc => selSc === schema.schemaId)[0];
        if (selSchema) {
          schema.isSelected = true;
        } else {
          schema.isSelected = false;
        }
        returnData.push(schema);
      });
    } else {
      returnData = data;
    }
    return returnData;
  }

  /**
   * For save or update schema group
   */
  public saveSchemaGroup() {
    const createSchemaGroup: CreateSchemaGroupRequest = new CreateSchemaGroupRequest();
    createSchemaGroup.moduleIds = this.selectedModules.map(data => data.objectid);
    createSchemaGroup.schemaGroupName = this.groupNameFrmCtrl.value;
    createSchemaGroup.schemaIds = this.selectedSchemaId;
    createSchemaGroup.groupId = (this.groupId && this.groupId !== 'new') ? this.groupId : '';
    this.schemaService.createSchemaGroup(createSchemaGroup).subscribe(
      data => {
        this.router.navigate(['/home/schema']);
      },
      error => {
        console.error('Error while saving schema group !');
      }
    );
  }
  /**
   * This method help us for manage the schema selection
   *  event mat checkbox change event
   *  schemaId
   */
  public manageSelectedSchemas(event, schemaId: number) {
    if (schemaId) {
      const index = this.selectedSchemaId.indexOf(schemaId);
      if (index >= 0) {
        this.selectedSchemaId.splice(index, 1);
      } else if (event.checked) {
        this.selectedSchemaId.push(schemaId);
      }
    }
  }
  /**
   * Get the group detail with assigned schema(s) while editing the exiting group
   *  groupId
   */
  public getSchemaGroupDetailsByGroupId(groupId: string) {
    this.schemaService.getSchemaGroupDetailsByGroupId(groupId).subscribe(data => {
      this.groupDetails = data;
      this.breadcrumb.heading = 'Edit ' + this.groupDetails.groupName;
      this.groupNameFrmCtrl.setValue(this.groupDetails.groupName);

      // set selected schema id while edit group
      this.groupDetails.schemaGroupMappings.forEach(grpDel => {
        this.selectedSchemaId.push(grpDel.schemaId);
      });

      // get the object number while edit group
      this.editGroupSelectedObjects();

      // get all schema on selected object ids while edit group
      this.getAllSchemaByModuleId();
    }, error => {
      console.error('Error while fetching group details');
    });
  }

  /**
   * Leave this page , back to schema group
   */
  public resetFields() {
    this.router.navigate(['/home/schema']);
  }

}
