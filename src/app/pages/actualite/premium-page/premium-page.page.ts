import { ToastAppService } from './../../../services/Toast/toast-app.service';
import { User } from './../../signup/users.model';
import { DataUserService } from './../../data-user.service';
import { TimeSystemService } from './../../../services/timestamp/time-system.service';
import { PremiumRequest } from './../../admin/premium-request/PremiumRequest.model';
import { Component, OnInit } from '@angular/core';
import { PremiumType } from './premiumType.enum';
import { PremiumService } from '../../../services/premium.service';

@Component({
  selector: 'app-premium-page',
  templateUrl: './premium-page.page.html',
  styleUrls: ['./premium-page.page.scss'],
})
export class PremiumPagePage implements OnInit {
  PremiumRequest: PremiumRequest = new PremiumRequest();
  selectedValue: string = '';
  user : User = new User;
  constructor(
            private timeSystem : TimeSystemService,
            private  dataUserSrv: DataUserService,
            private premiumServ: PremiumService,
            private toast: ToastAppService
  ) { }

  ngOnInit() {
    this.loadDataUser();
  }

  loadDataUser(){
      Object.assign(this.user, JSON.parse(this.dataUserSrv.userData)[0]);
  }
  
  doRequest(){
    if(this.user.accountType !== PremiumType.DECISION_ACCOUNT_PREMIUM_ON_WAIT){
      if(this.selectedValue !== ''){
        this.premiumServ.doRequestPremium(this.PremiumRequest, 'user-api/doPremiumRequest.php')
        .subscribe((resp)=>{
            if(Object.keys(resp).length !== 0){
                this.toast.makeToast('Demmande de compte premium effectue avec succes...');
                this.user.accountType = PremiumType.DECISION_ACCOUNT_PREMIUM_ON_WAIT;
            }
        });
      }else{
        this.toast.makeToast('Veuillez Choisir un mode');
      }
        
    }else{
      this.toast.makeToast("Vous avez deja une demande en cours d'etude !");
    }
   
  }

  checkValue(evt: any){
      const buildPremium = ()=>{
          this.PremiumRequest.id_user = this.user.id_users;
          this.PremiumRequest.nom = this.user.nom;
          this.PremiumRequest.prenom = this.user.prenom;
          this.PremiumRequest.profilImgUrl = this.user.profilImgUrl;
          this.PremiumRequest.pays = this.user.pays;
          this.PremiumRequest.premiumType = evt.target.value;
          this.PremiumRequest.price = this.premiumServ.getPricePremium(evt.target.value);
          this.PremiumRequest.REQUEST_DECISION = PremiumType.DECISION_ACCOUNT_PREMIUM_UNSET;
          this.PremiumRequest.date_request = this.timeSystem.getFormatDatePremium();
      }

      buildPremium();
  }
}
