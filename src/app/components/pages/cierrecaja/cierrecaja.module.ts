import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CierrecajaRoutingModule } from './cierrecaja-routing.module';
import { CierrecajaComponent } from './cierrecaja.component';
import { FormsModule, ReactiveFormsModule } from "@angular/forms"
import {MaterialModule} from "../../../material.module";


@NgModule({
  declarations: [CierrecajaComponent],
  exports:[
    ReactiveFormsModule
  ],
  imports: [
    CommonModule,
    CierrecajaRoutingModule,
    MaterialModule,
    ReactiveFormsModule,
    FormsModule
  ]
})
export class CierrecajaModule { }
