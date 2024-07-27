import { Component, OnInit, ViewChild} from '@angular/core';
import {gQueryService} from "../../../services/g-query.service";
import { AgmMap } from '@agm/core';
import {ActivatedRoute, Router} from "@angular/router";
import {MatSnackBar} from '@angular/material/snack-bar'

@Component({
  selector: 'app-ver-map',
  templateUrl: './ver-map.component.html',
  styleUrls: ['./ver-map.component.css']
})
export class VerMapComponent implements OnInit {
  public longitud; 
  public latitud; 
  public LatAct = null;
  public LngAct = null;
  public markers = [];
  procesos = [];

  @ViewChild(AgmMap) public agmMap: AgmMap

  constructor(private gQuery:gQueryService, private router:Router, private rutaActiva: ActivatedRoute, private _snackBar: MatSnackBar) { }

  ngOnInit() {
   
    this.latitud=-3.7722102000000004;
    this.longitud=-73.26553229999999;
    var target = document.getElementById('cargando_principal');
    target.style.display = "block"
    
    this.procesos = [
      { Codigo: '0', sp: 'sp_pedidos_pendientes_devolver'},
      { Codigo: '1', sp: 'sp_asignaciones_devolver'},
    ];
    // let Cod = 
    let tipo = this.procesos.filter(e => e.Codigo == this.rutaActiva.snapshot.params.CodTipo)
    let datos = this.rutaActiva.snapshot.params.Datos;

    // console.log(tipo);
    if (datos == "-1"){
      this.gQuery
      .sql(tipo[0].sp)
      .subscribe(data =>{
        target.style.display = "none"
        if(data ==null) return;
  
        var datos:any = data;
        // console.log(datos);
        for(var x=0; x <datos.length; x++){
          this.markers.push({
            latitud: datos[x].Latitud,
            longitud: datos[x].Longitud,
            label: datos[x].Cliente,
            datos : datos[x].Cliente + " - "  + datos[x].Direccion + " - " + datos[x].Referencia
          })
        }
      });
    }else{
      this.gQuery
      .sql(tipo[0].sp, datos )
      .subscribe(data =>{
        target.style.display = "none"
        if(data ==null) return;
  
        var datos:any = data;
        // console.log(datos);
        for(var x=0; x <datos.length; x++){
          this.markers.push({
            latitud: datos[x].Latitud,
            longitud: datos[x].Longitud,
            label: datos[x].Cliente,
            datos : datos[x].Cliente + " - "  + datos[x].Direccion + " - " + datos[x].Referencia
          })
        }
      });
    }
   
  }
  onCancelar(){
    this.router.navigate(["/pedidos"]);
  }
  verInfo(id){
    this._snackBar.open(this.markers[id].datos, "ok", {duration: 10000})
  }
}
