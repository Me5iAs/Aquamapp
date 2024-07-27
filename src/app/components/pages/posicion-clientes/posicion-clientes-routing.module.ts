import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PosicionClientesComponent } from './posicion-clientes.component';

const routes: Routes = [{ path: '', component: PosicionClientesComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PosicionClientesRoutingModule { }
