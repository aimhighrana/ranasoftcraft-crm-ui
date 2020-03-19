import { Component, OnInit } from '@angular/core';
import { SchemaDetailsService } from 'src/app/_services/home/schema/schema-details.service';
import { SchemaExecutionLog } from 'src/app/_models/schema/schemadetailstable';
import { ActivatedRoute } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'pros-schema-execution-logs',
  templateUrl: './schema-execution-logs.component.html',
  styleUrls: ['./schema-execution-logs.component.scss']
})
export class SchemaExecutionLogsComponent implements OnInit {

  executionLogs: SchemaExecutionLog[] = [];
  schemaId: string;
  constructor(
    private schemaDetailService: SchemaDetailsService,
    private activtedRouter: ActivatedRoute,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    console.log(this.activtedRouter);
    this.activtedRouter.params.subscribe(param =>{
      const schemaId = param.schemaId ? param.schemaId : '';
      this.schemaId = schemaId;
      this.schemaDetailService.getSchemaExecutionLogs(this.schemaId).subscribe(response =>{
        this.executionLogs = response;
      }, error=>{
        this.snackBar.open(`Error : ${error.message}`, 'Close',{duration:2000});
      });
    });
  }

  executionLogsTrackBy(object): string {
    return object ? object.id: null;
  }


}
