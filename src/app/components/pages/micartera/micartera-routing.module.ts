import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MicarteraComponent } from './micartera.component';

const routes: Routes = [{ path: '', component: MicarteraComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MicarteraRoutingModule { }
