import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PageNotFoundComponent } from '../shared/_components/page-not-found/page-not-found.component';
import { SchemaGroupFormComponent } from 'src/app/_modules/schema/_components/schema-group-form/schema-group-form.component';
import { SchemaListComponent } from 'src/app/_modules/schema/_components/schema-list/schema-list.component';
import { SchemaDetailsComponent } from './_components/schema-details/schema-details.component';
import { SchemaVariantsComponent } from './_components/schema-variants/schema-variants.component';
import { SchemaExecutionComponent } from './_components/schema-execution/schema-execution.component';
import { SchemaCollaboratorsComponent } from 'src/app/_modules/schema/_components/schema-collaborators/schema-collaborators.component';
import { SchemaExecutionLogsComponent } from './_components/schema-execution-logs/schema-execution-logs.component';
import { AddbusinessruleComponent } from '../admin/_components/module/business-rules/addbusinessrule/addbusinessrule.component';
import { TableColumnSettingsComponent } from '../shared/_components/table-column-settings/table-column-settings.component';
import { UploadDataComponent } from './_components/upload-data/upload-data.component';
import { CreateSchemaComponent } from '../admin/_components/module/schema/create-schema/create-schema.component';
import { SalesforceConnectionComponent } from './_components/salesforce-connection/salesforce-connection.component';
import { DuplicateBusinessruleComponent } from './_components/duplicate-businessrule/duplicate-businessrule.component';
import { AdvanceoptionsDialogComponent } from './_components/advanceoptions-dialog/advanceoptions-dialog.component';
import { DuplicateDetailsComponent } from './_components/duplicate-details/duplicate-details.component';
import { DiwCreateSchemaComponent } from '../admin/_components/module/schema/diw-create-schema/diw-create-schema.component';
import { DiwCreateBusinessruleComponent } from '../admin/_components/module/schema/diw-create-businessrule/diw-create-businessrule.component';
import { CreateVariantComponent } from './_components/create-variant/create-variant.component';
import { AppHomeComponent } from './_components/app-home/app-home.component';
import { UploadDatasetComponent } from './_components/upload-dataset/upload-dataset.component';
import { MdoGenericComponentsComponent } from './_components/mdo-generic-components/mdo-generic-components.component';

const routes: Routes = [
  { path: '', component: SchemaListComponent },
  { path: 'group/:groupId', component: SchemaGroupFormComponent },
  // { path: 'schema-list/:schemaGrpId', component: SchemaListComponent },
  { path: 'schema-details/:moduleId/:schemaId/:variantId', component: SchemaDetailsComponent },
  { path: 'schema-variants/:moduleId/:schemaId', component: SchemaVariantsComponent },
  { path: 'schema-execution/:schemaId', component: SchemaExecutionComponent },
  { path: 'collab/:schemaId', component: SchemaCollaboratorsComponent },
  { path: 'execution-logs/:schemaId', component: SchemaExecutionLogsComponent },
  { path: 'addbusinessrule', component: AddbusinessruleComponent },
  { path: 'table-column-settings', component: TableColumnSettingsComponent },
  { path: 'uploaddata', component: UploadDataComponent },
  { path: 'create-schema/:moduleId', component: CreateSchemaComponent },
  { path: 'create-schema/:moduleId/:schemaId', component: CreateSchemaComponent },
  { path: 'salesforce-connection', component: SalesforceConnectionComponent },
  { path: 'duplicate-businessrule', component: DuplicateBusinessruleComponent },
  { path: 'advanceoptions-dialog', component: AdvanceoptionsDialogComponent },
  { path: 'duplicate-details', component: DuplicateDetailsComponent },
  { path: 'diw-create-schema', component: DiwCreateSchemaComponent },
  { path: 'diw-create-businessrule', component: DiwCreateBusinessruleComponent },
  { path: 'schema-variants/create-variant/:moduleId/:schemaId/:variantId', component: CreateVariantComponent },
  { path: 'app-home', component: AppHomeComponent },
  { path: 'upload-dataset', component: UploadDatasetComponent },
  { path: 'mdo-generic-components', component: MdoGenericComponentsComponent },



  // anything not mapped should go to page not found component
  { path: '**', component: PageNotFoundComponent }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SchemaRoutingModule { }
