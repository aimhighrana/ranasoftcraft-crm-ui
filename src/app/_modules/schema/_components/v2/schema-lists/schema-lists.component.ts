import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SchemaListModuleList } from '@models/schema/schemalist';
import { SharedServiceService } from '@modules/shared/_services/shared-service.service';
import { SchemaService } from '@services/home/schema.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'pros-schema-lists',
  templateUrl: './schema-lists.component.html',
  styleUrls: ['./schema-lists.component.scss']
})
export class SchemaListsComponent implements OnInit, OnDestroy {

  /**
   * To have the module id of selected module
   */
  public moduleId: string;

  /**
   * To have the module data according to the selected module.
   */
  public moduleData: SchemaListModuleList;

  /**
   * All the http or normal subscription will store in this array
   */
  subscriptions: Subscription[] = [];

  /**
   * outlet name in which sheets to be opened
   */
  outlet = 'sb';

  /**
   * constructor of class
   * @param activatedRoute Instance the ActivatedRoute class
   * @param schemaService Instance of schema service class
   */
  constructor(private activatedRoute: ActivatedRoute,
    private schemaService: SchemaService,
    private sharedService: SharedServiceService,
    private router: Router,
  ) { }

  /**
   * Unsubscribe from Observables, services and DOM events
   */
  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => {
      sub.unsubscribe();
    });
  }

  /**
   * load pre loaded function
   */
  ngOnInit(): void {
    this.getRouteParams();

    /* this.sharedService.isSecondaryNavRefresh().subscribe(res=>{
      if(res && res.activeMenu === SecondaynavType.schema) {
        this.getSchemaList();
      }
    }); */
  }

  /**
   * get moduleId from the active router parameters
   */
  private getRouteParams() {
    const activatesub = this.activatedRoute.params.subscribe((params) => {
      this.moduleId = params.moduleId;
      if (this.moduleId) {
        this.moduleData = {
          moduleDesc: '',
          moduleId: '',
          schemaLists: []
        };
        this.getModuleInfo();
        this.getSchemaList();
      }
    });
    this.subscriptions.push(activatesub);
  }

  /**
   * get schema list according to module ID
   */
  public getSchemaList() {
    const schmeaInfoByModuleId = this.schemaService.getSchemaInfoByModuleId(this.moduleId).subscribe((moduleData) => {
      this.moduleData.schemaLists = moduleData.schemaLists;
    }, error => {
      console.error('Error: {}', error.message);
    });

    this.subscriptions.push(schmeaInfoByModuleId);
  }

  public getModuleInfo() {
    const moduleInfoByModuleId = this.schemaService.getModuleInfoByModuleId(this.moduleId).subscribe((moduleData) => {
      const module = moduleData[0];
      if (module) {
        this.moduleData.moduleDesc = module.moduleDesc;
        this.moduleData.moduleId = module.moduleId;
      }
    }, error => {
      console.error('Error: {}', error.message);
    });
    this.subscriptions.push(moduleInfoByModuleId);
  }
  /**
   * Function to open sidesheet to Upload data
   */
  public openUploadSideSheet() {
    this.router.navigate([{ outlets: { sb: `sb/schema/upload-data/${this.moduleId}/${this.outlet}` } }]);
  }

  /**
   * open the schem-info of selected schema
   * @param schemaId selcted schemaId
   */
  public openSchemaInfo(schemaId: string) {
    this.router.navigate([`/home/schema/schema-info/${this.moduleId}/${schemaId}`]);
  }

}
