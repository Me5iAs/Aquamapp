import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class gTranslationService {
  private url: string = 'https://libretranslate.com/translate';

  constructor(private http: HttpClient) { }

  translate(text: string, targetLang: string = 'es'): Observable<any> {
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    const body = {
      q: text,
      source: 'en',
      target: targetLang,
      format: 'text'
    };

    return this.http.post(this.url, body, { headers });
  }
}
