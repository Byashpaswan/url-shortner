import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class TokenService {
  constructor() { }

  get token() {
    return localStorage.getItem('currentUserToken');
  }

  set token(value: string | null) {
    value ? localStorage.setItem('currentUserToken', value): localStorage.removeItem('currentUserToken');
  }
  
}
