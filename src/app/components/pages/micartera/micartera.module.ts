import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MicarteraRoutingModule } from './micartera-routing.module';
import { MicarteraComponent } from './micartera.component';


@NgModule({
  declarations: [MicarteraComponent],
  imports: [
    CommonModule,
    MicarteraRoutingModule
  ]
})
export class MicarteraModule { }
