import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AsignarVisitaRoutingModule } from './asignar-visita-routing.module';
import { AsignarVisitaComponent } from './asignar-visita.component';
import { FormsModule, ReactiveFormsModule } from "@angular/forms"
import {MaterialModule} from "../../../material.module";

@NgModule({
  declarations: [AsignarVisitaComponent],
  imports: [
    CommonModule,
    AsignarVisitaRoutingModule,
    MaterialModule,
    ReactiveFormsModule,
    FormsModule,
  ]
})
export class AsignarVisitaModule { }
