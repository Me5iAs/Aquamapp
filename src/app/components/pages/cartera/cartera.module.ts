import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CarteraRoutingModule } from './cartera-routing.module';
import { CarteraComponent } from './cartera.component';
import { FormsModule, ReactiveFormsModule } from "@angular/forms"
import {MaterialModule} from "../../../material.module";


@NgModule({
  declarations: [CarteraComponent],
  exports:[
    ReactiveFormsModule
  ],
  imports: [
    CommonModule,
    CarteraRoutingModule,
    MaterialModule,
    ReactiveFormsModule,
    FormsModule,
  ]
})
export class CarteraModule { }
