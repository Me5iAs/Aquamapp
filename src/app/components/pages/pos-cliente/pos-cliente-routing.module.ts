import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PosClienteComponent } from './pos-cliente.component';

const routes: Routes = [{ path: '', component: PosClienteComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PosClienteRoutingModule { }
