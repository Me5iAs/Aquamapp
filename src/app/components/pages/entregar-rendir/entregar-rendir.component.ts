import { Component, OnInit, ViewChild } from '@angular/core';
import {FormGroup, FormControl, Validators} from "@angular/forms";
import {MatPaginator} from '@angular/material/paginator';
import {gQueryService} from "../../../services/g-query.service";
import {DateAdapter, MAT_DATE_FORMATS} from '@angular/material/core';
import { AppDateAdapter, APP_DATE_FORMATS } from "../../format-datepicker";
// import {MatTableDataSource} from '@angular/material/table';
import {MatSort} from '@angular/material/sort';
// import { UsuarioI } from 'src/app/models/usuario.interface';
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
  
  // dataSource = new MatTableDataSource();  

  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort: MatSort;

  public Repartidores;
  
  public Pedidos = [];
  public TotBot=0;
  public TotVale=0;
  public TotGar=0;
  public TotalSol=0;

  RendirForm = new FormGroup({
    Usuario: new FormControl()
  });
   
  constructor(private gQuery:gQueryService, private router:Router) {}


  ngOnInit() {

    // cargar  usuarios
    var target = document.getElementById('cargando_principal');
    target.style.display = "block"
    this.gQuery.sql("sp_repartidores_devolver")
    .subscribe(data =>{
      target.style.display = "none"
      this.Repartidores = data;
    })
  }

  Numero(d){
    return Number(d);
  }

  CargarPedidosPorRendir(){
    if(this.RendirForm.controls.Usuario.value){
      var target = document.getElementById('cargando_principal');
      target.style.display = "block"
      var UsuarioI = this.RendirForm.controls.Usuario.value;
      
      this.gQuery
      .sql("sp_pedidos_pendientes_rendir", UsuarioI)
      .subscribe(
        data =>{      
        target.style.display = "none"  
        this.Pedidos = [];
        if(data ==null) {
          alert("No se encuentran pedidos por rendir para este usuario");
          return;
        }
        
        var datos:any = data;
        this.TotBot=0;
        this.TotVale=0;
        this.TotGar=0;
        this.TotalSol=0;

        for(var x=0; x <datos.length; x++){
          // agregar resultado a la matrix de pedidos
          
          this.Pedidos.push({
            IdPedido  : datos[x].Id,
            Cliente   : datos[x].Cliente,
            Estado    : datos[x].Estado,
            Cantidad  : datos[x].Cantidad,
            Precio    : datos[x].Precio,
            Vales     : datos[x].Vales,
            Garantia  : datos[x].Garantia,
            Glosa     : datos[x].Comentario
          })   
          this.TotBot = this.TotBot + Number(datos[x].Cantidad);
          // console.log(this.TotBot);
          
          this.TotVale = this.TotVale + Number(datos[x].Vales);
          this.TotGar = this.TotGar + Number(datos[x].Garantia);
          if(datos[x].Estado=="Entregado"){
            this.TotalSol = this.TotalSol + (datos[x].Precio * datos[x].Cantidad) - (datos[x].Precio * datos[x].Vales) + Number(datos[x].Garantia)
          }
        }
        },
        error =>{
          alert("error al conectarse a la base de datos, contacte con el administrador");
        }
      );
    }
  }
  
  ngAfterViewInit(){}

  onAtenderPedidos(){
    var target = document.getElementById('cargando_principal');
    target.style.display = "block"
    
    var UsuarioEntrega = this.RendirForm.controls.Usuario.value;
    var UsuarioRegistra = JSON.parse(sessionStorage.getItem("dataUser"));
    this.gQuery.sql("sp_pedidos_rendir",UsuarioEntrega + "|" + UsuarioRegistra.Id )
    .subscribe(
      res =>{
        target.style.display = "none";
        this.Pedidos = [];
        this.RendirForm.controls.Usuario.setValue("");
        alert("Entrega registrada");
      },
      error =>{
        target.style.display = "none";
        alert("Error al conectarte a la base de datos");
      }
    );    
  }  
}

