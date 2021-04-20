import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PageNotFoundComponent } from '@modules/shared/_components/page-not-found/page-not-found.component';
import { FilterChipsComponent } from './_components/filter-chips/filter-chips.component';
// import { ListComponent } from './_components/list.component';
import { ListDatatableComponent } from './_components/list-datatable/list-datatable.component';
import { ListFilterComponent } from './_components/list-filter/list-filter.component';
import { TableViewSettingsComponent } from './_components/table-view-settings/table-view-settings.component';

const routes: Routes = [
  /* {
    path: '',
    component: ListDatatableComponent
  }, */
  { path: 'datatable/:moduleId', component: ListDatatableComponent },
  { path: 'table-view-settings/:moduleId/:viewId', component: TableViewSettingsComponent },
  { path: 'filter-settings/:moduleId', component: ListFilterComponent },
  // { path: 'list-filter', component: ListFilterComponent },
  { path: 'filter-chips', component: FilterChipsComponent },
  { path: '**', component: PageNotFoundComponent }
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ListRoutingModule { }
