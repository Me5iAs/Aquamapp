import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { VerPedidosMapComponent } from './ver-pedidos-map.component';

const routes: Routes = [{ path: '', component: VerPedidosMapComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class VerPedidosMapRoutingModule { }
