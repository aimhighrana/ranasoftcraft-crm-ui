import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { EndpointService } from '../../endpoint.service';
import { SendSchemavariantRequest, SchemaVariantResponse, VariantDetails } from 'src/app/_models/schema/schemalist';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Any2tsService } from '../../any2ts.service';

@Injectable({
  providedIn: 'root'
})
export class SchemaVariantService {

  constructor(
    private http: HttpClient,
    private endPointService: EndpointService,
    private any2tsService: Any2tsService
  ) { }

  public schemavariantDetailsBySchemaId(sendSchemavariantRequest: SendSchemavariantRequest): Observable<SchemaVariantResponse[]> {
    return this.http.post<any>(this.endPointService.schemaVarinatDetails(), sendSchemavariantRequest).pipe(map(response => {
      return this.any2tsService.any2SchemaVariantResponse(response);
    }));
  }

  public getSchemaVariantDetails(schemaId: string): Observable<VariantDetails[]> {
    return this.http.get<VariantDetails[]>(this.endPointService.getSchemaVariantsUrl(schemaId));
  }

  public saveUpdateSchemaVariant(request): Observable<string> {
    return this.http.post<string>(this.endPointService.saveUpdateVariantUrl(),request);
  }

  public getVariantdetailsByvariantId(variantId: string): Observable<VariantDetails> {
    return this.http.get<any>(this.endPointService.getVariantdetailsByvariantIdUrl(variantId));
  }

  public deleteVariant(variantId: string): Observable<boolean> {
    return this.http.delete<boolean>(this.endPointService.deleteVariantUrl(variantId));
  }
}
