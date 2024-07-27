import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import {MatPaginator} from '@angular/material/paginator';
import {gQueryService} from "../../../services/g-query.service";
import {MatTableDataSource} from '@angular/material/table';
import {MatSort} from '@angular/material/sort';

@Component({
  selector: 'app-porcobrar',
  templateUrl: './porcobrar.component.html',
  styleUrls: ['./porcobrar.component.css']
})
export class PorcobrarComponent implements OnInit, AfterViewInit {

  displayedColumns: string[] = ['Fecha', 'Bot','Paq', 'Deuda', 'Pos'];
  dataSource = new MatTableDataSource();  
  datadeuda = [];

  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort: MatSort;

  public EsRoot = false;
  constructor(public gQuery:gQueryService) {
  }

  
  ngOnInit() {
 
    this.CargarPendientes();  
  }

  CargarPendientes(){
    var target = document.getElementById('cargando_principal');
    target.style.display = "block"
    this.gQuery
    .sql("sp_porcobrar_general_devolver")
    .subscribe(data => {
      target.style.display = "none"
      if (data==null){
        this.datadeuda=null;
      }else{
        this.datadeuda = Object.values(data);
        // console.log(this.datadeuda);
      }    
    })

   

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

  CargarDetalle(IdCliente){
    var target = document.getElementById('l' + IdCliente);
     this.gQuery
    .sql("sp_porcobrar_detalle_devolver", IdCliente)
    .subscribe(data =>{
      target.style.display = "none"
      this.dataSource= new MatTableDataSource(<any> data);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;      
    });
  }

  onPagar(element){
    var target = document.getElementById('cargando_principal');
    target.style.display = "block"

    this.gQuery.sql("fn_cuadre_cerrado").subscribe( data =>{
      target.style.display = "none" 
      if(data["resultado"] == "1"){
        alert("no se puede registrar nuevos pagos en este día porque el día ya fue cerrado");
        return;
      }else{
        var confirmar = confirm("Va a proceder a registrar el pago. ¿Desea continuar ?")
        if(confirmar == true){
          var UsuarioI = JSON.parse(sessionStorage.getItem("dataUser"));
    
          this.gQuery
          .sql("sp_porcobrar_pagar", element.Id + "|" + UsuarioI.Id)
          .subscribe(data =>{
            target.style.display = "none"   
           this.CargarPendientes();
          });
        }
      }
    })

 
    
    // console.log(element);
  }

  onPagarTodo(IdCliente){
    
    var target = document.getElementById('cargando_principal');
    target.style.display = "block"

    this.gQuery.sql("fn_cuadre_cerrado").subscribe( data =>{
      target.style.display = "none" 
      if(data["resultado"] == "1"){
        alert("no se puede registrar nuevos pagos en este día porque el día ya fue cerrado");

        return;
      }else{
        var confirmar = confirm("Va a proceder a registrar el pago de todos los pendientes de este cliente. ¿Desea continuar ?")

        if(confirmar == true){
         
          var target = document.getElementById('cargando_principal');
          target.style.display = "block"
      
          var UsuarioI = JSON.parse(sessionStorage.getItem("dataUser"));
    
          this.gQuery
          .sql("sp_porcobrar_pagartodo", IdCliente + "|" + UsuarioI.Id)
          .subscribe(data =>{
            target.style.display = "none"
            this.CargarPendientes();
          });
        }
      }
    })
  
  }
  
  
}

