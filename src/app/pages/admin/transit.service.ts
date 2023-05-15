import { TypeNotification } from './../notifications/typeNotif.enum';
import { NotificationApp } from './../notifications/notification.model';
import { GetNotificationService } from './../notifications/get-notification.service';
import { Injectable } from '@angular/core';
import { User } from '../signup/users.model';

@Injectable({
  providedIn: 'root'
})
export class TransitService {
  public listUser : any;
  
  constructor( 
          private wsNotif: GetNotificationService
  ) { }

  notifToFemalle(listFemalle: Array<User>, msg: string){
    let listFemalleID : string[] = [];
    let notifToSend = new NotificationApp();

    listFemalle.forEach((user)=>{
        listFemalleID.push('id='+user.id_users);
    });
    
    notifToSend.message = msg;
    notifToSend.id_destinataire = '*';
    notifToSend.listID = listFemalleID;
    notifToSend.type = TypeNotification.ADMIN_NOTIF;
    notifToSend.Admin_Notif_SEXE = 'F';
    notifToSend.nomSender ='Hi-Chat';
    notifToSend.id_UsersSender = 0;
    notifToSend.profilImgUrlSender = '/assets/icon/appIcon.png';

    this.wsNotif.sendMultiNotifAdmin(notifToSend);
 }

 notifToMale(listMale: Array<User>, msg: string){
  let listFemalleID : string[] = [];
  let notifToSend = new NotificationApp();

  listMale.forEach((user)=>{
      listFemalleID.push('id='+user.id_users);
  });

  notifToSend.message = msg;
  notifToSend.id_destinataire = '*';
  notifToSend.listID = listFemalleID;
  notifToSend.type = TypeNotification.ADMIN_NOTIF;
  notifToSend.Admin_Notif_SEXE = 'M';
  notifToSend.nomSender ='Hi-Chat';
  notifToSend.id_UsersSender = 0;
  notifToSend.profilImgUrlSender = '/assets/icon/appIcon.png';

  this.wsNotif.sendMultiNotifAdmin(notifToSend);
}
}
