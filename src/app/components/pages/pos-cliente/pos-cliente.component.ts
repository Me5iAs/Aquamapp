import { Component, OnInit, ViewChild} from '@angular/core';
import {gQueryService} from "../../../services/g-query.service";
import { ActivatedRoute, Params } from '@angular/router';
import {MatSnackBar} from '@angular/material/snack-bar'
import {Router} from "@angular/router";
import {MatPaginator} from '@angular/material/paginator';
import {MatTableDataSource} from '@angular/material/table';
import {MatSort} from '@angular/material/sort';

@Component({
  selector: 'app-pos-cliente',
  templateUrl: './pos-cliente.component.html',
  styleUrls: ['./pos-cliente.component.css']
})
export class PosClienteComponent implements OnInit {
  displayedColumns: string[] = ['Nro','Fecha','Bot','Paq','Total'];
  dataSource = new MatTableDataSource();  

  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort: MatSort;

  public NomCli="";

  constructor(
    public gQuery:gQueryService, 
    private router:Router, 
    private _snackBar: MatSnackBar,
    private rutaActiva: ActivatedRoute) {
  }


  ngOnInit() {

    var target = document.getElementById('cargando_principal');
    target.style.display = "block"
    // console.log(this.rutaActiva.snapshot.params.NomCli);
    
    this.NomCli =this.rutaActiva.snapshot.params.NomCli;

    this.gQuery
    .sql("sp_pedidos_cliente", this.rutaActiva.snapshot.params.IdCli )
    .subscribe(data =>{
      target.style.display = "none"
      if (data==null){
        this.dataSource=null;
      }else{
        this.dataSource= new MatTableDataSource(<any> data);
        // console.log(this.dataSource);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        // console.log(this.dataSource.data);
        
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


  onCancelar(){
    this.router.navigate(["/clientes"]);
  }

  onGetData(elem){
    var total = 0;  
    this.dataSource.data.forEach(function (obj) {
      total = total + parseFloat(obj[elem]);
    });
    return total;
    
  }
}
