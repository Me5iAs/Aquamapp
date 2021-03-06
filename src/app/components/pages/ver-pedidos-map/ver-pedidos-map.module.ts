import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { VerPedidosMapRoutingModule } from './ver-pedidos-map-routing.module';
import { VerPedidosMapComponent } from './ver-pedidos-map.component';
import { AgmCoreModule } from '@agm/core';
import {MaterialModule} from "../../../material.module";

@NgModule({
  declarations: [VerPedidosMapComponent],
  imports: [
    CommonModule,
    MaterialModule,
    VerPedidosMapRoutingModule,
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyA8d0CD3InmjRc4R8GX3mf6ByuebwPwJUo',
      libraries: ['places']
    })
  ]
})
export class VerPedidosMapModule { }
