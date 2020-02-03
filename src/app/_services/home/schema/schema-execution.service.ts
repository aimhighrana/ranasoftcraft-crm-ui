import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { EndpointService } from '../../endpoint.service';
import { SchemaExecutionRequest } from 'src/app/_models/schema/schema-execution';

@Injectable({
  providedIn: 'root'
})
export class SchemaExecutionService {

  constructor(
    private http: HttpClient,
    private endpointService: EndpointService
  ) { }

  public scheduleSChema(schemaExecutionReq: SchemaExecutionRequest) {
    return this.http.post<any>(this.endpointService.getScheduleSchemaUrl(), schemaExecutionReq);
  }
}
