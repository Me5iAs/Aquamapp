import { Component, OnInit, ViewChild} from '@angular/core';
import {FormGroup, FormControl, Validators} from "@angular/forms";
import {gQueryService} from "../../../services/g-query.service";
import {SubirService} from "../../../services/subir.service";
import {Router} from "@angular/router";
import { ActivatedRoute, Params } from '@angular/router';
import { AgmMap } from '@agm/core';
import {MatSnackBar} from '@angular/material/snack-bar'

@Component({
  selector: 'app-edit-user',
  templateUrl: './edit-user.component.html',
  styleUrls: ['./edit-user.component.css']
})
export class EditUserComponent implements OnInit {
  public FileData;
  public File;
  public imageUrl;
  public latitud;
  public longitud;  
  public LatAct = null;
  public LngAct = null;
  public Botellones;
  public Precios;

  @ViewChild(AgmMap) public agmMap: AgmMap

  constructor(
    private gQuery:gQueryService, 
    private router:Router, 
    private _snackBar: MatSnackBar,
    private rutaActiva: ActivatedRoute,
    private enviandoImagen:SubirService) {

      this.Precios = [
        {Valor: 2, Texto: "S/ 2.00"},
        {Valor: 2.5, Texto: "S/ 2.50"},
        {Valor: 3, Texto: "S/ 3.00"},
        {Valor: 3.5, Texto: "S/ 3.50"},
        {Valor: 4, Texto: "S/ 4.00"}
      ]

      this.Botellones = [
        {Cantidad: 0, Texto: "Sin Botellones"},
        {Cantidad: 1, Texto: "1 Botellón"}
      ]
  
      for (var x=2; x<=30; x++){
        this.Botellones.push({
          Cantidad : x,
          Texto : x + " Botellones"
        })
      }
  }

  // formulario de nuevo cliente
  ClienteForm = new FormGroup({
    Nombre    : new FormControl("", [Validators.required]),
    DNI       : new FormControl("", [Validators.pattern("^[0-9]*$"), Validators.minLength(8)]),
    Direccion : new FormControl("",[Validators.required]),
    Referencia: new FormControl("", [Validators.required]),
    Posicion  : new FormControl("" , [Validators.required]),
    Telefono  : new FormControl("", [Validators.required, Validators.pattern("^[0-9]*$"), Validators.minLength(6)]),
    Foto      : new FormControl("", [Validators.required]),
    TipoCliente: new FormControl("", [Validators.required]),
    Botellones: new FormControl("", [Validators.required]),
    Precio: new FormControl("", [Validators.required])
  });

  // CARGA INICIAL
  // ===============
  ngOnInit() {
    navigator.geolocation.getCurrentPosition(position => {
      this.LatAct= position.coords.latitude;
      this.LngAct= position.coords.longitude;

      
    });
    this.LatAct=-3.7722102000000004;
    this.LngAct=-73.26553229999999;
    var target = document.getElementById('cargando_principal');
    target.style.display = "block"
    
    this.gQuery
    .sql("sp_cliente_devolver", this.rutaActiva.snapshot.params.IdCli )
    .subscribe(data =>{
      target.style.display = "none"
      this.ClienteForm.controls.Nombre.setValue(data[0].Nombre);
      this.ClienteForm.controls.DNI.setValue(data[0].DNI);
      this.ClienteForm.controls.Direccion.setValue(data[0].Direccion);
      this.ClienteForm.controls.Referencia.setValue(data[0].Referencia);
      this.ClienteForm.controls.Posicion.setValue(data[0].Latitud + ", " + data[0].Longitud );
      this.ClienteForm.controls.Telefono.setValue(data[0].Telefono);
      this.ClienteForm.controls.TipoCliente.setValue(Number(data[0].TipoCliente));
      this.ClienteForm.controls.Botellones.setValue(Number(data[0].Botellones));
      this.ClienteForm.controls.Precio.setValue(Number(data[0].Precio));
      
      console.log(data[0].Precio);
      
  // 
      // this.imageUrl = "http://localhost/backend/imagenes/" + data[0].Id;
      this.imageUrl = "backend/imagenes/" + data[0].Id;
      this.latitud = Number(data[0].Latitud);
      this.longitud = Number(data[0].Longitud);     
      this.agmMap.triggerResize();
  
    });

      this.FileData = [
        this.File,
        this.ClienteForm.value
      ]
  
  }

  ngAfterViewInit(){
  }
  
  public previewImage(event) {
    const reader = new FileReader();
    const file = event.target.files[0];
    reader.readAsDataURL(file);

    reader.onload = _event => {
      console.log(_event);
      this.imageUrl = reader.result;
    };
  }

  onFileChange(event) {
    if (event.target.files.length > 0) {
      this.File = event.target.files[0];
    }
    this.FileData = [
      this.File,
      this.ClienteForm.value
    ]

  }

  agregar_marcador($event){
      this.latitud = $event.coords.lat;
      this.longitud = $event.coords.lng;
      this.ClienteForm.controls.Posicion.setValue($event.coords.lat+ "," + $event.coords.lng);
  }

  PosicionActual(){
    this.latitud = this.LatAct;
    this.longitud = this.LngAct;
    this.ClienteForm.controls.Posicion.setValue(this.LatAct+ "," + this.LngAct);
  }

  verMapa(e){
    console.log(e);
    window.open('https://www.google.com/maps?q=' + e.latitude + ','+e.longitude+'&hl=es', '_blank');
  }
  onUpdateCliente(data){
    
    var a  = data.Posicion;
    a = a.split(",");
    var target = document.getElementById('cargando_principal');
    target.style.display = "block"

    this.gQuery.sql(
      "sp_cliente_update",
      this.rutaActiva.snapshot.params.IdCli + "|" + 
      data.Nombre         + "|" + 
      data.DNI            + "|" + 
      data.Direccion      + "|" + 
      data.Referencia     + "|" + 
      data.Telefono       + "|" +        
      a[0]                + "|" + 
      a[1]                + "|" +
      data.TipoCliente    + "|" +
      data.Botellones     + "|" +
      data.Precio
      ).subscribe(res =>{
        
        if(res[0].Estado==1){
          // alert(res[0].message);
          if(this.File){
            this.enviandoImagen.postFileImagen(this.File,this.rutaActiva.snapshot.params.IdCli).subscribe(
              response => {
                target.style.display = "none"
                this._snackBar.open(res[0].message, "ok", {duration: 2000})
                // alert(res[0].message);
                this.router.navigate(["/clientes"]);
              },
              error => {
                target.style.display = "none"
                console.log(error);
              }
            )
          }else{
            // alert(res[0].message);
            target.style.display = "none"
            this._snackBar.open(res[0].message, "ok", {duration: 2000})
            this.router.navigate(["/clientes"]);
          }
        }else{
          // alert(res[0].message);
          target.style.display = "none"
          this._snackBar.open(res[0].message, "ok", {duration: 2000})
        }
      }
    );
    
  }


  onCancelar(){
    this.router.navigate(["/clientes"]);
  }
}

