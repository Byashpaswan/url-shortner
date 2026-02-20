import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment.dev';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class Authservice {

  private api = `${environment.scheme}${environment.apiUrl}`;


  constructor(private http: HttpClient) {}

  login(data: any) {
    return this.http.post(`${this.api}/auth/login`, data);
  }

  register(data: any) {
    return this.http.post(`${this.api}/auth/register`, data);
  }
  
}
