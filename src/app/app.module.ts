import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from "@angular/forms"

// guardianes
// ng g g guards/auth
import { AuthGuard } from "./guards/auth.guard";
import { NoauthGuard } from './guards/noauth.guard';

import { AppComponent } from './app.component';
import { LoginComponent } from './components/login/login.component';
import { ContainerComponent } from './components/container/container.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { MaterialModule } from './material.module';
import { HomeComponent } from "./components/pages/home/home.component";
// import {MapaComponent} from "./components/pages/mapa/mapa.component";
import { ToolbarComponent } from './components/toolbar/toolbar.component';
import { GDialogComponent } from './components/shared/g-dialog/g-dialog.component';
import { GBuscarComponent } from './components/shared/g-buscar/g-buscar.component';
import { GInputComponent } from './components/shared/g-input/g-input.component';
import { GMostrarComponent } from './components/shared/g-mostrar/g-mostrar.component';


// crear componentes: ng g m components/pages/contratos -m=app --route=contratos
// además debe actualizarse en la constante routes el nuevo componente

const routes: Routes = [
  { path: 'login', component: LoginComponent, canActivate:[NoauthGuard]},
  { path: '', component: ContainerComponent,canActivate:[AuthGuard], children:[
    {path: 'home',loadChildren: () =>import("./components/pages/home/home.module").then(m => m.HomeModule)},
    // {path: 'profile',loadChildren: () =>import("./components/pages/profile/profile.module").then(m => m.ProfileModule)},
    {path: 'movimientos',loadChildren: () =>import("./components/pages/movimientos/movimientos.module").then(m => m.MovimientosModule)},
    {path: 'clientes',loadChildren: () =>import("./components/pages/clientes/clientes.module").then(m => m.ClientesModule)},
    {path: 'new_cliente',loadChildren: () =>import("./components/pages/new-clientes/new-clientes.module").then(m => m.NewClientesModule)},
    {path: 'pedidos', loadChildren: () => import('./components/pages/pedidos/pedidos.module').then(m => m.PedidosModule) },
    {path: 'nuevo_pedido', loadChildren: () => import('./components/pages/nuevo-pedido/nuevo-pedido.module').then(m => m.NuevoPedidoModule) },
    {path: 'edit_user/:IdCli', loadChildren: () => import('./components/pages/edit-user/edit-user.module').then(m => m.EditUserModule) },
    {path: 'atencion/:IdPedido', loadChildren: () => import('./components/pages/atencion/atencion.module').then(m => m.AtencionModule) },
    
    {path: 'vehiculos', loadChildren: () => import('./components/pages/vehiculos/vehiculos.module').then(m => m.VehiculosModule) },
    {path: 'ver_pedidos_map/:Estado', loadChildren: () => import('./components/pages/ver-pedidos-map/ver-pedidos-map.module').then(m => m.VerPedidosMapModule) },
    {path: 'pos_clientes', loadChildren: () => import('./components/pages/posicion-clientes/posicion-clientes.module').then(m => m.PosicionClientesModule) },
    {path: 'pos_cli/:IdCli/:NomCli', loadChildren: () => import('./components/pages/pos-cliente/pos-cliente.module').then(m => m.PosClienteModule) },
    {path: 'entrega', loadChildren: () => import('./components/pages/entrega/entrega.module').then(m => m.EntregaModule) },
    {path: 'rendir', loadChildren: () => import('./components/pages/rendir/rendir.module').then(m => m.RendirModule) },
    {path: 'prod', loadChildren: () => import('./components/pages/prod/prod.module').then(m => m.ProdModule) },
    {path: 'entregar_r', loadChildren: () => import('./components/pages/entregar-rendir/entregar-rendir.module').then(m => m.EntregarRendirModule) },
    { path: 'reports', loadChildren: () => import('./components/pages/reports/reports.module').then(m => m.ReportsModule) },
    { path: 'ruta', loadChildren: () => import('./components/pages/ruta/ruta.module').then(m => m.RutaModule) },
    { path: 'asignar', loadChildren: () => import('./components/pages/asignar-visita/asignar-visita.module').then(m => m.AsignarVisitaModule) },
    { path: 'reg_visita/:IdVisita/:NomCli', loadChildren: () => import('./components/pages/reg-visita/reg-visita.module').then(m => m.RegVisitaModule) },
    { path: 'ver_map/:CodTipo/:Datos', loadChildren: () => import('./components/pages/ver-map/ver-map.module').then(m => m.VerMapModule) },
    { path: 'seguimiento', loadChildren: () => import('./components/pages/seguimiento/seguimiento.module').then(m => m.SeguimientoModule) },
    { path: 'status_ped', loadChildren: () => import('./components/pages/estado-pedido/estado-pedido.module').then(m => m.EstadoPedidoModule) },
    {path:"", redirectTo:"home", pathMatch:"full"}
  ] },
  { path: '*', redirectTo: '/', pathMatch: 'full' },


];

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    ContainerComponent,
    ToolbarComponent,
    GDialogComponent,
    GBuscarComponent,
    GInputComponent,
    GMostrarComponent,
    
    // GMapaComponent  
  ],
  imports: [
    BrowserModule,
    RouterModule.forRoot(routes, { useHash: true }),
    HttpClientModule,
    FormsModule,
    BrowserAnimationsModule,
    MaterialModule,
    ReactiveFormsModule,

  ],
  exports:[
    ReactiveFormsModule,
    
  ],
  // entryComponents:[
  //   GDialogComponent,
  //   GBuscarComponent,
  //   GInputComponent,
  //   GMostrarComponent
  // ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
