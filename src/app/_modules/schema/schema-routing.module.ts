import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PageNotFoundComponent } from '../shared/_components/page-not-found/page-not-found.component';
import { SchemaGroupsComponent } from 'src/app/_modules/schema/_components/schema-groups/schema-groups.component';
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


const routes: Routes = [
  { path: '', component: SchemaGroupsComponent },
  { path: 'group/:groupId', component: SchemaGroupFormComponent },
  { path: 'schema-list/:schemaGrpId', component: SchemaListComponent },
  { path: 'schema-details/:moduleId/:schemaGroupId/:schemaId/:variantId', component: SchemaDetailsComponent },
  { path: 'schema-variants/:moduleId/:groupId/:schemaId', component: SchemaVariantsComponent },
  { path: 'schema-execution/:groupId/:schemaId', component: SchemaExecutionComponent },
  { path: 'collab/:schemaId', component: SchemaCollaboratorsComponent },
  { path: 'execution-logs/:schemaId', component: SchemaExecutionLogsComponent },
  { path: 'addbusinessrule', component: AddbusinessruleComponent },
  { path: 'table-column-settings', component: TableColumnSettingsComponent },
  { path: 'uploaddata', component: UploadDataComponent },
  { path: 'create-schema/:moduleId/:groupId/:schemaId', component: CreateSchemaComponent },
  // anything not mapped should go to page not found component
  { path: '**', component: PageNotFoundComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SchemaRoutingModule { }
