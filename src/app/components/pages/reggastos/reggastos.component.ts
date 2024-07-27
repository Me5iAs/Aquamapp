import { Component, OnInit, ViewChild, AfterViewInit, Inject } from '@angular/core';
import {FormGroup, FormControl, Validators} from "@angular/forms";
import {MatPaginator} from '@angular/material/paginator';
import {gQueryService} from "../../../services/g-query.service";
import {Router} from "@angular/router";
import {DateAdapter, MAT_DATE_FORMATS} from '@angular/material/core';
import { AppDateAdapter, APP_DATE_FORMATS } from "../../format-datepicker";
import {MatSort} from '@angular/material/sort';

@Component({
  selector: 'app-reggastos',
  templateUrl: './reggastos.component.html',
  styleUrls: ['./reggastos.component.css'],
  providers: [
    {provide: DateAdapter, useClass: AppDateAdapter},
    {provide: MAT_DATE_FORMATS, useValue: APP_DATE_FORMATS}
  ]
})

export class ReggastosComponent implements OnInit {
  MovimientoForm: FormGroup;

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
  
  public EsRoot = false;
  public hoy;
  public Usuarios = [];
  public Vehiculos = [];
  constructor(public gQuery:gQueryService, private router:Router) {}
           
  ngOnInit() {

    this.gQuery.sql("fn_cuadre_cerrado").subscribe( data =>{
      // console.log(data)
      target.style.display = "none" 
      if(data["resultado"] == "1"){
        alert("no se puede registrar nuevos gastos porque el día ya fue cerrado");
        this.router.navigate(["/home"]);
      }   
    })

    var Usu = JSON.parse(sessionStorage.getItem("dataUser"));
    if(Usu.CodTipo=="0"){
      this.EsRoot = true;
    }else{
      this.EsRoot = false;
    }
  

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
    
    // Cargar usuarios
      this.gQuery.sql("sp_usuarios_devolver").subscribe(data =>{
        for(var x = 0; x<Object.values(data).length; x++){
          this.Usuarios.push({
            Id      : data[x].Id,
            Usuario : data[x].Usuario
          })
        }
      });

      // Cargar vehiculos
      this.gQuery.sql("sp_vehiculos_devolver").subscribe(data =>{
        for(var x = 0; x<Object.values(data).length; x++){
          this.Vehiculos.push({
            Id      : data[x].Id,
            Descripcion : data[x].Descripcion
          })
        }
      });


    // fecha
      let date = new Date()

      let day = date.getDate()
      let month = date.getMonth() + 1
      let year = date.getFullYear()
      
      if(month < 10){
        this.hoy = `${day}/0${month}/${year}`;
      }else{
        this.hoy = `${day}/${month}/${year}`;
      }
    console.log(this.hoy);;

    
    // movimiento form
    this.MovimientoForm = new FormGroup({
      Fecha: new FormControl(date,Validators.required),
      Monto: new FormControl("", [Validators.pattern(/^\d+\.\d{2}$/), Validators.required]),
      IdCat: new FormControl("", Validators.required),
      Glosa: new FormControl(""),
      IdRefU: new FormControl(""),
      IdRefV: new FormControl(""),
      CajaGeneral: new FormControl()
    });
  }

  onNewMov(data){
    let sFecha = new Date();
    // let dFecha = sFecha.toISOString().split('T')[0];   

    console.log(data);
    // return;
    let day = sFecha.getDate()
    let month = sFecha.getMonth() + 1
    let year = sFecha.getFullYear() 
 
    let dFecha = year + "-" + month + "-" + day;


    var target = document.getElementById('cargando_principal');
    target.style.display = "block"
    
    var IdRef = ""
    // si e scategoria 5: pago de personal, el IdRef será el IdRefU (el id del usuario)
    if(data.IdCat == '5' ){
      IdRef = data.IdRefU;
      
    }

    // si la categoría está vinculado a un equipo, la idRef es IdRefV (el id del vehiculo)
    if(data.IdCat == 6 || 
      data.IdCat == 7 || 
      data.IdCat == 9 || 
      data.IdCat == 17 || 
      data.IdCat == 21 
      ){
        IdRef = data.IdRefV;
    }
    const cajageneral = data.CajaGeneral==true? '1':'0';

        
    this.gQuery.sql(
      "sp_mov_registrar",
      dFecha      + "|" + 
      data.IdCat  + "|" + 
      data.Glosa  + "|" + 
      data.Monto  + "|" + 
      JSON.parse(sessionStorage.dataUser).Id + "|"  + 
      IdRef       + "|" +
      cajageneral

      ).subscribe(res =>{
        target.style.display = "none"
        alert(res[0].Message)
        this.MovimientoForm.reset();
        
      }
    );
    

  }

  


}
