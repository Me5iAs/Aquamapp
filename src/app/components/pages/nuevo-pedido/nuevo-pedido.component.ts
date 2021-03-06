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
  public Precios;
  public Horas;
// Filtro para cliente [desplegable]
  filteredOptions: Observable<string[]>;

  constructor(
    private gQuery:gQueryService, 
    private router:Router, 
    private _snackBar: MatSnackBar,
    private enviandoImagen:SubirService) {
      this.Precios = [
        {Valor: 1.5, Texto: "S/ 1.50"},
        {Valor: 2, Texto: "S/ 2.00"},
        {Valor: 2.5, Texto: "S/ 2.50"},
        {Valor: 3, Texto: "S/ 3.00"},
        {Valor: 3.5, Texto: "S/ 3.50"}
      ]

      this.Botellones = [
        {Cantidad: 1, Texto: "1 Botellón"},
      ]
      for (var x=2; x<=30; x++){
        this.Botellones.push({
          Cantidad : x,
          Texto : x + " Botellones"
        })
      }

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
      for (var x=2; x<=30; x++){
        this.Botellones.push({
          Cantidad : x,
          Texto : x + " Botellones"
        })
      }
    }

    
  

  PedidoForm = new FormGroup({
    Cliente       : new FormControl("Anónimo", [Validators.required]),
    Cantidad      : new FormControl(10, [Validators.pattern("^[0-9]*$"), Validators.required]),
    Fecha_entrega : new FormControl(new Date(),[Validators.required]),
    // Hora_entrega  : new FormControl("", [Validators.required]),
    Precio        : new FormControl(2 , [Validators.required]),
    Glosa         : new FormControl(" "),
    
  });

  // CARGA INICIAL
  // ===============
  hora(){
    var a = new Date();
    if (a.getMinutes() <=30){
      console.log(a.getHours());
      return (a.getHours().toString() + ":30:00")
    }else{
      
      var b:number = a.getHours();
      b++;
      console.log(b.toString() + ":00:00");
      return (b.toString() + ":00:00")
    }
  }

  ngOnInit() {
    var target = document.getElementById('cargando_principal');
    target.style.display = "block"
        
    this.gQuery.sql("sp_clientes_devolver").subscribe( data =>{
     
      target.style.display = "none"      
      for(var x = 0; x<Object.values(data).length; x++){
        this.Clientes.push({
          Id: data[x].Id,
          Nombre: data[x].Nombre
        });
        
      }
      
    
      this.filteredOptions = this.PedidoForm.controls.Cliente.valueChanges.pipe(
        startWith(''),
        map(value => this._filter(value))
      );  
    })
    
  }
  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.Clientes.filter(option => option.Nombre.toLowerCase().indexOf(filterValue) === 0);
  }
  ngAfterViewInit(){
  }

  onRegistrarPedido(data){
    console.log(data.Cliente);
    
    var IdCliente = this.Clientes.filter( op => op.Nombre == data.Cliente );
    // console.log(IdCliente);
    
    var UsuarioI = JSON.parse(sessionStorage.getItem("dataUser"));
    if(!this.PedidoForm.valid){
      this._snackBar.open("llene correctamente los datos antes de continuar", "ok", {duration: 2000})
      // alert("llene correctamente los datos antes de continuar");
      return;
    }

    if(IdCliente[0].Id==0 && data.Glosa ==" "){
      this._snackBar.open("para clientes anónimo necesita ingresar la direccion y teléfono como comentario", "ok", {duration: 2000})
      // alert("para clientes anónimo necesita ingresar la direccion y teléfono como comentario");
      return;
    }

    var target = document.getElementById('cargando_principal');
    target.style.display = "block"    

    this.gQuery.sql(
      "sp_pedido_registrar",
      IdCliente[0].Id                              + "|" + 
      UsuarioI.Id                                  + "|" + 
      this.gQuery.fecha_2b(data.Fecha_entrega)     + "|" + 
      // data.Hora_entrega                            + "|" + 
      "15:30:00"                                   + "|" + 
      data.Cantidad                                + "|" +        
      data.Precio                                  + "|" +        
      data.Glosa
      ).subscribe(res =>{
        target.style.display = "none"
        if(res[0].Estado==1){
          this._snackBar.open(res[0].message, "ok", {duration: 2000})
          // alert(res[0].message); 
          // this.router.navigate(["/home"]);
          this.PedidoForm.controls.Cliente.setValue("Anónimo");
          this.PedidoForm.controls.Cantidad.setValue(10);
          this.PedidoForm.controls.Fecha_entrega.setValue(new Date());
          this.PedidoForm.controls.Precio.setValue(2);
          this.PedidoForm.controls.Glosa.setValue("");


        }
        
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

