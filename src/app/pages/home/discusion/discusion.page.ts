import { ToastAppService } from './../../../services/Toast/toast-app.service';
import { NavController, ToastController, AlertController, IonContent } from '@ionic/angular';
import { SearchService } from './../../search/search.service';
import { SaveResultSearchService } from './../../search/save-result-search.service';
import { RangeMessageService } from './../range-message.service';
import { GlobalStorageService } from './../../../services/localStorage/global-storage.service';
import { MessageApiService } from './../../../services/message-api.service';
import { ReceiverDataService } from './../receiver-data.service';
import { Component, ContentChild, ContentChildren, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Message } from './message.model';
import { DataUserService } from '../../data-user.service';

@Component({
  selector: 'app-discusion',
  templateUrl: './discusion.page.html',
  styleUrls: ['./discusion.page.scss'],
})
export class DiscusionPage implements OnInit {
  @ViewChild(IonContent) private myscroll!: IonContent;
  receivData!: any;
  currentUserData!: any;
  isMsgSend: boolean = true;
  dataForProfil!: any;
  message!: Array<Message>;
  colorSendBtn!:string; 
  stopInterval: boolean = false;
  messageToSend : Message;
  value: string = '';
  constructor(private receiverData: ReceiverDataService, 
              private apiMessage: MessageApiService,
              private apisearch: SearchService,
              private route: NavController,
              private toast: ToastAppService,
              private dataUser: DataUserService,
              private localSave: GlobalStorageService,
              private saveResltSearch: SaveResultSearchService,
              private rangeMessage: RangeMessageService,
              private globalSearch: SaveResultSearchService,
              private alertController: AlertController,
              private navContrl: NavController
              ) {this.messageToSend = new Message(); }

  ngOnInit() {
    // get first data of reveicer
    this.scrollToBottom();
    this.loadUsersData();
    this.loadMessageThisDiscussion();
    this.renit();
    this.webSocketOnMessage();
    this.setTheDatOfMsg();
    this.checkNewMsg();
    this.colorSendBtn = 'Dark';
  }

  ngOnDestroy() {
      this.stopInterval = true;
      this.checkNewMsg();
  }

  ionViewDidEnter(){
    this.scrollToBottom();
    this.checkNewMsg();
  }
  
showDetailmsg(msg: Message){
  console.log('message click :', msg)
}
 checkNewMsg(){
  let startLookForNewMsg;
  
  if(this.stopInterval){
    clearInterval(startLookForNewMsg);
  }
       startLookForNewMsg = setInterval(()=>{
        if(typeof this.apiMessage.newMsg !== 'undefined' ? true : false){
         if(this.isForThisUser(this.apiMessage.newMsg)){
             this.apiMessage.newMsg.statut = true;
             this.message.push(
                this.apiMessage.newMsg
              );
             this.apiMessage.newMsg = undefined;
           }
      }
      }, 100);
    
  }
 //sound To Play when the message come in
 /*
  playComminMsgSound(){

  }
  playOutGoingMsgSound(){

  }
 */ 

  refreshDisculist(){
    //this.rangeMessage.rangeMessage(this.getReceiverID());
  }
  
  isForThisUser(msgReceived: any): boolean{
    let id_sender = this.checkDestinataireID('', msgReceived)
    if(msgReceived.id_destinateur_user == this.getCurrentUserID() || id_sender == msgReceived.id_destinateur_user){
      msgReceived.isReceived = true;
      return true;
    }else{
      return false;
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

  async sendMessage(){
    if(!this.isFieldMessageEmpty()){
      this.setMessageParam();
      this.storeOutgoingMessage();
      //post message on User interface
        if(typeof this.message !== 'undefined'){
          this.message.push(
            {
              libelle: this.messageToSend.libelle,
              id_sender: this.messageToSend.id_sender,
              id_destinateur_user: this.messageToSend.id_destinateur_user
            }
          );
          try{
              this.myscroll.scrollToBottom();
          }catch(err){

          }
    
        }else{
          this.message = [];
          this.message.push(
            {
              libelle: this.messageToSend.libelle,
              id_sender: this.messageToSend.id_sender,
              id_destinateur_user: this.messageToSend.id_destinateur_user
            } 
          )
          try{
            this.myscroll.scrollToBottom();
        }catch(err){

        }

        }
        this.apiMessage.webSocketSendMessage(this.messageToSend);
        this.rangeMessage.LastMessage = this.messageToSend;
     }
    
  }
  
  webSocketOnMessage(){
   /* this.apiMessage.ws.onmessage = (msg)=>{
        let msgReceived = JSON.parse(msg.data);
        if(msgReceived.id_destinateur_user == this.currentUserData[0].id_users){
          msgReceived.isReceived = true;
          this.message.push(msgReceived);
        }
    }*/
  }

  loadMessageThisDiscussion(){
    setTimeout(() => {
      this.message = this.rangeMessage.getMessageOfDiscussion();
    }, 100);
  }

  renitListMessage(){
    this.message.length = 0;
    this.backToHome();
  }
  
  loadUsersData(){
    this.receivData = this.receiverData.ID_RECIVER_AND_DATA;
    
    if(typeof this.receivData === 'undefined'){
      this.receivData = this.globalSearch.dataUserFound;
    }

    try {

      this.currentUserData = JSON.parse(this.dataUser.userData);
    } catch (error) {

    }
    

  }

  isFieldMessageEmpty(): boolean{
    return typeof this.value === 'undefined' || this.value == null || this.value.length === 0 || this.value == '';
  }

  setColor(color: string){
  
    if(this.value.trim() != '' && this.value.trim() != null && typeof this.value.trim() !== 'undefined'){
      this.colorSendBtn = color;
    }else{
      this.colorSendBtn = 'Dark';
    }
  }

  setMessageParam(){
    this.messageToSend.libelle = this.value;
    this.value = '';
    if(typeof this.receivData.id_users !== 'undefined'){
      this.messageToSend.id_destinateur_user = this.receivData.id_users;
      this.messageToSend.id_discussion = this.currentUserData[0].id_users + this.receivData.id_users;
      
    }else{
      if(this.receivData.id_sender === this.getCurrentUserID()){
        this.messageToSend.id_destinateur_user = this.receivData.id_destinateur_user;  
        this.messageToSend.id_discussion = this.currentUserData[0].id_users + this.receivData.id_sender;    
      }else{
          this.messageToSend.id_destinateur_user = this.receivData.id_sender;
          this.messageToSend.id_discussion = this.currentUserData[0].id_users + this.receivData.id_sender;    
      }
    }
     let min = new Date().getMinutes() < 10 ? '0'+new Date().getMinutes() : new Date().getMinutes();
    this.messageToSend.date_envoie = '' + new Date().getHours().toString() + ':' +  min.toString() + ' | ' + new Date().toString().split(' ')[1]  + ' - ' + new Date().toString().split(' ')[0];
    this.messageToSend.id_sender = this.currentUserData[0].id_users;
    this.messageToSend.nom = this.currentUserData[0].nom;
    this.messageToSend.prenom = this.currentUserData[0].prenom;
    this.messageToSend.imageEnvoyeur = this.currentUserData[0].profilImgUrl;
    this.messageToSend.statut = false;
  }

  async storeOutgoingMessage(){
    let id_destinataire = 0;
    let key = 'SENDER_ID';
    let keyTab = Array();
    let isSenderKey = false;
    let isReceiverKey = false;

    keyTab = await this.localSave.getData(key);
    this.messageToSend.isReceived = false;
    this.messageToSend.nom = this.receivData.nom;
    this.messageToSend.prenom  = this.receivData.prenom;
    this.messageToSend.imageEnvoyeur = this.receivData.profilImgUrl == null ?  this.receivData.imageEnvoyeur:this.receivData.profilImgUrl;

    if(typeof this.receivData.id_users === 'undefined'){
      if(keyTab.length > 0){
        keyTab.forEach((key:number)=>{
            if(key === this.messageToSend.id_destinateur_user){
              isReceiverKey = true; 
            }else if(key === this.messageToSend.id_sender){
              isSenderKey = true;
            }
        });
      }
    }else{
      this.rangeMessage.saveMsgSend(this.messageToSend, this.messageToSend.id_destinateur_user); 
    }

    if(isSenderKey){
      this.rangeMessage.saveMsgSend(this.messageToSend, this.messageToSend.id_sender); 
    }
    if(isReceiverKey){
      this.rangeMessage.saveMsgSend(this.messageToSend, this.messageToSend.id_destinateur_user);
    }
   
   }
  goToProfil(){
      this.apisearch.simpleSearch('user-api/search.php', JSON.stringify(this.receivData)).subscribe((data)=>{
        //this.saveResltSearch.dataUserFound = JSON.parse(data);
        this.dataForProfil = data;
        this.saveResltSearch.dataUserFound = this.dataForProfil;
          
        this.route.navigateForward('search/profils');

      });
 }

 getCurrentUserID(): any{
  return this.currentUserData[0].id_users;
 }

 getReceiverID(): any{
    return this.receivData.id_users;
 }

 async notAvailable(){
    const alert = await this.alertController.create({
      header: 'Les appels audios et videos sont pas encore disponible pour cette version de Hi-Chat',
      buttons: [
        {
          text: 'Ok',
          role: 'cancel',
        }
      ],
    });

    await alert.present();

  }
  
  scrollToBottom(){
    try{
      this.myscroll.scrollToBottom();
    }catch(err){
    }
  }
  renit(){
    this.messageToSend.libelle = '';
    this.value  = '';
  }

  setTheDatOfMsg(){
    let C_YEAR = new Date().getFullYear();
    let C_MONTH = new Date().getMonth();
    let C_DAY = new Date().getDay();
    //let da = this.message[this.message.length-1].date_envoie.split('-');
 
    console.log('msg date:', C_MONTH, C_DAY, C_YEAR);
  }
  backToHome(){
      this.navContrl.navigateRoot('tabs/home');
  }
}
