import { Component, OnInit, OnChanges, SimpleChanges, Input, EventEmitter, Output } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { SchemalistService } from '@services/home/schema/schemalist.service';
import { SchemaListModuleList, SchemaListDetails } from '@models/schema/schemalist';
import { Location } from '@angular/common';
import { SchemaService } from '@services/home/schema.service';

@Component({
  selector: 'pros-secondary-navbar',
  templateUrl: './secondary-navbar.component.html',
  styleUrls: ['./secondary-navbar.component.scss']
})
export class SecondaryNavbarComponent implements OnInit, OnChanges {

  public moduleList: SchemaListModuleList[] = [];

  dataIntillegences: SchemaListDetails[] = [];

  @Input()
  activatedPrimaryNav: string;

  /**
   * icon arrow value
   */
  arrowIcon = 'keyboard_arrow_left';

  /**
   * Emitter to emit sidebar toggleing
   */
  @Output() toggleEmitter: EventEmitter<boolean> = new EventEmitter<boolean>();

  constructor(
    private router: Router,
    private schemaListService: SchemalistService,
    private activatedRouter: ActivatedRoute,
    private location: Location,
    private schemaService: SchemaService
  ) { }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes && changes.activatedPrimaryNav && changes.activatedPrimaryNav.previousValue !== changes.activatedPrimaryNav.currentValue) {

      switch (changes.activatedPrimaryNav.currentValue) {
        case 'welcome':
          this.getDataIntilligence();
          break;

        case 'schema':
          this.getSchemaList();
          break;
        default:
          break;
      }
    }
  }

  ngOnInit(): void {

    this.location.subscribe(res => {
      console.log(res);
    })

    // console.log(this.activatedRouter.url);
    // this.activatedRouter.url.subscribe(sub=>{
    //   console.log(sub);
    // });

    // if (this.router.url.includes('/home/schema')) {
    //   console.log(this.router.url);
    //   this.getSchemaList()
    // }
  }

  /**
   * Get all schema along with variants ..
   */
  getDataIntilligence() {
    this.schemaService.getSchemaWithVariants().subscribe(res => {
      this.dataIntillegences = res;
    }, error => console.error(`Error : ${error.message}`));
  }

  /**
   * Get all schemas ..
   */
  public getSchemaList() {
    this.schemaListService.getSchemaList().subscribe((moduleList) => {
      this.moduleList = moduleList;
      if (this.moduleList) {
        const firstModuleId = this.moduleList[0].moduleId;
        this.router.navigate(['/home/schema', firstModuleId]);
      }


    }, error => {
      console.error(`Error : ${error.message}`);
    })
  }

  /**
   * Open schema details ..
   */
  openSchemaDetails(module: SchemaListModuleList) {
    const frstSchemaId = module.schemaLists ? module.schemaLists[0].schemaId : '';
    this.router.navigate(['/home/schema/schema-details', module.moduleId, frstSchemaId, 0]);
  }

  /**
   * Get routed descriptions ..
   */
  get getRoutedDescription(): string {
    let res = 'Unknown';
    switch (this.activatedPrimaryNav) {
      case 'welcome':
        res = 'Home';
        break;
      case 'schema':
        res = 'Schema';
        break;

      default:
        break;
    }
    return res;
  }

  /**
   * Navigate to particular page ..
   */
  globalCreate() {
    switch (this.activatedPrimaryNav) {
      case 'welcome':
        break;
      case 'schema':
        this.router.navigate(['', { outlets: { sb: 'sb/schema/create-schema' } }]);
        break;
      default:
        break;
    }
  }

  /**
   * function to toggle the icon
   * and emit the toggle event
   */
  toggleSideBar() {
    if (this.arrowIcon === 'keyboard_arrow_left') {
      this.arrowIcon = 'keyboard_arrow_right';
    } else if (this.arrowIcon === 'keyboard_arrow_right') {
      this.arrowIcon = 'keyboard_arrow_left'
    }
    this.toggleEmitter.emit()
  }
}
