import { Component, OnInit, ViewChild, AfterViewInit, ElementRef } from '@angular/core';
 import * as XLSX from 'xlsx';
import {MatPaginator} from '@angular/material/paginator';
import {gQueryService} from "../../../services/g-query.service";
import {MatTableDataSource} from '@angular/material/table';
import {MatSort} from '@angular/material/sort';
import {MatDialog} from '@angular/material/dialog';
import {MatSnackBar} from '@angular/material/snack-bar'
import { Router } from '@angular/router';
import {FormGroup, FormControl, Validators} from "@angular/forms";
import {Sort} from '@angular/material/sort';

@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.css']
})
export class ReportsComponent implements OnInit, AfterViewInit {
  
  
  ColumnasDinamicas= [];
  columnsToDisplay: string[] = this.ColumnasDinamicas.slice();
  dataSource = new MatTableDataSource();  

  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort: MatSort;
  @ViewChild('TABLE') table: ElementRef;

  public userData= JSON.parse(sessionStorage.getItem("dataUser")); 
  public Procedimientos = [];
  exportAsExcel(){
      const ws: XLSX.WorkSheet=XLSX.utils.table_to_sheet(this.table.nativeElement);
      const wb: XLSX.WorkBook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

      /* save to file */
      var FechaActual = new Date();
      var DiaActual = this.gQuery.fecha_2b(new Date());
      DiaActual = this.gQuery.fecha_2n(DiaActual);
      
      var a = this.Procedimientos.filter( op => op.Valor ==this.BuscarForm.controls.Reporte.value );
  

      XLSX.writeFile(wb,  DiaActual + "_" + a[0].Texto+ '.xlsx');

    }
  constructor(public gQuery:gQueryService,public dialog: MatDialog, private router:Router, private _snackBar: MatSnackBar) {
    if(this.userData.CodTipo == 0){
      this.Procedimientos = [
        {
          Valor: "rpt_venta_x_cliente", 
          Texto: "Compras por Cliente"
        },
        {
          Valor: "rpt_flujo_caja", 
          Texto: "Flujo de Caja"
        },
        {
            Valor: "rpt_proyeccion_cliente", 
            Texto: "Proyección de clientes"
        },
        {
          Valor: "rpt_ventas_mensual", 
          Texto: "Ventas Mensuales"
        },
    
      ]
    }else{
      this.Procedimientos = [
        {
          Valor: "rpt_venta_x_cliente", 
          Texto: "Compras por Cliente"
        },
        {
            Valor: "rpt_proyeccion_cliente", 
            Texto: "Proyección de clientes"
        }
      ]
    }
    
  }
  
  
  BuscarForm = new FormGroup({
    Reporte: new FormControl("",Validators.required)
  });
if(){
}
  

  ngOnInit() {
  }

  esNumero(valor){
    if(isNaN(valor)){
      return true;
    }else{
      return false;
    }
  }

  CargarReporte(data){
    var target = document.getElementById('cargando_principal');
    target.style.display = "block"
    this.gQuery
    .sql(data.Reporte)
    .subscribe(data =>{
      target.style.display = "none"
      if (data==null){
        this.dataSource=null;
      }else{
        this.dataSource= new MatTableDataSource(<any> data);   
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        this.ColumnasDinamicas =[];
        for (var key in data[0]) { 
          this.ColumnasDinamicas.push(key);
          this.columnsToDisplay = this.ColumnasDinamicas.slice();
         }
      }
    },
    error => {
      target.style.display = "none"
      alert("Error: Ha ocurrido un error, vuelva a intentarlo, si sigue teniendo el mismo problema, coordine con el Administrador")
      // console.log(error)
    }
    );

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

}





