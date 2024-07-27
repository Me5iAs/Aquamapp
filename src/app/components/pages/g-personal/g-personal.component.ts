import { Component, OnInit, ViewChild, AfterViewInit, Inject } from '@angular/core';
import {FormGroup, FormControl, Validators} from "@angular/forms";
import {MatPaginator} from '@angular/material/paginator';
import {gQueryService} from "../../../services/g-query.service";
import { Router } from '@angular/router';
import {DateAdapter, MAT_DATE_FORMATS} from '@angular/material/core';
import { AppDateAdapter, APP_DATE_FORMATS } from "../../format-datepicker";
import {MatTableDataSource} from '@angular/material/table';
import {MatSort} from '@angular/material/sort';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import {MatSnackBar} from '@angular/material/snack-bar'

import {UsuarioI} from "../../../models/usuario.interface"

@Component({
  selector: 'app-g-personal',
  templateUrl: './g-personal.component.html',
  styleUrls: ['./g-personal.component.css'],
  providers: [
    {provide: DateAdapter, useClass: AppDateAdapter},
    {provide: MAT_DATE_FORMATS, useValue: APP_DATE_FORMATS}
  ]
})
export class GPersonalComponent implements OnInit {

 
 // TAB ASISTENCIA
  ColumnasAsistencia: string[] = ["Usuario", "TM", "TMIngreso", "TMSalida", "TMHextra", "TT", "TTIngreso", "TTSalida", "TTHextra"]
  dataAsistencia = new MatTableDataSource();
  
  // TAB SEGUIMIENTOS
  ColumnasSeguimiento: string[] = ["Usuario", "Basico", "Otros", "Descuentos", "Adelantos", "Total"];
  dataSeguimientos = new MatTableDataSource();
   // TAB COLABORADORES
  displayedColumns: string[] = ['Usuario', 'Tipo','Nombre', 'FechaNac', 'Telefono', 'Direccion', 'FechaInicio', 'Pos','Del'];
  dataSource = new MatTableDataSource();  

  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort: MatSort;
  public usuI:UsuarioI;
  public PlanillaMes;

  // public cliN:clienteI;
  public EsRoot = false;

  constructor(
    private gQuery:gQueryService,
    public dialog: MatDialog, 
    private router:Router, 
    private _snackBar: MatSnackBar) {
  }

  date = new Date();


  BuscarAsistenciaForm = new FormGroup({
    FechaAsist : new FormControl(this.date, Validators.required)
  });

  CargaSeguimientoForm = new FormGroup({
    Mes: new FormControl(this.date.getMonth() + 1, Validators.required),
    Ano: new FormControl(this.date.getFullYear(), Validators.required)
  });

  
  ngOnInit() {
    var Usu = JSON.parse(sessionStorage.getItem("dataUser"));
    if(Usu.CodTipo=="0"){
      this.EsRoot = true;
    }else{
      this.EsRoot = false;
    }

    this.cargarAsistencia();
    this.cargarSeguimiento();
    this.cargarColaboradores();  
    
  }

  AfterViewInit(){


    // document.getElementsByClassName("mat-sort-header-container")
  }


  // GENERALES
  Tipo2Cargo(a){
    // 0 Root, 1 Admin, 2 Representante de Ventas, 3 Repartidor, 4 asistente de control, 5 operador de planta
    if(a=="0"){return "Root";}
    if(a=="1"){return "Administrador";}
    if(a=="2"){return "Representante de Ventas";}
    if(a=="3"){return "Repartidor";}
    if(a=="4"){return "Asistente de Control";}
    if(a=="5"){return "Operador de Planta";}
  } 



  // TAB ASISTENCIA
  cargarAsistencia(){
    var target = document.getElementById('cargando_principal');
    target.style.display = "block"
    this.dataAsistencia = null
    this.gQuery
    .sql("sp_asistencia_devolver", this.gQuery.fecha_2b(this.BuscarAsistenciaForm.controls.FechaAsist.value)  )
    .subscribe(data =>{
      target.style.display = "none"
      if (data==null){
        this.dataAsistencia=null;
      }else{
        this.dataAsistencia= new MatTableDataSource(<any> data);
        this.dataAsistencia.paginator = this.paginator;
        this.dataAsistencia.sort = this.sort;
      }
    });
  }

  onActualizarCampoAsistencia(Id, Campo, Valor){
    var newVal = String(Valor);
    if(newVal==="True" || newVal ==="true") {
      newVal = "1"}

    if(newVal==="False" || newVal ==="false") {
      newVal = "0"}
    
    var MiSql = "asistencia" + "|" + Campo + "|" + newVal + "|" + "Id=" + Id; 
    // console.log(MiSql)
    this.gQuery.sql("sp_actualizarcampo", MiSql).subscribe();
  }

  desactivarText(Id, turno, valor){
    if(valor ==false){
        document.getElementById(turno+'inicio'+Id).setAttribute("disabled","disabled");
        document.getElementById(turno+'salida'+Id).setAttribute("disabled","disabled");
        document.getElementById(turno+'extra'+Id).setAttribute("disabled","disabled");

        // actualizar los campos dependiendo del turno
        if(turno =="m"){
          var MiSql = "asistencia" + "|TM_Ingreso|''|"+  "Id=" + Id;
          this.gQuery.sql("sp_actualizarcampo", MiSql).subscribe();

          var MiSql = "asistencia" + "|TM_Salida|''|"+  "Id=" + Id;
          this.gQuery.sql("sp_actualizarcampo", MiSql).subscribe(); 

          var MiSql = "asistencia" + "|TM_Extra|''|"+  "Id=" + Id;
          this.gQuery.sql("sp_actualizarcampo", MiSql).subscribe(); 

        }else{
          var MiSql = "asistencia" + "|TT_Ingreso|''|"+  "Id=" + Id;
          this.gQuery.sql("sp_actualizarcampo", MiSql).subscribe();
          
          var MiSql = "asistencia" + "|TT_Salida|''|"+  "Id=" + Id;
          this.gQuery.sql("sp_actualizarcampo", MiSql).subscribe(); 

          var MiSql = "asistencia" + "|TT_Extra|''|"+  "Id=" + Id;
          this.gQuery.sql("sp_actualizarcampo", MiSql).subscribe(); 
        }

        (document.getElementById(turno+'salida'+Id) as HTMLInputElement).value = "";
        (document.getElementById(turno+'inicio'+Id) as HTMLInputElement).value = "";
        (document.getElementById(turno+'extra'+Id) as HTMLInputElement).value = "";
     } else {
        document.getElementById(turno+'inicio'+Id).removeAttribute("disabled");
        document.getElementById(turno+'salida'+Id).removeAttribute("disabled");
        document.getElementById(turno+'extra'+Id).removeAttribute("disabled");
     }

  }

  toCheck(dato){
    if(dato =="1"){
      return true;
    }else{
      return false;
    }
  }


  // TAB SEGUIMIENTO
  cargarSeguimiento(){
    
    var target = document.getElementById('cargando_principal');
    target.style.display = "block"
    this.dataSeguimientos = null
    this.gQuery
    .sql("sp_planilla_devolver", this.CargaSeguimientoForm.controls.Mes.value + "|" + this.CargaSeguimientoForm.controls.Ano.value)
    .subscribe(data =>{
      target.style.display = "none"
      if (data==null){
        this.dataSeguimientos=null;
      }else{
        this.dataSeguimientos= new MatTableDataSource(<any> data);
        this.dataSeguimientos.paginator = this.paginator;
        this.dataSeguimientos.sort = this.sort;
        this.SumarColumnaSeguimiento()

      }
    });
  }
  
  SumarColumnaSeguimiento(){
    var total = 0;
    for(var x = 0; x<Object.values(this.dataSeguimientos.data).length; x++){
      // console.log(this.dataSeguimientos.data[x]["Total"])
      total = total + parseFloat(this.dataSeguimientos.data[x]["Total"]);
    }
    this.PlanillaMes = total;
    
  }

  infoPlanilla(IdUsuario, tipo){
    if(tipo=="d"){
      
    }else{

    }
  }

  

  // TAB COLABORADORES
    cargarColaboradores(){
      var target = document.getElementById('cargando_principal');
      target.style.display = "block"
      
      this.gQuery
      .sql("sp_usuarios_devolver")
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

  

    applyFilter(event: Event) {
      const filterValue = (event.target as HTMLInputElement).value;
      this.dataSource.filter = filterValue.trim().toLowerCase();

      if (this.dataSource.paginator) {
        this.dataSource.paginator.firstPage();
      }
    }
    
    // Editar usuario
    // onEditUsuario(event){
    // }  

    onDelUsuario(event){

      if(!confirm("Esta acción eliminará al colaborador, ¿desea continuar")) {
        return;
      }

      var target = document.getElementById('cargando_principal');
      target.style.display = "block"
      
      this.gQuery
        .sql("sp_usuario_delete",event.Id)
        .subscribe(res =>{
          target.style.display = "none"
          this._snackBar.open("Usuario eliminado con éxito", "ok", {duration: 2000})
          // alert("Cliente eliminado con éxito")
          this.cargarColaboradores()
        });
    }  

    onModalUsuario(usu:UsuarioI, pAccion:"Nuevo" | "Edit"){
      // console.log(usu);
      
      if(pAccion =="Nuevo"){
        usu = <UsuarioI> {
          Id: 0,
          Usuario: "",
          Clave: "",
          Tipo: "",
          CodTipo: "",
          Nombre: "",
          FechaNac: "",
          Telefono: "",
          Direccion: "",
          FechaInicio: "",
          Accion: "Nuevo"
        }  
      }else{
        usu.Accion = pAccion;
        // console.log(usu);
        
      }

      const dialogRef = this.dialog.open(DialogUsuario, {
        data: usu,
        width: '300px'
      });

      dialogRef.afterClosed().subscribe(result => {
        if(result==true){
          this.cargarColaboradores();
        }
      });
    }


}


@Component({
  selector: 'dialog-edit-user',
  templateUrl: 'dialog-edit-user.html',
  styleUrls: ['./g-personal.component.css'],
  providers: [
    {provide: DateAdapter, useClass: AppDateAdapter},
    {provide: MAT_DATE_FORMATS, useValue: APP_DATE_FORMATS}
  ]
})

export class DialogUsuario implements OnInit{
  UsuarioForm: FormGroup;

  ngOnInit(): void {}
  public EsRoot = false;
  public hoy;
  public TiposUsuario =[]

  constructor(
    private gQuery: gQueryService,
    private _snackBar: MatSnackBar,
    public dialogRef: MatDialogRef<DialogUsuario>,
    @Inject(MAT_DIALOG_DATA) public dataUsu: UsuarioI) {

      var Usu = JSON.parse(sessionStorage.getItem("dataUser"));
      if(Usu.CodTipo=="0"){
        this.EsRoot = true;
      }else{
        this.EsRoot = false;
      }
      
      // 0 Root, 1 Admin, 2 Representante de Ventas, 3 Repartidor, 4 asistente de control, 5 operador de planta

      this.TiposUsuario.push({Valor: "0",Texto: "Root"});
      this.TiposUsuario.push({Valor: "1",Texto: "Administrador"});
      this.TiposUsuario.push({Valor: "2",Texto: "Representante de Ventas"});
      this.TiposUsuario.push({Valor: "3",Texto: "Repartidor"});
      this.TiposUsuario.push({Valor: "4",Texto: "Asistente de Control"});
      this.TiposUsuario.push({Valor: "5",Texto: "Operador de Planta"});
      
      let sFechaNac = new Date(gQuery.fecha_2datapicker(this.dataUsu.FechaNac) + "T00:00:00");
      let sFechaIni = new Date(gQuery.fecha_2datapicker(this.dataUsu.FechaInicio) + "T00:00:00")

      if(dataUsu.Accion == "Edit"){
        this.UsuarioForm = new FormGroup({
          Id:           new FormControl(this.dataUsu.Id),
          Usuario:      new FormControl(this.dataUsu.Usuario,Validators.required),
          Tipo:         new FormControl(this.dataUsu.Tipo, Validators.required),
          Nombre:       new FormControl(this.dataUsu.Nombre, Validators.required),
          FechaNac:     new FormControl(sFechaNac, Validators.required),
          Telefono:     new FormControl(this.dataUsu.Telefono, Validators.required),
          Direccion:    new FormControl(this.dataUsu.Direccion, Validators.required),
          FechaInicio:  new FormControl(sFechaIni, Validators.required)
        });
      }else{
        this.UsuarioForm = new FormGroup({
          Usuario:      new FormControl("",Validators.required),
          Tipo:         new FormControl("", Validators.required),
          Nombre:       new FormControl("", Validators.required),
          FechaNac:     new FormControl("", Validators.required),
          Telefono:     new FormControl("", Validators.required),
          Direccion:    new FormControl("", Validators.required),
          FechaInicio:  new FormControl("", Validators.required)
        });
      }
    }
    




  onCancel(): void {
    this.dialogRef.close();
  }

  onUpdateUsu(data: UsuarioI){
    // console.log(data);
    // return;
    
    let sFechaNac = new Date(data.FechaNac);
    // let dFechaNac = sFechaNac.toISOString().split('T')[0];   
  
      let diaFechaNac = sFechaNac.getDate()
      let MesFechaNac = sFechaNac.getMonth() + 1
      let AnoFechaNac = sFechaNac.getFullYear() 
      let dFechaNac = AnoFechaNac + "-" + MesFechaNac + "-" + diaFechaNac;


      let sFechaInicio = new Date(data.FechaInicio);
      // let dFechaInicio = sFechaInicio.toISOString().split('T')[0];   
    
        let diaFechaInicio = sFechaInicio.getDate()
        let MesFechaInicio = sFechaInicio.getMonth() + 1
        let AnoFechaInicio = sFechaInicio.getFullYear() 
        let dFechaInicio = AnoFechaInicio + "-" + MesFechaInicio + "-" + diaFechaInicio;

    var target = document.getElementById('cargando_principal');
    target.style.display = "block"  

    this.gQuery.sql(
      "sp_usuario_update",
      data.Id         + "|" + 
      data.Usuario    + "|" + 
      data.Tipo       + "|" + 
      data.Nombre     + "|" +
      dFechaNac       + "|" +
      data.Telefono   + "|" +
      data.Direccion  + "|" +
      dFechaInicio
      ).subscribe(res =>{
        alert(res[0].Message);
        target.style.display = "none"
        this.dialogRef.close(true);
    });
  }

  onNewMov(data:UsuarioI){
    // let sFecha = new Date(data.Fecha);
    // let dFecha = sFecha.toISOString().split('T')[0];   

    // let day = sFecha.getDate()
    // let month = sFecha.getMonth() + 1
    // let year = sFecha.getFullYear() 
 
    // let dFecha = year + "-" + month + "-" + day;

    var target = document.getElementById('cargando_principal');
    target.style.display = "block"
        
    // this.gQuery.sql(
    //   "sp_mov_registrar",
    //   dFecha      + "|" + 
    //   data.IdCat  + "|" + 
    //   data.Glosa  + "|" + 
    //   data.Monto  + "|" + 
    //   JSON.parse(sessionStorage.dataUser).Id 
    //         + "|"  
    //   ).subscribe(res =>{
    //     target.style.display = "none"
    //     this._snackBar.open(res[0].message, "ok", {duration: 2000})
    //     // alert(res[0].Message);
    //     if(res[0].Estado==1){
    //       this.dialogRef.close(true);
    //     }else{
    //       this._snackBar.open(res[0].message, "ok", {duration: 2000})
    //       // alert(res[0].Message)
    //     }
    //   }
    // );
  }

}
