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
  public TotPaq=0;
  // public TotVale=0;
  // public TotGar=0;
  public TotalCred=0;
  public TotalSol=0;
  public TotalTransf = 0;

  public TotalBotEnviado = 0;
  public TotalPaqEnviado = 0;
  public TotalBotllenosRegresa;
  public TotalBotVaciosRegresa;
  public TotalPaqRegresa;

  RendirForm = new FormGroup({
    Usuario: new FormControl()
  });
   
  constructor(private gQuery:gQueryService, private router:Router) {}


  ngOnInit() {

    this.gQuery.sql("fn_cuadre_cerrado").subscribe( data =>{
      // console.log(data)
      target.style.display = "none" 
      if(data["resultado"] == "1"){
        alert("no se puede registrar rendiciones porque el día ya fue cerrado");
        this.router.navigate(["/home"]);
      }   
    })

    // cargar  usuarios
    var target = document.getElementById('cargando_principal');
    target.style.display = "block"
    this.gQuery.sql("sp_repartidores_rendir_devolver")
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
        this.TotPaq = 0;
        // this.TotVale=0;
        // this.TotGar=0;
        this.TotalCred=0;
        this.TotalSol=0;
        this.TotalBotEnviado = 0;
        this.TotalPaqEnviado = 0;

        for(var x=0; x <datos.length; x++){
          // agregar resultado a la matrix de pedidos
          
          this.Pedidos.push({
            IdPedido          : datos[x].Id,
            Cliente           : datos[x].Cliente,
            Estado            : datos[x].Estado,
            Cantidad          : datos[x].Cantidad,
            CantidadEnvio     : datos[x].CantidadEnvio,   
            CantidadPaq       : datos[x].CantidadPaq,
            CantidadPaqEnvio  : datos[x].CantidadPaqEnvio,  
            Precio            : datos[x].Precio,
            PrecioPaq         : datos[x].PrecioPaq,
            // Vales       : datos[x].Vales,
            // Garantia    : datos[x].Garantia,
            EstadoPago        : datos[x].EstadoPago,
            TipoPago          : datos[x].TipoPago,
            Glosa             : datos[x].Comentario
          })  
          this.TotalBotEnviado = this.TotalBotEnviado + Number(datos[x].CantidadEnvio);
          this.TotalPaqEnviado = this.TotalPaqEnviado + Number(datos[x].CantidadPaqEnvio);
          if(datos[x].Estado !="Rechazado"){
            this.TotBot = this.TotBot + Number(datos[x].Cantidad);
            this.TotPaq = this.TotPaq + Number(datos[x].CantidadPaq);
          }
         
          // console.log(this.TotBot);
          
          // this.TotVale = this.TotVale + Number(datos[x].Vales);
          // this.TotGar = this.TotGar + Number(datos[x].Garantia);

          if(datos[x].Estado=="Entregado"){
            if(datos[x].EstadoPago == 1){
              if(datos[x].TipoPago ==0){
                this.TotalSol = this.TotalSol + (datos[x].Precio * datos[x].Cantidad) + (datos[x].PrecioPaq * datos[x].CantidadPaq);
              }else{
                this.TotalTransf = this.TotalTransf + (datos[x].Precio * datos[x].Cantidad) + (datos[x].PrecioPaq * datos[x].CantidadPaq);
              }
              // this.TotalSol = this.TotalSol + (datos[x].Precio * datos[x].Cantidad) + (datos[x].PrecioPaq * datos[x].CantidadPaq) - (datos[x].Precio * datos[x].Vales) + Number(datos[x].Garantia)
            }else{
              this.TotalCred = this.TotalCred + (datos[x].Precio * datos[x].Cantidad) + (datos[x].PrecioPaq * datos[x].CantidadPaq);
            }
            
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

