import { ADMIN_CREDENTIALS } from './admim.enum';
import { DataUserService } from './../pages/data-user.service';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { EnvironementService } from './environement.service';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AccountApiService {
  public httOptions: any;

  constructor(private host : EnvironementService, 
              private http: HttpClient, 
              private dataUserServ: DataUserService) { 
              
              }

  public get(endpoint: string): Observable<any>{
      this.param();
    return this.http.get<any>(this.host.hostName+endpoint, { 'headers': this.httOptions});
  }

  public login(endpoint: string, ressource: any){
    return this.http.post<any>(this.host.hostName+endpoint, ressource );
  }
  
  public post(endpoint: string, ressource: any): Observable<any>{
    this.param();

    return this.http.post<any>(this.host.hostName+endpoint, ressource, {'headers': this.httOptions} );
  }
  public postSignal(endpoint: string, ressource: any){
    this.param();

    return this.http.post(this.host.hostName+endpoint, JSON.stringify(ressource),{ 'headers': this.httOptions});
  }
   
  public isAdmin(idUser: number): boolean{
    return idUser === ADMIN_CREDENTIALS.ADMIN_ID;
  }

  param(){
    this.httOptions =  {
        'Authorization': JSON.parse(this.dataUserServ.userData)[0].token,
      }
    
  }
 
}
