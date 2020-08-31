import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { NuevoPedidoComponent } from './nuevo-pedido.component';

const routes: Routes = [{ path: '', component: NuevoPedidoComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class NuevoPedidoRoutingModule { }
