import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { movimientosComponent } from './movimientos.component';

const routes: Routes = [{ path: '', component: movimientosComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MovimientosRoutingModule { }
