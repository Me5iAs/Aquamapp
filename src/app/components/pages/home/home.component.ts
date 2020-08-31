import { Component, OnInit } from '@angular/core';
import { UsuarioI } from "../../../models/usuario.interface";
import {AuthService} from "../../../services/auth.service"

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.styl']
})
export class HomeComponent implements OnInit {
  // public Opciones= [
    // {Title:"Mapa" , Subtitle: "Registra nuevos pedidos de Mapa", Image: 'banner_Mapa.png', Link: 'mapa'},
    // {Title:"Delivery" , Subtitle: "Registra nuevos pedidos de delivery", Image: 'banner_delivery.png', Link: 'delivery'},
    // {Title:"Bodega" , Subtitle: "Registra nuevos pedidos de bodegas y depósitos", Image: 'banner_bodegas.png', Link: 'deposito'},
    // {Title:"Ingresos y Egresos" , Subtitle: "Registra otros movimientos de dinero", Image: 'banner_ingresos.png', Link: 'movimientos'},
    // {Title:"Movimientos" , Subtitle: "Reporte de Movimientos", Image: 'banner_egresos.png', Link: 'rep_mov'},
    // {Title:"Clientes" , Subtitle: "Registra y actualiza los datos de los clientes", Image: 'banner_clientes.png', Link: 'clientes'},
    // {Title:"Contratos" , Subtitle: "Administra los contratos de los clientes", Image: 'banner_contratos.png', Link: 'contratos'}
  // ];
  public userData: UsuarioI = JSON.parse(sessionStorage.getItem("dataUser"));
  
  
  constructor(private auth:AuthService) { 
    console.log(this.userData);
  }

  ngOnInit() { }

  
  onLogout(){
    this.auth.logout();
  }
  
}
