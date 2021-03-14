import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PosClienteRoutingModule } from './pos-cliente-routing.module';
import { PosClienteComponent } from './pos-cliente.component';

import {MaterialModule} from "../../../material.module";

@NgModule({
  declarations: [PosClienteComponent],
  imports: [
    CommonModule,
    PosClienteRoutingModule,
    MaterialModule
  ]
})
export class PosClienteModule { }
