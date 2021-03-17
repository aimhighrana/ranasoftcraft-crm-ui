import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ListdataRoutingModule } from './listdata-routing.module';
import { ListingComponent } from './listing/listing.component';
import { MdoUiLibraryModule } from 'mdo-ui-library';


@NgModule({
  declarations: [ListingComponent],
  imports: [
    CommonModule,
    ListdataRoutingModule,
    MdoUiLibraryModule
  ]
})
export class ListdataModule { }
