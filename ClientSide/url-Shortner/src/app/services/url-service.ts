import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment.dev';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class UrlService {

  private api = `${environment.scheme}${environment.apiUrl}`;

  constructor(private http: HttpClient) {}

  shorten(urlOrPayload: string | { originalUrl: string; customAlias?: string }) {
    const payload = typeof urlOrPayload === 'string' ? { originalUrl: urlOrPayload } : urlOrPayload;
    return this.http.post(`${this.api}/url/shorten`, payload);
  }

  analytics() {
    return this.http.get(`${this.api}/url/analytics`);
  }
  
}
