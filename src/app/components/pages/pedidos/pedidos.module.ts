import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PedidosRoutingModule } from './pedidos-routing.module';
import { PedidosComponent, Dialogpedidos } from './pedidos.component';

import { FormsModule, ReactiveFormsModule } from "@angular/forms"
import {MaterialModule} from "../../../material.module";


@NgModule({
  declarations: [PedidosComponent, Dialogpedidos],
  imports: [
    CommonModule,
    PedidosRoutingModule,
    MaterialModule,
    ReactiveFormsModule,
    FormsModule
  ]
})
export class PedidosModule { }
