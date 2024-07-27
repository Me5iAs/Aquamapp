import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { DateAdapter, MAT_DATE_FORMATS } from '@angular/material/core';
import {MatTableDataSource} from '@angular/material/table';
import { APP_DATE_FORMATS, AppDateAdapter } from '../../format-datepicker';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import { gQueryService } from 'src/app/services/g-query.service';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-bonoclientesdetalle',
  templateUrl: './bonoclientesdetalle.component.html',
  styleUrls: ['./bonoclientesdetalle.component.css'],
  providers: [
    {provide: DateAdapter, useClass: AppDateAdapter},
    {provide: MAT_DATE_FORMATS, useValue: APP_DATE_FORMATS}
  ]
})

export class BonoclientesdetalleComponent implements OnInit {
  displayedColumns: string[] = ['Cliente', 'Bot', 'Paq', 'Activo'];
  dataSource = new MatTableDataSource();  

  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort: MatSort;

  constructor(
    private gQuery:gQueryService,
    public dialog: MatDialog, 
    private router:Router, private rutaActiva: ActivatedRoute) {
  }
  async ngOnInit() {
    this.CargarVentas()

  }

  CargarVentas(){
    
    var target = document.getElementById('cargando_principal');
    target.style.display = "block"
   
    this.gQuery
    .sql("sp_detalle_clientes_vendedor",  
      this.rutaActiva.snapshot.params.IdVendedor +  "|" + 
      this.rutaActiva.snapshot.params.mes + "|" +
      this.rutaActiva.snapshot.params.ano
    )
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

}
