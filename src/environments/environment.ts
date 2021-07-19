// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

/**
 * analyticsUrl for analytics microservices ..
 * apiurl for classic mdo
 * coreUrl for core apis from microservices ..
 * syncUrl for sync / job related  from microservices ..
 * authUrl for authentication from microservices ...
 *
 * Note : use only in development mode ... not required on environment.prod.ts ..
 */

export const environment = {
  production: false,
  analyticsUrl: 'http://localhost:8081',
  apiurl: 'https://mdoqa.masterdataonline.com',
  listurl: 'https://dev-classic.masterdataonline.com',
  coreUrl:'http://localhost:8084',
  syncUrl:'http://localhost:8085',
  authUrl:'http://localhost:8082',
  ruleUrl: 'http://localhost:1002',
  dataPlalyUri:'http://dataplay.connekthub.com/api/v1.0',

};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
