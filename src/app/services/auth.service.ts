import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import { BehaviorSubject } from 'rxjs';
import {UsuarioI} from "../models/usuario.interface";
import { Router } from '@angular/router';
import {MatSnackBar} from '@angular/material/snack-bar';
import {Title} from "@angular/platform-browser";
import { api } from "./g-constantes.service"
import { gQueryService } from './g-query.service';
const url_api = api.gAuthUrl;


const Cabecera: HttpHeaders = new HttpHeaders({
  "Content-type": "application/json"
});

@Injectable({providedIn: 'root'})

export class AuthService {
  public loggedIn = new BehaviorSubject<boolean>(!!sessionStorage.getItem("dataUser"));

  constructor(private http: HttpClient, private gQuery:gQueryService, private router:Router, private _snackBar: MatSnackBar, private _title:Title) {
    // this.loggedIn.next(!!sessionStorage.getItem("dataUser"));    
  }

  
  usuarios(){
    return this.http.post(url_api, {name:"sp_usuarios_devolver"},
      {headers: Cabecera})
      // .subscribe(data=> {
      //   return data;
      // })
      ;
  }

  login(user: UsuarioI){

    if(user.Usuario ==""){
      this._snackBar.open("¡Error!, Ingrese su usuario", "ok", {duration: 2000})
      // alert("¡Error!, Ingrese su usuario");
      return false;
    }else if(user.Clave ==""){
      this._snackBar.open("¡Error!, Ingrese su clave", "ok", {duration: 2000})
      // alert("¡Error!, Ingrese su clave");
      return false;
    }
    this.http.post(url_api, {tipo:"login", Usuario:user.Usuario, Clave:user.Clave},
    {headers: Cabecera})
    .subscribe(data =>{
      switch (data[0].Estado) {
        case "-1":
          this._snackBar.open("¡Algo ha salido mal!, La contraseña ingresada no es válida para el usuario", "ok", {duration: 2000})
        // alert("¡Algo ha salido mal!, La contraseña ingresada no es válida para el usuario");
        break;
        case "0":
          this._snackBar.open("¡Algo ha salido mal!, El usuario ingresado no se encuentra registrado en el sitema", "ok", {duration: 2000})
          // alert("¡Algo ha salido mal!, El usuario ingresado no se encuentra registrado en el sitema");
          
          break;
        default:
          user.Id = data[0].Id;
          user.Tipo = data[0].Tipo;
          user.Usuario = data[0].Usuario;
          user.CodTipo = data[0].CodTipo;
          user.Clave = "privado"
          this._title.setTitle("AquaM - " + user.Tipo);

          // agregar el menu
          this.gQuery.sql("sp_menu_devolver",data[0].Id)
          .subscribe(data =>{
            let Menu = []
            // console.log(data);
            
            for(var x = 0; x<Object.values(data).length; x++){
              Menu.push(data[x].Link);
            }
            sessionStorage.setItem("MenuUser", JSON.stringify(Menu));
            sessionStorage.setItem("dataUser", JSON.stringify(user));
          
            this.loggedIn.next(true);
            this.router.navigate(["/"]);
          })




          


          // let timerInterval
          // this._snackBar.open('Bienvenido ' + user.Usuario + ", espere un momento a que se cargue el sistema.", "ok", {duration: 2000})
          // alert('Bienvenido ' + user.Usuario + ", espere un momento a que se cargue el sistema.");
          
      }
    });
  }

  logout():void{
    sessionStorage.removeItem("dataUser");
    sessionStorage.removeItem("MenuUser");
    this.loggedIn.next(false);
    this.router.navigate(["/login"]);
  }
  
}
