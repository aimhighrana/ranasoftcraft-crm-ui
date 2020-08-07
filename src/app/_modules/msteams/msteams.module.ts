import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MSTeamsRoutingModule } from './msteams-routing.module';
import { SharedModule } from '../shared/shared.module';
import { MsteamConfigurationComponent } from './msteam-configuration/msteam-configuration.component';
import { MsteamAuthConfigurationComponent } from './msteam-auth-configuration/msteam-auth-configuration.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MsteamReportConfigurationComponent } from './msteam-report-configuration/msteam-report-configuration.component';
import { AppMaterialModuleForSpec } from 'src/app/app-material-for-spec.module';

@NgModule({
  declarations: [
    MsteamConfigurationComponent,
    MsteamAuthConfigurationComponent,
    MsteamReportConfigurationComponent
  ],
  imports: [
    CommonModule,
    MSTeamsRoutingModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    AppMaterialModuleForSpec
  ]
})
export class MSTeamsModule { }
