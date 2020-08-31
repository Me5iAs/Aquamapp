import { Component, OnInit } from '@angular/core';
import {AuthService} from "../../services/auth.service";
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
  
  
  constructor( public auth: AuthService) { }  
  ngOnInit() {
  }
  
  onLogout(){
    this.auth.logout();
    
  }
}
