import { EnvironementService } from './../../services/environement.service';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SearchService {

  constructor(private http: HttpClient, private host: EnvironementService) { }

  simpleSearch(endpoint: string, data: any): Observable<any> {
    return this.http.post(this.host.hostName+endpoint, data);
  } 

  searchWithOption(endpoint: string, data: any): Observable<any>{
    return this.http.post(this.host.hostName+endpoint, data);
  }

}
