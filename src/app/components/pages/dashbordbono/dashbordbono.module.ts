import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DashbordbonoRoutingModule } from './dashbordbono-routing.module';
import { DashbordbonoComponent } from './dashbordbono.component';
import { FormsModule, ReactiveFormsModule } from "@angular/forms"
import {MaterialModule} from "../../../material.module";

@NgModule({
  declarations: [DashbordbonoComponent],
  imports: [
    CommonModule,
    DashbordbonoRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule,
    
  ]
})
export class DashbordbonoModule { }
