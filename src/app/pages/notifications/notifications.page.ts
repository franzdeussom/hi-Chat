import { TypeNotification } from 'src/app/pages/notifications/typeNotif.enum';
import { NavController } from '@ionic/angular';
import { Publication } from './../actualite/publicatin.model';
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
                private navCtrl: NavController
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

   goToDetails(publication: Publication, index:number, isRead?: boolean){
    this.dataUser.publication = publication;
    console.log('isRead', isRead);
      if(!isRead){
          this.wsNotif.tmpNotif[index].isRead = true;
          this.localSaveNotification();
      }
    this.navCtrl.navigateForward('details');
   }

   goToDetailsSignal(){
      console.log('goToprofile');
   }
}
