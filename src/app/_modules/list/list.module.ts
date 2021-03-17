import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ListRoutingModule } from './list-routing.module';
import { ListComponent } from './_components/list.component';
import { ListDatatableComponent } from './_components/list-datatable/list-datatable.component';
import { TableViewSettingsComponent } from './_components/table-view-settings/table-view-settings.component';
import { SharedModule } from '@modules/shared/shared.module';


@NgModule({
  declarations: [
    ListComponent,
    TableViewSettingsComponent,
    ListDatatableComponent
  ],
  imports: [
    CommonModule,
    ListRoutingModule,
    SharedModule,
  ],
  exports:[]
})
export class ListModule { }
