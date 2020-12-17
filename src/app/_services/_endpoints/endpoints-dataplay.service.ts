import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class EndpointsDataplayService {

  apiUrl = environment.dataPlalyUri;

  constructor() { }

  /**
   * URI for get all available nouns ..from local library
   */
  public getAvailableNounsUri(): string {
    return `${this.apiUrl}/mro/noun`;
  }

  /**
   * URI for get all available modifiers  ..from local library
   */
  public getAvailableModifierUri(): string {
    return `${this.apiUrl}/mro/modifier`;
  }

  /**
   * URI for get all available attributes  ..from local library
   */
  public getAvailableAttributeUri(): string {
    return `${this.apiUrl}/mro/attribute`;
  }
}
