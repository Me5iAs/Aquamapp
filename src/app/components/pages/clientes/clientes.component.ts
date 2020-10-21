import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import {MatPaginator} from '@angular/material/paginator';
import {gQueryService} from "../../../services/g-query.service";
import {DateAdapter, MAT_DATE_FORMATS} from '@angular/material/core';
import { AppDateAdapter, APP_DATE_FORMATS } from "../../format-datepicker";
import {MatTableDataSource} from '@angular/material/table';
import {MatSort} from '@angular/material/sort';
import {MatDialog} from '@angular/material/dialog';
import {clienteI} from "../../../models/cliente.interface"
import {MatSnackBar} from '@angular/material/snack-bar'


@Component({
  selector: 'app-clientes',
  templateUrl: './clientes.component.html',
  styleUrls: ['./clientes.component.styl'],
  providers: [
    {provide: DateAdapter, useClass: AppDateAdapter},
    {provide: MAT_DATE_FORMATS, useValue: APP_DATE_FORMATS}
  ]
})
export class ClientesComponent implements OnInit, AfterViewInit {

  displayedColumns: string[] = ['Clientes', 'Del'];
  dataSource = new MatTableDataSource();  

  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort: MatSort;

  public cliN:clienteI;
  constructor(private gQuery:gQueryService,public dialog: MatDialog, private _snackBar: MatSnackBar) {
  }

  
  ngOnInit() {
    this.CargarClientes();  
  }

  CargarClientes(){
    var target = document.getElementById('cargando_principal');
    target.style.display = "block"
    
    this.gQuery
    .sql("sp_clientes_devolver")
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

 
  
  onDelCliente(event){
    if(event.Id==0){
      this._snackBar.open("No se puede eliminar el cliente anónimo", "ok", {duration: 2000})
      return;

    }
    if(!confirm("Esta acción eliminará al cliente, desea continuar")) {
      return;
    }
    var target = document.getElementById('cargando_principal');
    target.style.display = "block"
    
    this.gQuery
      .sql("sp_cliente_delete",event.Id)
      .subscribe(res =>{
        target.style.display = "none"
        this._snackBar.open("Cliente eliminado con éxito", "ok", {duration: 2000})
        // alert("Cliente eliminado con éxito")
        this.CargarClientes()
      });
  }   
}

