import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeRoutingModule } from './home-routing.module';
import { SharedModule } from '../shared/shared.module';
import { HomeLayoutComponent } from 'src/app/_modules/home/_components/home-layout/home-layout.component';
import { PrimaryNavbarComponent } from '@modules/schema/_components/primary-navbar/primary-navbar.component';
import { SecondaryNavbarComponent } from '@modules/schema/_components/secondary-navbar/secondary-navbar.component';
import { SystemTrayComponent } from './_components/system-tray/system-tray.component';
import { PrimaryNavigationComponent } from './_components/primary-navigation/primary-navigation.component';

@NgModule({
  declarations: [
    PrimaryNavbarComponent,
    SecondaryNavbarComponent,
    HomeLayoutComponent,
    SystemTrayComponent,
    PrimaryNavigationComponent
  ],
  imports: [
    CommonModule,
    HomeRoutingModule,
    SharedModule
  ]
})
export class HomeModule { }
