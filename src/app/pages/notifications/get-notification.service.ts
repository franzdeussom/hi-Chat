import { TypeNotification } from 'src/app/pages/notifications/typeNotif.enum';
import { ToastAppService } from './../../services/Toast/toast-app.service';
import { MessageNotif } from './messageNotif.enum';
import { NotificationApp } from './notification.model';
import { Injectable, Type } from '@angular/core';
import { EnvironementService } from '../../services/environement.service';
import { User } from '../signup/users.model';

@Injectable({
  providedIn: 'root'
})
export class GetNotificationService {
   wsNotif!: WebSocket;
  typeNotif!: TypeNotification;
  notifToSend: NotificationApp;
  globalNotification: Array<NotificationApp>;
  listAbonneCurrentUser!:User[];
  addLikeOnPublication: {PID: any, type:any}= {PID: undefined, type: ''};
  constructor(
              private host : EnvironementService,
              private toast: ToastAppService
    ) { 
      this.notifToSend = new NotificationApp();
      this.globalNotification = new Array<NotificationApp>();
    }

  makeConnectionToWsNotif(id_CurrentUsers:any){
      this.wsNotif = new WebSocket(this.host.webSocketNotif+id_CurrentUsers);
      this.startListener();
  }

  startListener(){
      this.wsNotif.onmessage = (notif: any) =>{
          const notifGet = JSON.parse(notif.data);
          this.showToast(notifGet);
      }
  }

  showToast(notificationGet: NotificationApp){
    this.globalNotification.unshift(notificationGet);  

      switch(notificationGet.type){
          case TypeNotification.LIKE:
             this.addLikeOnPub(notificationGet, TypeNotification.LIKE);
             this.toast.makeToast(notificationGet.prenom + '' + MessageNotif.LIKE);
            break;

          case TypeNotification.UNLIKE:
            this.addLikeOnPub(notificationGet, TypeNotification.UNLIKE);
            break;

          case TypeNotification.COMMENT:
            this.toast.makeToast(notificationGet.prenom + '' + MessageNotif.COMMENT);
            break;

          case TypeNotification.NEW_FOLLOWER:
            this.toast.makeToast(notificationGet.prenom + '' + MessageNotif.NEW_FOLLOWER);
            break;

          case TypeNotification.LIKE_COMMENT:
            this.toast.makeToast(notificationGet.prenom + '' + MessageNotif.LIKE_COMMENT);
            break;

          case TypeNotification.NEW_PUBLICATION:
            this.checkFollow(notificationGet);
      }

  }

  addLikeOnPub(notif: NotificationApp, type:any){
    this.addLikeOnPublication.PID = notif.publication?.PID;
    this.addLikeOnPublication.type = type; 
  }


  checkFollow(notif: NotificationApp){
    //check if the user who send the notifPub is an followers of the current user 
      let index = this.listAbonneCurrentUser.findIndex((user => user.id_users === notif.id_UsersSender));
      if(index != -1){
        this.toast.makeToast(notif.prenom + '' + MessageNotif.PUBLICATION);           
      }
  }

  sendNotification(type:any, dataUser: User, pub?: any, follower?: any, commentContent?: any){
    this.notifToSend.id_UsersSender = dataUser.id_users;
    this.notifToSend.nomSender = dataUser.nom;
    this.notifToSend.prenom = dataUser.prenom;
    this.notifToSend.profilImgUrlSender = dataUser.profilImgUrl;
      switch(type){
        case TypeNotification.LIKE:
          this.notifToSend.type = type;
          this.notifToSend.message = MessageNotif.LIKE;
          this.notifToSend.publication = pub;
          this.notifToSend.id_destinataire = pub?.id_user;
          this.notifToSend.id_pub = pub?.id_pub;
          break;

        case TypeNotification.UNLIKE:
          this.notifToSend.type = type;
          this.notifToSend.publication = pub;
          this.notifToSend.id_destinataire = pub?.id_user;
          this.notifToSend.id_pub = pub?.id_pub;
          break;

        case TypeNotification.COMMENT:
          this.notifToSend.type = type;
          this.notifToSend.id_destinataire = pub?.id_user;
          this.notifToSend.message = MessageNotif.COMMENT;
          this.notifToSend.publication = pub;
          this.notifToSend.commentContent = commentContent;
          break;

        case TypeNotification.LIKE_COMMENT:
          this.notifToSend.type = type;
          this.notifToSend.id_destinataire = commentContent.id_users;
          this.notifToSend.commentContent = commentContent;
          this.notifToSend.message = MessageNotif.LIKE_COMMENT;
          this.notifToSend.commentContent = commentContent;
          this.notifToSend.publication = pub;
          break;

        case TypeNotification.NEW_FOLLOWER:
          this.notifToSend.type = type;
          this.notifToSend.id_destinataire = follower?.id_users;
          this.notifToSend.message = MessageNotif.NEW_FOLLOWER;
          break;
          
        case TypeNotification.NEW_PUBLICATION:
          this.notifToSend.type = type;
          this.notifToSend.id_destinataire = '*';//send to all friends
          this.notifToSend.message = MessageNotif.PUBLICATION;
          this.notifToSend.publication = pub;
      }
     
      this.wsNotif.send(JSON.stringify(this.notifToSend));
  }
}
