import { Component, OnInit } from '@angular/core';
import {FormGroup, FormControl, Validators} from "@angular/forms";
import {gQueryService} from "../../../services/g-query.service";
import { Router, ActivatedRoute } from '@angular/router';
import {MatSnackBar} from '@angular/material/snack-bar';
import { AppDateAdapter, APP_DATE_FORMATS } from "../../format-datepicker";
import {DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE} from '@angular/material/core';

@Component({
  selector: 'app-reg-visita',
  templateUrl: './reg-visita.component.html',
  styleUrls: ['./reg-visita.component.css'],
  providers: [
    {provide: DateAdapter, useClass: AppDateAdapter},
    {provide: MAT_DATE_FORMATS, useValue: APP_DATE_FORMATS}
  ]
  
})
export class RegVisitaComponent implements OnInit {
  public data;
  public Resultados = [];
  public Botellones = [];
  public latitud;
  public longitud;
  public LatAct = null;
  public LngAct = null;  
  public nota ='';
  public labelFecha = "";
  public minDate = new Date();
  public maxDate = new  Date(this.minDate.getFullYear(),this.minDate.getMonth(),this.minDate.getDate()+15);
  
  visitaForm = new FormGroup({
    Resultado   : new FormControl(Validators.required),
    Glosa       : new FormControl("",[Validators.required]), 
    Botellones  : new FormControl(0),
    ProxPedido  : new FormControl(new Date())
  });

  
  constructor(private _adapter: DateAdapter<any>, private gQuery:gQueryService, private router:Router, public rutaActiva: ActivatedRoute, private _snackBar: MatSnackBar) {
    this.Resultados = [
      {Id: 1, Texto: "No ubicado"},
      {Id: 2, Texto: "No hizo pedido"},
      {Id: 3, Texto: "Pedido Relizado"},
    ]

    for (var x=1; x<=30; x++){
      this.Botellones.push({
        Cantidad : x,
        Texto : x + " Bot"
      })
    }   
  }

  
  ngOnInit() {
    navigator.geolocation.getCurrentPosition(position => {
      this.LatAct= position.coords.latitude;
      this.LngAct= position.coords.longitude;      
    });
    this.LatAct=-3.7722102000000004;
    this.LngAct=-73.26553229999999;
  }

  VerMapa(Lat, Lng){
    window.open('https://www.google.com/maps?q=' + Lat + ','+Lng+'&hl=es', '_blank');
  }
  onSelResultado(){
    if(this.visitaForm.controls.Resultado.value == 1){
      this.nota = "Nota: las actividades registradas como 'no ubicado' se vuelven a registrar como visita pendiente para el día siguiente."

    }else if(this.visitaForm.controls.Resultado.value == 2){
      this.nota = "Nota: las actividades registradas como 'no hizo pedido' requiere que se registre la próxima fecha de visita."
      this.labelFecha ="Fecha Prox.Visita"
    }else if(this.visitaForm.controls.Resultado.value == 3){
      this.nota="";
      this.labelFecha ="Fecha Prog.Entrega"
    }
  }
  onRegistrarVisita(data){
    // console.log(data);
    
    if(data.Resultado ==3 && data.Botellones == 0){
      this._snackBar.open("Ingrese el numero de botellones del nuevo pedido", "ok", {duration: 2000})
       return;
    }

    if(new Date(data.ProxPedido).getDate() == new Date().getDate() && data.Resultado==2){
      this._snackBar.open("La próxima fecha de visita no puede ser hoy", "ok", {duration: 2000})
       return;
    }

    var target = document.getElementById('cargando_principal');
    target.style.display = "block"
    
    let date = new Date(data.ProxPedido)
    
    let day = date.getDate()
    let month = date.getMonth() + 1
    let year = date.getFullYear()
    let sFecha = new Date(month + "-" + day + "-"+year);
    let dFecha = year + "-" + month + "-" + day;
    // let dFecha = sFecha.toISOString().split('T')[0];

    this.gQuery.sql(
      "sp_visitas_registrar",
      this.rutaActiva.snapshot.params.IdVisita  + "|" + 
      data.Resultado  + "|" + 
      data.Glosa      + "|" + 
      this.LatAct     + "|" +
      this.LngAct     + "|" + 
      data.Botellones + "|" + 
      dFecha
      ).subscribe(res =>{
        target.style.display = "none"
        this._snackBar.open(res[0].message, "ok", {duration: 2000})
        if(res[0].Estado==1){
          this.router.navigate(["/ruta"]);
        }  
      }, error =>{
        target.style.display = "none"
        this._snackBar.open("Error: no se ha podido establecer conexión con la base de datos", "Error", {duration: 2000})
      });
    // console.log(data);
    
 }
}

