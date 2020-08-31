import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';

import {AuthService} from "../services/auth.service";


@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor( private router:Router, private auth:AuthService ){}
  canActivate() {
      if(this.auth.loggedIn.value == true){
        return true;
      }else{
        console.log("no etas logueado");
        this.router.navigate(["/login"]);
        return false;
      }
  }
  
}
