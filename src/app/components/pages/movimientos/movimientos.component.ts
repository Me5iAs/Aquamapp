import { Component, OnInit, ViewChild, AfterViewInit, Inject } from '@angular/core';
import {FormGroup, FormControl, Validators} from "@angular/forms";
import {MatPaginator} from '@angular/material/paginator';
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

// dataMov
export class movimientosComponent implements OnInit {
  
  displayedColumns: string[] = ['chk','Fecha', 'Usuario', 'Categoria', 'Monto', 'Info'];
  dataSource = new MatTableDataSource();

  DataEfectivo = new MatTableDataSource();
  DataTransferencia = new MatTableDataSource();
  
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

  @ViewChild('paginatorTransferencia') paginatorTransferencia: MatPaginator;
 
  // @ViewChild(MatSort, {static: true}) sortTransferencia: MatSort;
 
  public movb:movimientoI;
  public Desde = new Date();
  public Hasta = new Date();
  public filtro = false;
  public IncluyeCajaGeneral = false;
  public Total;
  public TotalEfectivo;
  public TotalTrans;
  public EsRoot = false;
  constructor(public gQuery:gQueryService, private router:Router, public dialog: MatDialog) {}
       
      
  cargar_ig(){
  var target = document.getElementById('cargando_principal');
  target.style.display = "block"

   this.gQuery
    .sql("sp_mov_devolver", 
        this.gQuery.fecha_2b(this.Desde) + "|" + 
        this.gQuery.fecha_2b(this.Hasta) + "|" + 
        this.IncluyeCajaGeneral )
    .subscribe(data =>{
      // console.log(data);
      target.style.display = "none"    
      if(data){

        const dataArray = <any[]>data;

        const dataEfectivo = dataArray.filter(item => item.Transferencia == "0");
        const dataTransf = dataArray.filter(item => item.Transferencia == "1");        
        
        this.DataEfectivo = new MatTableDataSource(<any>dataEfectivo);
        this.DataTransferencia = new MatTableDataSource(<any>dataTransf);

        this.DataEfectivo.paginator = this.paginator;
        this.DataEfectivo.sort = this.sort;

        this.DataTransferencia.paginator = this.paginatorTransferencia;
      
        this.TotalEfectivo = dataEfectivo.reduce((total, item) => {
          return item.Tipo === 'Ingresos' 
            ? total + Number(item.Monto) 
            : total - Number(item.Monto);
        }, 0);
        this.TotalEfectivo = parseFloat(this.TotalEfectivo).toFixed(2);

        this.TotalTrans = dataTransf.reduce((total, item) => {
          return item.Tipo === 'Ingresos' 
            ? total + Number(item.Monto) 
            : total - Number(item.Monto);
        }, 0);

        this.TotalTrans = parseFloat(this.TotalTrans).toFixed(2);

/*
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
        */
      }else{
        this.DataTransferencia = new MatTableDataSource([]);
        this.DataEfectivo = new MatTableDataSource([]);
        this.TotalEfectivo = '0.00';
        this.TotalTrans = '0.00';

        // this.dataSource= new MatTableDataSource(<any> data);
      }
      
    });
  }

  ngOnInit() {
    // var Usu = JSON.parse(sessionStorage.getItem("dataUser"));
    // if(Usu.CodTipo=="0"){
    //   this.EsRoot = true;
    // }else{
    //   this.EsRoot = false;
    // }
    
    const Usu = JSON.parse(sessionStorage.getItem("dataUser"));
    this.EsRoot = Usu?.CodTipo === "0";


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

  applyFilter2(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value.trim().toLowerCase();

  // Aplicar filtro a DataEfectivo
  if (this.DataEfectivo) {
    this.DataEfectivo.filter = filterValue;

    // Recalcular TotalEfectivo
    this.TotalEfectivo = 0;
    this.DataEfectivo.filteredData.forEach((item: any) => { // Asegurar que 'item' sea de tipo 'any'
      if (item && item.Tipo === 'Ingresos') { // Verificar que 'item' y 'Tipo' existan
        this.TotalEfectivo += Number(item.Monto);
      } else if (item && item.Tipo === 'Gastos') {
        this.TotalEfectivo -= Number(item.Monto);
      }
    });
    this.TotalEfectivo = parseFloat(this.TotalEfectivo).toFixed(2);

    // Reiniciar paginador si está presente
    if (this.paginator) {
      this.paginator.firstPage();
    }
  }

  // Aplicar filtro a DataTransferencia
  if (this.DataTransferencia) {
    this.DataTransferencia.filter = filterValue;

    // Recalcular TotalTransferencia
    this.TotalTrans = 0;
    this.DataTransferencia.filteredData.forEach((item: any) => { // Asegurar que 'item' sea de tipo 'any'
      if (item && item.Tipo === 'Ingresos') { // Verificar que 'item' y 'Tipo' existan
        this.TotalTrans += Number(item.Monto);
      } else if (item && item.Tipo === 'Gastos') {
        this.TotalTrans -= Number(item.Monto);
      }
    });
    this.TotalTrans = parseFloat(this.TotalTrans).toFixed(2);

    // Reiniciar paginador si está presente
    if (this.paginatorTransferencia) {
      this.paginatorTransferencia.firstPage();
    }
  }
    /*
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    this.Total = 0;
    for(var x=0; x <Object.values(this.dataSource.filteredData).length; x++){
      // console.log(this.dataSource.filteredData[x]["Tipo"] + ". " + this.Total + "="+  Number(this.Total) + " + " + Number(this.dataSource.filteredData[x]["Monto"]));
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
    }*/
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value.trim().toLowerCase();
  
    // Aplicar filtro y recalcular para DataEfectivo
    if (this.DataEfectivo) {
      this.DataEfectivo.filter = filterValue;
      this.calcularTotales(this.DataEfectivo.filteredData, 'Efectivo');
      this.reiniciarPaginador(this.paginator);
    }
  
    // Aplicar filtro y recalcular para DataTransferencia
    if (this.DataTransferencia) {
      this.DataTransferencia.filter = filterValue;
      this.calcularTotales(this.DataTransferencia.filteredData, 'Transferencia');
      this.reiniciarPaginador(this.paginatorTransferencia);
    }
  }

  calcularTotales(filteredData: any[], tipo: 'Efectivo' | 'Transferencia') {
    let total = 0;
    filteredData.forEach(item => {
      if (item && item.Tipo) {
        if (item.Tipo === 'Ingresos') {
          total += Number(item.Monto);
        } else if (item.Tipo === 'Gastos') {
          total -= Number(item.Monto);
        }
      }
    });
  
    // Asignar el total correspondiente según el tipo
    if (tipo === 'Efectivo') {
      this.TotalEfectivo = parseFloat(total.toFixed(2));
    } else if (tipo === 'Transferencia') {
      this.TotalTrans = parseFloat(total.toFixed(2));
    }
  }
  
  // Función para reiniciar el paginador si está presente
  reiniciarPaginador(paginator: MatPaginator | undefined) {
    if (paginator) {
      paginator.firstPage();
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
        CajaGeneral: false,
        Categorias: this.Categoria 
      }  
    }else{
     
      mov.CajaGeneral = mov.CajaGeneral=='0'? false: true ;
      mov.Accion = pAccion;
      
      console.log(mov);
      
    }

    const dialogRef = this.dialog.open(Dialogmovimientos, {
      data: mov,
      // 'min-height': '400px',
      width: '400px'
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
  public Usuarios = []

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

      this.gQuery.sql("sp_usuarios_devolver").subscribe(data =>{
        for(var x = 0; x<Object.values(data).length; x++){
          this.Usuarios.push({
            Id      : data[x].Id,
            Usuario : data[x].Usuario
          })
        }
        // console.log(this.Usuarios)
      });

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
          Glosa: new FormControl("", Validators.required),
          IdRef: new FormControl(""),
          CajaGeneral: new FormControl(false)
        });
      }else{
        var dia = dataMov.Fecha.toString().slice(0,2);
        var mes = dataMov.Fecha.toString().slice(3,5);
        var año = dataMov.Fecha.toString().slice(6,10);
        
        // const cajageneral = this.dataMov.CajaGeneral=='1'? true:false;
        this.MovimientoForm = new FormGroup({
          Id: new FormControl(this.dataMov.Id),
          // Fecha: new FormControl( this.dataMov.Fecha),
          Fecha: new FormControl(new Date(mes + "-" + dia + "-"+año), Validators.required),
          Tipo: new FormControl(this.dataMov.Tipo),
          Monto: new FormControl(this.dataMov.Monto),
          Categoria: new FormControl(this.dataMov.Categoria),
          Glosa: new FormControl(this.dataMov.Glosa),
          Usuario: new FormControl(this.dataMov.Usuario),
          CajaGeneral: new FormControl(this.dataMov.CajaGeneral)
        });
      }
      // console.log(dataMov);
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
      this.dataMov.Id + "|" + JSON.parse(sessionStorage.dataUser).Id
    ).subscribe(res =>{
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

  onCredMov(data:movimientoI){
    if(!confirm("Esta acción eliminará al ingreso y pasará esta operación a una cuenta por cobrar, desea continuar")) {
      return;
    }

    var target = document.getElementById('cargando_principal');
    target.style.display = "block"

    this.gQuery.sql(
      "sp_cred_delete",
      this.dataMov.Id).subscribe(res =>{
        alert(res[0].message);
        target.style.display = "none"
    });

  }

  onNewMov(data){
    let sFecha = new Date(data.Fecha);
    // let dFecha = sFecha.toISOString().split('T')[0];   

    let day = sFecha.getDate()
    let month = sFecha.getMonth() + 1
    let year = sFecha.getFullYear() 
 
    let dFecha = year + "-" + month + "-" + day;

    var target = document.getElementById('cargando_principal');
    target.style.display = "block"
    
    var IdRef = ""

    // si es pago de personal
    if(data.IdCat == '5' ){
      IdRef = data.IdRef;
    }

    // si el gasto está asociado a un vehiculo
    // 6:gasolina, 7:aceite, 9:mtto vehiculo, 17:parchado, 21:repuestos
    if(data.IdCat == 6 || 
      data.IdCat == 7 || 
      data.IdCat == 9 || 
      data.IdCat == 17 || 
      data.IdCat == 21 
      ){
        IdRef = data.IdRefV;
    }

// console.log(data);
// console.log(IdRef);
const cajageneral = data.CajaGeneral==true? '1':'0';

    this.gQuery.sql(
      "sp_mov_registrar",
      dFecha      + "|" + 
      data.IdCat  + "|" + 
      data.Glosa  + "|" + 
      data.Monto  + "|" + 
      JSON.parse(sessionStorage.dataUser).Id + "|"  + 
      IdRef + "|" + 
      cajageneral

      ).subscribe(res =>{
        target.style.display = "none"
        this._snackBar.open(res[0].Message, "ok", {duration: 2000})
        // alert(res[0].Message);
        if(res[0].Estado==1){
          this.dialogRef.close(true);
        }else{
          this._snackBar.open(res[0].Message, "ok", {duration: 2000})
          // alert(res[0].Message)
        }
      }
    );
  }

}
