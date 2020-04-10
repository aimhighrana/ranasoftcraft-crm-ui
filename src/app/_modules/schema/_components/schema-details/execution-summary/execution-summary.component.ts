import { Component, OnInit, Input } from '@angular/core';
import { SchemalistService } from 'src/app/_services/home/schema/schemalist.service';
import { SchemaExecutionSummary } from 'src/app/_models/schema/schemadetailstable';

@Component({
  selector: 'pros-execution-summary',
  templateUrl: './execution-summary.component.html',
  styleUrls: ['./execution-summary.component.scss']
})
export class ExecutionSummaryComponent implements OnInit {

  @Input()
  schemaId: string;

  summary: SchemaExecutionSummary;
  constructor(
    private schemaListService: SchemalistService
  ) {
    this.summary = new SchemaExecutionSummary();
  }

  ngOnInit(): void {
    this.schemaListService.getSchemaDetailsBySchemaId(this.schemaId).subscribe(res=>{
        const summary: SchemaExecutionSummary  = new SchemaExecutionSummary();
        const totalErr = (res.totalCount > 0 ? res.errorCount / res.totalCount : 0);
        summary.totalErrorPer = Math.round((totalErr + Number.EPSILON) * 100 * 100) / 100;

        const uniqueErr = (res.totalUniqueValue > 0 ? res.errorUniqueValue / res.totalUniqueValue : 0);
        summary.uniqueErrorPer = Math.round((uniqueErr + Number.EPSILON) * 100 * 100) / 100;

        const totalSuccess = (res.totalCount > 0 ? res.successCount / res.totalCount : 0);
        summary.totalSuccessPer = Math.round((totalSuccess + Number.EPSILON) * 100 * 100) / 100;

        const uniqueSuccess = (res.totalUniqueValue > 0 ? res.successUniqueValue / res.totalUniqueValue : 0);
        summary.uniqueSuccessPer = Math.round((uniqueSuccess + Number.EPSILON) * 100 * 100) / 100;

        summary.total = res.totalCount;
        summary.runBy = res.createdBy;
        summary.startTime = res.executionStartTime;

        this.summary = summary;
    });
  }

}
