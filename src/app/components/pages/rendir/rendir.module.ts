import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RendirRoutingModule } from './rendir-routing.module';
import { RendirComponent } from './rendir.component';

import { FormsModule, ReactiveFormsModule } from "@angular/forms"
import {MaterialModule} from "../../../material.module";

@NgModule({
  declarations: [RendirComponent],
  imports: [
    CommonModule,
    RendirRoutingModule,
    MaterialModule,
    ReactiveFormsModule,
    FormsModule
  ]
})
export class RendirModule { }
