import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { VerMapRoutingModule } from './ver-map-routing.module';
import { VerMapComponent } from './ver-map.component';
import { AgmCoreModule } from '@agm/core';
import {MaterialModule} from "../../../material.module";


@NgModule({
  declarations: [VerMapComponent],
  imports: [
    CommonModule,
    VerMapRoutingModule,
    MaterialModule,
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyDfXfxPJGomCNonsmQiH1JuTTXdaUl-QaE',
      libraries: ['places']
    })
  ]
})
export class VerMapModule { }
