import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { EnvironementService } from './environement.service';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AccountApiService {
  public httOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    }),
    responseType: 'text' as 'json',
    withCredentials: true
  };

  constructor(private host : EnvironementService, private http: HttpClient) { }

  public get(endpoint: string): Observable<any>{
    return this.http.get<any>(this.host.hostName+endpoint);
  }
  
  public post(endpoint: string, ressource: any): Observable<any>{
    return this.http.post<any>(this.host.hostName+endpoint, ressource, this.httOptions );
  }

 
}
