import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import { gQueryService } from "../../../services/g-query.service"
import {MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import {MatPaginator} from '@angular/material/paginator';
import {MatTableDataSource} from '@angular/material/table';
import {MatSort} from '@angular/material/sort';
import {tablaI} from "../../../models/tabla.interface";


@Component({
  selector: 'app-g-mostrar',
  templateUrl: './g-mostrar.component.html',
  styleUrls: ['./g-mostrar.component.styl']
})
export class GMostrarComponent implements OnInit {

  displayedColumns: string[] = this.gTablaData.Columnas
  dataSource = new MatTableDataSource();
  mostrar = false;
  
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort: MatSort;
  
  constructor(
    private gQuery: gQueryService,
    public dialogRef: MatDialogRef<GMostrarComponent>,
    @Inject(MAT_DIALOG_DATA) public gTablaData:tablaI) {}


    ngOnInit() {
      // console.log(this.gTablaData);
      
      this.dataSource.sort = this.sort; 

      this.displayedColumns= this.gTablaData.Columnas;
    
      if(this.gTablaData.Datos || this.gTablaData.Datos!=""){
        var target = document.getElementById('cargando_principal');
        target.style.display = "block"
        
        this.gQuery
        .sql(this.gTablaData.Procedimiento, this.gTablaData.Datos)
        .subscribe(data =>{
          target.style.display = "none"
          this.dataSource= new MatTableDataSource(<any> data);
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
        });
        this.dataSource.sort = this.sort;    
      }else{
        var target = document.getElementById('cargando_principal');
        target.style.display = "block"
        
        this.gQuery
        .sql(this.gTablaData.Procedimiento)
        .subscribe(data =>{
          target.style.display = "none"
          this.dataSource= new MatTableDataSource(<any> data);
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
        });
        this.dataSource.sort = this.sort;
      }
    }
  
   
    onCancel(): void {
      this.dialogRef.close();
    }
}
