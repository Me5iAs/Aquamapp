import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { NuevoPedidoRoutingModule } from './nuevo-pedido-routing.module';
import { NuevoPedidoComponent } from './nuevo-pedido.component';
import { FormsModule, ReactiveFormsModule } from "@angular/forms"
import {MaterialModule} from "../../../material.module";
import { AgmCoreModule } from '@agm/core';

@NgModule({
  declarations: [NuevoPedidoComponent],
  imports: [
    CommonModule,
    NuevoPedidoRoutingModule,
    MaterialModule,
    ReactiveFormsModule,
    FormsModule,
    // GMapaModule
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyAyYkkI_yjO_J6IRFhwItUg-vb_pubp2Js',
      libraries: ['places']
    })
  ]
})
export class NuevoPedidoModule { }
