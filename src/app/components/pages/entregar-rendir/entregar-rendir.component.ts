import { Component, OnInit, ViewChild } from '@angular/core';
import {FormGroup, FormControl, Validators} from "@angular/forms";
import {MatPaginator} from '@angular/material/paginator';
import {gQueryService} from "../../../services/g-query.service";
import {DateAdapter, MAT_DATE_FORMATS} from '@angular/material/core';
import { AppDateAdapter, APP_DATE_FORMATS } from "../../format-datepicker";
import {MatTableDataSource} from '@angular/material/table';
import {MatSort} from '@angular/material/sort';
import { UsuarioI } from 'src/app/models/usuario.interface';
import { Router } from '@angular/router';

@Component({
  selector: 'app-entregar-rendir',
  templateUrl: './entregar-rendir.component.html',
  styleUrls: ['./entregar-rendir.component.css'],
  providers: [
    {provide: DateAdapter, useClass: AppDateAdapter},
    {provide: MAT_DATE_FORMATS, useValue: APP_DATE_FORMATS}
  ]
})
export class EntregarRendirComponent implements OnInit {
  // displayedColumns: string[] = ['Cliente', 'P.U','Bot', 'Vale', 'Gar', 'S/', 'Del'];
  dataSource = new MatTableDataSource();  

  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort: MatSort;

  public Repartidores;
  
  public Pedidos = [];

  public Botellones;
  public userData: UsuarioI = JSON.parse(sessionStorage.getItem("dataUser"));
  RendirForm = new FormGroup({
    Usuario: new FormControl()
  });

  EntregaForm = new FormGroup({
    Cantidad      : new FormControl("", [Validators.pattern("^[0-9]*$"), Validators.required]),
    EstadoPago    : new FormControl("",[Validators.required]),
    Glosa         : new FormControl(" "),
    
  });
   
  constructor(private gQuery:gQueryService, private router:Router) {
    this.Botellones = [
      {Cantidad: 1, Texto: "1"},
    ]
    for (var x=2; x<=30; x++){
      this.Botellones.push({
        Cantidad : x.toString(),
        Texto : x  
      })
    }
  }

  
  ngOnInit() {
    // cargar  usuarios
    var target = document.getElementById('cargando_principal');
    target.style.display = "block"
    this.gQuery.sql("sp_repartidores_devolver")
    .subscribe(data =>{
      target.style.display = "none"
      this.Repartidores = data;
    })
    // this.CargarPedidos();  
  }


  CargarPedidosPorRendir(){
    if(this.RendirForm.controls.Usuario.value){
      var target = document.getElementById('cargando_principal');
      target.style.display = "block"
      var UsuarioI = this.RendirForm.controls.Usuario.value;
      
      this.gQuery
      .sql("sp_pedidos_entregar", UsuarioI)
      .subscribe(data =>{      
        target.style.display = "none"  
        this.Pedidos = [];
        if(data ==null) return;
        
        var datos:any = data;
        for(var x=0; x <datos.length; x++){
          // agregar resultado a la matrix de pedidos
          this.Pedidos.push({
            IdPedido  : datos[x].Id,
            IdUsuario : UsuarioI,
            Cliente   : datos[x].Cliente,
            Cantidad  : datos[x].Cantidad,
            Precio    : datos[x].Precio,
            Vales     : 0,
            Garantia  : 0,
            Total     : datos[x].Precio * datos[x].Cantidad
          })   
        }
        console.log(this.Pedidos);
      });
    }
  }



  ngAfterViewInit(){
  }

  
  onAtenderPedido(data){
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
      data.IdPedido       + "|" + 
      UsuarioI.Id         + "|" + 
      data.Cantidad       + "|" + 
      "1"                 + "|" + 
      data.Vales          + "|" +
      data.Garantia
      ).subscribe(res =>{
        target.style.display = "none"
        alert("Entrega registrada");
        var i = this.Pedidos.indexOf(data);
        this.Pedidos.splice( i, 1 );

        // alert(res[0].message);
                
      });
    // console.log(data);
    
 }
 


  onDelPedido(Id){

    if(!confirm("Seguro que quieres registrar el rechazo del pedido")) {
      return;
    }

    var com = window.prompt("ingrese un comentario respecto al rechazo", "");
    console.log(com);
    
    if(com ==null){
      return;
    }

    var target = document.getElementById('cargando_principal');
    target.style.display = "block"


    this.gQuery
      .sql("sp_pedido_rechazar",Id + "|" +  com)
      .subscribe(res =>{
        // console.log(res);
        target.style.display = "none"  
        alert("Rechazo registrado")
        this.CargarPedidosPorRendir()
      });
  }

  onEnviarPedido(Id){
    var target = document.getElementById('cargando_principal');
    target.style.display = "block"


    this.gQuery
      .sql("sp_pedido_enviar",Id)
      .subscribe(res =>{
        console.log(res);
        target.style.display = "none"  
        alert("envio registrado")
        this.CargarPedidosPorRendir()
        
      });
  }

  onGetData(){
    var total = 0;  
    this.dataSource.data.forEach(function (obj) {
      total = total + parseFloat(obj["Cantidad"]);
    });
    return total;
    
  }
  
}

