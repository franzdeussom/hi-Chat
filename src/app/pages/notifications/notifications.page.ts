import { TypeNotification } from 'src/app/pages/notifications/typeNotif.enum';
import { NavController, ActionSheetController } from '@ionic/angular';
import { User } from './../signup/users.model';
import { DataUserService } from './../data-user.service';
import { GlobalStorageService } from './../../services/localStorage/global-storage.service';
import { GetNotificationService } from 'src/app/pages/notifications/get-notification.service';
import { Component, OnInit } from '@angular/core';
import { NotificationApp } from './notification.model';

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.page.html',
  styleUrls: ['./notifications.page.scss'],
})
export class NotificationsPage implements OnInit {
  listOfNotifations: Array<NotificationApp>
  tmpListOfNotification: any;
  dataCurrentUser: User = new User();
  typeNotif = TypeNotification.ACCOUNT_SIGNAL;  
  constructor(
                public wsNotif: GetNotificationService,
                private localStore: GlobalStorageService,
                private dataUser: DataUserService,
                private navCtrl: NavController,
                private actionSheetCtrl: ActionSheetController
             ) {
                  this.listOfNotifations = new Array<NotificationApp>();
              }

  ngOnInit() {
    this.loadNotifSave();
    this.loadDataUCurrentUser();
  }

  ngAfterViewChecked() {
    if(this.wsNotif.newNotification){
        this.getNotification();
    }else{
      this.listOfNotifations = this.tmpListOfNotification;
    }
  }

  getNotification(){
    if(this.wsNotif.tmpNotif.length > 0){
      if(this.wsNotif.globalNotification.length == 1){
        this.wsNotif.tmpNotif.unshift(this.wsNotif.globalNotification[0]);
      }else{
        this.wsNotif.globalNotification.forEach((notif)=>{
            this.wsNotif.tmpNotif.unshift(notif);
        });
      }
    }else{
      this.wsNotif.tmpNotif = this.wsNotif.globalNotification;
    }
      this.tmpListOfNotification = this.wsNotif.tmpNotif;
      this.wsNotif.newNotification = false;
      this.wsNotif.globalNotification = [];

    this.localSaveNotification();
  }

  loadDataUCurrentUser(){
    this.dataCurrentUser = JSON.parse(this.dataUser.userData)[0];
  }

  async localSaveNotification(){
    const KEY_NOTIFICATION = 'NOTIFICATIONS_USERS' + this.dataCurrentUser.id_users;
    if(await this.localStore.isAlreadyData(KEY_NOTIFICATION)){
        this.localStore.deleteData(KEY_NOTIFICATION);
        this.localStore.saveData(this.wsNotif.tmpNotif, KEY_NOTIFICATION)
    }else{
      this.localStore.saveData(this.wsNotif.tmpNotif, KEY_NOTIFICATION);
    }
  }

loadNotifSave(){
          this.listOfNotifations =  this.wsNotif.getLocaSave();
   }

   async showActionSheetCtrl(deleteAll?: boolean, index?: any){
    const msg = deleteAll ? 'Voulez vous vraiment supprimer toute vos notifications ?': 'Voulez vous vraiment Supprimer cette notification';

    const action = await  this.actionSheetCtrl.create({
      header: msg,
      buttons: [
        {
          text:'Supprimer',
          role: 'confirm',
          handler: ()=>{
           if(deleteAll){
              this.deleteAllNotif();
           } else{
              this.deleteOneNotif(index as number);
           }
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

   deleteAllNotif(){
    const KEY_NOTIFICATION = 'NOTIFICATIONS_USERS' + this.dataCurrentUser.id_users;
    this.wsNotif.deleteAllNotif(KEY_NOTIFICATION);
   }

   deleteOneNotif(index: number){
    const KEY_NOTIFICATION = 'NOTIFICATIONS_USERS' + this.dataCurrentUser.id_users;
    this.wsNotif.deleteOneNotif(index, KEY_NOTIFICATION);
   }

   goToDetails(publication: any, index:number, isRead?: boolean, isAdmin?:boolean){
      if(!isAdmin && typeof publication !== 'undefined'){
        this.dataUser.publication = publication;
        this.dataUser.isFromNotifList = true;
        this.setNotifAsRead(index, isRead);
        this.navCtrl.navigateForward('details');
      }
   
   }

   async setNotifAsRead(index: number, isRead?: boolean){
      if(!isRead){
          this.wsNotif.tmpNotif[index].isRead = true;
         await this.localSaveNotification();
      }else{
        this.wsNotif.tmpNotif[index].isRead = true;
        await this.localSaveNotification();
      }
   }

   goToDetailsSignal(){
      console.log('goToprofile');
   }
}
