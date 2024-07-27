import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { GPersonalComponent } from './g-personal.component';

const routes: Routes = [{ path: '', component: GPersonalComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GPersonalRoutingModule { }
