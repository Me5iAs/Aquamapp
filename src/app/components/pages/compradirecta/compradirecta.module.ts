import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CompradirectaRoutingModule } from './compradirecta-routing.module';
import { CompradirectaComponent } from './compradirecta.component';
import { FormsModule, ReactiveFormsModule } from "@angular/forms"
import {MaterialModule} from "../../../material.module";
import { AgmCoreModule } from '@agm/core';

@NgModule({
  declarations: [CompradirectaComponent],
  imports: [
    CommonModule,
    CompradirectaRoutingModule,
    MaterialModule,
    ReactiveFormsModule,
    FormsModule,
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyDfXfxPJGomCNonsmQiH1JuTTXdaUl-QaE',
      libraries: ['places']
    })
  ]
})




export class CompradirectaModule { }
