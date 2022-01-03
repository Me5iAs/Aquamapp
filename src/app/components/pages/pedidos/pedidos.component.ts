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
  selector: 'app-pedidos',
  templateUrl: './pedidos.component.html',
  // templateUrl: './pedidos.component.pug',
  styleUrls: ['./pedidos.component.styl'],
  providers: [
    {provide: DateAdapter, useClass: AppDateAdapter},
    {provide: MAT_DATE_FORMATS, useValue: APP_DATE_FORMATS}
  ]
})


export class PedidosComponent implements OnInit {
  displayedColumns: string[] = [ 'Nro','Cliente','Fecha','Usuario','Borrar'];
  dataSource = new MatTableDataSource();  

  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort: MatSort;
  public Repartidores;
  public Botellones;
  public total_envio:number = 0;
  public Pedidos_sel = []
  public userData: UsuarioI = JSON.parse(sessionStorage.getItem("dataUser"));

  EntregaForm = new FormGroup({
    Cantidad      : new FormControl("", [Validators.pattern("^[0-9]*$"), Validators.required]),
    EstadoPago    : new FormControl("",[Validators.required]),
    Glosa         : new FormControl(" "),
    
  });

  
  constructor(private gQuery:gQueryService, private router:Router) {
    this.Botellones = [
      {Cantidad: 1, Texto: "1 Botellón"},
    ]
    for (var x=2; x<=30; x++){
      this.Botellones.push({
        Cantidad : x,
        Texto : x + " Botellones"
      })
    }
  }
  EnviarForm = new FormGroup({
    Usuario: new FormControl()
  });
  
  ngOnInit() {
    this.CargarPedidos();
    
    var target = document.getElementById('cargando_principal');
    target.style.display = "block"

    this.gQuery.sql("sp_repartidores_devolver")
    .subscribe(data =>{
      target.style.display = "none"
      this.Repartidores = data;
    })
  }

  CargarPedidos(){
    var target = document.getElementById('cargando_principal');
    target.style.display = "block"
    
    this.gQuery
    .sql("sp_pedidos_pendientes_devolver", "0")
    .subscribe(data =>{
      target.style.display = "none"
      if (data==null){
        this.dataSource=null;
      }else{
        this.dataSource= new MatTableDataSource(<any> data);
        // console.log(this.dataSource);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      }
    });

  }
  ngAfterViewInit(){
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  onAtenderPedido(Id){
    console.log(this.userData.CodTipo);
    
    if(this.userData.CodTipo =='2'){
      return;
    }else{
      this.router.navigate(["/atencion/" + Id]);
    }
    
  }

  onSeleccionar(id, cant, ele){
    if(ele){
      // agregar 
      this.Pedidos_sel.push(id);
      this.total_envio = this.total_envio + parseInt(cant);
    }else{
      var i = this.Pedidos_sel.indexOf( id );
 
      if ( i !== -1 ) {
        this.Pedidos_sel.splice( i, 1 );
        this.total_envio = this.total_envio - parseInt(cant);
      }
    }
    // console.log(this.Pedidos_sel);
    // console.log(this.EnviarForm.controls.Usuario.value);
    
  }
  onDelPedido(Id){
    if(!confirm("Esta acción eliminará el Pedido, desea continuar")) {
      return;
    }

    var target = document.getElementById('cargando_principal');
    target.style.display = "block"


    this.gQuery
      .sql("sp_pedido_delete",Id)
      .subscribe(res =>{
        // console.log(res);
        target.style.display = "none"  
        alert("Pedido eliminado con éxito")
        this.CargarPedidos()
      });
  }

  onEnviarPedido(){
    var target = document.getElementById('cargando_principal');
    target.style.display = "block"


    this.gQuery
      .sql("sp_pedidos_enviar",
      this.EnviarForm.controls.Usuario.value + "|" + this.Pedidos_sel.join('-')
      )
      .subscribe(res =>{
        console.log(res);
        target.style.display = "none"  
        alert("envio registrado")
        this.total_envio = 0;
        this.Pedidos_sel = [];
        this.CargarPedidos()
        
      });
  }

  onGetData(){
    var total = 0;
    if(this.dataSource) {
      this.dataSource.data.forEach(function (obj) {
        total = total + parseFloat(obj["Cantidad"]);
      });
    }else{
      total = 0;
    }
    
    return total;
    
  }
  
}

