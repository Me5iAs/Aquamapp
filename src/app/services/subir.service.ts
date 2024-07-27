import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { log } from 'console';
import { Observable, observable } from 'rxjs';
import { api } from './g-constantes.service';

const url_api = api.gSubirUrl;
 
@Injectable({
  providedIn: 'root'
})
export class SubirService {
  
 
	constructor(private http: HttpClient){}

	public postFileImagen(imagenParaSubir: File, Nombre:string){

		const formData = new FormData(); 
    formData.append('imagenPropia', imagenParaSubir, imagenParaSubir.name); 
    formData.append("Nombre",Nombre);
		return this.http.post(url_api, formData);

	}
	
	 
	
  
}

