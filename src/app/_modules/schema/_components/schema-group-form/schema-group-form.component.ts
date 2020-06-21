import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Breadcrumb } from 'src/app/_models/breadcrumb';
import { SchemaService } from 'src/app/_services/home/schema.service';
import { ObjectTypeResponse, GetAllSchemabymoduleidsReq, GetAllSchemabymoduleidsRes, CreateSchemaGroupRequest, SchemaGroupWithAssignSchemas, SchemaGroupMapping } from 'src/app/_models/schema/schema';
import { FormControl } from '@angular/forms';
import { Observable, of } from 'rxjs';
import { MatAutocomplete, MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatChipInputEvent } from '@angular/material/chips';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'pros-schema-group-form',
  templateUrl: './schema-group-form.component.html',
  styleUrls: ['./schema-group-form.component.scss']
})
export class SchemaGroupFormComponent implements OnInit {
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
  schemaList: GetAllSchemabymoduleidsRes[] = [];
  schemaListObservable: Observable<GetAllSchemabymoduleidsRes[]> = of([]);
  groupNameFrmCtrl: FormControl;
  moduleInpCtrl = new FormControl();
  searchLodedSchemaCtrl: FormControl;
  filteredModules: Observable<ObjectTypeResponse[]>;

  @ViewChild('moduleSearchInp',{static: true}) moduleSearchInp: ElementRef<HTMLInputElement>;
  @ViewChild('auto',{static: true}) matAutocomplete: MatAutocomplete;
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
      /**
       * Search all
       */
      this.searchLodedSchemaCtrl.valueChanges.subscribe(
          data => {
            const filterData = this.schemaList.filter(schema => (schema.discription.toLowerCase().indexOf(data.toLowerCase()) === 0));
            this.schemaListObservable = of(filterData);
            filterData.length <= 0 ? this.showNullState = true : this.showNullState = false;

          }
      );

      /**
       * Update object type list on filter data
       */
      this.moduleInpCtrl.valueChanges.subscribe(value => {
        if (value instanceof ObjectTypeResponse) {} else if(value && value !==''){
          const filteredObjectTypes = this.moduleList.filter(module => (module.objectdesc.toLowerCase().indexOf(value.toLowerCase())) === 0);
          this.filteredModules = of(filteredObjectTypes);
        } else {
          this.filteredModules = of(this.moduleList);
        }
      });

      /**
       * update schema group description
       */
      this.groupNameFrmCtrl.valueChanges.subscribe(data => {
        this.groupDetails.groupName = data;
      });
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
  remove(objectId: string): void {
    const objectIds: string[] = this.groupDetails.objectId ? this.groupDetails.objectId : [];
    const index = objectIds.indexOf(objectId);
    if (index >= 0) {
      objectIds.splice(index, 1);
      this.groupDetails.objectId = objectIds;
      this.getAllSchemaByModuleId();
    }
  }
  /**
   * While selection object from object type this method will help us to get assigned schema(s)
   *  event
   */
  selected(event: MatAutocompleteSelectedEvent): void {
    const selData =  event.option? event.option.value : '';
    const objectIds: string[] = this.groupDetails.objectId ? this.groupDetails.objectId : [];
    const exitData =  objectIds.filter(objId => objId === selData.objectId);
    if (exitData.length === 0) {
      objectIds.push(selData.objectid);
      this.groupDetails.objectId = objectIds;
      this.moduleSearchInp.nativeElement.value = '';
      this.moduleInpCtrl.setValue(null);
      this.getAllSchemaByModuleId();
    }

  }

  /**
   * Make a service call for getting all modules
   */
  public getAllModuleList() {
    this.schemaService.getAllObjectType().subscribe(data => {
      this.moduleList = data;
      this.filteredModules = of(data);
    }, error => {
      console.error('Error while fetching modules');
    });
  }

  /**
   * Will help us for display the object description from objectType object
   *  objectType
   */
  displayFn(objectType: ObjectTypeResponse): string | undefined {
    return objectType ? objectType.objectdesc : '';
  }

  /**
   * Getting all schema(s) based on object ids
   * If there is no schema(s) on selected object then the null state will be visiable
   */
  public getAllSchemaByModuleId() {
    const selSchemaId: string[] = this.groupDetails.objectId;
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
  public getSchemaListResponseAsSelected(data: GetAllSchemabymoduleidsRes[]) {
    let returnData: GetAllSchemabymoduleidsRes[] = [];
    if (this.groupDetails.schemaGroupMappings && this.groupDetails.schemaGroupMappings.length > 0) {
      data.forEach(schema => {
        const selSchema = this.groupDetails.schemaGroupMappings.filter(selSc => selSc.schemaId === schema.schemaId)[0];
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
    createSchemaGroup.moduleIds = this.groupDetails.objectId;
    createSchemaGroup.schemaGroupName = this.groupDetails.groupName;
    createSchemaGroup.schemaIds = this.groupDetails.schemaGroupMappings ? this.groupDetails.schemaGroupMappings.map(grp => grp.schemaId) : [];
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
      const schemaGrpMapSchemaIds: SchemaGroupMapping[] = this.groupDetails.schemaGroupMappings ? this.groupDetails.schemaGroupMappings : [];
      const selectedSchema = schemaGrpMapSchemaIds.filter(selectedSchemas => selectedSchemas.schemaId === schemaId)[0];
      if (selectedSchema && selectedSchema.schemaId) {
        schemaGrpMapSchemaIds.splice(schemaGrpMapSchemaIds.indexOf(selectedSchema), 1);
      } else if (event.checked) {
        const newSchemaGrpMap: SchemaGroupMapping = new SchemaGroupMapping();
        newSchemaGrpMap.schemaId = schemaId;
        schemaGrpMapSchemaIds.push(newSchemaGrpMap);
      }
      this.groupDetails.schemaGroupMappings = schemaGrpMapSchemaIds;
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

  /**
   * For return object description by objectid
   *
   */
  displayObjectDescription(objectId: string): string {
    return this.moduleList.filter(module => module.objectid === objectId)[0].objectdesc;
  }

}
