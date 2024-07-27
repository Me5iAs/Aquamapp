import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { api } from 'src/app/services/g-constantes.service';
import { Chart } from 'chart.js';
import { gQueryService } from 'src/app/services/g-query.service';
import { Router } from '@angular/router';

export interface Seguimiento {
  ClientesActivos     : number;
  MetaClientes        : number;
  CumplimientoClientes: number;
  BonoClientes        : number;
  VentaTotal          : number;
  MetaVentas          : number;
  CumplimientoVenta   : number;
  BonoVentas          : number;
  BonoPlus            : number;
  MontoBonoPlus       : number;
}

@Component({
  selector: 'app-dashbordbono',
  templateUrl: './dashbordbono.component.html',
  styleUrls: ['./dashbordbono.component.css']
})
export class DashbordbonoComponent implements OnInit {



  public ExisteAvatar = false  
  public url_avatar: string;
  public nombreVendedor: string;
  public PeriodosVendedor =[];
  public ChartBonoVenta: any;
  public ChartBonoClientes: any;
  

  PeriodoForm = new FormGroup({
    sel_periodo : new FormControl()
  })
  public Seg: Seguimiento = {
    ClientesActivos     : 0,
    MetaClientes        : 0,
    CumplimientoClientes: 0,
    BonoClientes        : 0,

    VentaTotal          : 0,
    MetaVentas          : 0,
    CumplimientoVenta   : 0,
    BonoVentas          : 0,
    BonoPlus            : 0,
    MontoBonoPlus       : 0
  }

  
  constructor(private gQuery:gQueryService, private router:Router) { }

  ngOnInit(): void {
      this.CargarAvatar();
      this.CargarPeriodos();
      // this.createChart()
  }
  
  CargarAvatar(){
    //establecer el Avatar del Vendedor /v1.2 - 05.05.2024
    let Usu = JSON.parse(sessionStorage.getItem("dataUser"));
    this.nombreVendedor = Usu.Usuario
    this.url_avatar = api.gImagenesClientes + "user_" + Usu.Id + ".jpg";

    fetch( this.url_avatar,{  method: 'HEAD'})
    .then(response => {
      if(response.ok){
        this.ExisteAvatar = true
      }
      else{
        this.ExisteAvatar = false
      }
    });
  }

  CargarPeriodos(){
    let Usu = JSON.parse(sessionStorage.getItem("dataUser"));
    this.gQuery.sql("sp_periodosvendedor_devolver", Usu.Id)
    .subscribe(dataMeta =>{
      for(var x = 0; x<Object.values(dataMeta).length; x++){
        this.PeriodosVendedor.push({
          Id          : dataMeta[x].Id,
          Mes         : dataMeta[x].Mes,
          Ano         : dataMeta[x].Ano,
          Periodo     : this.Periodo(dataMeta[x].Mes, dataMeta[x].Ano)
        });
      }  
      this.PeriodoForm.controls.sel_periodo.setValue(this.PeriodosVendedor[0].Id);
    })
  }

  CargarMetas(){
    let Usu = JSON.parse(sessionStorage.getItem("dataUser"));
    
    // buscar en matriz el Id para determinar dia y mes
    let PeriodoSel = this.PeriodosVendedor.find(e => {
      if(e["Id"] ==  this.PeriodoForm.controls.sel_periodo.value){
        return e;
      }
    });

       
    // cargar venta
    this.gQuery.sql("sp_vendedores_seguimiento", 
       Usu.Id + "|" + PeriodoSel.Mes + "|" + PeriodoSel.Ano
    )
    .subscribe(data =>{

      
      let CumplimientoClientes:number = data[0].ClientesActivos / data[0].MetaClientes;
      let BonoClientes = 0;

      CumplimientoClientes = Number(CumplimientoClientes.toFixed(4));

      if (CumplimientoClientes > 1){
        CumplimientoClientes = 1;
      }

      if(CumplimientoClientes >= 0.8){
         BonoClientes = data[0].BonoClientes * CumplimientoClientes;
      }

      // Bono ventas
      let CumplimientoVenta = data[0].VentasTotales / data[0].MetaVentas;
      let BonoVenta = 0;
      let BonoPlus = 0;
      let MontoBonoPlus = 0;

      CumplimientoVenta = Number(CumplimientoVenta.toFixed(4));
// console.log("algo")
      if(CumplimientoVenta < 0.8){
        BonoPlus = 0;
        BonoVenta = 0;
        MontoBonoPlus = 0;
      }else if (CumplimientoVenta > 1){
        BonoPlus = (data[0].VentasTotales - data[0].MetaVentas) * data[0].BonoPlus;
        BonoPlus = Number(BonoPlus.toFixed(4));
        MontoBonoPlus = Number(data[0].VentasTotales - data[0].MetaVentas);
        CumplimientoVenta = 1;
        BonoVenta = data[0].BonoVentas;
      }else{
        BonoPlus = 0;
        MontoBonoPlus = 0;
        BonoVenta = CumplimientoVenta * data[0].BonoVentas;
      }
      
      
      this.Seg = {
        ClientesActivos     : data[0].ClientesActivos,
        MetaClientes        : data[0].MetaClientes,
        CumplimientoClientes: CumplimientoClientes,
        BonoClientes        : BonoClientes,

        VentaTotal          : data[0].VentasTotales,
        MetaVentas          : data[0].MetaVentas,
        CumplimientoVenta   : CumplimientoVenta,
        BonoVentas          : BonoVenta,
        BonoPlus            : BonoPlus,
        MontoBonoPlus       : MontoBonoPlus
      }

      let colorVenta;

      if(this.Seg.VentaTotal/ this.Seg.MetaVentas >= 0.8){
        colorVenta = '#73EBB1';
      }else if (this.Seg.VentaTotal/ this.Seg.MetaVentas >= 0.5){
        colorVenta = '#EC8A23';
      
      }else{
        colorVenta = '#E74253';
      }

      // construir charts

      let restoV = this.Seg.MetaVentas - this.Seg.VentaTotal;
      if (restoV <0){
        restoV = 0;
      }
      this.ChartBonoVenta = new Chart("ChartBonoVenta", {
        type: 'doughnut',
        options: {
          cutoutPercentage: 80,
          maintainAspectRatio: false,
         } ,
        data: {
          datasets: [{
            data: [ this.Seg.VentaTotal, restoV],
            
            backgroundColor: [
              colorVenta,'#f3f3f3'  
            ]
            
          }]
        }
      })

      let colorCliente;

      if(this.Seg.ClientesActivos/ this.Seg.MetaClientes > 0.5){
        colorCliente = '#73EBB1';
      }else{
        colorCliente = '#E74253';
      }

      let restoC = this.Seg.MetaClientes - this.Seg.ClientesActivos;
      if (restoC <0){
        restoC = 0;
      }

      this.ChartBonoClientes = new Chart("ChartBonoClientes", {
        type: 'doughnut',
        options: {
          cutoutPercentage: 80,
          maintainAspectRatio: false,
         } ,
        data: {
          datasets: [{
            data: [ this.Seg.ClientesActivos,restoC ],
            
            backgroundColor: [
              colorCliente,'#f3f3f3'  
            ]
            
          }]
        }
      })
    })
  }

  irdetalleventa(){
    
    let Usu = JSON.parse(sessionStorage.getItem("dataUser"));
    let DatosPeriodo = this.PeriodosVendedor.find(e => {
      if(e["Id"] ==  this.PeriodoForm.controls.sel_periodo.value){
        return e;
      }
    });
  
    this.router.navigate(["/bonoventadet/" + Usu.Id + "/" + DatosPeriodo.Mes + "/" + DatosPeriodo.Ano  ]);
  }
  irdetalleclientes(){
    // bonoclientesdet
    let Usu = JSON.parse(sessionStorage.getItem("dataUser"));
    let DatosPeriodo = this.PeriodosVendedor.find(e => {
      if(e["Id"] ==  this.PeriodoForm.controls.sel_periodo.value){
        return e;
      }
    });
  
    this.router.navigate(["/bonoclientesdet/" + Usu.Id + "/" + DatosPeriodo.Mes + "/" + DatosPeriodo.Ano  ]);
  }

  Periodo(mes: number, ano:number ){
    let periodo = "";
    switch (Number(mes)) {
      case 1: periodo ="enero " + ano; break;
      case 2: periodo ="febrero " + ano; break;
      case 3: periodo ="marzo " + ano; break;
      case 4: periodo ="abril " + ano; break;
      case 5: periodo ="mayo " + ano; break;
      case 6: periodo ="junio " + ano; break;
      case 7: periodo ="julio " + ano; break;
      case 8: periodo ="agosto " + ano; break;
      case 9: periodo ="septiembre " + ano; break;
      case 10: periodo ="octubre " + ano; break;
      case 11: periodo ="noviembre " + ano; break;
      default: periodo = "diciembre "+ano; break;
    }
    return periodo;

  }
}
