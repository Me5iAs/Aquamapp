import { Component, OnInit } from '@angular/core';
import {AuthService} from "../../services/auth.service";
import { gQueryService } from "../../services/g-query.service"
import { UsuarioI } from 'src/app/models/usuario.interface';


@Component({
  selector: 'app-container',
  templateUrl: './container.component.html',
  styleUrls: ['./container.component.styl']
})
export class ContainerComponent implements OnInit {
  // public appName = "Aquam";
  // public opened = false;
  public userData: UsuarioI = JSON.parse(sessionStorage.getItem("dataUser"));
  public lat;
  public lng;
  public MenuOriginal = []
  public Menu = [];
  constructor( public auth: AuthService, private gQuery:gQueryService,) { }  
  ngOnInit() {
    /* 
      0 Root, 
      1 Admin, 
      2 Representante de Ventas, 
      3 Repartidor, 
      4 asistente de control, 
      5 operador de planta
    */

    this.MenuOriginal = [
      {TipoUsuario: "0, 5",Item: "Reg.Operacion", Link: "/prod", Icono:"battery_full", Estado:"0"},
      {TipoUsuario: "2",Item: "Hoja de Ruta", Link: "/ruta", Icono:"explore", Estado:"1"},
      {TipoUsuario: "0,1,2,4",Item: "Nuevo Pedido", Link: "/nuevo_pedido", Icono:"phone_callback", Estado:"1"},
      {TipoUsuario: "0,1,4",Item: "Enviar Pedidos", Link: "/pedidos", Icono:"local_shipping", Estado:"1"},
      {TipoUsuario: "3",Item: "Entregar Pedido", Link: "/entrega", Icono:"store", Estado:"1"},
      {TipoUsuario: "0,1,4",Item: "Registrar Entrega", Link: "/entregar_r", Icono:"dns", Estado:"1"},
      {TipoUsuario: "0,1,4",Item: "Reportes", Link: "/reports", Icono:"assignment", Estado:"1"},
      {TipoUsuario: "0,1",Item: "Movimientos", Link: "/movimientos", Icono:"attach_money", Estado:"1"},
      {TipoUsuario: "0,1,2,4",Item: "Clientes", Link: "/clientes", Icono:"person", Estado:"1"},
      {TipoUsuario: "0",Item: "Estado de pedidos", Link: "/seguimiento", Icono:"gps_fixed", Estado:"1"},
      {TipoUsuario: "0,1,4",Item: "Asignar ruta", Link: "/asignar", Icono:"event", Estado:"1"},
      // {TipoUsuario: "0,1,2,4",Item: "Seguimiento", Link: "/asignar", Icono:"where_to_vote", Estado:"1"},
      
    ];

    this.Menu =this.MenuOriginal.filter(e => e.TipoUsuario.includes(this.userData.CodTipo) && e.Estado=='1')




    this.lat=-3.7722102000000004;
    this.lng=-73.26553229999999;
  
    // console.log("iniciando");
    var self = this;

    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(function(position) {
        self.lat= position.coords.latitude;
        self.lng= position.coords.longitude;
        console.log(position);
        console.log(self.lat)
      });

      
    } else {
      this.lat=-3.7722102000000004;
      this.lng=-73.26553229999999;
    
    }

    let _self = this;
    setInterval(function(){
      _self.RegistrarPosicion(); 
      
     }, 300000);    
  }

  RegistrarPosicion(){
    if(this.userData.CodTipo == "2"){
      if (this.lat!=-3.7722102000000004){
        this.gQuery.sql
          ("sp_posicion_registrar", 
            this.userData.Id + "|" + 
            this.lat + "|" + 
            this.lng
          ).subscribe();
      }
      
      
    }
    
  }

  CrearMenu(){
    
  }
  
  onLogout(){
    this.auth.logout(); 
  }
}
