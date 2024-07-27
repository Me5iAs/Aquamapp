import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { GPersonalRoutingModule } from './g-personal-routing.module';
import { GPersonalComponent, DialogUsuario } from './g-personal.component';
import { FormsModule, ReactiveFormsModule } from "@angular/forms"
import {MaterialModule} from "../../../material.module";


@NgModule({
  declarations: [GPersonalComponent, DialogUsuario],
  imports: [
    CommonModule,
    GPersonalRoutingModule,
    MaterialModule,
    ReactiveFormsModule,
    FormsModule,
  ]
})
export class GPersonalModule { }
