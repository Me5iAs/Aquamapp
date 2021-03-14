import { Component, OnInit, ViewChild, AfterViewInit, Inject } from '@angular/core';
import {FormGroup, FormControl, Validators} from "@angular/forms";
import {MatPaginator} from '@angular/material/paginator';
// import Swal from 'sweetalert2'
import {gQueryService} from "../../../services/g-query.service";
import {Router} from "@angular/router";
import {MatTableDataSource} from '@angular/material/table';
import {MatSort} from '@angular/material/sort';
import {MatSnackBar} from '@angular/material/snack-bar';

@Component({
  selector: 'app-rendir',
  templateUrl: './rendir.component.html',
  styleUrls: ['./rendir.component.styl']
})
export class RendirComponent implements OnInit {

  displayedColumns: string[] = ['chk','Monto', 'Del'];
  dataSource = new MatTableDataSource();
  @ViewChild(MatSort, {static: true}) sort: MatSort;

  
  public Repartidores;
  
  public Total
  public Pedidos;

  constructor(public gQuery:gQueryService, private router:Router) {}
  
    RendirForm = new FormGroup({
      Usuario: new FormControl()
    });

  cargar(){
    var target = document.getElementById('cargando_principal');
    target.style.display = "block"

    // cargar  pedidos
    this.gQuery
    .sql("sp_pedidos_x_rendir", this.RendirForm.controls.Usuario.value)
    .subscribe(data =>{
      target.style.display = "none"    
      if(data){
        this.dataSource= new MatTableDataSource(<any> data);
        this.dataSource.sort = this.sort;
        this.Total  = this.dataSource.data.reduce((accum:number, curr) => accum + parseFloat(curr["Total"]), 0)
        this.Pedidos  = this.dataSource.data.reduce((ped, curr) => ped + curr["Id"] + "-","")
        this.Pedidos = this.Pedidos.substring(0, this.Pedidos.length - 1);
        this.Total.toFixed(2);
      }else{        
        this.dataSource= new MatTableDataSource(<any> data);
      }
      console.log(this.dataSource);
    });
    

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

    
  }

  onRendir(){
    var target = document.getElementById('cargando_principal');
    target.style.display = "block"


    this.gQuery
      .sql("sp_pedidos_rendir_lote",
      JSON.parse(sessionStorage.dataUser).Id  + "|" + this.Pedidos
      )
      .subscribe(res =>{
        console.log(res);
        target.style.display = "none"  
        alert("Rendición registrada")
        this.dataSource = new MatTableDataSource();
        this.RendirForm.controls.Usuario.setValue("");
        this.Total = "";
        
      });
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
        this.cargar()
      });
  }

}

