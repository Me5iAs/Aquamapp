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
  selector: 'app-bonoventadetalle',
  templateUrl: './bonoventadetalle.component.html',
  styleUrls: ['./bonoventadetalle.component.css'],
  providers: [
    {provide: DateAdapter, useClass: AppDateAdapter},
    {provide: MAT_DATE_FORMATS, useValue: APP_DATE_FORMATS}
  ]
})

export class BonoventadetalleComponent implements OnInit {
  displayedColumns: string[] = ['Cliente', 'Venta'];
  dataSource = new MatTableDataSource();  
  DetalleCliente = new MatTableDataSource()
  public DataDesp
  ColumnasDetalleCliente: string[] = ['Fecha', 'Bot','Paq', 'Soles'];

  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort: MatSort;

  constructor(
    public gQuery:gQueryService,
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
    .sql("sp_detalle_venta_cliente",  
      this.rutaActiva.snapshot.params.IdVendedor +  "|" + 
      this.rutaActiva.snapshot.params.mes + "|" +
      this.rutaActiva.snapshot.params.ano
    )
    .subscribe(data =>{
  
      target.style.display = "none"
      if (data==null){
        this.DataDesp=null;
      }else{
        this.DataDesp = data;
      }
    });
  }

  CargarDetalle(item){
    this.DetalleCliente = new MatTableDataSource();
    if(item.Venta==0){
      return;
    }
    var target = document.getElementById('l' + item.Id);

    if(item.Venta==0){
      target.style.display = "none"
      return;
    }

    target.style.display = "block"

    this.gQuery
    .sql("sp_cartera_cliente_devolver", item.Id + "|" + this.rutaActiva.snapshot.params.mes + "|" + this.rutaActiva.snapshot.params.ano )
    .subscribe(data =>{
      target.style.display = "none"
      this.DetalleCliente= new MatTableDataSource(<any> data);
      
    }); 
  }

  CargarVentas2(){
    
    var target = document.getElementById('cargando_principal');
    target.style.display = "block"
   
    this.gQuery
    .sql("sp_detalle_venta_cliente",  
      this.rutaActiva.snapshot.params.IdVendedor +  "|" + 
      this.rutaActiva.snapshot.params.mes + "|" +
      this.rutaActiva.snapshot.params.ano
    )
    .subscribe(data =>{
      // alert("A");
      // console.log(data);
      
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

  getTotalCost() {
    let data = this.dataSource.data.reduce((datum = 0, val) => 
      datum = Number(datum) + Number(val['Venta']), 0);
    return data;
    
    // players = STATS.slice();
    // return this.dataSource. .reduce((accum, curr) => accum + curr.goals, 0);
    // return  this.dataSource.  map(t => t.cost).reduce((acc, value) => acc + value, 0);
  }

}
