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
      apiKey: 'AIzaSyAyYkkI_yjO_J6IRFhwItUg-vb_pubp2Js',
      libraries: ['places']
    })
    
  ],
  exports:[
    GMapaComponent
  ]
})
export class GMapaModule { }
