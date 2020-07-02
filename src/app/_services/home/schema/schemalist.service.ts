import { Injectable } from '@angular/core';
import { EndpointService } from '../../endpoint.service';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { SchemaListModuleList, SchemaListDetails } from 'src/app/_models/schema/schemalist';
import { map } from 'rxjs/operators';
import { Any2tsService } from '../../any2ts.service';

@Injectable({
  providedIn: 'root'
})
export class SchemalistService {
  constructor(
    private endpointService: EndpointService,
    private http: HttpClient,
    private any2tsService: Any2tsService
  ) { }

  public getSchemaList(): Observable<SchemaListModuleList[]> {
    return this.http.get<SchemaListModuleList[]>(this.endpointService.getSchemaListByGroupIdUrl());
  }

  public getSchemaDetailsBySchemaId(schemaId: string): Observable<SchemaListDetails> {
    return this.http.get<any>(this.endpointService.getSchemaDetailsBySchemaIdUrl(schemaId)).pipe(map(data => {
      return this.any2tsService.any2SchemaDetailsWithCount(data);
    }));
  }



}
