import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { SendSchemavariantRequest, SchemaVariantResponse, VariantDetails, SchemaVariantsModel } from 'src/app/_models/schema/schemalist';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Any2tsService } from '../../any2ts.service';
import { EndpointsClassicService } from '@services/_endpoints/endpoints-classic.service';

@Injectable({
  providedIn: 'root'
})
export class SchemaVariantService {

  constructor(
    private http: HttpClient,
    private endPointService: EndpointsClassicService,
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

  /**
   * Save / update variants .
   * @param schemaId request of all variants .. if already exits then update otherwise create new
   */
  public saveUpdateSchemaVariant(request: SchemaVariantsModel[]): Observable<string> {
    return this.http.post<string>(this.endPointService.saveUpdateVariantUrl(),request);
  }

  /**
   * Get variant detail by variant id ..
   * @param variantId queryParam for getting variants ..
   */
  public getVariantdetailsByvariantId(variantId: string, roleId: string, plantCode: string, userName: string): Observable<SchemaVariantsModel> {
    return this.http.get<SchemaVariantsModel>(this.endPointService.getVariantdetailsByvariantIdUrl(variantId), {params: {plantCode, roleId, userName}});
  }

  public deleteVariant(variantId: string): Observable<boolean> {
    return this.http.delete<boolean>(this.endPointService.deleteVariantUrl(variantId));
  }

  /**
   * Function to GET Api call for fetching data scope list
   * @param schemaId: ID of schema
   * @param type: variant type
   */
  public getAllDataScopeList(schemaId: string, type: string): Observable<any> {
    return this.http.get<any>(this.endPointService.getAllDataScopeUrl(schemaId, type));
  }
  /**
   * Get all data scopes / variants ...
   * @param schemaId append in params
   * @param type should be RUNFOR while get all data scope
   */
  public getDataScope(schemaId: string, type: string): Observable<SchemaVariantsModel[]> {
    return this.http.get<SchemaVariantsModel[]>(this.endPointService.getAllDataScopesUri(schemaId, type));
  }
}
