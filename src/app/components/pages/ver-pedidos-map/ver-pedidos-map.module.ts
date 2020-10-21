import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { VerPedidosMapRoutingModule } from './ver-pedidos-map-routing.module';
import { VerPedidosMapComponent } from './ver-pedidos-map.component';


@NgModule({
  declarations: [VerPedidosMapComponent],
  imports: [
    CommonModule,
    VerPedidosMapRoutingModule
  ]
})
export class VerPedidosMapModule { }
