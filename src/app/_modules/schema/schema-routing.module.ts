import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PageNotFoundComponent } from '../shared/_components/page-not-found/page-not-found.component';
import { SchemaGroupFormComponent } from 'src/app/_modules/schema/_components/schema-group-form/schema-group-form.component';
import { SchemaDetailsComponent } from './_components/v2/schema-details/schema-details.component';
import { SchemaVariantsComponent } from './_components/schema-variants/schema-variants.component';
import { SchemaExecutionComponent } from './_components/schema-execution/schema-execution.component';
import { SchemaCollaboratorsComponent } from 'src/app/_modules/schema/_components/schema-collaborators/schema-collaborators.component';
import { SchemaExecutionLogsComponent } from './_components/schema-execution-logs/schema-execution-logs.component';
import { AddbusinessruleComponent } from '../admin/_components/module/business-rules/addbusinessrule/addbusinessrule.component';
import { TableColumnSettingsComponent } from '../shared/_components/table-column-settings/table-column-settings.component';
import { UploadDataComponent } from './_components/upload-data/upload-data.component';
import { SalesforceConnectionComponent } from './_components/salesforce-connection/salesforce-connection.component';
import { DuplicateBusinessruleComponent } from './_components/duplicate-businessrule/duplicate-businessrule.component';
import { AdvanceoptionsDialogComponent } from './_components/advanceoptions-dialog/advanceoptions-dialog.component';
import { DuplicateDetailsComponent } from './_components/duplicate-details/duplicate-details.component';
import { DiwCreateSchemaComponent } from '../admin/_components/module/schema/diw-create-schema/diw-create-schema.component';
import { DiwCreateBusinessruleComponent } from '../admin/_components/module/schema/diw-create-businessrule/diw-create-businessrule.component';
import { CreateVariantComponent } from './_components/create-variant/create-variant.component';
import { WelcomeMdoComponent } from './_components/welcome-mdo/welcome-mdo.component';
import { UploadDatasetComponent } from './_components/upload-dataset/upload-dataset.component';
import { PrimaryNavbarComponent } from './_components/primary-navbar/primary-navbar.component';
import { CreateRuleComponent } from './_components/create-rule/create-rule.component';
import { SecondaryNavbarComponent } from './_components/secondary-navbar/secondary-navbar.component';
import { DiwTilesComponent } from './_components/diw-tiles/diw-tiles.component';
import { SidenavUserdefinedComponent } from './_components/sidenav-userdefined/sidenav-userdefined.component';
import { TableLoadingComponent } from './_components/table-loading/table-loading.component';
import { MdoGenericComponentsComponent } from '@modules/lib/_components/mdo-generic-components/mdo-generic-components.component';
import { CreateSchemaComponent } from './_components/v2/create-schema/create-schema.component';
import { SchemaInfoComponent } from './_components/v2/schema-info/schema-info.component';
import { BrruleSideSheetComponent } from './_components/v2/brrule-side-sheet/brrule-side-sheet.component';
import { SubscriberSideSheetComponent } from './_components/v2/subscriber-side-sheet/subscriber-side-sheet.component';
import { ScheduleTabComponent } from './_components/schedule-tab/schedule-tab.component';
import { BusinessrulelibrarySidesheetComponent } from './_components/businessrulelibrary-sidesheet/businessrulelibrary-sidesheet.component';
import { CatalogCheckComponent } from './_components/catalog-check/catalog-check.component';
import { MaterialDuplicatecheckSidesheetComponent } from './_components/material-duplicatecheck-sidesheet/material-duplicatecheck-sidesheet.component';
import { DuplicateDatacheckSidesheetComponent } from './_components/duplicate-datacheck-sidesheet/duplicate-datacheck-sidesheet.component';
import { DatascopeSidesheetComponent } from './_components/datascope-sidesheet/datascope-sidesheet.component';


const routes: Routes = [
  { path: '', component: DiwTilesComponent },
  { path: 'group/:groupId', component: SchemaGroupFormComponent },
  // { path: 'schema-list/:schemaGrpId', component: SchemaListComponent },
  { path: 'schema-details/:moduleId/:schemaId', component: SchemaDetailsComponent },
  { path: 'schema-variants/:moduleId/:schemaId', component: SchemaVariantsComponent },
  { path: 'schema-execution/:schemaId', component: SchemaExecutionComponent },
  { path: 'collab/:schemaId', component: SchemaCollaboratorsComponent },
  { path: 'execution-logs/:schemaId', component: SchemaExecutionLogsComponent },
  { path: 'addbusinessrule', component: AddbusinessruleComponent },
  { path: 'table-column-settings', component: TableColumnSettingsComponent },
  { path: 'uploaddata', component: UploadDataComponent },
  { path: 'create-schema/:schemaId', component: CreateSchemaComponent },
  { path: 'salesforce-connection', component: SalesforceConnectionComponent },
  { path: 'duplicate-businessrule', component: DuplicateBusinessruleComponent },
  { path: 'advanceoptions-dialog', component: AdvanceoptionsDialogComponent },
  { path: 'duplicate-details', component: DuplicateDetailsComponent },
  { path: 'diw-create-schema', component: DiwCreateSchemaComponent },
  { path: 'diw-create-businessrule', component: DiwCreateBusinessruleComponent },
  { path: 'schema-variants/create-variant/:moduleId/:schemaId/:variantId', component: CreateVariantComponent },
  { path: 'welcome', component: WelcomeMdoComponent },
  { path: 'upload-dataset', component: UploadDatasetComponent },
  { path: 'welcome-mdo', component: WelcomeMdoComponent },
  { path: 'upload-dataset', component: UploadDatasetComponent },
  { path: 'primary-navbar', component: PrimaryNavbarComponent },
  { path: 'secondary-navbar', component: SecondaryNavbarComponent },
  { path: 'create-rule', component: CreateRuleComponent },
  { path: ':moduleId', component: DiwTilesComponent },
  { path: 'sidenav-userdefined', component: SidenavUserdefinedComponent },
  { path: 'table-loading', component: TableLoadingComponent },
  { path: 'upload-data', component: UploadDataComponent },
  { path: 'mdo-generic-components', component: MdoGenericComponentsComponent },
  { path: 'schema-info/:moduleId/:schemaId', component: SchemaInfoComponent },
  { path: 'business-rule/:moduleId/:schemaId/:brId', component: BrruleSideSheetComponent },
  { path: 'subscriber/:moduleId/:schemaId/:subscriberId', component: SubscriberSideSheetComponent },
  { path: 'system/schedule-tab', component: ScheduleTabComponent },
  { path: 'system/businessrulelibrary-sidesheet', component: BusinessrulelibrarySidesheetComponent },
  { path: 'system/catalog-check', component: CatalogCheckComponent },
  { path: 'system/duplicatecheck-sidesheet', component: MaterialDuplicatecheckSidesheetComponent },
  { path: 'system/duplicate-datacheck-sidesheet', component: DuplicateDatacheckSidesheetComponent },
  { path: 'data-scope/:variantId', component: DatascopeSidesheetComponent },

  // anything not mapped should go to page not found component
  { path: '**', component: PageNotFoundComponent }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SchemaRoutingModule { }
