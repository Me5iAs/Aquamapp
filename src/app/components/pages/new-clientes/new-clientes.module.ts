import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { NewClientesRoutingModule } from './new-clientes-routing.module';
import { NewClientesComponent } from './new-clientes.component';
import { FormsModule, ReactiveFormsModule } from "@angular/forms"
import {MaterialModule} from "../../../material.module";
import { AgmCoreModule } from '@agm/core';

@NgModule({
  declarations: [NewClientesComponent],
  imports: [
    CommonModule,
    NewClientesRoutingModule,
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
export class NewClientesModule { }
