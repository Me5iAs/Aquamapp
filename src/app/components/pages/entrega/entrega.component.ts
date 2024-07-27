import { Component, OnInit, ViewChild } from '@angular/core';
import {MatPaginator} from '@angular/material/paginator';
import {gQueryService} from "../../../services/g-query.service";
import {DateAdapter, MAT_DATE_FORMATS} from '@angular/material/core';
import { AppDateAdapter, APP_DATE_FORMATS } from "../../format-datepicker";
import {MatTableDataSource} from '@angular/material/table';
import {MatSort} from '@angular/material/sort';
import { UsuarioI } from 'src/app/models/usuario.interface';
import { Router } from '@angular/router';

@Component({
  selector: 'app-entrega',
  templateUrl: './entrega.component.html',
  styleUrls: ['./entrega.component.css'],
  providers: [
    {provide: DateAdapter, useClass: AppDateAdapter},
    {provide: MAT_DATE_FORMATS, useValue: APP_DATE_FORMATS}
  ]
})
export class EntregaComponent implements OnInit {
  displayedColumns: string[] = ['Nro','Cliente', "Borrar"];
  dataSource = new MatTableDataSource();  

  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort: MatSort;

  public userData: UsuarioI = JSON.parse(sessionStorage.getItem("dataUser"));
   
  constructor(private gQuery:gQueryService, private router:Router) {}

  ngOnInit() {
    this.CargarPedidos();  
  }

  CargarPedidos(){
    // console.log("aa");
    var target = document.getElementById('cargando_principal');
    target.style.display = "block"
    var UsuarioI = JSON.parse(sessionStorage.getItem("dataUser"));

    this.gQuery
        .sql("sp_pedidos_entregar", UsuarioI.Id)
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
    // console.log(this.userData.CodTipo);
    
    if(this.userData.CodTipo =='2'){
      return;
    }else{
      this.router.navigate(["/atencion/" + Id]);
    }
    
  }

  onDelPedido(Id){

    if(!confirm("Seguro que quieres registrar el rechazo del pedido")) {
      return;
    }

    var com = window.prompt("ingrese un comentario respecto al rechazo", "");
    // console.log(com);
    
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
        this.CargarPedidos()
      });
  }

  onEnviarPedido(Id){
    var target = document.getElementById('cargando_principal');
    target.style.display = "block"


    this.gQuery
      .sql("sp_pedido_enviar",Id)
      .subscribe(res =>{
        // console.log(res);
        target.style.display = "none"  
        alert("envio registrado")
        this.CargarPedidos()
        
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

