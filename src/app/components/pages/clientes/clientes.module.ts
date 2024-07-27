import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ClientesRoutingModule } from './clientes-routing.module';
import { ClientesComponent } from './clientes.component';
import { FormsModule, ReactiveFormsModule } from "@angular/forms"
import {MaterialModule} from "../../../material.module";

@NgModule({
  declarations: [ClientesComponent, 
    // GMapaComponent
  ],
  exports:[
    ReactiveFormsModule
  ],
  // entryComponents: [
  //   DialogCliente
  // ],
  imports: [
    CommonModule,
    ClientesRoutingModule,
    MaterialModule,
    ReactiveFormsModule,
    FormsModule,
  ]
})
export class ClientesModule { }
