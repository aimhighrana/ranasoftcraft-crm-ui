import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SettingsComponent } from './_components/settings.component';
import { SettingsRoutingModule } from './settings-routing.module';
import { SharedModule } from '@modules/shared/shared.module';


@NgModule({
  declarations: [
    SettingsComponent
  ],
  imports: [
    CommonModule,
    SettingsRoutingModule,
    SharedModule
  ]
})
export class SettingsModule { }
