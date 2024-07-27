import { Component, OnInit} from '@angular/core';
import {FormGroup, FormControl, Validators} from "@angular/forms";
import {gQueryService} from "../../../services/g-query.service";
import {SubirService} from "../../../services/subir.service";
import {Router} from "@angular/router";
import {clienteI} from "../../../models/cliente.interface"
import {MatSnackBar} from '@angular/material/snack-bar';
import { UsuarioI } from 'src/app/models/usuario.interface';
import {MatTableDataSource} from '@angular/material/table';



@Component({
  selector: 'app-new-clientes',
  templateUrl: './new-clientes.component.html',
  styleUrls: ['./new-clientes.component.css']
})

export class NewClientesComponent implements OnInit {
  public FileData;
  public cliN:clienteI;
  public File;
  public imageUrl;
  dataTarifarioPaq = new MatTableDataSource();  
  displayedColumns: string[] = ['Min', 'Max', 'Precio'];
  
  Marcadores = [];
  lat;
  lng;
  latC;
  lngC;
  public Botellones;
  public Precios;
  public PreciosPaq;
  public TipoContacto;

  constructor(
    private gQuery:gQueryService, 
    private router:Router, 
    private _snackBar: MatSnackBar,
    private enviandoImagen:SubirService) {

      this.TipoContacto = [
        {Id:"1", Texto: "Visita a local"},
        {Id:"2", Texto: "Llamada telefónica"},
        {Id:"3", Texto: "Whatsapp"},
        {Id:"4", Texto: "No desea ser contactado"},
      ]
      this.Botellones = [
        {Cantidad: 0, Texto: "Sin Botellones"},
        {Cantidad: 1, Texto: "1 Botellón"}
      ];

      this.Precios = []
      this.PreciosPaq  = []
      
      /*
      this.Precios = [
        {Valor: 2.00, Texto: "S/ 2.00"},
        {Valor: 2.50, Texto: "S/ 2.50"},
        {Valor: 3.00, Texto: "S/ 3.00"},
        {Valor: 3.50, Texto: "S/ 3.50"},
        {Valor: 4.00, Texto: "S/ 4.00"}
      ]
     */
     
      for (var x=2; x<=30; x++){
        this.Botellones.push({
          Cantidad : x,
          Texto : x + " Botellones"
        })
      }



      this.FileData = [
        this.File,
        this.ClienteForm.value
      ]
  }

  // formulario de nuevo cliente
  ClienteForm = new FormGroup({
    Nombre    : new FormControl("", [Validators.required]),
    DNI       : new FormControl("", [Validators.pattern("^[0-9]*$"), Validators.minLength(8)]),
    Direccion : new FormControl("",[Validators.required]),
    Referencia: new FormControl("", [Validators.required]),
    Posicion  : new FormControl("" , [Validators.required]),
    Telefono  : new FormControl("", [Validators.required, Validators.pattern("^[0-9]*$"), Validators.minLength(6)]),
    Foto      : new FormControl(""),
    TipoCliente: new FormControl(0),
    Botellones: new FormControl(10),
    TipoContacto: new FormControl("1"),
    Precio: new FormControl("2.50"),
  });

  // CARGA INICIAL
  // ===============
  ngOnInit() {
    navigator.geolocation.getCurrentPosition(position => {
      this.lat= position.coords.latitude;
      this.lng= position.coords.longitude;
      this.latC= position.coords.latitude;
      this.lngC= position.coords.longitude;
    });
    this.lat=-3.7722102000000004;
    this.lng=-73.26553229999999;
  
    var target = document.getElementById('cargando_principal');
    target.style.display = "block"

    this.gQuery.sql("sp_tarifariobot_devolver").subscribe( data =>{
      // console.log(data)
      target.style.display = "none"      
      for(var x = 0; x<Object.values(data).length; x++){
        this.Precios.push({
          Valor : data[x].Valor,
          Texto : data[x].Texto
        });
        
      }
      // console.log(this.PreciosPaq); 
    })

    this.gQuery.sql("sp_tarifariopaq_devolver").subscribe( data =>{
      target.style.display = "none"
      if (data==null){
        this.dataTarifarioPaq=null;
      }else{
        this.dataTarifarioPaq= new MatTableDataSource(<any> data);
        // console.log(this.dataSource);
        // this.dataTarifarioPaq.paginator = this.paginator;
        // this.dataTarifarioPaq.sort = this.sort;
      }
      // // console.log(data)
      // target.style.display = "none"      
      // for(var x = 0; x<Object.values(data).length; x++){
      //   this.PreciosPaq.push({
      //     Min : data[x].Min,
      //     Max : data[x].Max,
      //     Precio: data[x].Precio
      //   });
        
      // }
      // console.log(this.PreciosPaq); 
    })
  }

  ngAfterViewInit(){
  }
  
  public previewImage(event) {
    const reader = new FileReader();
    const file = event.target.files[0];
    reader.readAsDataURL(file);

    reader.onload = _event => {
      // console.log(_event);
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
  //  console.log(event);
    this.Marcadores = [];
    this.Marcadores.push({
      lat : $event.coords.lat,
      lng: $event.coords.lng,
      });
      this.ClienteForm.controls.Posicion.setValue($event.coords.lat+ "," + $event.coords.lng);
  }

  PosicionActual(){
    this.Marcadores = [];
    this.Marcadores.push({
      lat : this.lat,
      lng: this.lng,
      }
    );
    this.ClienteForm.controls.Posicion.setValue(this.lat + "," + this.lng);
    this.latC= this.lat;
    this.lngC= this.lng;
    // console.log(this.Marcadores);
    

  }

  onRegistrarCliente(data){
    
    if(!this.File){
      if (!confirm("no se ha cargado una imagen, la imagen permite verificar la fachada del cliente, ¿quiere continuar sin la foto?")){
        return;
      }
    }
    
    if(!this.ClienteForm.valid){
      this._snackBar.open("Llene correctamente los datos antes de continuar", "ok", {duration: 2000})
      // alert("llene correctamente los datos antes de continuar");
      return;
    }
    var a = data.Posicion;
    a = a.split(",");
    // console.log(a);
    var userData: UsuarioI = JSON.parse(sessionStorage.getItem("dataUser"));

    var target = document.getElementById('cargando_principal');
    target.style.display = "block"
    
    this.gQuery.sql(
      "sp_cliente_registrar",
      data.Nombre         + "|" + 
      data.DNI            + "|" + 
      data.Direccion      + "|" + 
      data.Referencia     + "|" + 
      data.Telefono       + "|" +        
      a[0]                + "|" + 
      a[1]                + "|" +
      userData.Id         + "|" +
      data.TipoCliente    + "|" +
      data.Botellones     + "|" +
      data.Precio         + "|" +
      data.TipoContacto
      ).subscribe(res =>{
        target.style.display = "none"
        // console.log(res);
        if(res[0].Estado==1){
          if(this.File){
            this.enviandoImagen.postFileImagen(this.File, res[0].Id).subscribe(
              response => {
                target.style.display = "none"
                response = response; 
                if(response <= 1){
                  this._snackBar.open("Error subiendo imagen al servidor", "ok", {duration: 2000})
                  // alert("Error subiendo imagen al servidor"); 
                }else{
                this.router.navigate(["/clientes"]);
                }
              },
              error => {
                target.style.display = "none"
                // console.log(error);   
                // alert(<any>error);
                this._snackBar.open("Error", "ok", {duration: 2000})
              }
            )
          }else{
            // alert(res[0].message);
            target.style.display = "none"
            this._snackBar.open(res[0].message, "ok", {duration: 2000})
            this.router.navigate(["/clientes"]);
          }
          
        }
        
      }
    );
  
  }

    onCancelar(){
      this.router.navigate(["/clientes"]);
    }
}

