import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PageNotFoundComponent } from './_modules/shared/_components/page-not-found/page-not-found.component';
import { NewBusinessRulesComponent } from '@modules/schema/_components/new-business-rules/new-business-rules.component';
import { SystemTrayComponent } from '@modules/home/_components/system-tray/system-tray.component';
import { AuthGuard } from './_guards/auth.guard';
import { EmailTemplateComponent } from '@modules/report/view/email/email-template/email-template.component';

const routes: Routes = [
  { path: '', redirectTo: '/home/dash/welcome', pathMatch: 'full' },
  { path: 'auth', loadChildren: () => import('./_modules/auth/auth.module').then((m) => m.AuthModule) },
  { path: 'admin', loadChildren: () => import('./_modules/admin/admin.module').then((m) => m.AdminModule), canActivate: [AuthGuard] },
  { path: 'home', loadChildren: () => import('./_modules/home/home.module').then((m) => m.HomeModule), canActivate: [AuthGuard] },
  { path: 'nonav', loadChildren: () => import('./_modules/nonav/nonav.module').then((m) => m.NonavModule), canActivate: [AuthGuard] },
  { path: 'sb/schema', loadChildren: () => import('./_modules/schema/schema.module').then((m) => m.SchemaModule), outlet: 'sb' },
  { path: 'outer/schema', loadChildren: () => import('./_modules/schema/schema.module').then((m) => m.SchemaModule), outlet: 'outer' },
  { path: 'sb/list', loadChildren: () => import('./_modules/list/list.module').then((m) => m.ListModule), outlet: 'sb' },
  { path: 'outer/list', loadChildren: () => import('./_modules/list/list.module').then((m) => m.ListModule), outlet: 'outer' },
  { path: 'settings', loadChildren: () => import('./_modules/settings/settings.module').then((m) => m.SettingsModule), outlet: 'sb' },
  { path: 'msteams', loadChildren: () => import('./_modules/msteams/msteams.module').then((m) => m.MSTeamsModule) },
  { path: 'sb/report', loadChildren: () => import('./_modules/report/report.module').then((m) => m.ReportModule), outlet: 'sb' },
  { path: 'lib', loadChildren: () => import('./_modules/lib/lib.module').then((m) => m.LibModule) },
  { path: 'outer/add-business-rules', component: NewBusinessRulesComponent, outlet: 'outer' },
  { path: 'sb/add-business-rules', component: NewBusinessRulesComponent, outlet: 'sb' },
  { path: 'sb/system-tray', component: SystemTrayComponent, outlet: 'sb' },
  { path: 'sb/task', loadChildren: () => import('./_modules/taskinbox/taskinbox.module').then((m) => m.TaskinboxModule), outlet: 'sb' },
  { path: 'outer/report', loadChildren: () => import('./_modules/report/report.module').then((m) => m.ReportModule), outlet: 'outer' },
  // anything not mapped should go to page not found component
  { path: '**', component: PageNotFoundComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule],
})
export class AppRoutingModule {}
