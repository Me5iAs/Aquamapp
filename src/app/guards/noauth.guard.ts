import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class NoauthGuard implements CanActivate {
  constructor( private router:Router, private auth:AuthService ){}
  canActivate() {
    if(this.auth.loggedIn.value == true){
      console.log(this.auth.loggedIn);
      console.log(this.auth.loggedIn.value);
      
      console.log(" etas logueado");
      this.router.navigate(["/"]);
      return false;
    }else{
      return true;
    }
}
  
}
