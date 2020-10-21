import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';


const routes: Routes = [
  { path: 'new_clientes', loadChildren: () => import('./components/pages/new-clientes/new-clientes.module').then(m => m.NewClientesModule) }, 
{ path: 'edit_user/:IdCli', loadChildren: () => import('./components/pages/edit-user/edit-user.module').then(m => m.EditUserModule) },
  { path: 'nuevo_pedido', loadChildren: () => import('./components/pages/nuevo-pedido/nuevo-pedido.module').then(m => m.NuevoPedidoModule) },
  { path: 'atencion:/IdPedido', loadChildren: () => import('./components/pages/atencion/atencion.module').then(m => m.AtencionModule) },
  { path: 'vehiculos', loadChildren: () => import('./components/pages/vehiculos/vehiculos.module').then(m => m.VehiculosModule) },
  { path: 'reportes', loadChildren: () => import('./components/pages/reportes/reportes.module').then(m => m.ReportesModule) },
  { path: 'ver_pedidos_map', loadChildren: () => import('./components/pages/ver-pedidos-map/ver-pedidos-map.module').then(m => m.VerPedidosMapModule) }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
