import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SettingsComponent } from './_components/settings.component';
import { SettingsRoutingModule } from './settings-routing.module';
import { SharedModule } from '@modules/shared/shared.module';
import { ProfileComponent } from './_components/profile/profile.component';
import { ChangePasswordDialogComponent } from './_components/profile/change-password-dialog/change-password-dialog.component';


@NgModule({
  declarations: [
    SettingsComponent,
    ProfileComponent,
    ChangePasswordDialogComponent
  ],
  imports: [
    CommonModule,
    SettingsRoutingModule,
    SharedModule
  ]
})
export class SettingsModule { }
