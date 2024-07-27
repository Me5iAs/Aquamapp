import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MapapedidosComponent } from './mapapedidos.component';

const routes: Routes = [{ path: '', component: MapapedidosComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MapapedidosRoutingModule { }
