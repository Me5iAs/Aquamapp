import { Component, OnInit} from '@angular/core';
import {FormGroup, FormControl, Validators} from "@angular/forms";
import {gQueryService} from "../../../services/g-query.service";
import {SubirService} from "../../../services/subir.service";
import {Router} from "@angular/router";
import {Observable} from 'rxjs';
import {map, startWith} from 'rxjs/operators';
import {DateAdapter, MAT_DATE_FORMATS} from '@angular/material/core';
import { AppDateAdapter, APP_DATE_FORMATS } from "../../format-datepicker";
import {MatSnackBar} from '@angular/material/snack-bar';
import { disableDebugTools } from '@angular/platform-browser';

@Component({
  selector: 'app-nuevo-pedido',
  templateUrl: './nuevo-pedido.component.html',
  styleUrls: ['./nuevo-pedido.component.css'],
  providers: [
    {provide: DateAdapter, useClass: AppDateAdapter},
    {provide: MAT_DATE_FORMATS, useValue: APP_DATE_FORMATS}
  ]
})
export class NuevoPedidoComponent implements OnInit {
  public Clientes =[];
  public Botellones;
  public Paquetes; //nuevo para venta de paquetes
  public PreciosBot = [];
  // public TarifarioPaq;
  public PreciosPaq = [];
  // public PreciosPaq2;
  public Horas;
  public UsuarioEditaPrecio = false;
// Filtro para cliente [desplegable]
  filteredOptions: Observable<string[]>;

  constructor(
    private gQuery:gQueryService, 
    private router:Router, 
    private _snackBar: MatSnackBar,
    private enviandoImagen:SubirService) {

      // Cargar lista de precios 
      // this.Precios = [
      //   {Valor: 1.5, Texto: "S/ 1.50"},
      //   {Valor: 2, Texto: "S/ 2.00"},
      //   {Valor: 2.3, Texto: "S/ 2.30"},
      //   {Valor: 2.5, Texto: "S/ 2.50"},
      //   {Valor: 3, Texto: "S/ 3.00"},
      //   {Valor: 3.5, Texto: "S/ 3.50"}
      // ]

      // this.PreciosPaq = [

      // ];
      
      // this.PreciosPaq2 = [ //agregado
      //   {Valor: 8, Texto: "S/ 8.00"},
      //   {Valor: 8.3, Texto: "S/ 8.30"},
      //   {Valor: 8.5, Texto: "S/ 8.50"},
      //   {Valor: 9, Texto: "S/ 9.00"},
      //   {Valor: 9.5, Texto: "S/ 9.50"},
      //   {Valor: 10, Texto: "S/ 10.00"}
      // ]

      // Cargar cantidad de Botellones y paquetes
      this.Botellones = [
        {Cantidad: 0, Texto: "0 Botellones"},
        {Cantidad: 1, Texto: "1 Botellón"},
      ]
      this.Paquetes = [
        {Cantidad: 0, Texto: "0 Paquetes"},
        {Cantidad: 1, Texto: "1 Paquete"},
      ]
      for (var x=2; x<=500; x++){
        this.Botellones.push({
          Cantidad : x,
          Texto : x + " Botellones"
        });

        this.Paquetes.push({
          Cantidad : x,
          Texto : x + " Paquetes"
        });

      }

      // Cargar hotas
      this.Horas = [
        {Valor: "7:00:00", Texto: "7:00 am"},
        {Valor: "7:30:00", Texto: "7:30 am"},
        {Valor: "8:00:00", Texto: "8:00 am"},
        {Valor: "8:30:00", Texto: "8:30 am"},
        {Valor: "9:00:00", Texto: "9:00 am"},
        {Valor: "9:30:00", Texto: "9:30 am"},
        {Valor: "10:00:00", Texto: "10:00 am"},
        {Valor: "10:30:00", Texto: "10:30 am"},
        {Valor: "11:00:00", Texto: "11:00 am"},
        {Valor: "11:30:00", Texto: "11:30 am"},
        {Valor: "12:00:00", Texto: "12:00 m"},
        {Valor: "12:30:00", Texto: "12:30 pm"},
        {Valor: "13:00:00", Texto: "1:00 pm"},
        {Valor: "15:00:00", Texto: "3:00 pm"},
        {Valor: "15:30:00", Texto: "3:30 pm"},
        {Valor: "16:00:00", Texto: "4:00 pm"},
        {Valor: "16:30:00", Texto: "4:30 pm"},
        {Valor: "17:00:00", Texto: "5:00 pm"},
        {Valor: "17:30:00", Texto: "5:30 pm"},
        {Valor: "18:00:00", Texto: "6:00 pm"}
        
      ]

    }

  // Formulario
  PedidoForm = new FormGroup({
    Cliente       : new FormControl("Anónimo", [Validators.required]),
    Cantidad      : new FormControl(10, [Validators.pattern("^[0-9]*$"), Validators.required]),
    CantidadPaq   : new FormControl(0, [Validators.pattern("^[0-9]*$"), Validators.required]),
    Fecha_entrega : new FormControl(new Date(),[Validators.required]),
    Hora_entrega  : new FormControl("8:00:00", [Validators.required]),
    Precio        : new FormControl('3.50' , [Validators.required]),
    PrecioPaq     : new FormControl("9.50", [Validators.required]),
    Glosa         : new FormControl(" "),
    
  });



  // CARGA INICIAL
  // ===============
  hora(){
    var a = new Date();
    if (a.getMinutes() <=30){
      // console.log(a.getHours());
      return (a.getHours().toString() + ":30:00")
    }else{
      
      var b:number = a.getHours();
      b++;
      // console.log(b.toString() + ":00:00");
      return (b.toString() + ":00:00")
    }
  }

  ngOnInit() {
    var target = document.getElementById('cargando_principal');
    target.style.display = "block"

    // habilitar la edición de cantidad de paquetes
    var dUser = sessionStorage.getItem("dataUser"); 
    dUser = JSON.parse(dUser); 
    if(dUser["CodTipo"]=="0"){
      this.UsuarioEditaPrecio = true;
    }else{
      this.UsuarioEditaPrecio = false;
    }

    //carga tarifario de cliente anonimo
    this.CargarTarifarioPaq(0);

    //Carga Listado de clientes 
    this.gQuery.sql("sp_clientes_devolver", "0").subscribe( data =>{
      console.log(data)
      target.style.display = "none"      
      for(var x = 0; x<Object.values(data).length; x++){
        this.Clientes.push({
          Id: data[x].Id,
          Nombre: data[x].Nombre,
          Precio: data[x].Precio,
          PrecioPaq: data[x].PrecioPaq,
        });
        
      }
      
      this.filteredOptions = this.PedidoForm.controls.Cliente.valueChanges.pipe(
        startWith(''),
        map(value => this._filter(value))
      );  
    })
    
    // Cargar listado de posibles precios del botellon
    
    this.gQuery.sql("sp_tarifariobot_devolver").subscribe( data =>{
      // console.log(data)
      target.style.display = "none"      
      for(var x = 0; x<Object.values(data).length; x++){
        this.PreciosBot.push({
          Valor: data[x].Valor,
          Texto: data[x].Texto
        });
      }
   
      
      this.filteredOptions = this.PedidoForm.controls.Cliente.valueChanges.pipe(
        startWith(''),
        map(value => this._filter(value))
      );  
    })

    // cuando cambie el numero de pedidos de paquetes, solo se puede modificar el precio si eres administrador
    this.PedidoForm.get("CantidadPaq").valueChanges.subscribe(selectedValue => {
      this.ActualizarTarifaPaqPorCantidad()
     
    })
    
  }
  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.Clientes.filter(option => option.Nombre.toLowerCase().indexOf(filterValue) === 0);
  }

  ActualizarTarifaPaqPorCantidad(){
    for(var x = 0; x<this.PreciosPaq.length; x++){

      if(
          this.PedidoForm.get("CantidadPaq").value >= this.PreciosPaq[x].Desde &&
          this.PedidoForm.get("CantidadPaq").value <= this.PreciosPaq[x].Hasta){
        this.PedidoForm.controls.PrecioPaq.setValue( this.PreciosPaq[x].Valor);
        // console.log("entra")
      }
    }
  }
  CargarTarifarioPaq(IdCliente){
    var target = document.getElementById('cargando_principal');
    target.style.display = "block"   

    this.gQuery.sql("sp_tarifariopaqcliente_devolver", IdCliente).subscribe( data =>{
      // console.log(data)
      target.style.display = "none"    
      this.PreciosPaq = [];  
      for(var x = 0; x<Object.values(data).length; x++){
        this.PreciosPaq.push({
          Desde: data[x].Min,
          Hasta: data[x].Max,
          Valor: data[x].Precio
        });
      } 
      this.ActualizarTarifaPaqPorCantidad();
    })
  }

  CargarPrecio(event){    
    var a = this.Clientes.filter( op => op.Nombre == event.option.value );
    // console.log(a[0]);
    
    this.PedidoForm.controls.Precio.setValue((a[0].Precio));
    this.CargarTarifarioPaq(a[0].Id)
    

  }
  onRegistrarPedido(data){
    console.log(data);
    
    var IdCliente = this.Clientes.filter( op => op.Nombre == data.Cliente );
    
    var UsuarioI = JSON.parse(sessionStorage.getItem("dataUser"));
    if(!this.PedidoForm.valid){
      this._snackBar.open("llene correctamente los datos antes de continuar", "ok", {duration: 2000})
      return;
    }

    if(IdCliente[0].Id==0 && (data.Glosa ==" " || data.Glosa=="")){
      this._snackBar.open("para clientes anónimo necesita ingresar la direccion y teléfono como comentario", "ok", {duration: 2000})
      // alert("para clientes anónimo necesita ingresar la direccion y teléfono como comentario");
      return;
    }

    var target = document.getElementById('cargando_principal');
    target.style.display = "block"    
    
    let date = new Date(data.Fecha_entrega)    
    let day = date.getDate()
    let month = date.getMonth() + 1
    let year = date.getFullYear() 
    // let sFecha = new Date(month + "-" + day + "-"+year);
// console.log(sFecha)
    // let dFecha = sFecha.toISOString().split('T')[0];   
// console.log(dFecha)
    // let dia = sFecha.getDate();
    // let mes = sFecha.getMonth()+1;
    // let ano = sFecha.getFullYear();
    // let dFecha = ano + "-" + mes + "-" + dia; 
    let dFecha = year + "-" + month + "-" + day;
    // console.log(dFecha)
// return;
    this.gQuery.sql(
      "sp_pedido_registrar",  //modificado
      IdCliente[0].Id           + "|" + 
      UsuarioI.Id               + "|" + 
      data.Cantidad             + "|" +        
      data.Precio               + "|" +
      data.CantidadPaq          + "|" +
      data.PrecioPaq            + "|" +
      data.Glosa                + "|" + 
      dFecha                    + "|" + 
      data.Hora_entrega
      ).subscribe(res =>{
        target.style.display = "none"
        if(res[0].Estado=="1"){
          this._snackBar.open(res[0].message, "ok", {duration: 2000})
          this.PedidoForm.controls.Cliente.setValue("Anónimo");
          this.PedidoForm.controls.Cantidad.setValue(10);
          this.PedidoForm.controls.CantidadPaq.setValue(1);
          this.PedidoForm.controls.Fecha_entrega.setValue(new Date());
          this.PedidoForm.controls.Precio.setValue(2.5);
          this.PedidoForm.controls.PrecioPaq.setValue(9.5);
          this.PedidoForm.controls.Glosa.setValue(" ");
        }else{
          alert("ERRROR" + "\n" +  res[0].message);
        }
        
      },
      error => {
        target.style.display = "none"
        this._snackBar.open("ERROR: no se ha podido establecer conexion con el servidor (¿tienes Internet?)", "ok", {duration: 3000})
      }
    );
  
  }

    onCancelar(){
      this.router.navigate(["/pedidos"]);
    }

    onFocusEvent(event: any){
      this.PedidoForm.controls.Cliente.setValue("");      
   }
}

