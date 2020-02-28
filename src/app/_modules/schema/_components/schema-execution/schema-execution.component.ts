import { Component, OnInit } from '@angular/core';
import { Breadcrumb } from 'src/app/_models/breadcrumb';
import { SchemaListDetails } from 'src/app/_models/schema/schemalist';
import { SchemalistService } from 'src/app/_services/home/schema/schemalist.service';
import { ActivatedRoute, Router } from '@angular/router';
import { SchemaExecutionService } from 'src/app/_services/home/schema/schema-execution.service';
import { SchemaExecutionRequest } from 'src/app/_models/schema/schema-execution';
import { MatDialog } from '@angular/material';
import { SchemaExecutionDialogComponent } from './schema-execution-dialog/schema-execution-dialog.component';

@Component({
  selector: 'pros-schema-execution',
  templateUrl: './schema-execution.component.html',
  styleUrls: ['./schema-execution.component.scss']
})

export class SchemaExecutionComponent implements OnInit {

  breadcrumb: Breadcrumb = {
    heading: 'Execute schema',
    links: [
      {
        link: '/home/schema/',
        text: 'Schema group(s)'
      }, {
        link: '/home/schema/schema-list',
        text: 'Schema List'
      }
    ]
  };
  selectedRunType = 'all';
  schemaId: string;
  groupId: string;
  schemaDetail: SchemaListDetails;
  constructor(
    private schemaListService: SchemalistService,
    private activatedRouter: ActivatedRoute,
    private schemaExecutionService: SchemaExecutionService,
    private router: Router,
    private dialog: MatDialog
  ) {
    this.schemaDetail = new SchemaListDetails();
   }

  ngOnInit() {
    this.activatedRouter.params.subscribe(param => {
      this.schemaId = param.schemaId;
      this.groupId = param.groupId;
      this.getSchemaDetail(this.schemaId);
});
  }

  private getSchemaDetail(schemaId: string) {
    this.schemaListService.getSchemaDetailsBySchemaId(schemaId).subscribe(data => {
      this.schemaDetail = data;
      this.breadcrumb.links[1].link = this.breadcrumb.links[1].link + '/' + this.groupId;
      this.breadcrumb.links[1].text = this.schemaDetail.schemaDescription;
    }, error => {
      console.error('Error while fetching schema details');
    });
  }

  public scheduleSchema() {
    const schemaExecutionReq: SchemaExecutionRequest = new SchemaExecutionRequest();
    schemaExecutionReq.schemaId =  this.schemaId;
    schemaExecutionReq.variantId = '0'; // 0 for run all
    this.schemaExecutionService.scheduleSChema(schemaExecutionReq).subscribe(data => {
      alert('Successfully scheduled');
      this.router.navigate(['/home/schema/schema-list', this.groupId]);
    }, error => {
      console.error('Error while schedule schema');
    });
}
  openDialog() {
    const dialogRef = this.dialog.open(SchemaExecutionDialogComponent, {
      height: '400px',
      width: '550px',
      data: {schemaId: this.schemaId}
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
  }
}
