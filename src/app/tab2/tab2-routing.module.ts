import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EmpCreateUpdateComponent } from './emp-create-update/emp-create-update.component';
import { Tab2Page } from './tab2.page';

const routes: Routes = [
  {
    path: '',
    component: Tab2Page,
  },{
    path: 'new',
    component: EmpCreateUpdateComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class Tab2PageRoutingModule {}
