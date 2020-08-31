import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MovimientosRoutingModule } from './movimientos-routing.module';
import { movimientosComponent, Dialogmovimientos } from './movimientos.component';
import { FormsModule, ReactiveFormsModule } from "@angular/forms"
import {MaterialModule} from "../../../material.module";

@NgModule({
  declarations: [movimientosComponent, Dialogmovimientos],
  exports:[
    ReactiveFormsModule
  ],
// entryComponents: [
//   Dialogmovimientos
// ],
  imports: [
    CommonModule,
    MovimientosRoutingModule,
    MaterialModule,
    ReactiveFormsModule,
    FormsModule
  ]
})
export class MovimientosModule { }
