import { AccountApiService } from './../../../services/account-api.service';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SinalAccountService {

  constructor(
      private api: AccountApiService
  ) { }

  makeSignal(idUser_WMS: any, idUser_S: any){
      
  }
}
