import { SecurityMsg } from './../../home/securitymsg.model';
import { ToastAppService } from './../../../services/Toast/toast-app.service';
import { DataUserService } from './../../data-user.service';
import { RangeMessageService } from './../../home/range-message.service';
import { ReceiverDataService } from './../../home/receiver-data.service';
import { NavController, AlertController } from '@ionic/angular';
import { SaveResultSearchService } from './../save-result-search.service';
import { Component, OnInit } from '@angular/core';
import { GetAllMessageService } from '../../home/get-all-message.service';

@Component({
  selector: 'app-profils',
  templateUrl: './profils.page.html',
  styleUrls: ['./profils.page.scss'],
})
export class ProfilsPage implements OnInit {
  dataUserFound!: any;
  listDiscSecur: SecurityMsg;
  constructor(private searchResltService: SaveResultSearchService,
              private navCtrl : NavController,
              private currenDatUser: DataUserService,
              private getAllMesg: GetAllMessageService,
              private rangeMessage: RangeMessageService,
              private toast: ToastAppService,
              private alertController: AlertController,
              private receiverData: ReceiverDataService) {
                this.listDiscSecur = new SecurityMsg();
               }

  ngOnInit() {
      this.checkTheData();
      this.loadSecurityDisc();     
}

  async loadSecurityDisc(){
      this.listDiscSecur.discussion_list  = await this.rangeMessage.getListMsgSecure();
      this.listDiscSecur.pass_key = await this.rangeMessage.getPassMsgKey();

      if(!Array.isArray(this.listDiscSecur.discussion_list)){
        this.listDiscSecur.discussion_list = [];
      }
   }

  signal(){
    console.log('e');
  }
  
  checkTheData(){
    if(this.searchResltService.isFromSearch){
      this.dataUserFound = this.searchResltService.dataUserFound;
      this.searchResltService.isFromSearch = false;
    }else{
      this.dataUserFound = this.searchResltService.dataUserFound[0];
    }
  }
  async presentEntryPassword(){
    const alert = await this.alertController.create({
      header: 'Entrer le mot de passe pour acceder à la discussion',
      buttons: [
        {
          text: 'Annuler',
          role: 'cancel'
        },
          {
            text: 'Valider',
            role: 'confirm',
            handler: (password)=>{
                if(password.pass === this.listDiscSecur.pass_key){
                    //password correct, then nav to discussion
                    this.rangeMessage.setMessageOfDiscusion(this.dataUserFound.id_users);
                    this.navCtrl.navigateForward('discusion');
                }else{
                  this.toast.makeToast('Mot de passe incorrect !');
                }
            }
          },
      ],
      inputs: [
        {
          placeholder: 'mot de passe',
          type: 'password',
          name: 'pass'
        }
      ],
    });

    await alert.present();

  }
  async goToChatPage(){
      this.receiverData.ID_RECIVER_AND_DATA = this.dataUserFound;
      if(await this.rangeMessage.isDiscussionSecured(this.dataUserFound.id_users)){
          this.presentEntryPassword();
      }else{
        this.rangeMessage.setMessageOfDiscusion(this.dataUserFound.id_users);
        this.navCtrl.navigateForward('discusion');
      }
     
  }
}
