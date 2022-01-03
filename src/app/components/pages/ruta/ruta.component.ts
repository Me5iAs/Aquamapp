import { Component, OnInit, ViewChild } from '@angular/core';
import {FormGroup, FormControl, Validators} from "@angular/forms";
import {MatPaginator} from '@angular/material/paginator';
import {gQueryService} from "../../../services/g-query.service";
import {MatTableDataSource} from '@angular/material/table';
import {MatSort} from '@angular/material/sort';
import { UsuarioI } from 'src/app/models/usuario.interface';
import { Router } from '@angular/router';

@Component({
  selector: 'app-ruta',
  templateUrl: './ruta.component.html',
  styleUrls: ['./ruta.component.css']
})
export class RutaComponent implements OnInit {
  displayedColumns: string[] = [ 'Nro','Cliente','Fecha'];
  dataSource = new MatTableDataSource();  

  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort: MatSort;
  
  public userData: UsuarioI = JSON.parse(sessionStorage.getItem("dataUser"));


  constructor(public gQuery:gQueryService, private router:Router) {}
  
  ngOnInit() {
    this.CargarAsignaciones();
  }

  CargarAsignaciones(){
    var target = document.getElementById('cargando_principal');
    target.style.display = "block"
    
    this.gQuery
    .sql("sp_asignaciones_devolver",this.userData.Id.toString())
    .subscribe(data =>{
      target.style.display = "none"
      if (data==null){
        this.dataSource = new MatTableDataSource();  
      }else{
        this.dataSource= new MatTableDataSource(<any> data);        
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

  onVisitar(Id, Cliente){
    this.router.navigate(["/reg_visita/" + Id + "/" + Cliente]);
    
  }

}

