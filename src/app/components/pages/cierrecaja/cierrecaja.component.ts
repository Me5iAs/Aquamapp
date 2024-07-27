import { Component, OnInit, ViewChild, AfterViewInit, Inject } from '@angular/core';
import {FormGroup, FormControl, Validators} from "@angular/forms";
import {MatPaginator} from '@angular/material/paginator';
import {gQueryService} from "../../../services/g-query.service";
import {Router} from "@angular/router";
import {DateAdapter, MAT_DATE_FORMATS} from '@angular/material/core';
import { AppDateAdapter, APP_DATE_FORMATS } from "../../format-datepicker";
import {MatSort} from '@angular/material/sort';

@Component({
  selector: 'app-cierrecaja',
  templateUrl: './cierrecaja.component.html',
  styleUrls: ['./cierrecaja.component.css'],
  providers: [
    {provide: DateAdapter, useClass: AppDateAdapter},
    {provide: MAT_DATE_FORMATS, useValue: APP_DATE_FORMATS}
  ]
})
export class CierrecajaComponent implements OnInit {
  CuadreForm: FormGroup;

  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort: MatSort;

  public onConteo = true;
  public cuadrehecho = true;
  public resumen = [];
  public DatosCierre = [];
  public EsRoot = false;
  public TotalOperacion = 0;
  public TotalConteo = 0;
  
  constructor(public gQuery:gQueryService, private router:Router) {}
           
  ngOnInit() {
    var Usu = JSON.parse(sessionStorage.getItem("dataUser"));

    this.EsRoot = Usu.CodTipo === "0" || Usu.CodTipo === "1";
    this.VerificarCierre();

    // movimiento form
    this.CuadreForm = new FormGroup({
      s200: new FormControl(0, [Validators.pattern(/^\d+\.\d{2}$/), Validators.required]),
      s100: new FormControl(0, [Validators.pattern(/^\d+\.\d{2}$/), Validators.required]),
      s50: new FormControl(0, [Validators.pattern(/^\d+\.\d{2}$/), Validators.required]),
      s20: new FormControl(0, [Validators.pattern(/^\d+\.\d{2}$/), Validators.required]),
      s10: new FormControl(0, [Validators.pattern(/^\d+\.\d{2}$/), Validators.required]),
      s5: new FormControl(0, [Validators.pattern(/^\d+\.\d{2}$/), Validators.required]),
      s2: new FormControl(0, [Validators.pattern(/^\d+\.\d{2}$/), Validators.required]),
      s1: new FormControl(0, [Validators.pattern(/^\d+\.\d{2}$/), Validators.required]),
      s050: new FormControl(0, [Validators.pattern(/^\d+\.\d{2}$/), Validators.required]),
      s020: new FormControl(0, [Validators.pattern(/^\d+\.\d{2}$/), Validators.required]),
      s010: new FormControl(0, [Validators.pattern(/^\d+\.\d{2}$/), Validators.required]),
    
    });
  }

  VerificarCierre(){
    var target = document.getElementById('cargando_principal');
    target.style.display = "block"

    this.gQuery.sql("sp_cuadre_existe_devolver").subscribe(data =>{
      target.style.display = "none"
        
      this.cuadrehecho = data !== null;
      if (this.cuadrehecho) {
        this.DatosCierre = [{
          Fecha: data[0].Fecha,
          Hora: data[0].Hora,
          Operaciones: data[0].Operaciones,
          Conteo: data[0].Conteo,
          Diferencia: data[0].Diferencia,
          Usuario: data[0].Usuario
        }];
      }       
    });
  }

  onRevertirCierre() {
    const target = document.getElementById('cargando_principal');
    target.style.display = "block";

    this.gQuery.sql("sp_cuadre_revertir").subscribe(() => {
      target.style.display = "none";
      alert("Se ha revertido el cierre del día de hoy");
      location.reload();
    });
  }

  onRegistrarConteo2(data){
    if (!confirm("Esta opción generará el cierre del día, lo que implica lo siguiente: a) No se podrán registrar nuevas entradas o salidas de dinero en este día, b) en caso de faltantes generará un descuento automático en forma de adelanto para el operador de control. ¿Desea continuar?")) {
      return;
    }

    this.onConteo = false;
    const target = document.getElementById('cargando_principal');
    target.style.display = "block";
    const Usu = JSON.parse(sessionStorage.getItem("dataUser"));

 
    this.TotalConteo = 
    this.CuadreForm.controls.s200.value * 200 + 
    this.CuadreForm.controls.s100.value * 100 + 
    this.CuadreForm.controls.s50.value * 50 + 
    this.CuadreForm.controls.s20.value * 20 + 
    this.CuadreForm.controls.s10.value * 10 + 
    this.CuadreForm.controls.s5.value * 5 + 
    this.CuadreForm.controls.s2.value * 2 + 
    this.CuadreForm.controls.s1.value * 1 + 
    this.CuadreForm.controls.s050.value * 0.5 + 
    this.CuadreForm.controls.s020.value * 0.2 + 
    this.CuadreForm.controls.s010.value * 0.1
    ;

    this.gQuery.sql(
      "sp_cuadre_resumen_devolver",
      Usu.Id + "|" + 
      this.CuadreForm.controls.s200.value + "|"  +
      this.CuadreForm.controls.s100.value + "|"  +
      this.CuadreForm.controls.s50.value + "|"  +
      this.CuadreForm.controls.s20.value + "|"  +
      this.CuadreForm.controls.s10.value + "|"  +
      this.CuadreForm.controls.s5.value + "|"  +
      this.CuadreForm.controls.s2.value + "|"  +
      this.CuadreForm.controls.s1.value + "|"  +
      this.CuadreForm.controls.s050.value + "|"  +
      this.CuadreForm.controls.s020.value + "|"  +
      this.CuadreForm.controls.s010.value
      )
      .subscribe(data =>{
        
        

        target.style.display = "none"   
        for(var x = 0; x<Object.values(data).length; x++){

          this.resumen.push({
            Descripcion : data[x].Descripcion,
            Monto       : data[x].Monto,
            Tipo        : data[x].Tipo,
          }); 

          if(data[x].Tipo =="Ingresos"){
            this.TotalOperacion = this.TotalOperacion + parseFloat(data[x].Monto); 
          }else{
            this.TotalOperacion =this.TotalOperacion - parseFloat(data[x].Monto); 
          }
        }

        // this.resumen.push({
        //   Descripcion : "Total operaciones",
        //   Monto       : TotalOperacion.toFixed(2),
        //   Tipo        : ""
        // });

        // this.resumen.push({
        //   Descripcion : "Total Conteo",
        //   Monto       : TotalConteo.toFixed(2),
        //   Tipo        : ""
        // })

     

        // la diferencia
  
      }
    );

  }

  onRegistrarConteo(data) {
    if (!confirm("Esta opción generará el cierre del día, lo que implica lo siguiente: a) No se podrán registrar nuevas entradas o salidas de dinero en este día, b) en caso de faltantes generará un descuento automático en forma de adelanto para el operador de control. ¿Desea continuar?")) {
      return;
    }

    this.onConteo = false;
    const target = document.getElementById('cargando_principal');
    target.style.display = "block";
    const Usu = JSON.parse(sessionStorage.getItem("dataUser"));

   
    this.TotalConteo = Object.keys(this.CuadreForm.controls).reduce((acc, key) => {
      const value = this.CuadreForm.controls[key].value;
      let denomination
      if(key.substring(1,2)=='0'){
        denomination = parseFloat(key.substring(1).replace('0', '.'));
      }else{
         denomination = parseFloat(key.substring(1));
      
      }
      console.log(denomination);
      
      return acc + (value * denomination);
    }, 0);

   

    // this.TotalConteo = Object.keys(this.CuadreForm.controls).reduce((acc, key) => {
    //   const value = this.CuadreForm.controls[key].value;
    //   const denomination = parseFloat(key.substring(1).replace('0', '.'));
    //   return acc + (value * denomination);
    // }, 0);

    const formData = Object.values(this.CuadreForm.controls).map(control => control.value).join('|');

    this.gQuery.sql("sp_cuadre_resumen_devolver", `${Usu.Id}|${formData}`).subscribe((data: any[]) => {

      console.log(data);
      
      target.style.display = "none";
      this.resumen = data.map(item => ({
        Descripcion: item.Descripcion,
        Monto: item.Monto,
        Tipo: item.Tipo
      }));

      this.TotalOperacion = this.resumen.reduce((acc, item) => {
        return item.Tipo === "Ingresos" ? acc + parseFloat(item.Monto) : acc - parseFloat(item.Monto);
      }, 0);
    });
  }
}
