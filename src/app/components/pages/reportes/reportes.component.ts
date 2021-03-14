import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import {MatPaginator} from '@angular/material/paginator';
import {gQueryService} from "../../../services/g-query.service";
import {MatTableDataSource} from '@angular/material/table';
import {MatSort} from '@angular/material/sort';
import {MatDialog} from '@angular/material/dialog';
import {clienteI} from "../../../models/cliente.interface"
import {MatSnackBar} from '@angular/material/snack-bar'
import { Router } from '@angular/router';

@Component({
  selector: 'app-reportes',
  templateUrl: './reportes.component.html',
  styleUrls: ['./reportes.component.styl']
})
export class ReportesComponent implements OnInit, AfterViewInit {

  displayedColumns: string[] = ['Nombre', 'n_botellones','ultimo_pedido', 'Prox_pedido', 'Pos', 'Estado'];
  // displayedColumns: string[] = ['Nombre', 'n_botellones','ultimo_pedido',  'Prox_pedido', 'Estado'];
  dataSource = new MatTableDataSource();  

  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort: MatSort;

  public cliN:clienteI;
  constructor(public gQuery:gQueryService,public dialog: MatDialog, private router:Router, private _snackBar: MatSnackBar) {
  }

  
  ngOnInit() {
    this.CargarReporte();  
  }

  CargarReporte(){
    var target = document.getElementById('cargando_principal');
    target.style.display = "block"

    this.gQuery
    .sql("rpt_proyeccion_cliente")
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

  onPosCliente(event){
  
    this.router.navigate(["/pos_cli/" + event.Id + "/" + event.Nombre]);
  }   
}

