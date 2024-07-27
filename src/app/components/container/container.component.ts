import { Component, OnInit } from '@angular/core';
import {AuthService} from "../../services/auth.service";
import { gQueryService } from "../../services/g-query.service"
import { UsuarioI } from 'src/app/models/usuario.interface';
import { MenuService } from "../../services/menu.service"

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
  constructor( public auth: AuthService, private gQuery:gQueryService, private menu:MenuService) { }  
  ngOnInit() {
  

    this.Menu = this.menu.DevolverMenuPrincipal(this.userData.Id);
   


    this.lat=-3.7722102000000004;
    this.lng=-73.26553229999999;
  

    var self = this;

    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(function(position) {
        self.lat= position.coords.latitude;
        self.lng= position.coords.longitude;
        // console.log(position);
        // console.log(self.lat)
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
