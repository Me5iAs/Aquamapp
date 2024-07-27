import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EstadoPedidoRoutingModule } from './estado-pedido-routing.module';
import { EstadoPedidoComponent } from './estado-pedido.component';


@NgModule({
  declarations: [EstadoPedidoComponent],
  imports: [
    CommonModule,
    EstadoPedidoRoutingModule
  ]
})
export class EstadoPedidoModule { }
