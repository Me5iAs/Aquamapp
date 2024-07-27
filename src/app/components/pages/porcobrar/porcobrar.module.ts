import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PorcobrarRoutingModule } from './porcobrar-routing.module';
import { PorcobrarComponent } from './porcobrar.component';
import { FormsModule, ReactiveFormsModule } from "@angular/forms"
import {MaterialModule} from "../../../material.module";

@NgModule({
  declarations: [PorcobrarComponent],
  imports: [
    CommonModule,
    PorcobrarRoutingModule,
    MaterialModule,
    ReactiveFormsModule,
    FormsModule,
  ]
})
export class PorcobrarModule { }
