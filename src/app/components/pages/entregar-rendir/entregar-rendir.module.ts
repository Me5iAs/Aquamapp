import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EntregarRendirRoutingModule } from './entregar-rendir-routing.module';
import { EntregarRendirComponent } from './entregar-rendir.component';

import { FormsModule, ReactiveFormsModule } from "@angular/forms"
import {MaterialModule} from "../../../material.module";

@NgModule({
  declarations: [EntregarRendirComponent],
  imports: [
    CommonModule,
    EntregarRendirRoutingModule,
    MaterialModule,
    ReactiveFormsModule,
    FormsModule
  ]
})
export class EntregarRendirModule { }
