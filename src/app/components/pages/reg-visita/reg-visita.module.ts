import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RegVisitaRoutingModule } from './reg-visita-routing.module';
import { RegVisitaComponent } from './reg-visita.component';
import { FormsModule, ReactiveFormsModule } from "@angular/forms"
import {MaterialModule} from "../../../material.module";

@NgModule({
  declarations: [RegVisitaComponent],
  imports: [
    CommonModule,
    RegVisitaRoutingModule,
    MaterialModule,
    ReactiveFormsModule,
    FormsModule
  ]
})
export class RegVisitaModule { }
