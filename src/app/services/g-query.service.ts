import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {map, retry} from "rxjs/operators/";
import { api } from "./g-constantes.service"


const url_api = api.gServiceUrl;
// const url_api = "http://192.168.1.4/aquamapp/gQuery.php";

// const url_api = "http://localhost/aquamapp/gQuery.php";
// const url_api = "backend/gQuery.php";
// data.datos = data.datos.replace(/"/gi,"");
// data.datos = data.datos.replace(/'/gi,"");

const Cabecera: HttpHeaders = new HttpHeaders({
  "Content-type": "application/json"
});
@Injectable({
  providedIn: 'root'
})
export class gQueryService {

  constructor(private http:HttpClient) { }
  headers: HttpHeaders = new HttpHeaders({
    "Content-type": "application/json"
  });

  
  sql(procedimiento:string, datos?:string){
    return this.http.post(url_api, {name:procedimiento, datos: datos},
      {headers: Cabecera})
      .pipe(
        map(data=>data), 
        retry(3) // retry a failed request up to 3 times
      // catchError(this.) // then handle the error
        
      );
  }

  buscar(tabla:string, campos:string, criterio:string, valor:string){
    var sql = "select " + campos + " from " + tabla + " where " + criterio + " like '%" + valor + "%'";
    return this.http.post(url_api, {name:"Buscar", datos: sql},
      {headers: Cabecera}).pipe(map(data=>data));
  }

  update(tabla:string, campos:string, criterio:string){
    var sql = "update " + tabla + " set " + campos + " where " + criterio;
    return this.http.post(url_api, {name:"Execute", datos: sql},
      {headers: Cabecera}).pipe(map(data=>data));
  }

  fecha_2b(date) {
    var d = new Date(date),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear();

    if (month.length < 2) 
        month = '0' + month;
    if (day.length < 2) 
        day = '0' + day;

    return [year, month, day].join('-');
  }

  fecha_2n(fecha:string){
    return [fecha.substr(8,2), fecha.substr(5,2), fecha.substr(0,4) ].join("/");
  }

  fecha_2datapicker(fecha:string){
    // console.log(fecha)
    return [fecha.substr(6,4), fecha.substr(3,2), fecha.substr(0,2) ].join("-");  
  }

  parte_fecha(fecha:string, tipo){
    // console.log(fecha);
    
    // D:dia completo, d:dia abreviado, M:mes completo, m:mes abreviado
    // fecha: 18/10/2020
    let fechaA = fecha.split("/");
    let date = new Date(fechaA[1] + "-" + fechaA[0] + "-" + fechaA[2]);

    let diaC = ["lunes", "martes", "miércoles", "jueves", "viernes", "sabado","domingo"];
    let diaA = ["LUN", "MAR", "MIE", "JUE", "VIE", "SAB","DOM"];
    let mesC = ["enero", "febrero", "marzo", "abril", "mayo", "junio", "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"];
    let mesA = ["ENE", "FEB", "MAR", "ABR", "MAY", "JUN", "JUL", "AGO", "SEP", "OCT", "NOV", "DIC"];
    if(tipo=="D"){
      return diaC[date.getDay()-1];
    }
    if(tipo=="d"){
      return diaA[date.getDay()-1];
    }
    if(tipo=="M"){
      return mesC[Number(fechaA[1])-1];
    }
    if(tipo=="m"){
      return mesA[Number(fechaA[1])-1];
    }
  }

}
