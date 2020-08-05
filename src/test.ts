// This file is required by karma.conf.js and loads recursively all the .spec and framework files

import 'zone.js/dist/zone-testing';
import { getTestBed } from '@angular/core/testing';
import {
  BrowserDynamicTestingModule,
  platformBrowserDynamicTesting
} from '@angular/platform-browser-dynamic/testing';

declare const require: any;

// First, initialize the Angular testing environment.
getTestBed().initTestEnvironment(
  BrowserDynamicTestingModule,
  platformBrowserDynamicTesting()
);

///  Load only home, admin , schema ,report and test .. modules
const adminModule = require.context('./app/_modules/admin', true, /\.spec\.ts$/);
const homeModule = require.context('./app/_modules/home', true, /\.spec\.ts$/);
const report = require.context('./app/_modules/report', true, /\.spec\.ts$/);
const schemaModule = require.context('./app/_modules/schema', true, /\.spec\.ts$/);
const sharedModule = require.context('./app/_modules/shared', true, /\.spec\.ts$/);
const _services = require.context('./app/_services', true, /\.spec\.ts$/);

// add load the modules
adminModule.keys().map(adminModule);
homeModule.keys().map(homeModule);
report.keys().map(report);
schemaModule.keys().map(schemaModule);
sharedModule.keys().map(sharedModule);
_services.keys().map(_services);

// // Then we find all the tests.
// const context = require.context('./', true, /\.spec\.ts$/);
// // And load the modules.
// context.keys().map(context);
