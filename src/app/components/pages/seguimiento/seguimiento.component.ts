import { Component, OnInit, ViewChild, AfterViewInit, Inject } from '@angular/core';
import {FormGroup, FormControl, Validators} from "@angular/forms";
import {MatPaginator} from '@angular/material/paginator';
// import Swal from 'sweetalert2'
import {gQueryService} from "../../../services/g-query.service";
import {Router} from "@angular/router";
import {DateAdapter, MAT_DATE_FORMATS} from '@angular/material/core';
import { AppDateAdapter, APP_DATE_FORMATS } from "../../format-datepicker";
import {MatTableDataSource} from '@angular/material/table';
import {MatSort} from '@angular/material/sort';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import {movimientoI} from "../../../models/movimiento.interface"
import {MatSnackBar} from '@angular/material/snack-bar';


@Component({
  selector: 'app-seguimiento',
  templateUrl: './seguimiento.component.html',
  styleUrls: ['./seguimiento.component.css'],
  providers: [
    {provide: DateAdapter, useClass: AppDateAdapter},
    {provide: MAT_DATE_FORMATS, useValue: APP_DATE_FORMATS}
  ]
})
export class SeguimientoComponent implements OnInit {
  
  displayedColumns: string[] = ['chk','Fecha', 'Usuario', 'Categoria', 'Monto', 'Info'];
  dataSource = new MatTableDataSource();
  public Categoria = [
    {
      Nombre: "Ingresos",
      Categoria: [] 
    },
    {
      Nombre: "Gastos",
      Categoria: [] 
    },
  ];
  
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort: MatSort;
  public movb:movimientoI;
  public Desde = new Date();
  public Hasta = new Date();
  public filtro = false;
  public IncluyeCajaGeneral = false;
  public Total;
  public EsRoot = false;
  constructor(public gQuery:gQueryService, private router:Router, public dialog: MatDialog) {}
       
      
  cargar_ig(){
  var target = document.getElementById('cargando_principal');
  target.style.display = "block"

   this.gQuery
    .sql("sp_mov_devolver", this.gQuery.fecha_2b(this.Desde) + "|" + this.gQuery.fecha_2b(this.Hasta) + "|" + this.IncluyeCajaGeneral )
    .subscribe(data =>{
      // console.log(data);
      target.style.display = "none"    
      if(data){
        this.dataSource= new MatTableDataSource(<any> data);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        this.Total = 0;
        for(var x=0; x <Object.values(data).length; x++){
          if(data[x].Tipo =='Ingresos'){
            this.Total = Number(this.Total) + Number(data[x].Monto);
          }else{
            this.Total = Number(this.Total) - Number(data[x].Monto);
          }
        }
        this.Total = parseFloat(this.Total).toFixed(2);
        
      }else{        
        this.dataSource= new MatTableDataSource(<any> data);
      }
      
    });
  }

  ngOnInit() {
    var Usu = JSON.parse(sessionStorage.getItem("dataUser"));
    if(Usu.CodTipo=="0"){
      this.EsRoot = true;
    }else{
      this.EsRoot = false;
    }
    

    this.cargar_ig();

    // Cargar categorias
    var target = document.getElementById('cargando_principal');
    target.style.display = "block"
    
    this.gQuery
    .sql("sp_mov_cat_devolver","2")
    .subscribe(data =>{      
      target.style.display = "none"    
      if(data ==null) return;

      var datos:any = data;
      for(var x=0; x <datos.length; x++){
        if(datos[x].Filtro ==1){

          this.Categoria[0].Categoria.push({Id: datos[x].Id, Categoria: datos[x].Categoria});
        }else{
          this.Categoria[1].Categoria.push({Id: datos[x].Id, Categoria: datos[x].Categoria});
        }
      }
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    this.Total = 0;
    for(var x=0; x <Object.values(this.dataSource.filteredData).length; x++){
      console.log(this.dataSource.filteredData[x]["Tipo"] + ". " + this.Total + "="+  Number(this.Total) + " + " + Number(this.dataSource.filteredData[x]["Monto"]));
      if(this.dataSource.filteredData[x]["Tipo"] =='Ingresos'){
        this.Total = Number(this.Total) + Number(this.dataSource.filteredData[x]["Monto"]);
      }else{
        this.Total = Number(this.Total) - Number(this.dataSource.filteredData[x]["Monto"]);
      }
    }
    this.Total = parseFloat(this.Total).toFixed(2);

    // this.Total = this.dataSource.filteredData.map(t => t.duration).reduce((acc, value) => acc + value, 0)

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

}
