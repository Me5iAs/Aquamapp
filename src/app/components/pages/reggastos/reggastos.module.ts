import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ReggastosRoutingModule } from './reggastos-routing.module';
import { ReggastosComponent } from './reggastos.component';
import { FormsModule, ReactiveFormsModule } from "@angular/forms"
import {MaterialModule} from "../../../material.module";


@NgModule({
  declarations: [ReggastosComponent],
  exports:[
    ReactiveFormsModule
  ],
  imports: [
    CommonModule,
    ReggastosRoutingModule,
    MaterialModule,
    ReactiveFormsModule,
    FormsModule
  ]
})
export class ReggastosModule { }
