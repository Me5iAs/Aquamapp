import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProdRoutingModule } from './prod-routing.module';
import { ProdComponent } from './prod.component';


@NgModule({
  declarations: [ProdComponent],
  imports: [
    CommonModule,
    ProdRoutingModule
  ]
})
export class ProdModule { }
