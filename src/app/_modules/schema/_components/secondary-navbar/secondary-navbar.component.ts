import { Component, OnInit, OnChanges, SimpleChanges, Input } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { SchemalistService } from '@services/home/schema/schemalist.service';
import { SchemaListModuleList } from '@models/schema/schemalist';

@Component({
  selector: 'pros-secondary-navbar',
  templateUrl: './secondary-navbar.component.html',
  styleUrls: ['./secondary-navbar.component.scss']
})
export class SecondaryNavbarComponent implements OnInit, OnChanges {

  public moduleList: SchemaListModuleList[] = [];

  @Input()
  activatedPrimaryNav: string;

  constructor(
    private router: Router,
    private schemaListService: SchemalistService,
    private activatedRouter: ActivatedRoute
    ) { }

  ngOnChanges(changes: SimpleChanges): void {
    if(changes && changes.activatedPrimaryNav && changes.activatedPrimaryNav.previousValue !== changes.activatedPrimaryNav.currentValue) {

      switch (changes.activatedPrimaryNav.currentValue) {
        case 'welcome':
          this.getSchemaList();
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

    console.log(this.activatedRouter.url);
    this.activatedRouter.url.subscribe(sub=>{
      console.log(sub);
    });

    if (this.router.url.includes('/home/schema')) {
      console.log(this.router.url);
      this.getSchemaList()
    }
  }

  public getSchemaList() {
    this.schemaListService.getSchemaList().subscribe((moduleList) => {
      console.log(moduleList);
      this.moduleList = moduleList;

      if(this.moduleList){
        const firstModuleId = this.moduleList[0].moduleId;
        this.router.navigate(['/home/schema',firstModuleId]);
      }


    }, error=>{
      console.error(`Error : ${error.message}`);
    })
  }

  /**
   * Open schema details ..
   */
  openSchemaDetails(module: SchemaListModuleList) {
    const frstSchemaId = module.schemaLists ? module.schemaLists[0].schemaId : '';
    this.router.navigate(['/home/schema/schema-details', module.moduleId ,frstSchemaId, 0]);
  }
}
