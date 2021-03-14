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
      apiKey: 'AIzaSyDfXfxPJGomCNonsmQiH1JuTTXdaUl-QaE',
      libraries: ['places']
    })
  ]
})
export class VerPedidosMapModule { }
