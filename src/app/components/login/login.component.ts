import { Component, OnInit } from '@angular/core';
import {AuthService} from "../../services/auth.service";
import { UsuarioI } from "../../models/usuario.interface";
import {FormGroup, FormControl, Validators} from "@angular/forms";
import { Router } from "@angular/router";
import {gQueryService} from "../../services/g-query.service"

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.styl']
})
export class LoginComponent implements OnInit {
  public Usuarios;

  constructor(public auth:AuthService, private gQuery:gQueryService, private route:Router) { 
    var target = document.getElementById('cargando_principal');
    target.style.display = "block"
    
    

    this.gQuery.sql("sp_usuarios_devolver")
    .subscribe(data =>{
      target.style.display = "none"
      this.Usuarios = data;
      
    }) 
  }
  
  loginForm = new FormGroup({
    Usuario: new FormControl("",Validators.required),
    Clave: new FormControl("", Validators.required)
  });

  ngOnInit() {}

  onLogin(form: UsuarioI){
    this.auth.login(form);
  }

  onLogout(){
    this.auth.logout();
  }

}
