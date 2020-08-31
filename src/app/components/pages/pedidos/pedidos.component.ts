import { Component, OnInit, ViewChild } from '@angular/core';
import {FormGroup, FormControl, Validators} from "@angular/forms";
import {MatPaginator} from '@angular/material/paginator';
import {gQueryService} from "../../../services/g-query.service";
import {DateAdapter, MAT_DATE_FORMATS} from '@angular/material/core';
import { AppDateAdapter, APP_DATE_FORMATS } from "../../format-datepicker";
import {MatTableDataSource} from '@angular/material/table';
import {MatSort} from '@angular/material/sort';
import { UsuarioI } from 'src/app/models/usuario.interface';
import { Router } from '@angular/router';



@Component({
  selector: 'app-pedidos',
  templateUrl: './pedidos.component.html',
  styleUrls: ['./pedidos.component.styl'],
  providers: [
    {provide: DateAdapter, useClass: AppDateAdapter},
    {provide: MAT_DATE_FORMATS, useValue: APP_DATE_FORMATS}
  ]
})


export class PedidosComponent implements OnInit {
  displayedColumns: string[] = ['Cliente','Borrar'];
  dataSource = new MatTableDataSource();  

  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort: MatSort;

  public Botellones;
  public userData: UsuarioI = JSON.parse(sessionStorage.getItem("dataUser"));

  EntregaForm = new FormGroup({
    Cantidad      : new FormControl("", [Validators.pattern("^[0-9]*$"), Validators.required]),
    EstadoPago    : new FormControl("",[Validators.required]),
    Glosa         : new FormControl(" "),
    
  });

  
  constructor(private gQuery:gQueryService, private router:Router) {
    this.Botellones = [
      {Cantidad: 1, Texto: "1 Botellón"},
    ]
    for (var x=2; x<=30; x++){
      this.Botellones.push({
        Cantidad : x,
        Texto : x + " Botellones"
      })
    }
  }

  
  ngOnInit() {
    this.CargarPedidos();  
  }

  CargarPedidos(){
    this.gQuery
    .sql("sp_pedidos_pendientes_devolver")
    .subscribe(data =>{
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

  onAtenderPedido(Id){
    console.log(this.userData.CodTipo);
    
    if(this.userData.CodTipo =='2'){
      return;
    }else{
      this.router.navigate(["/atencion/" + Id]);
    }
    
  }

  onDelPedido(Id){
    if(!confirm("Esta acción eliminará el Pedido, desea continuar")) {
      return;
    }

    this.gQuery
      .sql("sp_pedido_delete",Id)
      .subscribe(res =>{
        // console.log(res);
        
        alert("Pedido eliminado con éxito")
        this.CargarPedidos()
      });
  }   
}

