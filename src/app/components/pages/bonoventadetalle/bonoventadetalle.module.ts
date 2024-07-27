import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BonoventadetalleRoutingModule } from './bonoventadetalle-routing.module';
import { BonoventadetalleComponent } from './bonoventadetalle.component';
import { FormsModule, ReactiveFormsModule } from "@angular/forms"
import {MaterialModule} from "../../../material.module";

@NgModule({
  declarations: [BonoventadetalleComponent],
  imports: [
    CommonModule,
    BonoventadetalleRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule
  ]
})
export class BonoventadetalleModule { }
