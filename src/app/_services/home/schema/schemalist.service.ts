import { Injectable } from '@angular/core';
import { EndpointService } from '../../endpoint.service';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { SchemaListModuleList } from 'src/app/_models/schema/schemalist';
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

  /*
  public getSchemaListByModuleId(moduleId: string): Observable<any> {
    const url = this.endpointService.getSchemaListByModuleId() + '?objectId=' + moduleId;
    return this.http.get<any>(url);
  } */
  public getSchemaListByGroupId(groupId: string): Observable<SchemaListModuleList[]> {
    return this.http.get<any>(this.endpointService.getSchemaListByGroupIdUrl(groupId)).pipe(map(data => {
      return this.any2tsService.anyToSchemaListsViewPage(data);
    }));
  }
  /*
  public getRestFieldListBySchemaId(sendDataForSchemaVariantFields: SendDataForSchemaVariantFields): Observable<any> {
    const body = '?schemaId=' + sendDataForSchemaVariantFields.schemaId + '&queryString=' + sendDataForSchemaVariantFields.queryString + '&query=' + sendDataForSchemaVariantFields.query + '&fetchSize=' + sendDataForSchemaVariantFields.fetchSize + '&fetchCount=' + sendDataForSchemaVariantFields.fetchCount;
    const url = this.endpointService.getRestFieldListBySchemaId() + body;
    return this.http.post<any>(url, '');
  }
  public getBusinessRulesBySchemaId(schemaId: string, objectId: string): Observable<any> {
    return this.http.post<any>(this.endpointService.getBusinessRulesBySchemaId(schemaId, objectId), '').pipe(map(data => {
      return this.any2tsService.any2SchemaBrInfoList(data);
    }));
  }
  public assignBrToSchema(sendData: AssignBrToSchemaRequest): Observable<any> {
    return this.http.post(this.endpointService.getAssignBrToSchemaUrl(), sendData);
  }
  public scheduleSchemaByCriteria(sendData: ScheduleSchemaRequest): Observable<any> {
    return this.http.post<any>(this.endpointService.getScheduleSchemaUrl(), sendData);
  }
  public getCategories(fetchCount: number, searchString: string): Observable<CategoriesResponse[]> {
    const url = this.endpointService.getCategoriesUrl() + '?fCount=' + fetchCount + '&searchString=' + searchString;
    return this.http.get<any>(url).pipe(map(data => {
      return this.any2tsService.any2CategoriesResponse(data);
    }));
  }
  public getDependency(sendData: DependencyRequest): Observable<DependencyResponse[]> {
    return this.http.post<any>(this.endpointService.getDependencyUrl(), sendData).pipe(map(data => {
      return this.any2tsService.any2DependencyResponse(data);
    }));
  }
  public addCustomCategory(categoryName: string): Observable<any> {
    const url = this.endpointService.addCustomCategoryUrl() + '?category=' + categoryName;
    return this.http.post<any>(url, '');
  }

  public saveBusinessRule(sendDta: SaveBusinessRule): Observable<any> {
    return this.http.post<any>(this.endpointService.saveBusinessRuleUrl(), sendDta);
  }
  public getAllApiList(sendData: SchemaGetApiRequest): Observable<DependencyResponse[]> {
    return this.http.post<any>(this.endpointService.getBusinessRuleApiListUrl(), sendData).pipe(map(data => {
      return this.any2tsService.any2DependencyResponse(data);
    }));
  }
  public getDuplicacySettingList(sendData: SchemaGetApiRequest): Observable<DependencyResponse[]> {
    return this.http.post<any>(this.endpointService.getDuplicacySettingListUrl(), sendData).pipe(map(data => {
      return this.any2tsService.any2DependencyResponse(data);
    }));
  }
  public getVariantDetailsForScheduleSchema(objectId: string, searchString: string): Observable<VariantDetailsScheduleSchema[]> {
    const url = this.endpointService.getVariantDetailsForScheduleSchemaUrl(objectId) + '?searchQuery=' + searchString;
    return this.http.get(url).pipe(map(data => {
      return this.any2tsService.any2VariantDetailsScheduleSchema(data);
    }));
  }
  public getVariantControlByVariantId(variantId: string): Observable<VariantAssignedFieldDetails[]> {
    return this.http.get<any>(this.endpointService.getVariantControlByVariantIdUrl(variantId)).pipe(map(data => {
      return this.any2tsService.any2VariantAssignedFieldDetails(data);
    }));
  } */
}
