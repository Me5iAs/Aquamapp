import { Component, OnInit, ViewChild, Inject } from '@angular/core';
import {FormGroup, FormControl, Validators} from "@angular/forms";
import {MatPaginator} from '@angular/material/paginator';
import {gQueryService} from "../../../services/g-query.service";
import {DateAdapter, MAT_DATE_FORMATS} from '@angular/material/core';
import { AppDateAdapter, APP_DATE_FORMATS } from "../../format-datepicker";
import {MatTableDataSource} from '@angular/material/table';
import {MatSort} from '@angular/material/sort';
import { UsuarioI } from 'src/app/models/usuario.interface';
import { Router } from '@angular/router';

import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import {movimientoI, cantidadesI} from "../../../models/movimiento.interface"
import {MatSnackBar} from '@angular/material/snack-bar';
import { checkServerIdentity } from 'tls';
import { $ } from 'protractor';


@Component({
  selector: 'app-pedidos',
  templateUrl: './pedidos.component.html',
  // templateUrl: './pedidos.component.pug',
  styleUrls: ['./pedidos.component.styl'],
  providers: [
    {provide: DateAdapter, useClass: AppDateAdapter},
    {provide: MAT_DATE_FORMATS, useValue: APP_DATE_FORMATS}
  ]
})



export class PedidosComponent implements OnInit {
  displayedColumns: string[] = [ 'Nro','Cliente','Fecha','Usuario','Borrar'];
  dataSource = new MatTableDataSource();  

  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort: MatSort;
  public Repartidores;
  public Botellones;
  public total_envio:number = 0;
  public total_envio_paq:number = 0;
  public Pedidos_sel = []
  public EsRoot;
  public pedidoparcial = false;
  public numeros = [];
  public checkspedidos: boolean = false;
 
 
  public userData: UsuarioI = JSON.parse(sessionStorage.getItem("dataUser"));
  public SelBot;

  EntregaForm = new FormGroup({
    Cantidad      : new FormControl("", [Validators.pattern("^[0-9]*$"), Validators.required]),
    EstadoPago    : new FormControl("",[Validators.required]),
    Glosa         : new FormControl(" "),
  });

  
  constructor(private gQuery:gQueryService, private router:Router, public dialog: MatDialog) {
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
  EnviarForm = new FormGroup({
    Usuario: new FormControl(),
    Parcial: new FormControl()
  });
  
  ngOnInit() {
    this.CargarPedidos();
   
    var dUser = sessionStorage.getItem("dataUser"); 
    dUser = JSON.parse(dUser); 
    if(dUser["CodTipo"]=="0"){
      this.EsRoot = true;
    }else{
      this.EsRoot = false;
    }

    var target = document.getElementById('cargando_principal');
    target.style.display = "block"

    this.gQuery.sql("sp_repartidores_devolver")
    .subscribe(data =>{
      target.style.display = "none"
      this.Repartidores = data;
    })

    for(var x = 0;x<500; x++ ){
      this.numeros.push(x);
    }
  }

  CargarPedidos(){
    var target = document.getElementById('cargando_principal');
    target.style.display = "block"
    
    this.gQuery
    .sql("sp_pedidos_pendientes_devolver", "0")
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
  
  ngAfterViewInit(){
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }


  onSelPedidoParcial(){
    // console.log(this.dataSource.data);
    this.pedidoparcial =! this.pedidoparcial 
    // console.log(this.Pedidos_sel)
    if(this.pedidoparcial == false){
      this.Pedidos_sel = [];
      var cheks = document.getElementsByClassName("checksel");
      for(var i=0;i<cheks.length;i++){
        
        var chek = cheks[i]  as HTMLInputElement
        chek.classList.remove("mat-checkbox-checked")
        this.total_envio = 0;
        this.total_envio_paq = 0;
      }

    }
    
    // console.log(this.dataSource.data);
  }
 
  onSeleccionar(id, cant, paq, ele){
    // console.log(id, cant, paq, ele)
    // si está chequeando algo.

    // if(this.Pedidos_sel.length == 0 ){
    //   this.total_envio = 0;
    //   this.total_envio_paq = 0;
    // }

    // agregar envio
    if(ele){
      if(this.Pedidos_sel.length == 1 && this.pedidoparcial == true){
        var index = this.dataSource.data.findIndex(obj => obj['Id']==this.Pedidos_sel);
        // console.log(this.dataSource.data);
        this.total_envio = parseInt(this.dataSource.data[index]["Cantidad"]);
        this.total_envio_paq = parseInt(this.dataSource.data[index]["CantidadPaq"]);
        this.pedidoparcial = false;
        const chbox = document.getElementById("cPedParcial") as HTMLInputElement;
        chbox.checked = false;

        // console.log(index);

      }
      this.Pedidos_sel.push(id);
      this.total_envio = this.total_envio + parseInt(cant);
      this.total_envio_paq = this.total_envio_paq + parseInt(isNaN(paq) ? "0" : paq);
    
      // quitar envio
    }else{
      var i = this.Pedidos_sel.indexOf( id );
 
      if ( i !== -1 ) {
        this.Pedidos_sel.splice( i, 1 );
        this.total_envio = this.total_envio - parseInt(cant);
        this.total_envio_paq = this.total_envio_paq - parseInt(paq);

        if(this.Pedidos_sel.length ==0 ){
         
          this.total_envio = 0;
          this.total_envio_paq = 0;
          this.pedidoparcial = false;
          const chbox = document.getElementById("cPedParcial") as HTMLInputElement;
          chbox.checked = false;

          // document.getElementById("cPedParcial").checked = true;
        }
      }

      
    }
    // console.log("pedidos seleccionados: " + this.Pedidos_sel);
    // console.log("botellones a enviar: " + this.total_envio);
    // console.log("paquetes a enviar: " + this.total_envio_paq);
    // console.log("chek pedido parcial: "+ this.pedidoparcial);
    // console.log(this.EnviarForm.controls.Usuario.value);
    
  }

  onDelPedido(Id){
    if(!confirm("Esta acción eliminará el Pedido, desea continuar")) {
      return;
    }

    var target = document.getElementById('cargando_principal');
    target.style.display = "block"


    this.gQuery
      .sql("sp_pedido_delete",Id)
      .subscribe(res =>{
        // console.log(res);
        target.style.display = "none"  
        alert("Pedido eliminado con éxito")
        this.CargarPedidos()
      });
  }

  onEditPedido(mov){
    // aqui me quedé, es para eitar precios de los pedidos
    // console.log(mov);
    const dialogRef = this.dialog.open(Dialogpedidos, {
      data: mov,
      width: '300px'
    });

    dialogRef.afterClosed().subscribe(result => {
      if(result==true){
        this.CargarPedidos();
        // this.cargar_ig();
      }
    });
    
  }

  onEnviarPedido(){

    // si está seleccionado el check de pedido parcial
    if(this.pedidoparcial==true){

      // obtengo el valor total del pedido seleccionado y lo comparo con la cantidad seleccionada
      var t = this.dataSource.data.find(x => x["Id"] == this.Pedidos_sel[0]);


      if(this.total_envio == 0 &&  this.total_envio_paq==0){
        alert("No se puede registrar envio de 0 paquetes y 0 botellones");
        return;
      }

      if(parseInt(t["Cantidad"]) < this.total_envio ){
        // si es mayor muestro mensaje, vuelvo a ponerlo al maximo y termina
        alert("La cantidad de botellones a enviar no puede ser mayor que el total envío");
        this.total_envio  = parseInt(t["Cantidad"]);
        return;
      }

      if(parseInt(t["CantidadPaq"]) < this.total_envio_paq ){
        // si es mayor muestro mensaje, vuelvo a ponerlo al maximo y termina
        alert("La cantidad de paquetes a enviar no puede ser mayor que el total envío");
        this.total_envio_paq  = parseInt(t["CantidadPaq"]);
        return;
      }

      var target = document.getElementById('cargando_principal');
      target.style.display = "block"
      this.gQuery
      .sql("sp_pedidoparcial_enviar",
        this.userData.Id + "|" +
        this.EnviarForm.controls.Usuario.value + "|" + 
        this.Pedidos_sel[0] + "|" + 
        this.total_envio+ "|" +
        this.total_envio_paq
      )
      .subscribe(res =>{
        // console.log(res);
        target.style.display = "none"  
        alert("envio registrado")
        this.total_envio = 0;
        this.total_envio_paq = 0;
        this.Pedidos_sel = [];
        this.CargarPedidos()
        
      });

    }else{
      var target = document.getElementById('cargando_principal');
      target.style.display = "block"
      this.gQuery
      .sql("sp_pedidos_enviar",
      this.userData.Id + "|" +
      this.EnviarForm.controls.Usuario.value + "|" + 
      this.Pedidos_sel.join('-')
      )
      .subscribe(res =>{
        // console.log(res);
        target.style.display = "none"  
        alert("envio registrado")
        this.total_envio = 0;
        this.total_envio_paq = 0;
        this.Pedidos_sel = [];
        this.CargarPedidos()
        
      });
    }
  }

  onGetData(){
    var total = 0;
    if(this.dataSource) {
      this.dataSource.data.forEach(function (obj) {
        if (isNaN(parseFloat(obj["Cantidad"]))){
          total = total + 0;
        }else{
          total = total + parseFloat(obj["Cantidad"]);
        }
      });
    }else{
      total = 0;
    }
    
    return total;
    
  }

  onGetPaq(){
    var total = 0;
    if(this.dataSource) { 
      this.dataSource.data.forEach(function (obj) {
        if (isNaN(parseFloat(obj["CantidadPaq"]))){
          total = total + 0;
        }else{
          total = total + parseFloat(obj["CantidadPaq"]);
        }
      });
    }else{
      total = 0;
    }
    
    return total;
    
  }
  
}



// dialogo pedido

@Component({
  selector: 'dialog-pedidos',
  templateUrl: 'dialog-pedidos.html',
  styleUrls: ['./pedidos.component.styl'],
  providers: [
    {provide: DateAdapter, useClass: AppDateAdapter},
    {provide: MAT_DATE_FORMATS, useValue: APP_DATE_FORMATS}
  ]
})

export class Dialogpedidos implements OnInit{
  CantidadesForm: FormGroup;
  public Botellones;
  public Paquetes;
  public PreciosBot = [];
  public PreciosPaq = [];

  ngOnInit() {
    var target = document.getElementById('cargando_principal');
    target.style.display = "block"

    // cantidad de botellones
    this.Botellones = [
      {Cantidad: 0, Texto: "0 Botellones"},
      {Cantidad: 1, Texto: "1 Botellón"},
    ]
    this.Paquetes = [
      {Cantidad: 0, Texto: "0 Paquetes"},
      {Cantidad: 1, Texto: "1 Paquete"},
    ]
    for (var x=2; x<=500; x++){
      this.Botellones.push({
        Cantidad : x,
        Texto : x + " Botellones"
      });

      this.Paquetes.push({
        Cantidad : x,
        Texto : x + " Paquetes"
      });

    }

    this.CantidadesForm = new FormGroup({
      Id: new FormControl(this.dataMov.Id),
      CantidadBot:  new FormControl( Number(this.dataMov.Cantidad)),
      PrecioBot:    new FormControl(this.dataMov.Precio), 
      CantidadPaq:  new FormControl(Number(this.dataMov.CantidadPaq)),
      PrecioPaq:    new FormControl(this.dataMov.PrecioPaq),
      Comentario:   new FormControl(this.dataMov.Comentario)
    });
    // cargar tarifario de botellones
    this.gQuery.sql("sp_tarifariobot_devolver").subscribe( data =>{
      target.style.display = "none"      
      for(var x = 0; x<Object.values(data).length; x++){
        this.PreciosBot.push({
          Valor: data[x].Valor,
          Texto: data[x].Texto
        });
      } 
    })

    // cargar tarifario de paquetes
    this.gQuery.sql("sp_tarifariopaqcliente_devolver", "0").subscribe( data =>{
      // console.log(data)
      target.style.display = "none"    
      this.PreciosPaq = [];  
      for(var x = 0; x<Object.values(data).length; x++){
        this.PreciosPaq.push({
          Desde: data[x].Min,
          Hasta: data[x].Max,
          Valor: data[x].Precio
        });
      } 
     
    })
   
  }
  
  constructor(
    private gQuery: gQueryService,
    private _snackBar: MatSnackBar,
    public dialogRef: MatDialogRef<Dialogpedidos>,
    @Inject(MAT_DIALOG_DATA) public dataMov) {

      // console.log(dataMov);


    }



    onCancel(): void {
      this.dialogRef.close();
    }


  onUpdateMov(data){

    var target = document.getElementById('cargando_principal');
    target.style.display = "block"
    // console.log(data);
  
    this.gQuery.sql(
      "sp_pedido_actualizar",
        data.Id           + "|" + 
        data.CantidadBot  + "|" + 
        data.PrecioBot    + "|" + 
        data.CantidadPaq  + "|" +
        data.PrecioPaq    + "|" +
        data.Comentario
      ).subscribe(res =>{
        // console.log(res);
        alert(res[0].message);
        target.style.display = "none"
        // this._snackBar.open(res[0].message, "ok", {duration: 2000})
        this.dialogRef.close(true);
    });
  }



}
