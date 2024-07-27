import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HomeRoutingModule } from './home-routing.module';
import { HomeComponent } from './home.component';
import {MaterialModule} from "../../../material.module";
// import {ContainerComponent } from "../../container/container.component"
// import {GoogleMapsModule} from "@angular/google-maps"


@NgModule({
  declarations: [HomeComponent],
  imports: [
    CommonModule,
    HomeRoutingModule,
    MaterialModule,
    // GoogleMapsModule
  ]
})
export class HomeModule { }
