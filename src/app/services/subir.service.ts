import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

// const url_api = "http://192.168.1.42/subirArchivo.php";
const url_api = "http://localhost/aquamapp/subirArchivo.php";
// const url_api = "backend/subirArchivo.php";

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

