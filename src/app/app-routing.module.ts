import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PageNotFoundComponent } from './_modules/shared/_components/page-not-found/page-not-found.component';
import { HomeLayoutComponent } from './_components/home/home-layout/home-layout.component';
import { SchemaListComponent } from './_components/home/schema/schema-list/schema-list.component';
import { SchemaGroupsComponent } from './_components/home/schema/schema-groups/schema-groups.component';
import { SchemaDetailsComponent } from './_components/home/schema/schema-details/schema-details.component';
import { SchemaVariantsComponent } from './_components/home/schema/schema-variants/schema-variants.component';
import { SchemaGroupFormComponent } from './_components/home/schema/schema-group-form/schema-group-form.component';
import { SchemaExecutionComponent } from './_components/home/schema/schema-execution/schema-execution.component';
import { SchemaCollaboratorsComponent } from './_components/home/schema/schema-collaborators/schema-collaborators.component';

const routes: Routes = [
  { path: 'admin', loadChildren: () => import('./_modules/admin/admin.module').then(m => m.AdminModule) },
  { path: 'schema/collab/:schemaId', component: SchemaCollaboratorsComponent, outlet: 'sb' },
  {
    path: 'home', component: HomeLayoutComponent,
    children: [
      { path: '', redirectTo: 'schema', pathMatch: 'full' },
      { path: 'schema', component: SchemaGroupsComponent },
      { path: 'schema/group/:groupId', component: SchemaGroupFormComponent },
      { path: 'schema/schema-list/:schemaGrpId', component: SchemaListComponent },
      { path: 'schema/schema-details/:moduleId/:schemaGroupId/:schemaId', component: SchemaDetailsComponent },
      { path: 'schema/schema-variants/:moduleId/:groupId/:schemaId', component: SchemaVariantsComponent },
      { path: 'schema/schema-execution/:groupId/:schemaId', component: SchemaExecutionComponent }
    ]
  },
  // anything not mapped should go to page not found component
  { path: '**', component: PageNotFoundComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
