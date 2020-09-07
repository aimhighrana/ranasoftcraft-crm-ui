import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PageNotFoundComponent } from './_modules/shared/_components/page-not-found/page-not-found.component';
import { NewBusinessRulesComponent } from '@modules/schema/_components/new-business-rules/new-business-rules.component';


const routes: Routes = [
  { path: 'admin', loadChildren: () => import('./_modules/admin/admin.module').then(m => m.AdminModule) },
  { path: 'home', loadChildren: () => import('./_modules/home/home.module').then(m => m.HomeModule) },
  { path: 'sb/schema', loadChildren: () => import('./_modules/schema/schema.module').then(m => m.SchemaModule), outlet: 'sb' },
  { path: 'msteams', loadChildren: () => import('./_modules/msteams/msteams.module').then(m => m.MSTeamsModule) },
  { path: 'sb/report', loadChildren: () => import('./_modules/report/report.module').then(m => m.ReportModule), outlet: 'sb' },
  { path: 'lib', loadChildren: () => import('./_modules/lib/lib.module').then(m => m.LibModule)},
  { path: 'outer/add-business-rules', component: NewBusinessRulesComponent, outlet: 'outer' },
  { path: 'sb/add-business-rules', component: NewBusinessRulesComponent, outlet: 'sb' },


  // anything not mapped should go to page not found component
  { path: '**', component: PageNotFoundComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
