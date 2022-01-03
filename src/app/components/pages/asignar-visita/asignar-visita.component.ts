import { Component, OnInit, ViewChild, AfterViewInit, ElementRef } from '@angular/core';
 import * as XLSX from 'xlsx';
import {MatPaginator} from '@angular/material/paginator';
import {gQueryService} from "../../../services/g-query.service";
import {MatTableDataSource} from '@angular/material/table';
import {MatSort} from '@angular/material/sort';
import {MatDialog} from '@angular/material/dialog';
import {MatSnackBar} from '@angular/material/snack-bar'
import { Router } from '@angular/router';
import {DateAdapter, MAT_DATE_FORMATS} from '@angular/material/core';
import {FormGroup, FormControl, Validators} from "@angular/forms";
import { AppDateAdapter, APP_DATE_FORMATS } from "../../format-datepicker";
import {SelectionModel} from '@angular/cdk/collections';

@Component({
  selector: 'app-asignar-visita',
  templateUrl: './asignar-visita.component.html',
  styleUrls: ['./asignar-visita.component.css'],
  providers: [
    {provide: DateAdapter, useClass: AppDateAdapter},
    {provide: MAT_DATE_FORMATS, useValue: APP_DATE_FORMATS}
  ]
})


export class AsignarVisitaComponent implements OnInit {
  public Asignaciones = [];
  public Vendedores;
  public minDate = new Date();
  public maxDate = new  Date(this.minDate.getFullYear(),this.minDate.getMonth(),this.minDate.getDate()+15);
  public filterValue='';
  // public selection;
  displayedColumns: string[] = ["Chk", "Cliente","Segmento", "Pedidos", "Botellones", "Ult_pedido", "Frecuencia","Promedio","Prox_pedido", "Estado"];
  dataSource = new MatTableDataSource();  

  selection = new SelectionModel(true, []);
  
  
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort: MatSort;

  // exportAsExcel(){
  //     const ws: XLSX.WorkSheet=XLSX.utils.table_to_sheet(this.table.nativeElement);
  //     const wb: XLSX.WorkBook = XLSX.utils.book_new();
  //     XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

  //     /* save to file */
  //     var FechaActual = new Date();
  //     var DiaActual = this.gQuery.fecha_2b(new Date());
  //     DiaActual = this.gQuery.fecha_2n(DiaActual);
      
  //     // var a = this.Procedimientos.filter( op => op.Valor ==this.BuscarForm.controls.Reporte.value );
  

  //     XLSX.writeFile(wb,  DiaActual + "_" + 'asignaciones.xlsx');

  // }

  constructor(
    public gQuery:gQueryService,
    public dialog: MatDialog, 
    private router:Router, 
    private _snackBar: MatSnackBar) {
  }

  
  AsignarForm = new FormGroup({
    Vendedor: new FormControl(),
    FechaProg: new FormControl(new Date(), Validators.required),
  })
  
  MostrarForm = new FormGroup({
    Dias: new FormControl(2,Validators.required)
  });


  public Dias = [
    {
      Valor: 1, 
      Texto: "01 día"
    }];
  
    

  ngOnInit() {
    // #cargar lista de dias
    for(var i = 2; i<10; i++){
      this.Dias.push({
        Valor: i,
        Texto: "0" + i + " Días"
      })
    }

    // #cargar vendedores
    var target = document.getElementById('cargando_principal');
    target.style.display = "block"
    this.gQuery
    .sql("sp_vendedores_devolver")
    .subscribe(data =>{
      target.style.display = "none"
      if (data==null){
        alert("no se encuentran vendedores registrados");
        return;
      }else{
        this.Vendedores = data;
        
      }
    },
    error => {
      target.style.display = "none"
      alert("Error: Ha ocurrido un error, vuelva a intentarlo, si sigue teniendo el mismo problema, coordine con el Administrador")
    }
    );
  }

  Numero(val){
    return Number(val);
  }

  esNumero(valor){
    if(isNaN(valor)){
      return true;
    }else{
      return false;
    }
  }

  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected == numRows;

  }

  onCheck() {
    var _self = this;
    if(this.isAllSelected()){
      _self.selection.clear();
    }else{
      this.dataSource.data.forEach(function(row){
        _self.selection.select(row);
      });
    }    
  }

  onAsignar(){
    
    var IdClienteArray = this.selection.selected.map(data => data.Id);
    var IdVendedor = this.AsignarForm.controls.Vendedor.value;
    let sFecha = new Date(this.AsignarForm.controls.FechaProg.value);
    let day = sFecha.getDate()
    let month = sFecha.getMonth() + 1
    let year = sFecha.getFullYear() 

    let dFechaProg = year + "-" + month + "-" + day;
    console.log(dFechaProg)

    // console.log(IdClienteArray.join("-"));
    
    // return;
    var target = document.getElementById('cargando_principal');
    target.style.display = "block"
    
    this.gQuery
    .sql("sp_visitas_asignar",  
      IdVendedor  + "|" +
      dFechaProg  + "|" +
      IdClienteArray.join("-"))
    .subscribe(data =>{
      target.style.display = "none"
      this.dataSource = new MatTableDataSource(); 
      this.selection = new SelectionModel(true, []);
      alert("Asignaciones registradas con éxito");
    },
    error => {
      target.style.display = "none"
      alert("Error: Ha ocurrido un error, vuelva a intentarlo, si sigue teniendo el mismo problema, coordine con el Administrador")
    }
    );

  }

 

  onSeleccionarTodo(event){
    if(event){
      // agregar 
      // this.Asignaciones.push(id);
    }else{
      // var i = this.Asignaciones.indexOf( id );
      // if ( i !== -1 ) {
      //   this.Asignaciones.splice( i, 1 );        
      // }
    }
  }

  onSeleccionar(id,  ele){
    if(ele){
      // agregar 
      this.Asignaciones.push(id);
    }else{
      var i = this.Asignaciones.indexOf( id );
      if ( i !== -1 ) {
        this.Asignaciones.splice( i, 1 );        
      }
    }
    console.log(this.Asignaciones);
    
    
    
  }

  CargarProyeccion(data){
    var target = document.getElementById('cargando_principal');
    target.style.display = "block"
    this.gQuery
    .sql("sp_proyecciones_devolver", data.Dias)
    .subscribe(data =>{
      target.style.display = "none"
      if (data==null){
        alert("No se encuentran clientes con proyección de pedido para los días seleccionados");
        // this.dataSource=null;
        this.dataSource = new MatTableDataSource();  
      }else{
        this.dataSource= new MatTableDataSource(<any> data);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      }
    },
    error => {
      target.style.display = "none"
      alert("Error: Ha ocurrido un error, vuelva a intentarlo, si sigue teniendo el mismo problema, coordine con el Administrador")
    }
    );

  }

  ngAfterViewInit(){
  }

  applyFilter(event: Event) {
    this.filterValue = (event.target as HTMLInputElement).value;
    
    this.dataSource.filter = this.filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

}





