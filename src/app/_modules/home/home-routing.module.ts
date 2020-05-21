import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PageNotFoundComponent } from '../shared/_components/page-not-found/page-not-found.component';
import { HomeLayoutComponent } from 'src/app/_modules/home/_components/home-layout/home-layout.component';

const routes: Routes = [
  {
    path: '', component: HomeLayoutComponent,
    children: [
      // { path: '', redirectTo: 'schema', pathMatch: 'full' },
      { path: 'schema', loadChildren: () => import('../schema/schema.module').then(m => m.SchemaModule) },
      { path: 'report', loadChildren: () => import('../report/report.module').then(m => m.ReportModule) },
      // load base component
      { path: '', loadChildren: () => import('../base/base.module').then(m => m.BaseModule) },
    ]
  },
  // anything not mapped should go to page not found component
  { path: '**', component: PageNotFoundComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HomeRoutingModule { }
