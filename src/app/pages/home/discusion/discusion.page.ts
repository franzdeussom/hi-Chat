import { CryptAndDecryptMessage } from './encrytDecrypt.service';
import { SheetControllerService } from './../../../services/Toast/sheet-controller.service';
import { TypeMessage } from './typeMessage.enum';
import { GetNotificationService } from 'src/app/pages/notifications/get-notification.service';
import { ToastAppService } from './../../../services/Toast/toast-app.service';
import { NavController, ToastController, AlertController, IonContent, ActionSheetController } from '@ionic/angular';
import { SearchService } from './../../search/search.service';
import { SaveResultSearchService } from './../../search/save-result-search.service';
import { RangeMessageService } from './../range-message.service';
import { GlobalStorageService } from './../../../services/localStorage/global-storage.service';
import { MessageApiService } from './../../../services/message-api.service';
import { ReceiverDataService } from './../receiver-data.service';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Message } from './message.model';
import { DataUserService } from '../../data-user.service';

@Component({
  selector: 'app-discusion',
  templateUrl: './discusion.page.html',
  styleUrls: ['./discusion.page.scss'],
})

export class DiscusionPage implements OnInit {
  @ViewChild(IonContent) private myscroll!: IonContent;
  @ViewChild('filechooser', { static: true }) private fileChooserElementRef!: ElementRef;

  items: File[] = [];
  receivData!: any;
  currentUserData!: any;
  isMsgSend: boolean = true;
  dataForProfil!: any;
  message: Array<Message> = [];
  colorSendBtn!:string; 
  stopInterval: boolean = false;
  messageToSend : Message;
  value: string = '';
  fullScreenBgUrl: any = '';
  showFullScreenImg: boolean = false;
  typeMsg = TypeMessage;

  constructor(private receiverData: ReceiverDataService, 
              private apiMessage: MessageApiService,
              private apisearch: SearchService,
              public wsNotif : GetNotificationService,
              private route: NavController,
              private toast: ToastAppService,
              private dataUser: DataUserService,
              private localSave: GlobalStorageService,
              private saveResltSearch: SaveResultSearchService,
              private rangeMessage: RangeMessageService,
              private globalSearch: SaveResultSearchService,
              private sheetCtrl : SheetControllerService,
              private actionCtrl : ActionSheetController,
              private alertController: AlertController,
              private encryptSystem: CryptAndDecryptMessage,
              private navContrl: NavController
              ) {this.messageToSend = new Message(); }

  ngOnInit() {
    // get first data of reveicer
    this.scrollToBottom();
    this.loadUsersData();
    this.loadMessageThisDiscussion();
    this.renit();
    this.setTheDatOfMsg();
    this.checkNewMsg();
    this.listenerInputChange();
    this.colorSendBtn = 'Dark';
  }

  ngOnDestroy() {
      this.stopInterval = true;
  
  }

  ionViewDidEnter(){
    this.scrollToBottom();
    this.loadUsersData();
  }
  
  ngAfterViewChecked() {
    this.checkNewMsg();
 
  }

async showDetailmsg(msg: Message, index: number){
    const action = await this.actionCtrl.create({
      header: 'Message: ' + msg.libelle + ' Date reception/envoie: ' + msg.date_envoie,
      buttons: [
        {
          text: 'Supprimer temp. pour moi',
          role: 'confirm',
          handler: ()=>{
           this.deleteMessage(index);
          }
        },
        {
          text: 'Annuler',
          role: 'cancel'
        }
      ]
    });

    await action.present();
  }

  deleteMessage(index: number){
      let messageTmp;
      this.message.splice(index, 1);
  }

 checkNewMsg(){

        if(typeof this.apiMessage.newMsg !== 'undefined' ? true : false){
          this.wsNotif.countMsgNotRead = this.wsNotif.countMsgNotRead--;
          if(this.isForThisUser(this.apiMessage.newMsg)){
             this.apiMessage.newMsg.statut = true;
             if(typeof this.message !== 'undefined'){
                this.message.push(
                this.apiMessage.newMsg
              );
             }    
             
             this.apiMessage.newMsg = undefined;
           }
      }
    
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

  async sendMessage(isImage?: boolean, imgBase64?: any, extension?:string){
    this.rangeMessage.checkLocalStoreSize();
    const sendMsg = (isImg?: boolean, imgeBase64?:any, ext?:string )=>{
      if(isImg){
        this.setParamImgMessage(imgeBase64, ext);
        this.storeOutgoingMessage();
        this.send();
      }else{
        if(!this.isFieldMessageEmpty()){
          this.setMessageParam();
          this.storeOutgoingMessage();
          this.send();
        }
      }
    }
    if(this.apiMessage.connectionState === 200){
      sendMsg(isImage, imgBase64, extension);
    }else{
        this.sheetCtrl.makeSimpleAlertController("Echec lors de l'envoie du message, Connexion pas etablie !", this.currentUserData[0].id_users);   
    }
      
  }
  
  postMessageOnUi(){
      //post message on User interface
        let tmp : Message = new Message();
        Object.assign(tmp, this.messageToSend);
        tmp.libelle = this.encryptSystem.decryptMessage(this.messageToSend.libelle);
        
        if(typeof this.message !== 'undefined'){
          this.message.push(tmp);
    
        }else{
          this.message = [];
          this.message.push(tmp);
        }

        this.myscroll.scrollToBottom();
  }

  send(){
        this.postMessageOnUi();
        this.messageToSend.id_user = this.currentUserData[0].id_users;
        this.apiMessage.webSocketSendMessage(this.messageToSend);
        
        this.messageToSend.id_user = this.messageToSend.id_destinateur_user;
        this.rangeMessage.LastMessage = this.messageToSend;

  }

  listenerInputChange() {
    const wireUpFileChooser = () => {
        const elementRef = this.fileChooserElementRef.nativeElement as HTMLInputElement;
        elementRef.addEventListener('change', (evt: any) => {
            const files = evt.target.files as File[];
            for (let i = 0; i < files.length; i++) {
                this.items.push(files[i]);
            }
            this.items.forEach(() => {
               const checking = this.isFileValid(this.items[0]);
               if(checking.isValid){
                   this.convertInBase64AndSendIt(this.items[0], checking.extension);
               }else{
                  this.toast.makeToast('Format de fichier pas pris en charge');
                  this.items.length = 0;
               }
          });
        }, false);
    };
    wireUpFileChooser();
    
 }

isFileValid(file: File): any{
    let response : {
      isValid: boolean,
      extension: string
    } = {
      isValid : false,
      extension: ''
    };
    const extensionSupportList = ['JPG', 'PNG', 'JPEG', 'SVG', 'TIF', 'GIF']
    let extension = file.type.split('/')[1].toUpperCase();
    let index = extensionSupportList.indexOf(extension);

    if(index != -1){
        response.isValid  = true;
        response.extension = extensionSupportList[index];
    }else{
      response.isValid  = false;
      response.extension = '';
    }

    return response; 
}

 convertInBase64AndSendIt(image: any, extension: string): any{
  const file = image;
  const reader = new FileReader();
  let base64Url;

    reader.addEventListener("load", () => {
        // Base64 Data URL  👇
       base64Url = reader.result;
       this.sendMessage(true, base64Url, extension);
    });

    reader.readAsDataURL(file);
    this.items.length = 0;
    return base64Url;
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

  setPIDdisc(){
    if(Array.isArray(this.message)){
      let index = this.message.length;
      if(index != 0){  
        if(typeof this.message[index-1].id_discussion !== 'undefined' ){
            this.messageToSend.id_discussion = this.message[index-1].id_discussion;
        }else{
            this.messageToSend.id_discussion = '' +(Math.random() * 2).toFixed(3)+'' + this.currentUserData[0].id_users +''+this.receivData.id_users;
        }
      }else{
        this.messageToSend.id_discussion = '' +(Math.random() * 2).toFixed(3)+'' + this.currentUserData[0].id_users +''+this.receivData.id_users;
      }
    }else{
      this.messageToSend.id_discussion = '' +(Math.random() * 2).toFixed(3)+'' + this.currentUserData[0].id_users +''+this.receivData.id_users;
    }
  }

  setMessageParam(){
    this.setPIDdisc();
    this.defineReceiver();
    this.messageToSend.type = TypeMessage.TEXT;
    this.messageToSend.libelle = this.encryptSystem.cryptMessage(this.value);
    this.value = '';
    let min = new Date().getMinutes() < 10 ? '0'+new Date().getMinutes() : new Date().getMinutes();
    this.messageToSend.date_envoie = '' + new Date().getHours().toString() + ':' +  min.toString() + ' | ' + new Date().toString().split(' ')[1]  + ' - ' + new Date().toString().split(' ')[0];
    this.messageToSend.id_sender = this.currentUserData[0].id_users;
    this.messageToSend.nom = this.currentUserData[0].nom;
    this.messageToSend.prenom = this.currentUserData[0].prenom;
    
    this.messageToSend.imageEnvoyeur = this.currentUserData[0].profilImgUrl;
    this.messageToSend.statut = false;
  }

  defineReceiver(){
    if(typeof this.receivData.id_users !== 'undefined'){
      this.messageToSend.id_destinateur_user = this.receivData.id_users;
      
    }else{
      if(this.receivData.id_sender === this.getCurrentUserID()){
        this.messageToSend.id_destinateur_user = this.receivData.id_destinateur_user;  
        
      }else{
          this.messageToSend.id_destinateur_user = this.receivData.id_sender;
      }

    }
    this.messageToSend.id_user = this.messageToSend.id_destinateur_user;
    this.messageToSend.idUser = ''+ this.currentUserData[0].id_users + this.messageToSend.id_destinateur_user;
    this.messageToSend.imgDisc = this.currentUserData[0].profilImgUrl;
  }

  setParamImgMessage(imgaBase64: any, extension:any){
      this.setPIDdisc();
      this.defineReceiver();

    this.messageToSend.type = TypeMessage.IMAGE;
    this.messageToSend.imgBase64Url = imgaBase64;

    let min = new Date().getMinutes() < 10 ? '0'+new Date().getMinutes() : new Date().getMinutes();
    this.messageToSend.date_envoie = '' + new Date().getHours().toString() + ':' +  min.toString() + ' | ' + new Date().toString().split(' ')[1]  + ' - ' + new Date().toString().split(' ')[0];
    this.messageToSend.id_sender = this.currentUserData[0].id_users;
    this.messageToSend.nom = this.currentUserData[0].nom;
    this.messageToSend.prenom = this.currentUserData[0].prenom;
    
    this.messageToSend.imageEnvoyeur = this.currentUserData[0].profilImgUrl;
    this.messageToSend.statut = false;

  }

  ///store in sqlite DB(to implement later ! );
  async storeOutgoingMessage(){
    let key = 'SENDER_ID';
    let keyTab = Array();
    let isSenderKey = false;
    let isReceiverKey = false;

    keyTab = await this.localSave.getData(key);
    this.messageToSend.isReceived = 0;
    this.messageToSend.nom = this.receivData.nom;
    this.messageToSend.prenom  = this.receivData.prenom;
    this.messageToSend.imageEnvoyeur = typeof this.receivData.profilImgUrl !== 'undefined' ? this.receivData.profilImgUrl : this.receivData.imageEnvoyeur;
    this.messageToSend.libelle = this.encryptSystem.decryptMessage(this.messageToSend.libelle);
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
      this.apisearch.simpleSearch('user-api/search/search.php', JSON.stringify(this.receivData)).subscribe((data)=>{
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
      header: 'Les appels audios et videos sont pas encore disponible pour cette version de Hi-Chat !',
      buttons: [
        {
          text: 'Ok',
          role: 'cancel'
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
 
  }
  showFullScreen(imgBase64Url?: any){
    if(!this.showFullScreenImg){
      this.fullScreenBgUrl = imgBase64Url;
      this.showFullScreenImg = true;

    }else{
      this.fullScreenBgUrl = '';
      this.showFullScreenImg = false;
    }

  }

  backToHome(){
      this.navContrl.navigateRoot('tabs/home');
  }
}
