import { Message } from './../home/discusion/message.model';
import { RangeMessageService } from './../home/range-message.service';
import { GlobalStorageService } from './../../services/localStorage/global-storage.service';
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
  newNotification: boolean = false;
  tabAbment: number[] = [];
  dataCurrentUser: any;

 public globalNotification: Array<NotificationApp>;
 public tmpNotif: any[] = [];
 public countMsgNotRead: number = 0;
 public connectionState: number = 200 ;
 

  listAbonneCurrentUser!: any[];

  addLikeOnPublication: {PID: any, type:any}= {PID: undefined, type: ''};
  constructor(
              private host : EnvironementService,
              private toast: ToastAppService,
              private localStore: GlobalStorageService,
    ) { 
      this.notifToSend = new NotificationApp();
      this.globalNotification = new Array<NotificationApp>();
    }

  makeConnectionToWsNotif(id_CurrentUsers:any, dataCurrentUsers: User){
      this.wsNotif = new WebSocket(this.host.webSocketNotif+id_CurrentUsers);
      this.dataCurrentUser = dataCurrentUsers as User;
      this.startListener();
  }

  startListener(){
      this.wsNotif.onmessage = (notif: any) =>{
          const notifGet = JSON.parse(notif.data);
          this.showToast(notifGet);
      }
  }

  checkConnectionState(){
      this.wsNotif.onerror = (evt)=>{
          this.connectionState = 500;
      }
  }

  showToast(notificationGet: NotificationApp){

      switch(notificationGet.type){
          case TypeNotification.LIKE:
            if(!this.isNotifPresentInMainList(notificationGet)){
                this.globalNotification.unshift(notificationGet);
                this.newNotification = true;
                this.toast.makeToast(notificationGet.prenom + ' ' + MessageNotif.LIKE);
            }
             this.addLikeOnPub(notificationGet, TypeNotification.LIKE);
            break;

          case TypeNotification.UNLIKE:
            this.addLikeOnPub(notificationGet, TypeNotification.UNLIKE);
            break;

          case TypeNotification.COMMENT:
            if(!this.isNotifPresentInMainList(notificationGet)){
                this.globalNotification.unshift(notificationGet);
                this.newNotification = true;
                this.toast.makeToast(notificationGet.prenom + ' ' + MessageNotif.COMMENT);
              }
            break;

          case TypeNotification.NEW_FOLLOWER:
           if(!this.isNotifPresentInMainList(notificationGet)){
                this.globalNotification.unshift(notificationGet);
                this.newNotification = true;
                this.toast.makeToast(notificationGet.prenom + ' ' + MessageNotif.NEW_FOLLOWER);
            }
            break;

          case TypeNotification.LIKE_COMMENT:
            if(!this.isNotifPresentInMainList(notificationGet)){
                this.globalNotification.unshift(notificationGet);
                this.newNotification = true;

                this.toast.makeToast(notificationGet.prenom + ' ' + MessageNotif.LIKE_COMMENT);
            }
            break;
            
          case TypeNotification.ADMIN_NOTIF:
            this.globalNotification.unshift(notificationGet);
            this.newNotification = true;
            this.toast.makeToast('Hi-Chat: ' + notificationGet.message);
            break;

          case TypeNotification.NEW_PUBLICATION:
           if(!this.isNotifPresentInMainList(notificationGet)){
                this.globalNotification.unshift(notificationGet);
                this.newNotification = true;
            }
            this.checkFollow(notificationGet);
            break;

          case TypeNotification.ACCOUNT_SIGNAL:
            this.globalNotification.unshift(notificationGet);
            this.newNotification = true;
            break;
            //on connection listenner
          case TypeNotification.LIST_USER_ONLINE:
            setTimeout(() => {
               this.showUsersOnline(notificationGet);
            }, 500);
            break;
          case TypeNotification.NEW_USER_ONLINE: 
            this.addInListOfUserOnline(notificationGet);
          
            break;
          case TypeNotification.USER_LOGOUT:
            this.deleteInlistOfUserOnline(notificationGet);
            break;
          case TypeNotification.DELETE_PUB:
            this.deletePubOnNotifList(notificationGet);
            break;
      }

  }

  addLikeOnPub(notif: NotificationApp, type:any){
    this.addLikeOnPublication.PID = notif.publication?.PID;
    this.addLikeOnPublication.type = type; 
  }

  isNotifPresentInMainList(notifGet: NotificationApp): boolean{
    return this.globalNotification.findIndex((notif => 
             ( notif.publication?.PID === notifGet.publication?.PID && notif.type === notifGet.type && notif.id_UsersSender === notifGet.id_UsersSender)
      )) !== -1 ? true: false;
  }

  checkFollow(notif: NotificationApp){
    //check if the user who send the notifPub is an followers of the current user 
      let index = this.listAbonneCurrentUser.findIndex((user => user.id_users === notif.id_UsersSender));
      if(index != -1){
        this.toast.makeToast(notif.prenom + ' ' + MessageNotif.PUBLICATION);           
      }
  }

  sendNotifAdmin(idDestinataire: number, message: string, type: string, to?: string, listID?: string[]){
    this.notifToSend.message = message;
    this.notifToSend.id_destinataire = idDestinataire;
    this.notifToSend.listID = listID;
    this.notifToSend.type = type;
    this.notifToSend.Admin_Notif_SEXE = to;
    this.notifToSend.nomSender ='Hi-Chat';
    this.notifToSend.id_UsersSender = 0;
    this.notifToSend.profilImgUrlSender = '/assets/icon/appIcon.png';
    this.wsNotif.send(JSON.stringify(this.notifToSend));
  }

  sendMultiNotifAdmin(notifBuild: NotificationApp){
      this.wsNotif.send(JSON.stringify(notifBuild));
  }

  sendNotification(type:any, dataUser: User, pub?: any, follower?: any, commentContent?: any){
    this.notifToSend.id_UsersSender = dataUser.id_users;
    this.notifToSend.nomSender = dataUser.nom;
    this.notifToSend.prenom = dataUser.prenom;
    this.notifToSend.isRead = false;
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
          this.notifToSend.PID = pub.PID,
          this.notifToSend.id_destinataire = '*';//send to all friends
          this.notifToSend.message = MessageNotif.PUBLICATION;
          this.notifToSend.publication = pub;
          break;
        case TypeNotification.DELETE_PUB:
          this.notifToSend.type = type;
          this.notifToSend.PID = pub.PID,
          this.notifToSend.id_destinataire = '*';//send to all friends
          this.notifToSend.message = MessageNotif.PUBLICATION;
          this.notifToSend.publication = pub;
          break;
      }
     
      this.wsNotif.send(JSON.stringify(this.notifToSend));
  }

async loadNotifSave(idUser: number){
    const KEY_NOTIFICATION = 'NOTIFICATIONS_USERS' + idUser;

    if(await this.localStore.isAlreadyData(KEY_NOTIFICATION)){
        this.tmpNotif = await this.localStore.getData(KEY_NOTIFICATION);
  }
} 

deletePubOnNotifList(notifGet: NotificationApp){
   const index = this.tmpNotif.findIndex(((notif: { PID: number; })=> notif.PID === notifGet.PID));
    if(index != -1){
      this.tmpNotif.splice(index, 1);
        if(this.countMsgNotRead > 1){
          this.countMsgNotRead--;
        }else{
          this.countMsgNotRead = 0;
        }
    }
}

addInListOfUserOnline(connectionData: any){
  let idUser = Number.parseInt(connectionData.id.toString().split('=')[1]);
  if(this.checkPresenceInListAbmnt(idUser)){
      this.tabAbment.push(idUser);
  }

}

deleteInlistOfUserOnline(connectionData: any){
  let idUser = Number.parseInt(connectionData.id.toString().split('=')[1]);
  if(this.tabAbment.includes(idUser)){
    const index = this.tabAbment.indexOf(idUser);
    this.tabAbment.splice(index, 1);
  }
}

showUsersOnline(notifGet: any){
  console.log('list user get online: ', notifGet.list);
  if(Array.isArray(notifGet.list)){
    if(notifGet.list.length > 0){
        notifGet.list.forEach((item:any) => {
            let id = Number.parseInt(item.toString().split('=')[1]);
            
            if(this.checkPresenceInListAbmnt(id)){
              this.tabAbment.push(id);
            }
        });

    }

  }
  console.log('list of user online', this.tabAbment);
}

deleteAllNotif(key: string){
    this.localStore.deleteData(key);
    this.tmpNotif.length = 0;
}

deleteOneNotif(index: number, key: string){
    this.localStore.deleteData(key);
    this.tmpNotif.splice(index, 1);
    this.localStore.saveData(this.tmpNotif, key);
}

checkPresenceInListAbmnt(id: number): boolean{
  const isInTabAbment = ()=>{
    if(typeof  this.listAbonneCurrentUser[0] !== 'undefined' || Array.isArray(this.listAbonneCurrentUser[0])){
      let index = this.listAbonneCurrentUser[0].findIndex(((user: { id_users: number; })=> user.id_users === id));
      return index != -1;
    }else{
      this.listAbonneCurrentUser[0] = [];
      return false;
    }
    
  }
  return isInTabAbment();
}

 getLocaSave(): Array<any>{
   return this.tmpNotif.length > 0 ? this.tmpNotif: [];
 }
 
 kontoMelden(idDestinataire: any, motif?: string){
    let Admin = new User();
    let notifToSend = new NotificationApp();
    Admin.id_users = 0;
    Admin.nom = 'Hi-Chat'
    Admin.prenom = '';
    Admin.profilImgUrl = '/assets/icon/appIcon.png';

    notifToSend.type = TypeNotification.ACCOUNT_SIGNAL;
    notifToSend.profilImgUrlSender = Admin.profilImgUrl;
    notifToSend.nomSender = Admin.nom;
    notifToSend.prenom = Admin.prenom;
    notifToSend.id_UsersSender = Admin.id_users;
    notifToSend.isRead = false;
    notifToSend.id_destinataire = idDestinataire;
    notifToSend.message = MessageNotif.ACCOUNT_SIGNAL;
    notifToSend.commentContent = motif;

    this.wsNotif.send(JSON.stringify(notifToSend));
 }
}
