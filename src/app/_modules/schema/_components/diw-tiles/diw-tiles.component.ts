import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SchemalistService } from '@services/home/schema/schemalist.service';
import { SchemaListModuleList, SchemaListDetails } from '@models/schema/schemalist';
import { SchemaService } from '@services/home/schema.service';
import { SchemaExecutionRequest } from '@models/schema/schema-execution';
import { SchemaExecutionService } from '@services/home/schema/schema-execution.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'pros-diw-tiles',
  templateUrl: './diw-tiles.component.html',
  styleUrls: ['./diw-tiles.component.scss']
})
export class DiwTilesComponent implements OnInit {

  public moduleId: any;
  public moduleListData: SchemaListModuleList;
  public schemaListData: SchemaListDetails[] = [];

  constructor(private activatedRoute: ActivatedRoute,
    private schemaListService: SchemalistService,
    private schemaService: SchemaService,
    private schemaExecutionService: SchemaExecutionService,
    private matSnackBar: MatSnackBar
    ) { }

  ngOnInit(): void {
    this.getRouteParams();
  }

  /**
   * get moduleId
   */
  private getRouteParams() {
    this.activatedRoute.params.subscribe((params)=>{
      this.moduleId = params.moduleId;
      this.getSchemaList();
    })
  }

  /**
   * get all schema list from schemalist service
   */
  public getSchemaList() {
    this.schemaService.getSchemaInfoByModuleId(this.moduleId).subscribe((res)=> {
      this.moduleListData = res;
      // this.filterData();
    }, error=>{
      console.error('Error: {}', error.message);
    })
  }

  /**
   * Run schema now ..
   * @param schema runable schema details .
   */
  runSchema(schema: SchemaListDetails) {
    const schemaExecutionReq: SchemaExecutionRequest = new SchemaExecutionRequest();
    schemaExecutionReq.schemaId = schema.schemaId;
    schemaExecutionReq.variantId = '0'; // 0 for run all
    this.schemaExecutionService.scheduleSChema(schemaExecutionReq).subscribe(data => {
        if(data) {
          const exitSchema =  this.moduleListData.schemaLists.filter(sc=> sc.schemaId === schema.schemaId)[0];
          if(exitSchema) {
            exitSchema.isInRunning = true;
          }
        }
     }, error => {
      this.matSnackBar.open(`Something went wrong `, 'Close', { duration: 5000 });
    });
  }


  /**
   * Getting Statics of Schema according to the schema ID.
   */
  public getSchemaStatics(){
    this.schemaListData.map((schemaList) => {
     this.schemaService.getSchemaThresholdStatics(schemaList.schemaId).subscribe((schemaStatics) => {
       console.log(schemaStatics);
     }, error => {
       console.log(error);
     })
    })
  }
}
