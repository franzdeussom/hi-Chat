import { ADMIN_CREDENTIALS } from './../../../services/admim.enum';
import { TypeNotification } from './../../notifications/typeNotif.enum';
import { AlertController, ActionSheetController } from '@ionic/angular';
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
  listRequestSearchResult : PremiumRequest[] = new Array<PremiumRequest>();

  user: User = new User();
  requestValidMsg: string ='';
  totalPrice: number = 0;
  totalPriceRequestValid : number = 0;
  searchValue : string = '';

  constructor(private api: AccountApiService,
               private dataUserServ: DataUserService,
               private timeSystem: TimeSystemService,
               private wsNotif: GetNotificationService,
               private alertCtrl: AlertController,
               private alertCtrlSheet: ActionSheetController,
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

async alertSheetCtrlConfirmRequest(id:number, typeAccount:any, index:number, isFromSearchList?: boolean){
        const alert = await this.alertCtrlSheet.create({
          header : 'Voulez vous definir ce compte comme Premium mode : ' + typeAccount + '?',
          buttons: [
            {
              text: 'Definir comme ' + typeAccount,
              role: 'confirm',
              handler: ()=> {
                this.approvedRequest(id, typeAccount, index, isFromSearchList);
              }
            },
            {
              text: 'Annuler',
              role: 'cancel'
            }
          ]
        });

        await alert.present();
  }

async confirmApplyRequest(id:number, typeAccount:any, index:number, isFromSearchList?: boolean){
       const alert = await this.alertCtrlSheet.create({
        header : 'Voulez vous vraiment definir ce compte comme Premium '+ typeAccount,
        buttons: [
          {
              text : 'Continuer',
              role: 'confirm',
              handler: ()=>{
                this.approvedRequest(id, typeAccount, index, isFromSearchList);
              }
          },
          {
              text :'Annuler',
              role:'cancel'
          }
        ]
       });

       await alert.present();
  }

  approvedRequest(id:number, typeAccount:any, index:number, isFromSearchList?: boolean){
    const dateEnd = this.timeSystem.getBuildDateExpiredPremium(typeAccount, this.timeSystem.getFormatDatePremium());
      this.premiumSrv.defineDecisionUsersRequest(
        'API-ADMIN/premium/setPremium.php',
        id,
        dateEnd,
        typeAccount,
        PremiumType.DECISION_ACCOUNT_PREMIUM_OK
      ).subscribe((resp: any)=>{
            if(Object.keys(resp).length !== 0){
                this.setRequestAsValid(index, isFromSearchList);
                this.wsNotif.sendPremiumConfirmationNotif(id, typeAccount);
            }
      });
  }

  setRequestAsValid(index: number, isFromSearchList?: boolean){
    if(isFromSearchList){
        const getIndexInMainList = ()=>{
          return this.listRequest.indexOf(this.listRequestSearchResult[index]);
        }
      this.listRequest[getIndexInMainList()].REQUEST_DECISION = PremiumType.DECISION_ACCOUNT_PREMIUM_OK;

    }else{
      this.listRequest[index].REQUEST_DECISION = PremiumType.DECISION_ACCOUNT_PREMIUM_OK;
    }
  }


  deleteRequest(id: string, index: number, isFromSearchList?: boolean){
      if(isFromSearchList){
        const getIndexInMainList = ()=>{
          return this.listRequest.indexOf(this.listRequestSearchResult[index]);
        }
        this.listRequest.splice(getIndexInMainList(), 1);
      }else{
        this.listRequest.splice(index, 1);
      }

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

  async confirmDeleteRequestValid(){
       const alertSheet = await this.alertCtrlSheet.create({
          header: 'Voulez vous vraiment supprimer toutes les demandes Premium Validees ?',
          buttons: [
            {
              text: 'Supprimer *',
              role: 'confirm',
              handler: ()=>{
                this.doDelete();
              }
            },
            {
              text: 'Suppression locale',
              role: 'confirm',
              handler: ()=>{
                this.doDeleteOnUi();
              }
            },
            {
              text: 'Annuler',
              role: 'cancel'
            }
          ]
        });

        await alertSheet.present();
  }

  doDelete(){
    this.premiumSrv.deleteAllRequestValid(ADMIN_CREDENTIALS.ADMIN_ID, 'API-ADMIN/deleteAllRequestValid.php')
    .subscribe((resp)=>{
        if(Object.keys(resp).length != 0){
            this.doDeleteOnUi();
        }
    });
  }

  doDeleteOnUi(){
    let tabIndex = new Array();

        this.listRequest.forEach((request, index)=>{
            if(request.REQUEST_DECISION === PremiumType.DECISION_ACCOUNT_PREMIUM_OK){
                tabIndex.push(index);
            }
        });

        tabIndex.forEach((elmt)=>{
            this.listRequest.splice(elmt, 1);
        });
  }

  searchUser(){
      const exec = (request: PremiumRequest)=>{
          return request.nom.toString().toLowerCase().substring(0, this.searchValue.length) === this.searchValue.toLowerCase();
      }
      this.listRequestSearchResult = this.listRequest.filter(exec);
   
  }

 async alertCtrlAddReference(id_users: any, typeAccountRequest: any){
        const alert = await this.alertCtrl.create({
          header: 'Entrez le message de la notification ainsi que les coordonnees de payement : ',
          inputs: [
            {
              type: 'text',
              name: 'reference'
            }
          ],
          buttons: [
            {
              text:'Envoyer',
              role: 'confirm',
              handler: (data: any)=> {
                  if(typeof data.reference !== 'undefined'){
                       this.sendNotifPaymnt(id_users, typeAccountRequest, data.reference, TypeNotification.ADMIN_NOTIF);
                  }
              }
            },
            {
              text: 'Annuler',
              role: 'cancel'
            }
          ]
        });

      await alert.present();
  }

  sendNotifPaymnt(id_users: any, typeRequest: any, reference: any, typeNotif: string){
      this.wsNotif.sendNotifPayementGateway(id_users, reference, typeNotif);
  }
}
