import { TimeSystemService } from './../../../services/timestamp/time-system.service';
import { PremiumType } from './../../actualite/premium-page/premiumType.enum';
import { PremiumService } from './../../../services/premium.service';
import { User } from './../../signup/users.model';
import { DataUserService } from './../../data-user.service';
import { AccountApiService } from './../../../services/account-api.service';
import { PremiumRequest } from './PremiumRequest.model';
import { Component, OnInit } from '@angular/core';
import { GetNotificationService } from '../../notifications/get-notification.service';

@Component({
  selector: 'app-premium-request',
  templateUrl: './premium-request.page.html',
  styleUrls: ['./premium-request.page.scss'],
})
export class PremiumRequestPage implements OnInit {
  listRequest : PremiumRequest[] = new Array<PremiumRequest>();
  user: User = new User();
  requestValidMsg: string ='';
  totalPrice: number = 0;
  totalPriceRequestValid : number = 0;

  constructor(private api: AccountApiService,
               private dataUserServ: DataUserService,
               private timeSystem: TimeSystemService,
               private wsNotif: GetNotificationService,
               private premiumSrv: PremiumService) { this.requestValidMsg = PremiumType.DECISION_ACCOUNT_PREMIUM_OK }

  ngOnInit() {
    this.loadDataUser();
    this.loadRequest();
  }

  handlerRefresh(evt: any){
    setTimeout(() => {
      // Any calls to load data go here
      this.loadRequest();
      evt.target.complete();
    }, 2100);
  }

  loadDataUser(){
    Object.assign(this.user, JSON.parse(this.dataUserServ.userData)[0]);
    if(!this.api.isAdmin(this.user.id_users)){
      throw new Error('Pas d autorisation pour acceder a cette page');
    }
  }

  approvedRequest(id:number, typeAccount:any, index:number){
    const dateEnd = this.timeSystem.getBuildDateExpiredPremium(typeAccount, this.timeSystem.getFormatDatePremium());
      this.premiumSrv.defineDecisionUsersRequest(
        'API-ADMIN/premium/setPremium.php',
        id,
        dateEnd,
        typeAccount,
        PremiumType.DECISION_ACCOUNT_PREMIUM_OK
      ).subscribe((resp: any)=>{
            if(Object.keys(resp).length !== 0){
                this.setRequestAsValid(index);
                this.wsNotif.sendPremiumConfirmationNotif(id, typeAccount);
            }
      });
  }

  setRequestAsValid(index: number){
      this.listRequest[index].REQUEST_DECISION = PremiumType.DECISION_ACCOUNT_PREMIUM_OK;
  }


  deleteRequest(id: string, index: number){
        this.listRequest.splice(index, 1);
        this.generateTotalPriceOfRequest();
  }

  loadRequest(){
      this.api.get('API-ADMIN/getpremiumRequest.php').subscribe((resp)=>{
            if(Object.keys(resp).length !== 0){
                Object.assign(this.listRequest, resp);
                this.generateTotalPriceOfRequest();
                this.generetePriceRequestValid();

            }
      });
  }

  generateTotalPriceOfRequest(){
        this.totalPrice = this.premiumSrv.getTotalPriceOfPremiumRequest(this.listRequest);
  }

  generetePriceRequestValid(){
        this.totalPriceRequestValid = this.premiumSrv.getTotalPriceRequestValid(this.listRequest);
  }
}
