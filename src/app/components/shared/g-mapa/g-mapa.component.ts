import { Component, OnInit, ViewChild, Input, Output, Inject, EventEmitter } from '@angular/core';
// import { GoogleMap, MapInfoWindow, MapMarker } from '@angular/google-maps';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import {FormGroup, FormControl, Validators} from "@angular/forms"; 
import {GInputComponent} from "../../shared/g-input/g-input.component";
import {inputI} from "../../../models/input.interface";

@Component({
  selector: 'g-mapa',
  templateUrl: './g-mapa.component.html',
  styleUrls: ['./g-mapa.component.styl']
})
export class GMapaComponent implements OnInit {

  // @ViewChild(GoogleMap) map: GoogleMap;
  // @ViewChild(MapInfoWindow) info: MapInfoWindow;

  @Input() Marcadores: any[] = [];
  @Input() Multimarcadores: boolean = true;
  @Input() Alto: string="300";
  // @Output() MarcadoresChange = new EventEmitter<any[]>();
   /* imput Marcadores debe tener esta estructura:
   Marcadores = [
     {
       position: {
         lat : latitud (en numeros),
         lng: longitud (en numeros),
       },
       label: {
         text: "direccion",
       },
       title: "referencia",
       options: {
         animation: google.maps.Animation.DROP,
       },
     }
   ] */

  public input:inputI;
  markers = [];
  Direccion: string="";
  Referencia: string ="";
  lat;
  lng;
  zoom = 16; //14

  constructor(public dialog: MatDialog) { }

  ngOnInit() {
    // this.Marcadores.push({
    //   lat : -3.7517195237045096,
    //   lng: -73.26032472300109,
    //   title: "Direccion",
    //   label: "Referencia",
    //   // animation: google.maps.Animation.DROP,
    //   }
    // );

    navigator.geolocation.getCurrentPosition(position => {
      if(this.Marcadores.length==0){
        this.lat= position.coords.latitude;
        this.lng= position.coords.longitude;
      }else{
        this.lat= this.Marcadores[0].lat;
        this.lng= this.Marcadores[0].lng;
      }
    });
    // console.log(this.Marcadores);
    
    // this.markers = this.Marcadores;
  }

  click(event){
    if(!confirm("¿Desea agregar un nuevo marcador?")){
      return;
    }

    this.input = <inputI> {
      Titulo : "Dirección",
      Campos: [
         {Nombre: "Direccion",Tipo:"Texto",Etiqueta:"Direccion",Valor: "", Validacion:[Validators.required]},
         {Nombre: "Referencia",Tipo:"Texto",Etiqueta:"Referencia",Valor: "", Validacion:[Validators.required]},
      ]
    }
    
    const dialogRef = this.dialog.open(GInputComponent, {
      data: this.input,
      width: '300px',
    });

    const _self = this;
    dialogRef.afterClosed().subscribe(result => {
      if(result){
        if (this.Multimarcadores == false){
            this.Marcadores = [];
        }
      
        this.Marcadores.push({
          lat: event.coords.lat,
          lng: event.coords.lng,
          title: result.Direccion,
          label: result.Referencia,
          // animation: google.maps.Animation.DROP,
        }
        );
      }
      // console.log(this.Marcadores);
      
    })
  }
 
   isMobile(){
    return (
      (navigator.userAgent.match(/Android/i)) ||
      (navigator.userAgent.match(/webOS/i)) ||
      (navigator.userAgent.match(/iPhone/i)) ||
      (navigator.userAgent.match(/iPod/i)) ||
      (navigator.userAgent.match(/iPad/i)) ||
      (navigator.userAgent.match(/BlackBerry/i))
    );
  }

  mousein(marker){
    // console.log(marker);
    
    if(this.isMobile()){
      return;
    }else{
      this.openInfo(marker);
    }
  }
  mouseout(){
    
    
    if(this.isMobile()){
      return;
    }else{
      // this.closeInfo();
    }
  }

  mobileclick(marker){
    // console.log(marker);
    if(this.isMobile()){
      this.openInfo(marker);
    }else{
     return;
    }
  }
  
  openInfo(marker) {
    // console.log(marker);
    // this.Direccion = content.label.text;
    // this.Referencia = content.title;
    // this.info.open(marker);
  }

  // closeInfo() {
  //   this.info.close();
  // }

}
