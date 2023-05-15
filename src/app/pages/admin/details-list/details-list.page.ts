import { SearchService } from './../../search/search.service';
import { ToastAppService } from 'src/app/services/Toast/toast-app.service';
import { AccountApiService } from 'src/app/services/account-api.service';
import { TypeNotification } from './../../notifications/typeNotif.enum';
import { GetNotificationService } from 'src/app/pages/notifications/get-notification.service';
import { AlertController, ActionSheetController, NavController } from '@ionic/angular';
import { TransitService } from './../transit.service';
import { Component, OnInit } from '@angular/core';
import { User } from '../../signup/users.model';
import { SaveResultSearchService } from '../../search/save-result-search.service';

@Component({
  selector: 'app-details-list',
  templateUrl: './details-list.page.html',
  styleUrls: ['./details-list.page.scss'],
})
export class DetailsListPage implements OnInit {
    listUser: User[] = [];
    listUserSearch: User[] = [];
    titleType: string = '';
    valueSearch: string = '';

  constructor(
      private transit: TransitService,
      private alertCrl: AlertController,
      private actionSheet: ActionSheetController,
      private wsNotif: GetNotificationService,
      private accountApi: AccountApiService,
      private apisearch : SearchService,
      private saveResltSearch: SaveResultSearchService,
      private route: NavController,
      private toast: ToastAppService
  ) {  }

  ngOnInit() {
    this.loadUserFromTransit();
  }

  ionViewWillEnter(){
    this.loadUserFromTransit();
  }

  loadUserFromTransit(){
    this.listUser = this.transit.listUser;
  }

  async showActionSheetCtrlDelete(idUser: number, prenom: any){
      const action = await this.actionSheet.create({
        header: 'Voulez vous vraiment supprimer le compte de ' + prenom + ' ?',
        buttons: [
          {
            text: 'Supprimer',
            role: 'confirm',
            handler:()=>{
              this.deleteUser(idUser);
            }
          },
          {
            text: 'Annuler',
            role: 'cancel',
          }
        ]
      });
   await action.present();   
  }

  deleteUser(idUser: number){
      const param = { who: 'Admin', id_users: idUser };
      this.accountApi.post('user-api/deleteAccount.php', JSON.stringify(param)).subscribe((response)=>{
          if(Object.keys(response).length > 0){
            this.toast.makeToast('Compte supprime avec Succes !');
          }
      });
  }

  async showAlertControllerNotif(idUser: number){
    const action = await this.alertCrl.create({
      header: 'Message de la notification :',
      buttons : [
        {
          text: 'Envoyer',
          role:'confirm',
          handler: (data)=>{
              this.sendNotif(idUser, data.message);
          }

        },
        {
          text: 'Annuler',
          role: 'cancel'
        }
      ],
      inputs : [
        {
          type: 'text',
          name: 'message',
        }
      ]
      
    });
    await action.present();
  }

  sendNotif(idUser: number, message: string){
    if(message.length != 0 || message !== ''){
         this.wsNotif.sendNotifAdmin(idUser, message, TypeNotification.ADMIN_NOTIF);
         this.toast.makeToast('Notification envoyée');

     }else{
      this.toast.makeToast('Impossible Champs vide !');
    }
  }

  doSearch(){
      const execSearch = (user: User)=>{
        return user.nom?.toString().toLowerCase().substring(0, this.valueSearch.length) === this.valueSearch.toLowerCase();
      }

    this.listUserSearch = this.listUser.filter(execSearch);      
  }

  goToProfil(user: User){
    setTimeout(() => {

      this.apisearch.simpleSearch('user-api/search.php', JSON.stringify(user)).subscribe((data)=>{
        //this.saveResltSearch.dataUserFound = JSON.parse(data);
        this.saveResltSearch.dataUserFound = data;
        this.route.navigateForward('search/profils');
      });  
    }, 100);


  }
}
