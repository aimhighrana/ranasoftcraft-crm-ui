import { Injectable } from '@angular/core';
import { EndpointsAnalyticsService } from '@services/_endpoints/endpoints-analytics.service';
import { EndpointsClassicService } from '@services/_endpoints/endpoints-classic.service';
import { EndpointsDataplayService } from '@services/_endpoints/endpoints-dataplay.service';
import { Observable, throwError } from 'rxjs';

import {NounModifier} from '@models/schema/noun-modifier.ts';
import { HttpClient } from '@angular/common/http';
import { Modifier } from '@models/schema/schemadetailstable';

@Injectable({
  providedIn: 'root'
})
export class NounModifierService {

  constructor(
    private endpointClassic: EndpointsClassicService,
    private endpointAnalytics: EndpointsAnalyticsService,
    private endpointDataplay: EndpointsDataplayService,
    private http: HttpClient
  ) { }


  /**
   * Get all available nouns .. from local lib..
   * @param plantCode append in parameter required parameter
   * @param fieldId optional for append in conditional ..
   * @param fieldValue optional for append in conditional ..
   * @param searchString  seach noun based on the values ..
   */
  public getLocalNouns(plantCode : string , fieldId?: string, fieldValue?: string, searchString?: string): Observable<NounModifier[]> {
    fieldId = fieldId ? fieldId : '';
    fieldValue = fieldValue ? fieldValue : '';
    searchString = searchString ? searchString : '';
    return this.http.get<NounModifier[]>(this.endpointClassic.getAvailableNounsUri(), {params:{fieldId, fieldValue, searchString, plantCode}})
  }

  /**
   * Get all available modifiers ..  from local
   * @param plantCode plantCode append in parameter required parameter
   * @param nounCode nounCode must be required while getting modifier ..
   * @param searchString seach modifier based on the values ..
   */
  public getLocalModifier(plantCode : string , nounCode: string, searchString?: string): Observable<Modifier[]> {
    if(!nounCode) {
      throwError('Nouncode must be required ');
    }
    searchString = searchString ? searchString : '';
    return this.http.get<Modifier[]>(this.endpointClassic.getAvailableNounsUri(), {params:{nounCode, searchString, plantCode}})
  }

  /**
   * Get all available modifiers .. from local lib..
   * @param plantCode plantCode append in parameter required parameter
   * @param nounCode nounCode must be required while getting modifier ..
   * @param searchString seach modifier based on the values ..
   */
  public getLocalAttribute(nounCode: string,  modifierCode: string, plantCode : string , searchString?: string): Observable<Modifier[]> {
    if(!nounCode) {
      throwError('Nouncode must be required ');
    }

    if(!modifierCode) {
      throwError('Modifier must be required ');
    }

    searchString = searchString ? searchString : '';
    return this.http.get<Modifier[]>(this.endpointClassic.getAvailableNounsUri(), {params:{nounCode, modifierCode, searchString, plantCode}})
  }



  /**
   * Get all available nouns .. from local lib..
   * @param plantCode append in parameter required parameter
   * @param fieldId optional for append in conditional ..
   * @param fieldValue optional for append in conditional ..
   * @param searchString  seach noun based on the values ..
   */
  public getGsnNouns(plantCode : string , fieldId?: string, fieldValue?: string, searchString?: string): Observable<NounModifier[]> {
    fieldId = fieldId ? fieldId : '';
    fieldValue = fieldValue ? fieldValue : '';
    searchString = searchString ? searchString : '';
    return this.http.get<NounModifier[]>(this.endpointDataplay.getAvailableNounsUri(), {params:{fieldId, fieldValue, searchString, plantCode}})
  }

  /**
   * Get all available modifiers ..  from local
   * @param plantCode plantCode append in parameter required parameter
   * @param nounCode nounCode must be required while getting modifier ..
   * @param searchString seach modifier based on the values ..
   */
  public getGsnModifier(plantCode : string , nounCode: string, searchString?: string): Observable<Modifier[]> {
    if(!nounCode) {
      throwError('Nouncode must be required ');
    }
    searchString = searchString ? searchString : '';
    return this.http.get<Modifier[]>(this.endpointDataplay.getAvailableNounsUri(), {params:{nounCode, searchString, plantCode}})
  }

  /**
   * Get all available modifiers .. from local lib..
   * @param plantCode plantCode append in parameter required parameter
   * @param nounCode nounCode must be required while getting modifier ..
   * @param searchString seach modifier based on the values ..
   */
  public getGsnAttribute(nounCode: string,  modifierCode: string, plantCode : string , searchString?: string): Observable<Modifier[]> {
    if(!nounCode) {
      throwError('Nouncode must be required ');
    }

    if(!modifierCode) {
      throwError('Modifier must be required ');
    }

    searchString = searchString ? searchString : '';
    return this.http.get<Modifier[]>(this.endpointDataplay.getAvailableNounsUri(), {params:{nounCode, modifierCode, searchString, plantCode}})
  }



  /**
   * Get all suggested noun based on objectNumber ..
   *
   * @param schemaId append as parameter
   * @param runid append as parameter
   * @param objNr append as parameter
   * @param brType append as parameter
   * @param searchString append as parameter
   */
  public getSuggestedNouns(schemaId: string, runid: string, objNr: string, brType: string,searchString?: string): Observable<NounModifier[]> {
    searchString = searchString ? searchString : '';
    return this.http.get<NounModifier[]>(this.endpointClassic.getSuggestedNounUri(schemaId, runid), {params:{searchString, brType, objNr}})
  }

  /**
   * Get all suggested modifier based on nounCode , objectNumber
   *
   * @param schemaId append as parameter
   * @param runid append as parameter
   * @param objNr append as parameter
   * @param brType append as parameter
   * @param nounCode append as parameter
   * @param searchString append as parameter
   */
  public getSuggestedModifiers(schemaId: string, runid: string, objNr: string, brType: string, nounCode: string,  searchString?: string): Observable<NounModifier[]> {
    if(!nounCode) {
      throwError('Nouncode must be required ');
    }
    searchString = searchString ? searchString : '';
    return this.http.get<NounModifier[]>(this.endpointClassic.getSuggestedModifierUri(schemaId, runid), {params:{nounCode, searchString, brType, objNr}})
  }

  /**
   * Get all suggested attributes based nounCode , modifier and objectNumber
   *
   * @param schemaId append as parameter
   * @param runid append as parameter
   * @param objNr append as parameter
   * @param brType append as parameter
   * @param nounCode append as parameter
   * @param modCode append as parameter
   * @param searchString append as parameter
   */
  public getSuggestedAttributes(schemaId: string, runid: string, objNr: string, brType: string, nounCode: string, modCode: string,  searchString?: string): Observable<Modifier[]> {
    if(!nounCode) {
      throwError('Nouncode must be required ');
    }

    if(!modCode) {
      throwError('Modifier must be required ');
    }

    searchString = searchString ? searchString : '';
    return this.http.get<Modifier[]>(this.endpointClassic.getSuggestedAttributeUri(schemaId, runid), {params:{nounCode, modCode, searchString, brType, objNr}})
  }
}
