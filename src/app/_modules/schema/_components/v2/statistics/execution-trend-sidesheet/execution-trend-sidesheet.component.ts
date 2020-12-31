import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SchemaListDetails } from '@models/schema/schemalist';
import { SchemalistService } from '@services/home/schema/schemalist.service';

@Component({
  selector: 'pros-execution-trend-sidesheet',
  templateUrl: './execution-trend-sidesheet.component.html',
  styleUrls: ['./execution-trend-sidesheet.component.scss']
})
export class ExecutionTrendSidesheetComponent implements OnInit {

  moduleId: string;

  schemaId: string;

  variantId: string;

  /**
   * Current schema info ..
   */
  schemaInfo: SchemaListDetails;



  constructor(private router: Router,
    private activatedRoute: ActivatedRoute,
    private schemaListService: SchemalistService,
    ) { }

  ngOnInit(): void {
    this.activatedRoute.params.subscribe(params => {
      this.moduleId = params.moduleId;
      this.schemaId = params.schemaId;
      this.variantId = params.variantId;

      this.getSchemaDetails();
    });
  }

  /**
   * Get schema info ..
   */
  getSchemaDetails() {
    this.schemaListService.getSchemaDetailsBySchemaId(this.schemaId).subscribe(res => {
      this.schemaInfo = res;
    }, error => console.error(`Error : ${error.message}`))
  }



  close() {
    this.router.navigate([{ outlets: { sb: null } }]);
  }

}
