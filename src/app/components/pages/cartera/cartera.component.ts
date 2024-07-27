import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import {MatPaginator} from '@angular/material/paginator';
import {gQueryService} from "../../../services/g-query.service";
import {DateAdapter, MAT_DATE_FORMATS} from '@angular/material/core';
import { AppDateAdapter, APP_DATE_FORMATS } from "../../format-datepicker";
import {MatTableDataSource} from '@angular/material/table';
import {MatSort} from '@angular/material/sort';
import {MatDialog} from '@angular/material/dialog';

import {MatSnackBar} from '@angular/material/snack-bar'
import { Router } from '@angular/router';
import {FormGroup, FormControl, Validators} from "@angular/forms";





@Component({
  selector: 'app-cartera',
  templateUrl: './cartera.component.html',
  styleUrls: ['./cartera.component.css'],
  providers: [
    {provide: DateAdapter, useClass: AppDateAdapter},
    {provide: MAT_DATE_FORMATS, useValue: APP_DATE_FORMATS}
  ],
  
})

export class CarteraComponent implements OnInit {

  // displayedColumns: string[] = ['Clientes', 'Pos','Del'];
  dataSource = new MatTableDataSource();  
  DetalleCliente = new MatTableDataSource()

  ColumnasDetalleCliente: string[] = ['Fecha', 'Bot','Paq', 'Soles'];
   
  public filterValue='';
  
  public buenos = 0;
  public malos  = 0;
  public medios = 0;
  public total = 0;

  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort: MatSort;

 
  public EsRoot = false;
  public FiltrarBy = "todos";
  // public DetalleCliente = [];

  constructor(
    public gQuery:gQueryService,
    public dialog: MatDialog, 
    private router:Router, 
    private _snackBar: MatSnackBar) {
      
  }
  
  date = new Date();
  CargaForm = new FormGroup({
    Mes: new FormControl(this.date.getMonth() + 1, Validators.required),
    Ano: new FormControl(this.date.getFullYear(), Validators.required)
  })

 
  
  ngOnInit() {
    var Usu = JSON.parse(sessionStorage.getItem("dataUser"));
    if(Usu.CodTipo=="0"){
      this.EsRoot = true;
    }else{
      this.EsRoot = false;
    }
    this.CargarClientes();  
  }

  CargarClientes(){
    var target = document.getElementById('cargando_principal');
    target.style.display = "block"
    var Usu = JSON.parse(sessionStorage.getItem("dataUser"));
    
    this.gQuery
    .sql("sp_cartera_devolver", Usu.Id + "|" + this.CargaForm.controls.Mes.value + "|" + this.CargaForm.controls.Ano.value )
    .subscribe(data =>{
      target.style.display = "none"
      if (data==null){
        this.dataSource=null;
      }else{
        this.dataSource= new MatTableDataSource(<any> data);
        // console.log(this.dataSource);      
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;

        this.buenos = 0;
        this.malos = 0;
        this.medios = 0;
        this.total = 0;

        for(var x = 0; x<Object.values(data).length; x++){
          if(data[x].Pedidos == 0){
            this.malos++;
          }else if(data[x].Pedidos >=3){
            this.buenos++
          }else{
            this.medios++
          }

          this.total++ 
          
        }
        // console.log(this.buenos);
        // console.log(this.medios);
        // console.log(this.malos);
        // console.log(this.total);

      }
    });

  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  

  filtrar(a){
    if(a =="todos"){
      const elms = document.querySelectorAll<HTMLElement>('.malo, .bueno, .medio');
      elms.forEach(function(el){
        el.style.display = "block";
      })
      return;
    }

    const elm = document.querySelectorAll<HTMLElement>('.malo, .bueno, .medio');
    elm.forEach(function(el){
      el.style.display = "none";
    })

    var elems = document.querySelectorAll<HTMLElement>("." + a);
    elems.forEach(function(el){
      el.style.display="block"
    })    
  }

  MostrarIcono(valor, r){
    // si valor es 0 y referencia es rojo entonces devolver verdadero
    // si valor es 1 o 2 y referencia es igual a naranga entonces verdadero
    // si valor es 3 o más y referencia es verdad entonces verdadero
    if(valor == 0 && r == "r"){
      return true;
    }

    if(valor > 0 && valor <=2 && r == "a"){
      return true;
    }
    if(valor >= 3 && r == "v"){
      return true;
    }

    return false;
  }

  CargarDetalle(cliente){
    this.DetalleCliente = new MatTableDataSource();
    if(cliente.Pedidos==0){
      return;
    }
    var target = document.getElementById('l' + cliente.Id);
    // console.log(target)
    if(cliente.Pedidos==0){
      target.style.display = "none"
      return;
    }

    target.style.display = "block"

    

    // this.DetalleCliente = new MatTableDataSource();
    this.gQuery
    .sql("sp_cartera_cliente_devolver", cliente.Id + "|" + this.CargaForm.controls.Mes.value + "|" + this.CargaForm.controls.Ano.value )
    .subscribe(data =>{
      target.style.display = "none"
      this.DetalleCliente= new MatTableDataSource(<any> data);
      
    }); 
  }
}

