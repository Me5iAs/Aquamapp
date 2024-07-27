import { Component, OnInit,} from '@angular/core';
import {FormGroup, FormControl, Validators} from "@angular/forms";
import {gQueryService} from "../../../services/g-query.service";
import { Router, ActivatedRoute } from '@angular/router';
import {MatSnackBar} from '@angular/material/snack-bar';
import { Location } from '@angular/common';

@Component({
  selector: 'app-atencion',
  templateUrl: './atencion.component.html',
  styleUrls: ['./atencion.component.css']
})
export class AtencionComponent implements OnInit {
  public Botellones;
  public Paquetes;
  public Garantias;
  public Vales;
  public data;
  public latitud;
  public habilitadoPaq;
  public longitud;
  public LatAct = null;
  public LngAct = null;  

  EntregaForm = new FormGroup({
    Cantidad      : new FormControl(4, [Validators.required]),
    CantidadPaq   : new FormControl(4, [Validators.required]),
    EstadoPago    : new FormControl("",[Validators.required]),
    Glosa         : new FormControl(" "),
    Vale          : new FormControl(0, [Validators.required]),
    Garantia      : new FormControl(0, [Validators.required]),
  });

  
  constructor(private gQuery:gQueryService, private router:Router, private rutaActiva: ActivatedRoute, private _snackBar: MatSnackBar, private location: Location) {
    this.Botellones = [
      {Cantidad: 0, Texto: "0 Bot"},
      {Cantidad: 1, Texto: "1 Bot"},
    ]

    this.Paquetes = [
      {Cantidad: 0, Texto: "0 Paq"},
      {Cantidad: 1, Texto: "1 Paq"},
    ]

    for (var x=2; x<=100; x++){
      this.Botellones.push({
        Cantidad : x,
        Texto : x + " Bot"
      })
      this.Paquetes.push({
        Cantidad : x,
        Texto : x + " Paq"
      })
    }

    this.Garantias = [
      {Cantidad: 0, Texto: "sin garantía"},
      {Cantidad: 5, Texto: "S/ 5.00"},
      {Cantidad: 10, Texto: "S/ 10.00"},
      {Cantidad: 15, Texto: "S/ 15.00"},
      {Cantidad: 20, Texto: "S/ 20.00"}
    ]

    this.Vales = [
      {Cantidad: 0, Texto: "Sin vales"},
      {Cantidad: 1, Texto: "Vale por 1 bot"},
      {Cantidad: 2, Texto: "Vale por 2 bot"},
      {Cantidad: 3, Texto: "Vale por 3 bot"},
      {Cantidad: 4, Texto: "Vale por 4 bot"}
    ]
    
  }

  
  ngOnInit() {
    navigator.geolocation.getCurrentPosition(position => {
      this.LatAct= position.coords.latitude;
      this.LngAct= position.coords.longitude;

      
    });
    this.LatAct=-3.7722102000000004;
    this.LngAct=-73.26553229999999;
    // alert("AAA");
    this.CargarPedido();  

  }

  CargarPedido(){
    var target = document.getElementById('cargando_principal');
    target.style.display = "block"

    this.gQuery
    .sql("sp_pedido_devolver", this.rutaActiva.snapshot.params.IdPedido)
    .subscribe(data =>{
      target.style.display = "none"
      this.data = data[0];
      // console.log(this.data)
      this.EntregaForm.controls.Cantidad.setValue( Number(data[0].Cantidad));
      this.EntregaForm.controls.CantidadPaq.setValue( Number(data[0].CantidadPaq));
      
    });


  }

  VerMapa(Lat, Lng){
    window.open('https://www.google.com/maps?q=' + Lat + ','+Lng+'&hl=es', '_blank');
  }

  onRegistrarAtencion(data){
    // console.log(this.data);
    if(data.Cantidad > this.data.Cantidad){
      alert("No se puede entregar más botellones de los que se llevó");
      
      this.EntregaForm.controls.Cantidad.setValue( Number(this.data.Cantidad));
      return ;
    }

    if(parseInt(data.CantidadPaq) > parseInt(this.data.CantidadPaq)){
      alert("No se puede entregar más paquetes de los que se llevó");
      this.EntregaForm.controls.CantidadPaq.setValue( Number(this.data.CantidadPaq));
// console.log(this.EntregaForm)
      return ;
    } 
    
    // var UsuarioI = JSON.parse(sessionStorage.getItem("dataUser"));
    // var a;
    // if(data.EstadoPago==true){
    //   a = 1;
    // }else{
    //   a = 0;
    // }
    var target = document.getElementById('cargando_principal');
    target.style.display = "block"
   
    // console.log(data.EstadoPago);
    // return;
    this.gQuery.sql(
      "sp_pedido_registrar_entrega",
      this.rutaActiva.snapshot.params.IdPedido  + "|" + 
      data.Cantidad       + "|" + 
      data.CantidadPaq    + "|" +
      data.EstadoPago     + "|" +
      data.Vale           + "|" +
      data.Garantia       + "|" + 
      this.LatAct         + "|" +
      this.LngAct
      ).subscribe(res =>{
        target.style.display = "none"
        this._snackBar.open(res[0].message, "ok", {duration: 2000})
        // alert(res[0].message);
        if(res[0].Estado==1){
          // this.router.navigate(["/entrega"]);
          this.location.back();
        }         
      }, error =>{
        target.style.display = "none"
        this._snackBar.open("Error: no se ha podido establecer conexión con la base de datos", "Error", {duration: 2000})
      });
    // console.log(data);
    
 }

 onRegresar(){
  this.location.back();
 }
}

