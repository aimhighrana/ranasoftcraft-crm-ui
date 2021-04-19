import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ListRoutingModule } from './list-routing.module';
import { ListComponent } from './_components/list.component';
import { ListDatatableComponent } from './_components/list-datatable/list-datatable.component';
import { TableViewSettingsComponent } from './_components/table-view-settings/table-view-settings.component';
import { SharedModule } from '@modules/shared/shared.module';
import { GlobalSearchComponent } from './_components/global-search/global-search.component';
import { ListFilterComponent } from './_components/list-filter/list-filter.component';
import { FilterSaveModalComponent } from './_components/filter-save-modal/filter-save-modal.component';
import { FilterChipsComponent } from './_components/filter-chips/filter-chips.component';


@NgModule({
  declarations: [
    ListComponent,
    TableViewSettingsComponent,
    ListDatatableComponent,
    GlobalSearchComponent,
    ListFilterComponent,
    FilterSaveModalComponent,
    FilterChipsComponent
  ],
  imports: [
    CommonModule,
    ListRoutingModule,
    SharedModule,
  ],
  exports:[]
})
export class ListModule { }
