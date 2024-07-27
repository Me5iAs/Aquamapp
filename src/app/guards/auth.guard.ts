import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router, CanActivateChild, ActivatedRoute } from '@angular/router';
import {AuthService} from "../services/auth.service";
import { MenuService } from '../services/menu.service';
import { UsuarioI } from '../models/usuario.interface';
import { Observable, ReplaySubject } from 'rxjs';
import { gQueryService } from '../services/g-query.service';


@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate, CanActivateChild {
  constructor( private router:Router, private RutaActiva:ActivatedRoute, private auth:AuthService, private gQuery:gQueryService ){}
  
  public userData: UsuarioI = JSON.parse(sessionStorage.getItem("dataUser"));
  public Menu = [];
  
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    
      if(this.auth.loggedIn.value == true){
        const routePath = route.url.map(segment => segment.path).join('/');
        // console.log(route.url);
             
        if(routePath=="home" || routePath ==""){
          return true;
        };
        this.Menu = JSON.parse(sessionStorage.getItem("MenuUser"));
        let ruta = route.url[0].path;

        return this.Menu.some(item => item.startsWith("/" + ruta));
        

      }else{
        this.router.navigate(["/login"]);
        return false;
      }
  }
  
  canActivateChild(childRoute: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | Observable<boolean> | Promise<boolean> {
    return this.canActivate(childRoute, state)
    
  }
  
}
