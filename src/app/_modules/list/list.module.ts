import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ListRoutingModule } from './list-routing.module';
import { ListComponent } from './_components/list.component';
import { SharedModule } from '@modules/shared/shared.module';


@NgModule({
  declarations: [ListComponent],
  imports: [
    CommonModule,
    ListRoutingModule,
    SharedModule,
  ],
  exports:[]
})
export class ListModule { }
