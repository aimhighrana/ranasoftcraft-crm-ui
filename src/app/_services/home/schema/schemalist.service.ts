import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SchemalistService {

  dummyJson:any={
    "MDA_123": {
      "Material": [
        {
          "schema_id": "273",
          "title": "MRO Cleansing",
          "totalValue": "4.6K",
          "thisWeekProgress": "+10",
          "enableProgressBar": true,
          "successValue": 70,
          "errorValue": 30,
          "details": {
            "structure": "Header Information",
            "Owner": [
              "Ellen Shervin",
              "Oakland Tech",
              "Procurement Manager"
            ],
            "Date": "07/10/2019"
          },
          "variants": {
            "total_variants": 4
          }
        },
        {
          "schema_id": "837456",
          "title": "Vendor",
          "totalValue": "7.8K",
          "thisWeekProgress": "-10",
          "enableProgressBar": true,
          "successValue": 20,
          "errorValue": 80,
          "details": {
            "structure": "Header Information",
            "Owner": [
              "Ellen Shervin",
              "Oakland Tech",
              "Procurement Manager"
            ],
            "Date": "07/10/2019"
          },
          "variants": {
            "total_variants": 0
          }
        },
        {
          "schema_id": "837456",
          "title": "Vendor",
          "totalValue": "7.8K",
          "thisWeekProgress": "-10",
          "enableProgressBar": true,
          "successValue": 20,
          "errorValue": 80,
          "details": {
            "structure": "Header Information",
            "Owner": [
              "Ellen Shervin",
              "Oakland Tech",
              "Procurement Manager"
            ],
            "Date": "07/10/2019"
          },
          "variants": {
            "total_variants": 12
          }
        }
      ],
      "Functional Location": [
        {
          "schema_id": "273",
          "title": "MRO Cleansing",
          "totalValue": "4.6K",
          "thisWeekProgress": "+10",
          "enableProgressBar": true,
          "successValue": 70,
          "errorValue": 30,
          "details": {
            "structure": "Header Information",
            "Owner": [
              "Ellen Shervin",
              "Oakland Tech",
              "Procurement Manager"
            ],
            "Date": "07/10/2019"
          },
          "variants": {
            "total_variants": 2
          }
        },
        {
          "schema_id": "837456",
          "title": "Vendor",
          "totalValue": "7.8K",
          "thisWeekProgress": "-10",
          "enableProgressBar": true,
          "successValue": 20,
          "errorValue": 80,
          "details": {
            "structure": "Header Information",
            "Owner": [
              "Ellen Shervin",
              "Oakland Tech",
              "Procurement Manager"
            ],
            "Date": "07/10/2019"
          },
          "variants": {
            "total_variants": 10
          }
        },
        {
          "schema_id": "837456",
          "title": "Vendor",
          "totalValue": "7.8K",
          "thisWeekProgress": "-10",
          "enableProgressBar": true,
          "successValue": 20,
          "errorValue": 80,
          "details": {
            "structure": "Header Information",
            "Owner": [
              "Ellen Shervin",
              "Oakland Tech",
              "Procurement Manager"
            ],
            "Date": "07/10/2019"
          },
          "variants": {
            "total_variants": 6
          }
        }
      ]
    }
  };

  fieldData:any={"Material_273":[{"fieldId":"TEST_999","fieldDesc":"Test","picklist":"0","dataType":"NUM"},{"fieldId":"MAT_TYPE_001","fieldDesc":"Material Type","picklist":"1","dataType":"AJAX"},{"fieldId":"GRP_00023","fieldDesc":"Group Type","picklist":"1","dataType":"AJAX"}],"Functional Location_273":[{"fieldId":"FUN_TEST_2436","fieldDesc":"Funtional Test","picklist":"0","dataType":"NUM"},{"fieldId":"MAT_TYPE_001","fieldDesc":"FLOC Type","picklist":"1","dataType":"AJAX"},{"fieldId":"GRP_00023","fieldDesc":"FLOC Group Type","picklist":"1","dataType":"AJAX"}]};
  constructor() { }

  getAllSchemaDetails(groupId){
    return this.dummyJson[groupId];
  }

  getAllFieldData(moduleId:string){
    return  this.fieldData[moduleId];
  }
}
