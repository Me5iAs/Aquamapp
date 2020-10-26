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
      apiKey: 'AIzaSyA8d0CD3InmjRc4R8GX3mf6ByuebwPwJUo',
      libraries: ['places']
    })
    
  ],
  exports:[
    GMapaComponent
  ]
})
export class GMapaModule { }
