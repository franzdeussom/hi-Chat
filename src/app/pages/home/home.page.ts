import { NetworkService } from './../../services/network/network.service';
import { TypeMessage } from './discusion/typeMessage.enum';
import { GetNotificationService } from './../notifications/get-notification.service';
import { AccountApiService } from 'src/app/services/account-api.service';
import { SecurityMsg } from './securitymsg.model';
import { GlobalStorageService } from './../../services/localStorage/global-storage.service';
import { DataUserService } from './../data-user.service';
import { ReceiverDataService } from './receiver-data.service';
import { RangeMessageService } from './range-message.service';
import { AlertController, NavController, Platform } from '@ionic/angular';
import { GetAllMessageService } from './get-all-message.service';
import { MessageApiService } from '../../services/message-api.service';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Message } from './discusion/message.model';
import { ToastAppService } from '../../services/Toast/toast-app.service';
import { User } from '../signup/users.model';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {
  activFieldResults!: boolean;

  search : {
      'value': string
  }={
      value: ''
  };
  dataUser!: any;
  listOfSender: Array<Message>;
  listLastMesg: Array<Message>;
  AllMessage: any;
  listDiscSecur : SecurityMsg;
  listOfSearchBar: Message[] = [];
  typeMsg = TypeMessage;
  constructor(public webSocket : MessageApiService,
              private cdRef:ChangeDetectorRef,
              private loadDataUser: DataUserService,
              private api: MessageApiService,
              private accountServ: AccountApiService,
              private receiver: ReceiverDataService,
              public wsNotif: GetNotificationService,
              private rangeMessage: RangeMessageService,
              private navController: NavController,
              private localSave: GlobalStorageService,
              private toast: ToastAppService,
              private network: NetworkService,
              private plt: Platform,
              private alertController: AlertController
              ) {
                this.plt.ready().then(()=>{
                  
                })
                this.listDiscSecur = new SecurityMsg();
                this.listOfSender = new Array<Message>(); this.listLastMesg = new Array<Message>()  
              }

  ngOnInit(){
      this.getDataUser();
      this.connectWebSocket();
      this.onWebsocketMessage();
      this.loadMessage();
      this.checkGetMessageMissed();
      this.checkUpdateListOfSenderHome();
      this.loadSecurityDisc();
      this.getFollowers();
  }

  ionViewDidEnter(){
    this.getDataUser();
    this.loadMessage();
    this.onWebsocketMessage();
    this.loadSecurityDisc();
  }
  
  ngAfterViewChecked() {
    try{
       this.checkUpdateListOfSenderHome();
    }catch(err){

    }
    this.cdRef.detectChanges();

  }

  
  async getFollowers(){
    let tmp;
    tmp = await this.loadAbonne();
    this.wsNotif.listAbonneCurrentUser = tmp;
  }

  loadAbonne(): Promise<User[]>{
    return  new Promise((resolve, reject)=>{
      this.accountServ.post('user-api/getUserFollowersHome.php', JSON.stringify(this.dataUser[0])).subscribe((data)=>{
          if(Object.keys(data).length > 0){
            resolve(JSON.parse(data));
          }
        }, (err)=>{
            reject(err);
        });
     });
  }

  checkUpdateListOfSenderHome(){
     // let tmp = setInterval(()=>{
      try{
        if( typeof this.rangeMessage.LastMessage !== 'undefined'){
          this.upDateSenderList(this.rangeMessage.LastMessage);
          this.rangeMessage.LastMessage = undefined;
          }
      }catch(err){

      }
        
   //   }, 1000);
  }

  connectWebSocket(){
    //connect to the websocket chat server
    this.webSocket.webSocketInit(JSON.parse(this.loadDataUser.userData)[0].id_users);
    
    //connect to the websocket Notification server and start listenner on new Notification
    this.wsNotif.makeConnectionToWsNotif(JSON.parse(this.loadDataUser.userData)[0].id_users, JSON.parse(this.loadDataUser.userData)[0])
    //console.log('message recu', this.webSocket.webSocketOnMessage()); 
  }

 async onWebsocketMessage(){
    let prenom = '';
    let msgReceived = new Message();
    let nom = '';

    this.webSocket.ws.onmessage = async (msg:any)=>{
             msgReceived = JSON.parse(msg.data);
             prenom = msgReceived.prenom;
             nom = msgReceived.nom;
              msgReceived.isReceived = 1;
             this.api.newMsg = msgReceived;
              this.wsNotif.countMsgNotRead++;
        this.rangeMessage.saveMsgSend(msgReceived, await this.checkDestinataireIDMsg(msgReceived.id_destinateur_user, msgReceived));
        this.upDateSenderList(msgReceived);
        this.toast.makeToast('Vous avez recu un nouveau message de ' + prenom + ' ' + nom);
    }

  }

async checkDestinataireID(id_destinateur_user: any, msg : Message, changeSender?: boolean): Promise<number>{
  changeSender = false;
  let isSenderKey = false;
  let isReceiverKey = false;
  let key = 'SENDER_ID';
  let keyTab = Array();

  keyTab = await this.localSave.getData(key);

  if(typeof keyTab !== 'undefined'){
    if(keyTab.length > 0){
      keyTab.forEach((key:number)=>{
          if(key === msg.id_destinateur_user){
            isReceiverKey = true; 
          }else if(key === msg.id_sender){
            isSenderKey = true;
          }
      });
    }
  }else{
    if(changeSender){
      isSenderKey = true;
    }else{
      isSenderKey = false
    }
  }
    
  return isSenderKey ? msg.id_sender : msg.id_destinateur_user;
}  

async checkDestinataireIDMsg(id_destinateur_user: any, msg : Message, changeSender?: boolean): Promise<number>{
  changeSender = false;
  let id = 0;
  let key = 'SENDER_ID';
  let keyTab = Array();
  keyTab = await this.localSave.getData(key);

if(this.listOfSender.length > 0){
    this.listOfSender.forEach((message: Message)=>{
      if(message.nom === msg.nom && keyTab.includes(message.id_destinateur_user)){
        id = message.id_destinateur_user;
      }else if(message.nom === msg.nom && keyTab.includes(message.id_sender)){
        id = message.id_sender;
      }else{
          id = msg.id_sender;
      }
    });
}else{
  id =msg.id_sender;
}

 return id;
}  

  loadMessage(){
  //when the user is connected...
        this.init();
        this.listOfSender.length = 0;
        this.rangeMessage.getBackupMessage();
        this.listOfSender = this.rangeMessage.backupMessage;
        
      }


  handleRefresh(event:any) {
    this.loadMessage();
    setTimeout(() => {
      // Any calls to load data go here
      event.target.complete();
    }, 2100);
  };

  upDateSenderList(msg: Message){
      this.listOfSender = this.rangeMessage.backupMessage;
      let count = 0;
      let i = 0;
      if(this.listOfSender.length > 0){
        
        this.listOfSender.forEach((message: Message, index:any)=>{
            let idUsers = '' + message.id_destinateur_user + this.dataUser[0].id_users;
            if(message.id_discussion === msg.id_discussion || idUsers === msg.idUser ){
               count++;
               i = index;
            }   
        });
        if(count > 0){
          let tmpValueOfListOfSender;
          this.listOfSender[i] = msg;
          this.listOfSender[i].statut = false;
          //save tmp msg
          tmpValueOfListOfSender = this.listOfSender[i];
          //delete it, in the main list
          this.listOfSender.splice(i, 1);
          //add it again in the main list, as first discussion msg
          this.listOfSender.unshift(tmpValueOfListOfSender);
          
        }else{
          this.listOfSender.unshift(msg);
        }
        i = 0;
      }else{
        this.listOfSender.unshift(msg);
      }
  }

  getIdUsersMessage(idUserOfMessage: number, msg: Message): number{
      return idUserOfMessage == this.dataUser[0].id_users ? msg.id_sender:idUserOfMessage;
  }


  listWsSender(msgToAdd: Message){
    let count = 0;
    let indexMsg = 0;
    if(this.listOfSender.length > 0){
      this.listOfSender.forEach((userMsg: Message, index: any)=>{
         if(userMsg.id_sender == msgToAdd.id_sender){
            count++;
            indexMsg = index;
         }
      })
      if(count == 0){
        //not yet this sender in the list
        this.listOfSender.unshift(msgToAdd);
      }else{
        //present in the list, updating libelle , statut message, and date

        this.listOfSender[indexMsg].statut = msgToAdd.statut;
        this.listOfSender[indexMsg].date_envoie = msgToAdd.date_envoie;
        this.listOfSender[indexMsg].libelle = msgToAdd.libelle;
        
    }
    }else{
      this.listOfSender.unshift(msgToAdd);
    }
    count = 0;
    indexMsg = 0;
  }

  enableResultField(): void {
    this.activFieldResults = true;
  }
  disableResultField(): void {
    this.activFieldResults = false;
    this.search.value = '';
  }

  searchUser(){
    let exec = (message: Message)=>{
        return message.nom.toString().toLowerCase().substring(0, this.search.value.length) === this.search.value.toLowerCase();    
    }

    this.listOfSearchBar = this.listOfSender.filter(exec);
  }

  getDataUser(){
      this.dataUser = JSON.parse(this.loadDataUser.userData);
      this.rangeMessage.allData_currentUser = this.dataUser;
 }

  async loadSecurityDisc(){
  let key = 'SECURITY_DISC_KEY'+this.dataUser[0].id_users;

  if(await this.localSave.isAlreadyData(key) ? true:false){
    this.listDiscSecur.pass_key = await this.rangeMessage.getPassMsgKey();
    this.listDiscSecur.discussion_list = await this.rangeMessage.getListMsgSecure();
  }else{
      this.listDiscSecur.discussion_list = [];
  }
   
   }


   checkGetMessageMissed(){
    this.api.post('msg-api/getAllMessageUser.php', this.dataUser).subscribe((data)=>{
      if(Object.keys(data).length === 0 ? false:true){
            this.wsNotif.countMsgNotRead = Array.isArray(data) ? data.length: 0;
            this.addInListSender(data);
            this.rangeMessage.delMsgMissedDB(); 
      }
    }, (err)=>{
          this.network.CONNEXION_DB_STATE = 500;
          
    });
   }
   addInListSender(MsgMissed: Array<Message>){
            MsgMissed.forEach(async (msg)=>{
              this.rangeMessage.saveMsgSend(msg, await this.checkDestinataireID(msg.id_destinateur_user, msg));
            });

        setTimeout(() => {
            
            MsgMissed.forEach((msg)=>{
               this.upDateSenderList(msg);
            });

        }, 1000);

          setTimeout(() => {
            this.loadMessage();
          }, 1000);

   }

   init(){
    this.rangeMessage.tabSenderMsg.length = 0;
    this.rangeMessage.TabCurrentUserMsgSend.length = 0;
    this.rangeMessage.listOfSender.length = 0
    this.listLastMesg.length = 0;
   }

   addPassword(){

   }

   async presentAlertDel(id: any, data: any) {

    const alert = await this.alertController.create({
      header: 'Voulez vous vraiment supprimer cette discussion avec ' + data.nom + ' ?',
      buttons: [
        {
          text: 'Quitter',
          role: 'cancel',
          handler: () => {
          },
        },
        {
          text: 'Supprimer',
          role: 'confirm',
          
          handler: () => {
            this.deleteDiscussion(id, data);
          },
        },
      ],
    });

    await alert.present();

    const { role } = await alert.onDidDismiss();
  }

   async deleteDiscussion(id_DU: number, msg: any){
        let id_ToDelete = await this.checkDestinataireIDMsg(id_DU, msg);
        let key = 'MSG_BUP_WITDH='+id_ToDelete+'AND'+this.dataUser[0].id_users;

        this.localSave.deleteData(key);
        this.rangeMessage.deleteKey(id_ToDelete);
        this.loadMessage();
   }
   
async  forgotDiscKey(){
      const alert = await this.alertController.create({
        header: 'Entrer le mot de passe de votre compte :',
        buttons: [
          {
            text: 'Annuler',
            role: 'cancel'
          },
            {
              text: 'valider',
              role: 'confirm',
              handler: (password)=>{
                  if(password.pass === this.dataUser[0].mdp){
                      //password correct, then show the discu key
                      this.toast.makeToast("Le mot de passe de vos discussions securisées est: " + this.listDiscSecur.pass_key?.toString());
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

  async isPasswordCorrect(indexMsg: any, ID_USERS_OF_DISCUSSION: number, receiverDATA: any){
       const alert = await this.alertController.create({
          header: 'Entrer le mot de passe pour acceder à la discussion',
          buttons: [
            {
              text: 'Annuler',
              role: 'cancel'
            },
            {
              text: 'Oublié ?',
              role: 'confirm',
              handler: ()=>{
                  this.forgotDiscKey();
              }
            },
              {
                text: 'Valider',
                role: 'confirm',
                handler: (password)=>{
                    if(password.pass === this.listDiscSecur.pass_key){
                        //password correct, then nav to discussion
                        this.setAllParamOfDiscAndForward(indexMsg, ID_USERS_OF_DISCUSSION, receiverDATA);                      
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

  async goToDiscusion(ID_USERS_OF_DISCUSSION: number , receiverDATA: any, indexMsg: number){
    this.receiver.ID_RECIVER_AND_DATA = receiverDATA;
    
    if(Array.isArray(this.listDiscSecur.discussion_list)){
        if(this.listDiscSecur.discussion_list.includes(await this.checkDestinataireID(ID_USERS_OF_DISCUSSION, receiverDATA))){
            this.isPasswordCorrect(indexMsg, ID_USERS_OF_DISCUSSION, receiverDATA);
        }else{
            this.setAllParamOfDiscAndForward(indexMsg, ID_USERS_OF_DISCUSSION, receiverDATA);
        }
    }else{
        this.setAllParamOfDiscAndForward(indexMsg, ID_USERS_OF_DISCUSSION, receiverDATA);
    }

  }

 async setAllParamOfDiscAndForward(indexMsg: any, ID_USERS_OF_DISCUSSION: number, receiverDATA: any){
    
    this.updateSetMsgAsRead(indexMsg, ID_USERS_OF_DISCUSSION, receiverDATA);
    this.rangeMessage.setMessageOfDiscusion(await this.checkDestinataireID(ID_USERS_OF_DISCUSSION, receiverDATA, true));
    this.wsNotif.countMsgNotRead = 0;
    this.navController.navigateForward('discusion');
  }
  
  async updateSetMsgAsRead(indexMsg: any, ID_USERS_OF_DISCUSSION: number, receiverDATA: any){
    if(this.listOfSender[indexMsg].statut == false || !this.listOfSender[indexMsg].statut){
      this.listOfSender[indexMsg].statut = true;
      this.rangeMessage.updateMessageSetAsRead(await this.checkDestinataireID(ID_USERS_OF_DISCUSSION, receiverDATA));
    }
  }

  async checkAlreadySecurity(): Promise<boolean>{
    let key = 'SECURITY_DISC_KEY'+this.dataUser[0].id_users;
    return await this.localSave.isAlreadyData(key) ? true:false;
  }


  async presentAlertSetSecurity(id: number, data:any) {
    let id_sec = await this.checkDestinataireID(id, data);

    if(await this.checkAlreadySecurity()){
      //already disc security list... 
      if(this.listDiscSecur.discussion_list.includes(id_sec)){

        //this disc is include in the list of disc security, move the security
        const alert = await this.alertController.create({
          header: 'Entrer le mot de passe pour retirer la protection',
          buttons: [
            {
              text: 'Annuler',
              role: 'cancel'
            },
              {
                text: 'Retirer',
                role: 'confirm',
                handler: (password)=>{
                    if(password.pass === this.listDiscSecur.pass_key){
                        this.rangeMessage.delIdOnSecureDiscList(id_sec);
                        this.loadSecurityDisc();
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
  
      }else{
        //don't present in the list, we add it
        this.rangeMessage.addPasswordOnDisc(id_sec);
        this.loadSecurityDisc();
      }
    }else{
      //not yet a list of security
      const alert = await this.alertController.create({
        header: 'Nouveau mot de passe ! Veuillez entrer un mot de passe.',
        buttons: [
          {
            text: 'Annuler',
            role: 'cancel'
          },
            {
              text: 'Securisé',
              role: 'confirm',
              handler: (password)=>{
                  if(typeof password.pass !== 'undefined' || password.pass != ''){
                      this.setSecurityDisc(id, data, password.pass);
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
   
  }

 async setSecurityDisc(id: number, data:any, password:string){

  let key = 'SECURITY_DISC_KEY'+this.dataUser[0].id_users;
  let idToAdd = await this.checkDestinataireID(id, data);
  let list = this.listDiscSecur.discussion_list;

      if(await this.localSave.isAlreadyData(key) ? false:true){
        this.rangeMessage.createPasswordDiscu(password, idToAdd);
        this.loadSecurityDisc();
      }else{
          if(Array.isArray(list)){
            if(list.includes(idToAdd)){
              this.toast.makeToast('Cette discution est déjà protéjée !')
            }else{
              this.rangeMessage.addPasswordOnDisc(idToAdd);
              this.loadSecurityDisc();
            }
          }
      }
  }

}
