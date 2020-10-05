import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PageNotFoundComponent } from '../shared/_components/page-not-found/page-not-found.component';
import { NonavLayoutComponent } from './_layouts/nonav-layout/nonav-layout.component';

const routes: Routes = [{
  path: '', component: NonavLayoutComponent,
  children: [
    { path: 'report', loadChildren: () => import('../report/report.module').then(m => m.ReportModule) }
  ]
},
// anything not mapped should go to page not found component
{ path: '**', component: PageNotFoundComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class NonavRoutingModule { }
