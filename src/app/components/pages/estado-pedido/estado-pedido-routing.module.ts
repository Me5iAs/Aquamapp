import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { EstadoPedidoComponent } from './estado-pedido.component';

const routes: Routes = [{ path: '', component: EstadoPedidoComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EstadoPedidoRoutingModule { }
