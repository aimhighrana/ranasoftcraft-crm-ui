import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { SchemaService } from 'src/app/_services/home/schema.service';
import { SchemaExecutionRequest } from 'src/app/_models/schema/schema-execution';
import { SchemaExecutionService } from 'src/app/_services/home/schema/schema-execution.service';

@Component({
  selector: 'pros-schema-execution-dialog',
  templateUrl: './schema-execution-dialog.component.html',
  styleUrls: ['./schema-execution-dialog.component.scss']
})
export class SchemaExecutionDialogComponent implements OnInit {

  totalCount = 0;
  schemaId: string;
  router: any;
  groupId: any;
  constructor(
    @Inject(MAT_DIALOG_DATA) private data: any,
    private schemaService: SchemaService,
    private schemaExecutionService: SchemaExecutionService
) {}
  ngOnInit() {
    this.getCount();
    console.log(this.data);
    console.log(`schemaid ${this.data.schemaId}`);
}

  private getCount() {
    this.schemaService.scheduleSchemaCount(this.data.schemaId).subscribe(data => {
    this. totalCount = data;
}, error => {
  console.error('Error while fetch schema count details!');
});
}
  closeDialog(): void {
  }
  public scheduleSchema() {
    const schemaExecutionReq: SchemaExecutionRequest = new SchemaExecutionRequest();
    schemaExecutionReq.schemaId =  this.data.schemaId;
    schemaExecutionReq.variantId = '0'; // 0 for run all
    this.schemaExecutionService.scheduleSChema(this.data.schemaId).subscribe(data => {
      console.log('Successfully scheduled');
      this.router.navigate(['/home/schema/schema-list', this.groupId]);
    }, error => {
      console.log('Error while schedule schema');
    });
}
}
