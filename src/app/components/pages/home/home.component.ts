import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UsuarioI } from "../../../models/usuario.interface";
import {AuthService} from "../../../services/auth.service"
import { MenuService } from "../../../services/menu.service"

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.styl']
})
export class HomeComponent implements OnInit {

  public userData: UsuarioI = JSON.parse(sessionStorage.getItem("dataUser"));
  public Menu = [];

  
  constructor(private auth:AuthService,  private router:Router, private menu:MenuService) { 


  }

  ngOnInit() { 
    this.Menu = this.menu.DevolverMenuCompleto(this.userData.Id);
  }

  
  onLogout(){
    this.auth.logout();
  }
  onIr(link){
    this.router.navigate(["/"+link]);
  }
  
}
