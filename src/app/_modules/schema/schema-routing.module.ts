import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PageNotFoundComponent } from '../shared/_components/page-not-found/page-not-found.component';
import { SchemaGroupsComponent } from 'src/app/_modules/schema/_components/schema-groups/schema-groups.component';
import { SchemaGroupFormComponent } from 'src/app/_modules/schema/_components/schema-group-form/schema-group-form.component';
import { SchemaListComponent } from 'src/app/_modules/schema/_components/schema-list/schema-list.component';
import { SchemaDetailsComponent } from 'src/app/_components/home/schema/schema-details/schema-details.component';
import { SchemaVariantsComponent } from 'src/app/_components/home/schema/schema-variants/schema-variants.component';
import { SchemaExecutionComponent } from 'src/app/_components/home/schema/schema-execution/schema-execution.component';

const routes: Routes = [
  // primary outlet
  { path: '', component: SchemaGroupsComponent },
  { path: 'group/:groupId', component: SchemaGroupFormComponent },
  { path: 'schema-list/:schemaGrpId', component: SchemaListComponent },
  { path: 'schema-details/:moduleId/:schemaGroupId/:schemaId', component: SchemaDetailsComponent },
  { path: 'schema-variants/:moduleId/:groupId/:schemaId', component: SchemaVariantsComponent },
  { path: 'schema-execution/:groupId/:schemaId', component: SchemaExecutionComponent },
  // anything not mapped should go to page not found component
  { path: '**', component: PageNotFoundComponent }
];

@NgModule({
  imports: [ RouterModule.forChild(routes) ],
  exports: [ RouterModule ]
})
export class SchemaRoutingModule { }
