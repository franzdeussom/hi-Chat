import { TypeNotification } from './../pages/notifications/typeNotif.enum';
import { GetNotificationService } from './../pages/notifications/get-notification.service';
import { PremiumType } from './../pages/actualite/premium-page/premiumType.enum';
import { PremiumRequest } from './../pages/admin/premium-request/PremiumRequest.model';
import { TimeSystemService } from './timestamp/time-system.service';
import { EnvironementService } from './environement.service';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class PremiumService {
  
  constructor(private http: HttpClient, 
              private env: EnvironementService,
              private wsNotif: GetNotificationService,
              private timeSystem: TimeSystemService
              ) { }

    getPricePremium(typePremium: string): number{
        let value = 0;

        switch(typePremium){
          case PremiumType.PREMIUM_A: value = PremiumType.PREMIUM_A_PRICE;break;
          case PremiumType.PREMIUM_B: value = PremiumType.PREMIUM_B_PRICE; break;
          case PremiumType.PREMIUM_C: value = PremiumType.PREMIUM_C_PRICE; break;
          case PremiumType.PREMIUM_D: value = PremiumType.PREMIUM_D_PRICE; break;
        }

      return value;
    }
    
  updateAccountPremium(endpoint: string, id_Account: number, resetPremiumValidity: boolean): Promise<boolean>{
      const body = { id_Account : id_Account , decision : resetPremiumValidity};
      //expired Premium ****user____ auto-update set As expired

      return new Promise((resolve, rejects)=>{
                  this.http.post(this.env.hostName+endpoint, JSON.stringify(body)).subscribe((resp)=>{
                    if(Object.keys(resp).length != 0){
                        resolve(true);
                    }else{
                      rejects(false);
                    }
                  }, (err)=>{
                    rejects(false);
                  });
              });
  }

  defineDecisionUsersRequest(endpoint: string, idUsers : number, endDate: string, typeAccount: string, decisionRequest: string): any{
      const body = { 
              id_users: idUsers,
              decision: true,
              startDate: this.timeSystem.getFormatDatePremium(),
              endDate: endDate,
              accountType: typeAccount,
              decisionRequest: decisionRequest
             };
      return this.http.post(this.env.hostName+endpoint, JSON.stringify(body), {withCredentials: true});
  }

  deleteAllRequestValid(id: any, endpoint: string){
    const body : {
          id_admin: number,
          mode: string ,
          clause: string,
    } = {
      id_admin : id,
      mode: 'DELETE',
      clause: 'VALID'
     }
     return this.http.post(this.env.hostName+endpoint, JSON.stringify(body));
  }
 

  doRequestPremium(body: PremiumRequest, endpoint: string){
      return this.http.post(this.env.hostName+endpoint, JSON.stringify(body), {withCredentials: true});
  }


  getTotalPriceOfPremiumRequest(listRequest: PremiumRequest[]): number{
    let TotalPrice = 0;

    listRequest.forEach((request)=>{
        TotalPrice = TotalPrice + request.price;
    });
  return TotalPrice;
  }

  getTotalPriceRequestValid(listRequest: PremiumRequest[]){
      let TotalPrice = 0;

      listRequest.forEach((request)=>{
          TotalPrice = TotalPrice + (request.REQUEST_DECISION === PremiumType.DECISION_ACCOUNT_PREMIUM_OK ? request.price: TotalPrice);
      });

      return TotalPrice;
  }
}
