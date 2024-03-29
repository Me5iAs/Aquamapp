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
  selector: 'app-movimientos',
  templateUrl: './movimientos.component.html',
  styleUrls: ['./movimientos.component.styl'],
  providers: [
    {provide: DateAdapter, useClass: AppDateAdapter},
    {provide: MAT_DATE_FORMATS, useValue: APP_DATE_FORMATS}
  ]
})

// 
export class movimientosComponent implements OnInit {
  
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

  onModalMovimiento(mov:movimientoI, pAccion:"Nuevo" | "Info"){
    var dia, mes, año;
    if(pAccion =="Nuevo"){
      dia = new Date().getDate();
      mes = new Date().getMonth()+1;
      año = new Date().getFullYear();

      mov = <movimientoI> {
        Id: "",
        Fecha: new Date(mes + "-" + dia + "-"+año),
        Usuario: "",
        IdCat:"",
        Categoria: "",
        Glosa: "",
        Tipo:"",
        Monto: 0,
        Accion: "Nuevo",
        Categorias: this.Categoria 
      }  
    }else{
      mov.Accion = pAccion;
      console.log(mov);
      
    }

    const dialogRef = this.dialog.open(Dialogmovimientos, {
      data: mov,
      width: '300px'
    });

    dialogRef.afterClosed().subscribe(result => {
      if(result==true){
        this.cargar_ig();
      }
    });
  }
}


@Component({
  selector: 'dialog-movimientos',
  templateUrl: 'dialog-movimientos.html',
  styleUrls: ['./movimientos.component.styl'],
  providers: [
    {provide: DateAdapter, useClass: AppDateAdapter},
    {provide: MAT_DATE_FORMATS, useValue: APP_DATE_FORMATS}
  ]
})

export class Dialogmovimientos implements OnInit{
  MovimientoForm: FormGroup;

  ngOnInit(): void {}
  public EsRoot = false;
  public hoy;

  constructor(
    private gQuery: gQueryService,
    private _snackBar: MatSnackBar,
    public dialogRef: MatDialogRef<Dialogmovimientos>,
    @Inject(MAT_DIALOG_DATA) public dataMov: movimientoI) {

      var Usu = JSON.parse(sessionStorage.getItem("dataUser"));
      if(Usu.CodTipo=="0"){
        this.EsRoot = true;
      }else{
        this.EsRoot = false;
      }

      let date = new Date()

      let day = date.getDate()
      let month = date.getMonth() + 1
      let year = date.getFullYear()
      
      if(month < 10){
        this.hoy = `${day}/0${month}/${year}`;
      }else{
        this.hoy = `${day}/${month}/${year}`;
      }
      
      if(dataMov.Accion == "Nuevo"){
        this.MovimientoForm = new FormGroup({
          Fecha: new FormControl( this.dataMov.Fecha,Validators.required),
          // Monto: new FormControl("", [Validators.pattern("^[0-9]*$"), Validators.required]),
          Monto: new FormControl("", [Validators.pattern(/^\d+\.\d{2}$/), Validators.required]),
          IdCat: new FormControl("", Validators.required),
          Glosa: new FormControl("", Validators.required)
        });
      }else{
        var dia = dataMov.Fecha.toString().slice(0,2);
        var mes = dataMov.Fecha.toString().slice(3,5);
        var año = dataMov.Fecha.toString().slice(6,10);
        

        this.MovimientoForm = new FormGroup({
          Id: new FormControl(this.dataMov.Id),
          // Fecha: new FormControl( this.dataMov.Fecha),
          Fecha: new FormControl(new Date(mes + "-" + dia + "-"+año), Validators.required),
          Tipo: new FormControl(this.dataMov.Tipo),
          Monto: new FormControl(this.dataMov.Monto),
          Categoria: new FormControl(this.dataMov.Categoria),
          Glosa: new FormControl(this.dataMov.Glosa),
          Usuario: new FormControl(this.dataMov.Usuario)
        });
      }
      console.log(dataMov);
    }
    




    onCancel(): void {
    this.dialogRef.close();
  }

  onDelMov(data: movimientoI){
    if(!confirm("Esta acción eliminará al movimiento, desea continuar")) {
      return;
    }

    var target = document.getElementById('cargando_principal');
    target.style.display = "block"

    this.gQuery.sql(
      "sp_mov_delete",
      this.dataMov.Id).subscribe(res =>{
        alert(res[0].message);
        target.style.display = "none"
        // this._snackBar.open(res[0].message, "ok", {duration: 2000})
        // this.dialogRef.close(true);
    });
  }

  onUpdateMov(data: movimientoI){
    let sFecha = new Date(data.Fecha);
    // let dFecha = sFecha.toISOString().split('T')[0];   
  
      let day = sFecha.getDate()
      let month = sFecha.getMonth() + 1
      let year = sFecha.getFullYear() 
      let dFecha = year + "-" + month + "-" + day;

    var target = document.getElementById('cargando_principal');
    target.style.display = "block"

    this.gQuery.sql(
      "sp_mov_update",
      data.Id + "|" + dFecha + "|" + data.Monto + "|" + data.Glosa
      ).subscribe(res =>{
        alert(res[0].Message);
        target.style.display = "none"
        // this._snackBar.open(res[0].message, "ok", {duration: 2000})
        this.dialogRef.close(true);
    });
  }

  onNewMov(data:movimientoI){
    let sFecha = new Date(data.Fecha);
    // let dFecha = sFecha.toISOString().split('T')[0];   

    let day = sFecha.getDate()
    let month = sFecha.getMonth() + 1
    let year = sFecha.getFullYear() 
 
    let dFecha = year + "-" + month + "-" + day;

    var target = document.getElementById('cargando_principal');
    target.style.display = "block"
        
    this.gQuery.sql(
      "sp_mov_registrar",
      dFecha      + "|" + 
      data.IdCat  + "|" + 
      data.Glosa  + "|" + 
      data.Monto  + "|" + 
      JSON.parse(sessionStorage.dataUser).Id 
            + "|"  
      ).subscribe(res =>{
        target.style.display = "none"
        this._snackBar.open(res[0].message, "ok", {duration: 2000})
        // alert(res[0].Message);
        if(res[0].Estado==1){
          this.dialogRef.close(true);
        }else{
          this._snackBar.open(res[0].message, "ok", {duration: 2000})
          // alert(res[0].Message)
        }
      }
    );
  }

}
