import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { PageNotFoundComponent } from "../shared/_components/page-not-found/page-not-found.component";
import { PrimaryNavigationComponent } from "./_components/primary-navigation/primary-navigation.component";
import { WelcomeComponent } from "./_components/welcome/welcome.component";

const routes: Routes = [
  {
    path: "",
    component: PrimaryNavigationComponent,
    children: [
      {
        path: "",
        redirectTo: "dash/welcome",
        pathMatch: "full",
      },
      {
        path: "dash",
        children: [
          {
            path: "welcome",
            component: WelcomeComponent,
          },
        ],
      },
      // { path: '', redirectTo: 'schema', pathMatch: 'full' },
      {
        path: "schema",
        loadChildren: () =>
          import("../schema/schema.module").then((m) => m.SchemaModule),
      },
      {
        path: "report",
        loadChildren: () =>
          import("../report/report.module").then((m) => m.ReportModule),
      },
      {
        path: "list",
        loadChildren: () =>
          import("../list/list.module").then((m) => m.ListModule),
      },
      // { path: 'task/inbox', loadChildren: () => import('../taskinbox/taskinbox.module').then(m => m.TaskinboxModule) },
      {
        path: "task/:node",
        loadChildren: () =>
          import("../taskinbox/taskinbox.module").then(
            (m) => m.TaskinboxModule
          ),
      },
    ],
  },
  // anything not mapped should go to page not found component
  { path: "**", component: PageNotFoundComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class HomeRoutingModule {}
