import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DashbordbonoComponent } from './dashbordbono.component';

const routes: Routes = [{ path: '', component: DashbordbonoComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DashbordbonoRoutingModule { }
