import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BonoclientesdetalleRoutingModule } from './bonoclientesdetalle-routing.module';
import { BonoclientesdetalleComponent } from './bonoclientesdetalle.component';
import {MaterialModule} from "../../../material.module";

@NgModule({
  declarations: [BonoclientesdetalleComponent],
  imports: [
    CommonModule,
    BonoclientesdetalleRoutingModule,
    MaterialModule
  ]
})
export class BonoclientesdetalleModule { }
