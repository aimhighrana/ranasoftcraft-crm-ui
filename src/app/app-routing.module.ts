import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PageNotFoundComponent } from './_modules/shared/_components/page-not-found/page-not-found.component';
import { SchemaCollaboratorsComponent } from './_components/home/schema/schema-collaborators/schema-collaborators.component';

const routes: Routes = [
  { path: 'admin', loadChildren: () => import('./_modules/admin/admin.module').then(m => m.AdminModule) },
  { path: 'home', loadChildren: () => import('./_modules/home/home.module').then(m => m.HomeModule) },
  { path: 'schema/collab/:schemaId', component: SchemaCollaboratorsComponent, outlet: 'sb' },
  // anything not mapped should go to page not found component
  { path: '**', component: PageNotFoundComponent }
];

@NgModule({
  imports: [ RouterModule.forRoot(routes, { useHash: true }) ],
  exports: [ RouterModule ]
})
export class AppRoutingModule { }
