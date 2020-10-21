import { Component, OnInit,} from '@angular/core';
import {FormGroup, FormControl, Validators} from "@angular/forms";
import {gQueryService} from "../../../services/g-query.service";
import { Router, ActivatedRoute } from '@angular/router';
import {MatSnackBar} from '@angular/material/snack-bar';

@Component({
  selector: 'app-atencion',
  templateUrl: './atencion.component.html',
  styleUrls: ['./atencion.component.css']
})
export class AtencionComponent implements OnInit {
  public Botellones;
  public Garantias;
  public Vales;
  public data;

  EntregaForm = new FormGroup({
    Cantidad      : new FormControl(4, [Validators.required]),
    EstadoPago    : new FormControl(true,[Validators.required]),
    Glosa         : new FormControl(" "),
    Vale          : new FormControl(1, [Validators.required]),
    Garantia      : new FormControl(0, [Validators.required]),
    
  });

  
  constructor(private gQuery:gQueryService, private router:Router, private rutaActiva: ActivatedRoute, private _snackBar: MatSnackBar) {
    this.Botellones = [
      {Cantidad: 1, Texto: "1 Botellón"},
    ]

    for (var x=2; x<=30; x++){
      this.Botellones.push({
        Cantidad : x,
        Texto : x + " Botellones"
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
      {Cantidad: 1, Texto: "Vale por 1 botellón"},
      {Cantidad: 2, Texto: "Vale por 2 botellones"},
      {Cantidad: 3, Texto: "Vale por 3 botellones"},
      {Cantidad: 4, Texto: "Vale por 4 botellones"}
    ]
    
  }

  
  ngOnInit() {
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
      this.EntregaForm.controls.Cantidad.setValue( Number(data[0].Cantidad));
      
    });

  }

  VerMapa(Lat, Lng){
    window.open('https://www.google.com/maps?q=' + Lat + ','+Lng+'&hl=es', '_blank');
  }

  onRegistrarAtencion(data){
    var UsuarioI = JSON.parse(sessionStorage.getItem("dataUser"));
    var a;
    if(data.EstadoPago==true){
      a = 1;
    }else{
      a = 0;
    }
    var target = document.getElementById('cargando_principal');
    target.style.display = "block"
    
    this.gQuery.sql(
      "sp_pedido_registrar_entrega",
      this.rutaActiva.snapshot.params.IdPedido  + "|" + 
      UsuarioI.Id         + "|" + 
      data.Cantidad       + "|" + 
      a                   + "|" + 
      data.Glosa          + "|" + 
      data.Vale           + "|" +
      data.Garantia
      ).subscribe(res =>{
        target.style.display = "none"
        this._snackBar.open(res[0].message, "ok", {duration: 2000})
        // alert(res[0].message);
        if(res[0].Estado==1){
          this.router.navigate(["/pedidos"]);
        }         
      });
    // console.log(data);
    
 }
}

