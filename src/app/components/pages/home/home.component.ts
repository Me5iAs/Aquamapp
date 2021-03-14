import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UsuarioI } from "../../../models/usuario.interface";
import {AuthService} from "../../../services/auth.service"

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.styl']
})
export class HomeComponent implements OnInit {
  public Opciones= [
    {Title:"Nvo Pedido",       Icon: "phone_callback",  Link: 'nuevo_pedido'},
    {Title:"Pedidos" ,          Icon: "dns",            Link: 'pedidos'},
    {Title:"Clientes" ,         Icon: "person",         Link: 'clientes'},
    {Title:"Posición" ,         Icon: "person_search",  Link: 'pos_cli'},
    {Title:"Reportes",          Icon: "assignment",     Link: 'reportes'},
    {Title:"Movimientos" ,      Icon: "attach_money",   Link: 'movimientos'}
  ];
  public userData: UsuarioI = JSON.parse(sessionStorage.getItem("dataUser"));
  
  
  constructor(private auth:AuthService,  private router:Router) { 
    console.log(this.userData);
  }

  ngOnInit() { }

  
  onLogout(){
    this.auth.logout();
  }
  onIr(link){
    this.router.navigate(["/"+link]);
  }
  
}
