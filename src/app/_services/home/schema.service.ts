import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class SchemaService {

  private schemaListUrl:string='http://localhost:8080/MDOSF/moduleCount';
  constructor(private _http:HttpClient) { }

  getAllSchema(){
    return [
      {
        "schemaId": "MDA_123",
        "title": "MRO",
        "totalValue": "4.6K",
        "thisWeekProgress": "+10",
        "enableProgressBar": true,
        "successValue": 70,
        "errorValue": 30
      },
      {
        "schemaId": "837456",
        "title": "Vendor",
        "totalValue": "7.8K",
        "thisWeekProgress": "-10",
        "enableProgressBar": true,
        "successValue": 20,
        "errorValue": 80
      },
      {
        "schemaId": "846",
        "title": "Test",
        "totalValue": "56.3K",
        "thisWeekProgress": "-80",
        "enableProgressBar": true,
        "successValue": 20,
        "errorValue": 80
      },
      {
        "schemaId": "8769863",
        "title": "MDA",
        "totalValue": "4.6K",
        "thisWeekProgress": "+10",
        "enableProgressBar": true,
        "successValue": 100,
        "errorValue": 0
      },
      {
        "schemaId": "836958",
        "title": "TESTING 2",
        "totalValue": "4.6K",
        "thisWeekProgress": "+67",
        "enableProgressBar": true,
        "successValue": 0,
        "errorValue": 100
      },
      {
        "schemaId": "8475693",
        "title": "MRO",
        "totalValue": "4.6K",
        "thisWeekProgress": "+10",
        "enableProgressBar": true,
        "successValue": 10,
        "errorValue": 99
      },
      {
        "schemaId": "478965",
        "title": "MRO",
        "totalValue": "4.6K",
        "thisWeekProgress": "+10",
        "enableProgressBar": true,
        "successValue": 1,
        "errorValue": 99
      },
      {
        "schemaId": "9386498",
        "title": "MRO",
        "totalValue": "4.6K",
        "thisWeekProgress": "+10",
        "enableProgressBar": true,
        "successValue": 1,
        "errorValue": 99
      },
      {
        "schemaId": "98364892",
        "title": "MRO",
        "totalValue": "4.6K",
        "thisWeekProgress": "+10",
        "enableProgressBar": true,
        "successValue": 0,
        "errorValue": 100
      }
    ];
  }
}
