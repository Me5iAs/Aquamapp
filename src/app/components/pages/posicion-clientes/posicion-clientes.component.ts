import { Component, OnInit, ViewChild} from '@angular/core';
import {gQueryService} from "../../../services/g-query.service";
import { AgmMap } from '@agm/core';
import {Router} from "@angular/router";
import {MatSnackBar} from '@angular/material/snack-bar'

@Component({
  selector: 'app-posicion-clientes',
  templateUrl: './posicion-clientes.component.html',
  styleUrls: ['./posicion-clientes.component.css']
})
export class PosicionClientesComponent implements OnInit {
  public longitud; 
  public latitud; 
  public LatAct = null;
  public LngAct = null;
  public markers = [];
  @ViewChild(AgmMap) public agmMap: AgmMap

  constructor(private gQuery:gQueryService, private router:Router, private _snackBar: MatSnackBar) { }

  ngOnInit() {
    // navigator.geolocation.getCurrentPosition(position => {
    //   this.LatAct= position.coords.latitude;
    //   this.LngAct= position.coords.longitude;
    //   this.latitud = this.LatAct;
    //   this.longitud = this.LngAct;
      
    // });
    this.latitud=-3.7722102000000004;
    this.longitud=-73.26553229999999;
    var target = document.getElementById('cargando_principal');
    target.style.display = "block"
    
    this.gQuery
    .sql("sp_clientes_devolver_pos")
    .subscribe(data =>{
      target.style.display = "none"
      if(data ==null) return;

      var datos:any = data;
      // console.log(datos);
      for(var x=0; x <datos.length; x++){
        this.markers.push({
          latitud: datos[x].Latitud,
          longitud: datos[x].Longitud,
          label: datos[x].Nombre,
          datos : datos[x].Nombre + " - "  + datos[x].Direccion + " - " + datos[x].Referencia
        })
      }
      // console.log(this.markers);
      this.agmMap.triggerResize();
  
    });
  }
  onCancelar(){
    this.router.navigate(["/pedidos"]);
  }
  verInfo(id){
    this._snackBar.open(this.markers[id].datos, "ok", {duration: 10000})
  }

}
