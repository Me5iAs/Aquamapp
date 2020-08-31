import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import { gQueryService } from "../../../services/g-query.service"
import {MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import {MatPaginator} from '@angular/material/paginator';
import {MatTableDataSource} from '@angular/material/table';
import {MatSort} from '@angular/material/sort';
import {buscarI} from "../../../models/buscar.interface";

@Component({
  selector: 'app-g-buscar',
  templateUrl: './g-buscar.component.html',
  styleUrls: ['./g-buscar.component.styl']
})
export class GBuscarComponent implements OnInit {

  // columnas: string[] = this.data.Columnas.slice();
  displayedColumns: string[] = this.data.Columnas
  dataSource = new MatTableDataSource();
  mostrar = false;
  
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort: MatSort;


  constructor(
    private gQuery: gQueryService,
    public dialogRef: MatDialogRef<GBuscarComponent>,
    @Inject(MAT_DIALOG_DATA) public data:buscarI) {}

  ngOnInit() {
    this.dataSource.sort = this.sort;
  }

  onBuscar() {
    this.mostrar = true;

    this.gQuery
    .buscar(
      this.data.Tabla,
      this.data.Campos.toString(),
      this.data.Criterio,
      this.data.Valor
      )
    .subscribe(data =>{
      this.dataSource= new MatTableDataSource(<any> data);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });
  }

 
  onCancel(): void {
    this.dialogRef.close();
  }
}
