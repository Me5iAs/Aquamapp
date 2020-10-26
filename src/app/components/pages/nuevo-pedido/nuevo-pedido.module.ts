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
      apiKey: 'AIzaSyA8d0CD3InmjRc4R8GX3mf6ByuebwPwJUo',
      libraries: ['places']
    })
  ]
})
export class NuevoPedidoModule { }
