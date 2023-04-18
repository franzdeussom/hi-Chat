import { AccountApiService } from './../../../services/account-api.service';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SinalAccountService {

  constructor(
      private api: AccountApiService
  ) { }

  makeSignal(idUser_WMS: any, idUser_S: any): boolean{
      const data : {
          id_user_WMS: any,
          id_user_S: any,
      } = {
        id_user_WMS: idUser_WMS,
          id_user_S: idUser_S
      };
      let isDone : boolean = false;

      this.api.post('user-api/signalAccount.php', JSON.stringify(data)).subscribe((response)=>{
          if(Object.keys(response).length > 0){
              isDone = true;
          }else{
            isDone = false;
          }
      },(err)=>{
        isDone = false;
      });
      return isDone;
  }
}
