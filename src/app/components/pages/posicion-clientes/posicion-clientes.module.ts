import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PosicionClientesRoutingModule } from './posicion-clientes-routing.module';
import { PosicionClientesComponent } from './posicion-clientes.component';
import { AgmCoreModule } from '@agm/core';
import {MaterialModule} from "../../../material.module";

@NgModule({
  declarations: [PosicionClientesComponent],
  imports: [
    CommonModule,
    PosicionClientesRoutingModule,
    MaterialModule,
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyDfXfxPJGomCNonsmQiH1JuTTXdaUl-QaE',
      libraries: ['places']
    })
  ]
})
export class PosicionClientesModule { }
