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
      apiKey: 'AIzaSyDfXfxPJGomCNonsmQiH1JuTTXdaUl-QaE',
      libraries: ['places']
    })
  ]
})
export class NewClientesModule { }
