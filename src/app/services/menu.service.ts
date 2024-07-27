import { Injectable } from '@angular/core';
import {gQueryService} from "../services/g-query.service"

@Injectable({
  providedIn: 'root'
})
export class MenuService {
  public MenuOriginal = [];
  public MenuPrincipal =  [];

      /* 
      0 Root, 
      1 Admin, 
      2 Representante de Ventas, 
      3 Repartidor, 
      4 asistente de control, 
      5 operador de planta
    */

  /*

  public MenuOriginal = [
    
    {TipoUsuario: "1, 4",   Item: "Compra Dir",         Link: "/compradirecta", Icono:"price_check",        Estado:"1", TipoMenu: "Principal"},
    {TipoUsuario: "0, 5",   Item: "Reg.Operacion",      Link: "/prod",          Icono:"battery_full",       Estado:"0", TipoMenu: "Principal"},
    {TipoUsuario: "2",      Item: "Seguimiento Meta",   Link: "/seg_metas",     Icono:"query_stats",        Estado:"1", TipoMenu: "Principal"},
    {TipoUsuario: "1,2,4",  Item: "Nuevo Pedido",       Link: "/nuevo_pedido",  Icono:"phone_callback",     Estado:"1", TipoMenu: "Principal"},
    {TipoUsuario: "1,4",    Item: "Enviar Pedidos",     Link: "/pedidos",       Icono:"local_shipping",     Estado:"1", TipoMenu: "Principal"},
    {TipoUsuario: "3",      Item: "Entregar Pedido",    Link: "/entrega",       Icono:"store",              Estado:"1", TipoMenu: "Principal"},
    {TipoUsuario: "1,4",    Item: "Registrar Entrega",  Link: "/entregar_r",    Icono:"dns",                Estado:"1", TipoMenu: "Principal"}, 
    {TipoUsuario: "4",      Item: "Reg. Gastos",        Link: "/reggastos",     Icono:"paid",               Estado:"1", TipoMenu: "Principal"},
    {TipoUsuario: "1",      Item: "Cierre de Caja",     Link: "/cierrecaja",    Icono:"logout",             Estado:"1", TipoMenu: "Principal"},
    {TipoUsuario: "0,1",    Item: "Movimientos",        Link: "/movimientos",   Icono:"attach_money",       Estado:"1", TipoMenu: "Principal"},
    {TipoUsuario: "0,1",    Item: "Por Cobrar",         Link: "/porcobrar",     Icono:"currency_exchange",  Estado:"1", TipoMenu: "Principal"},
    {TipoUsuario: "2",      Item: "Mi Cartera",         Link: "/cartera",       Icono:"people_alt",         Estado:"1", TipoMenu: "Principal"},
    {TipoUsuario: "0,1,4",  Item: "Estado de pedidos",  Link: "/seguimiento",   Icono:"gps_fixed",          Estado:"1", TipoMenu: "Principal"},
    {TipoUsuario: "0,1,2,4",Item: "Clientes",           Link: "/clientes",      Icono:"person",             Estado:"1", TipoMenu: "Principal"},
    {TipoUsuario: "0,1,4",  Item: "Personal",           Link: "/g_personal",    Icono:"groups_2",           Estado:"1", TipoMenu: "Principal"},
    {TipoUsuario: "1,4",    Item: "Asignar ruta",       Link: "/asignar",       Icono:"event",              Estado:"1", TipoMenu: "Secundario"},
    {TipoUsuario: "0,1,4",  Item: "Reportes",           Link: "/reports",       Icono:"assignment",         Estado:"1", TipoMenu: "Secundario"},
    
    
    
  ];
  */

  constructor(private gQuery:gQueryService) { }

  // DevolverMenu

  DevolverMenuCompleto(IdUsuario){
    this.MenuOriginal = [];
    this.gQuery.sql("sp_menu_devolver",IdUsuario)
    .subscribe(data =>{
      // console.log(data)
      // return Object.values(data);
      // this.MenuOriginal = Object.values(data);

      for(var x = 0; x<Object.values(data).length; x++){
        
        this.MenuOriginal.push({
          Link      : data[x].Link,
          Icono     : data[x].Icono,
          Item      : data[x].Item,
          TipoMenu  : data[x].TipoMenu
        });

      }  
    })

    return this.MenuOriginal;
    // return this.MenuOriginal.filter(e => e.TipoUsuario.includes(TipoUsuario) && e.Estado=='1')
  }

  DevolverMenuPrincipal(IdUsuario){
    this.MenuPrincipal = [];
    this.gQuery.sql("sp_menu_devolver",IdUsuario)
    .subscribe(data =>{
      // console.log(data)
      // return Object.values(data);
      // this.MenuOriginal = Object.values(data);

      for(var x = 0; x<Object.values(data).length; x++){
        if(data[x].TipoMenu == "Principal"){
          this.MenuPrincipal.push({
            Link      : data[x].Link,
            Icono     : data[x].Icono,
            Item      : data[x].Item,
            TipoMenu  : data[x].TipoMenu
          });
        }
        
      }

     
      
      
    })
  
      
    return this.MenuPrincipal;
    // return this.MenuOriginal.filter(e => e.TipoUsuario.includes(TipoUsuario) && e.Estado=='1')

    // return this.MenuOriginal.filter(e =>  e.TipoMenu == "Principal")
  }
}

