import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GMapaComponent } from './g-mapa.component';
// import { GoogleMapsModule } from "@angular/google-maps";
import { AgmCoreModule } from '@agm/core';

@NgModule({
  declarations: [GMapaComponent],
  imports: [
    CommonModule,
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyDfXfxPJGomCNonsmQiH1JuTTXdaUl-QaE',
      libraries: ['places']
    })
    
  ],
  exports:[
    GMapaComponent
  ]
})
export class GMapaModule { }
