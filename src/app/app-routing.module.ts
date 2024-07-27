import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [{ path: 'micartera', loadChildren: () => import('./components/pages/micartera/micartera.module').then(m => m.MicarteraModule) }, { path: 'mapapedidos', loadChildren: () => import('./components/pages/mapapedidos/mapapedidos.module').then(m => m.MapapedidosModule) }];
// const routes: Routes = [
//   { path: 'new_clientes', loadChildren: () => import('./components/pages/new-clientes/new-clientes.module').then(m => m.NewClientesModule) }, 
//   { path: 'edit_user/:IdCli', loadChildren: () => import('./components/pages/edit-user/edit-user.module').then(m => m.EditUserModule) },
//   { path: 'nuevo_pedido', loadChildren: () => import('./components/pages/nuevo-pedido/nuevo-pedido.module').then(m => m.NuevoPedidoModule) },
//   { path: 'atencion:/IdPedido', loadChildren: () => import('./components/pages/atencion/atencion.module').then(m => m.AtencionModule) },
//   { path: 'vehiculos', loadChildren: () => import('./components/pages/vehiculos/vehiculos.module').then(m => m.VehiculosModule) },
  
//   { path: 'ver_pedidos_map', loadChildren: () => import('./components/pages/ver-pedidos-map/ver-pedidos-map.module').then(m => m.VerPedidosMapModule) },
//   { path: 'pos_clientes', loadChildren: () => import('./components/pages/posicion-clientes/posicion-clientes.module').then(m => m.PosicionClientesModule) },
//   { path: 'pos_cli', loadChildren: () => import('./components/pages/pos-cliente/pos-cliente.module').then(m => m.PosClienteModule) },
//   { path: 'entrega', loadChildren: () => import('./components/pages/entrega/entrega.module').then(m => m.EntregaModule) },
//   { path: 'rendir', loadChildren: () => import('./components/pages/rendir/rendir.module').then(m => m.RendirModule) },
//   { path: 'prod', loadChildren: () => import('./components/pages/prod/prod.module').then(m => m.ProdModule) },
//   { path: 'entregar_r', loadChildren: () => import('./components/pages/entregar-rendir/entregar-rendir.module').then(m => m.EntregarRendirModule) },
//   { path: 'reports', loadChildren: () => import('./components/pages/reports/reports.module').then(m => m.ReportsModule) },
//   { path: 'ruta', loadChildren: () => import('./components/pages/ruta/ruta.module').then(m => m.RutaModule) },
//   { path: 'asignar', loadChildren: () => import('./components/pages/asignar-visita/asignar-visita.module').then(m => m.AsignarVisitaModule) },
//   { path: 'reg_visita', loadChildren: () => import('./components/pages/reg-visita/reg-visita.module').then(m => m.RegVisitaModule) },
//   { path: 'ver_map', loadChildren: () => import('./components/pages/ver-map/ver-map.module').then(m => m.VerMapModule) },
//   { path: 'seguimiento', loadChildren: () => import('./components/pages/seguimiento/seguimiento.module').then(m => m.SeguimientoModule) },
//   { path: 'status_ped', loadChildren: () => import('./components/pages/estado-pedido/estado-pedido.module').then(m => m.EstadoPedidoModule) },
//   { path: 'compradirecta', loadChildren: () => import('./components/pages/compradirecta/compradirecta.module').then(m => m.CompradirectaModule) },
//   { path: 'cartera', loadChildren: () => import('./components/pages/cartera/cartera.module').then(m => m.CarteraModule) },
//   { path: 'seg_metas', loadChildren: () => import('./components/pages/seg-metas/seg-metas.module').then(m => m.SegMetasModule) },
//   { path: 'g_personal', loadChildren: () => import('./components/pages/g-personal/g-personal.module').then(m => m.GPersonalModule) },
//   { path: 'porcobrar', loadChildren: () => import('./components/pages/porcobrar/porcobrar.module').then(m => m.PorcobrarModule) },
//   { path: 'gastos', loadChildren: () => import('./components/pages/reggastos/reggastos.module').then(m => m.ReggastosModule) },
//   { path: 'cierrecaja', loadChildren: () => import('./components/pages/cierrecaja/cierrecaja.module').then(m => m.CierrecajaModule) },
//   { path: 'segmetas', loadChildren: () => import('./components/pages/segmetas/segmetas.module').then(m => m.SegmetasModule) },
//   { path: 'dashboardb', loadChildren: () => import('./components/pages/dashbordbono/dashbordbono.module').then(m => m.DashbordbonoModule) },
//   { path: 'bonoventadet/:IdVendedor/:mes/:ano', loadChildren: () => import('./components/pages/bonoventadetalle/bonoventadetalle.module').then(m => m.BonoventadetalleModule) },
//   { path: 'bonoclientesdet/:IdVendedor/:mes/:ano', loadChildren: () => import('./components/pages/bonoclientesdetalle/bonoclientesdetalle.module').then(m => m.BonoclientesdetalleModule) },
  
// ];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
