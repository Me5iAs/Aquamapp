import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { MapapedidosComponent, DialogUsuario, DialogInstrucciones } from './mapapedidos.component';
import { HttpClientModule } from '@angular/common/http';
import {MaterialModule} from "../../../material.module";
// import { MatTreeModule } from '@angular/material/tree';

const routes: Routes = [
  { path: '', component: MapapedidosComponent }
];

@NgModule({
  declarations: [
    MapapedidosComponent, DialogUsuario, DialogInstrucciones
    
  ],
  imports: [
    CommonModule,
    MaterialModule,
    RouterModule.forChild(routes),
    HttpClientModule,
    // MatTreeModule
  ]
})
export class MapapedidosModule { }
