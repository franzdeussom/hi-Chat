import { SecurityMsg } from './securitymsg.model';
import { ToastAppService } from './../../services/Toast/toast-app.service';
import { DataUserService } from './../data-user.service';
import { MessageApiService } from './../../services/message-api.service';
import { GlobalStorageService } from './../../services/localStorage/global-storage.service';
import { Message } from './discusion/message.model';
import { Injectable } from '@angular/core';
import { Storage } from '@capacitor/storage';
import { SQLite, SQLiteObject } from '@awesome-cordova-plugins/sqlite/ngx';


@Injectable({
  providedIn: 'root'
})
export class RangeMessageService {
  public AllMessage: Array<any>;
  public allData_currentUser: any;
  public msgRage: Array<Message>;
  public listOfSender: Array<any>;
  public id_current_user: any;
  public tabSenderMsg : Array<Message>;
  public TabCurrentUserMsgSend: Array<Message>;
  
  public backupMessage :  Array<any>;
  private id_currentUser:any;
  public lastMessageToTheDiscussion: any;
  public wsAllMsg: Array<Message>;
  public wsSender: Array<Message>;
  public LastMessage!: any;
  private tmpMissedID : Array<number>;
  constructor( private globaStrorage: GlobalStorageService, 
               private api : MessageApiService, private localSave: GlobalStorageService,
               private UserData: DataUserService,private toast: ToastAppService,
               ) {this.AllMessage = new Array<Message>(); 
                this.msgRage = new Array<Message>();
                this.listOfSender = new Array<any>();
                this.TabCurrentUserMsgSend = new Array<any>();
                this.tabSenderMsg = new Array<any>();
                this.wsAllMsg = new Array<Message>();
                this.wsSender = new Array<Message>();
                this.backupMessage = new Array<any>();
                this.AllMessage = new Array<any>();
                this.AllMessage.push([]);
                this.AllMessage.push([]);
                this.tmpMissedID = new Array<number>();
                this.id_current_user = this.globaStrorage.currentUser.id_users;
                this.id_currentUser = JSON.parse(this.UserData.userData)[0].id_users;
              }

  async saveMsgSend(msg: Message, id_receiver: any, isFromThisUser?:boolean){
 
    let key = 'MSG_BUP_WITDH='+id_receiver+'AND'+this.id_currentUser;
    
    const { value } = await Storage.get({ key });
    if(!value || value === '[]' || value.length === 0){
      //no data present, create the backup with this sender
      let backUp = [];
      backUp.push(msg);
      this.localSave.saveData(backUp, key);
      this.setBackupListOfSenderID(id_receiver);
    
    }else{
      //backup already set, get and add on the backup
      let tmpBackUp;
      tmpBackUp = await this.localSave.getData(key);
      
         tmpBackUp.push(msg);
        this.localSave.deleteData(key);
        this.localSave.saveData(tmpBackUp, key);
        
        if(!isFromThisUser){
            this.setBackupListOfSenderID(id_receiver);
        }
    }

    
     
  }

 async setBackupListOfSenderID(id_sender: any){
      let key = 'SENDER_ID' 

      const { value } = await Storage.get({ key });
      if(!value || value === '[]' || value.length === 0){
        //no data present, create the backup of sender
        let backupID = [];
        backupID.push(id_sender);
        this.localSave.saveData(backupID, key)
        
      }else{
        let tmpBackUp;
        let count = 0;
        let i = 0;
        tmpBackUp = await this.localSave.getData(key);
        tmpBackUp.forEach((element: any, index: number) => {
            if(element == id_sender){
              count++;
              i = index;
            }
        });
        if(count == 0){
          tmpBackUp.unshift(id_sender);
          this.localSave.deleteData(key);
          this.localSave.saveData(tmpBackUp, key);
        }else{
          let tmpID = tmpBackUp[i];
          tmpBackUp.splice(i, 1);
          tmpBackUp.unshift(tmpID);
          this.localSave.deleteData(key);
          this.localSave.saveData(tmpBackUp, key);  
        }
        
      }
  }

 async getBackupMessage(){
       let keyIDSender = 'SENDER_ID';
       let keyDiscussion = 'MSG_BUP_WITDH='; 
    
     let backUpSender = await this.localSave.getData(keyIDSender);
    if(typeof backUpSender === 'undefined' || backUpSender.length === 0 || backUpSender === '[]'){
        console.log('pas de backUp');

    }else{

      backUpSender.forEach(async (element:any) => {
        keyDiscussion = 'MSG_BUP_WITDH='+element+'AND'+this.id_currentUser;
        let msg;
        let size = 0;
        msg = await this.localSave.getData(keyDiscussion);
       
        if(Array.isArray(msg)){
          if(msg.length == 1){
            size = 0;
          }else if(msg.length > 1) {
            size = msg.length-1;
          }
          this.backupMessage.push(msg[size]);        
        }
        
          //console.log('is already present present on the list')
          //this.backupMessage[index].libelle = msg[size].libelle;
         });
    }
     
  }

  async checkDestinataireID(id_destinateur_user: any, msg : Message, changeSender?: boolean): Promise<number>{
    changeSender = false;
    let key = 'SENDER_ID';
    let keyTab = [];
  
    keyTab = await this.localSave.getData(key);
    
    if(Array.isArray(keyTab)){
          if(keyTab.length > 0 && keyTab.includes(id_destinateur_user)){
            return id_destinateur_user;
          }else if(keyTab.length > 0 && keyTab.includes(msg.id_sender)) {
            return msg.id_sender;
          }else{
            return msg.id_sender;
          }
    }else{
      this.tmpMissedID.push(msg.id_sender);
      return msg.id_sender;
    }
      
   
  }  


  async addInBackupMsgMissed(msgMissed: any){
    //ajout des messages pas recu directement dans le Backup des message Locaux
    if(Array.isArray(msgMissed)){
        msgMissed.forEach(async (elemnt: Message)=> {
          let idToAdd = await this.checkDestinataireID(elemnt.id_destinateur_user, elemnt);
                this.saveMsgSend(elemnt, idToAdd);
        });}

           let tpID = await this.localSave.getData('SENDER_ID');
           if(Array.isArray(tpID)){
                this.localSave.saveData(Array.from(new Set(tpID.concat(this.tmpMissedID).reverse())), 'SENDER_ID');
            }else{
                this.localSave.saveData(this.tmpMissedID, 'SENDER_ID');  
            }
        setTimeout(() => {
          
        }, 800);
  }

  delMsgMissedDB(){
    let userData: {
      nom : string,
      id_users: number
    } = {
      nom : '',
      id_users: this.id_currentUser
    }

    this.api.post('msg-api/deletemsgmissed.php', JSON.stringify(userData)).subscribe((response:any)=>{
        if(Object.keys(response).length === 0 ? false:true){
            this.toast.makeToast('Reception des messages Terminé');
        }else{
          
        }
    })
  }

  deleteAllMessage(){
    this.localSave.clear();
  }

  async deleteKey(id_sender: number){
    let key = 'SENDER_ID';
    let keySec = 'SECURITY_DISC_KEY'+this.id_currentUser;

    let listOfKey = await this.localSave.getData(key);
    let listDiscSecur: number[] = await this.getListMsgSecure();
    
    let count = 0;
    let i = 0;
    if(Array.isArray(listOfKey)){
      //----to change
      listOfKey.forEach((key: number, index: number)=>{
        if(key === id_sender){
          count++;
          i = index;
        }
      });
      if(count > 0){
        listOfKey.splice(i, 1);
        this.localSave.saveData(listOfKey, key);
      }
    }
    if(listDiscSecur.includes(id_sender)){
      //delete it if present in the list of disc secur
      let index = listDiscSecur.indexOf(id_sender);
      listDiscSecur.splice(index, 1);
      this.localSave.deleteData(keySec);
      this.localSave.saveData(listDiscSecur, keySec);
    }
  }

   async setMessageOfDiscusion(id_sender: number){
    let key = 'MSG_BUP_WITDH='+id_sender+'AND'+this.id_currentUser;
    this.lastMessageToTheDiscussion = await this.localSave.getData(key);
    setTimeout(() => {

    }, 100);
  }

  async updateMessageSetAsRead(id_sender: number){
    let key = 'MSG_BUP_WITDH='+id_sender+'AND'+this.id_currentUser;
    let msg = await this.localSave.getData(key); 
    let size = msg.length-1;
    msg[size].statut = true;
    this.localSave.saveData(msg, key);

  }

  getAndAddToSpecifyDiscussion(id_userSender: any, newMsg: any){
    /*
    this.backupMessage.forEach((element:any, index:any) => {
      console.log('Backup getadd', element[index], this.backupMessage);

      if(element[index].id_sender === id_userSender){
        this.backupMessage[index][index].push(newMsg);

      }
  });*/

  
  }

  createBackupMessage( msg?: any, firsSave?: boolean){
      
      if(firsSave){
        this.backupMessage.push([msg]);
      }

      this.localSave.saveData(this.backupMessage, 'MESSAGES_USERS_ID'+this.id_currentUser);
  }

  isAlreadySave(id_userSender : any): boolean{
    let count = 0;
    if(this.backupMessage.length > 0){
        this.backupMessage.forEach((element:any, index:any) => {
            console.log('valeur index:', element[index].id_sender);  
          if(element[index].id_sender === id_userSender){
              count++;
            }
        });
        if(count > 0){
          //already conversation exits
          return true;
        }else{
          //dont exits
          return false;
        }
    }else{
      //backup leer
      return false;
    }

  }

  isAlreadyMessageBackup(): Promise<boolean>{
    let response = this.localSave.isAlreadyData('MESSAGES_USERS_ID'+this.id_currentUser)
    return response;
  }

  createPasswordDiscu(password: string, id: number){
    let key = 'SECURITY_DISC_KEY'+this.id_currentUser;
    let disc_sec = new SecurityMsg();
    disc_sec.pass_key = password;
    disc_sec.discussion_list = [id];
    this.localSave.saveData([disc_sec], key);
  }

  async updatePasswordDiscu(password: any){
    let key = 'SECURITY_DISC_KEY'+this.id_currentUser;
    let list : SecurityMsg[] = await this.localSave.getData(key);
    list[0].pass_key = password;

    this.localSave.deleteData(key);
    this.localSave.saveData(list, key);
  }

  async addPasswordOnDisc(id: number){
    let key = 'SECURITY_DISC_KEY'+this.id_currentUser;
    let list : SecurityMsg[] = await this.localSave.getData(key);
   
    if(Array.isArray(list[0].discussion_list)){
      list[0].discussion_list.push(id);
      this.localSave.deleteData(key);
      this.localSave.saveData(list, key);
    }else{
      list[0].discussion_list = [id];
      this.localSave.deleteData(key);
      this.localSave.saveData(list, key);
    }
  }

  async delIdOnSecureDiscList(id: number){
    let key = 'SECURITY_DISC_KEY'+this.id_currentUser;
    let list : SecurityMsg[] = await this.localSave.getData(key);

    let index = list[0].discussion_list.indexOf(id);
    list[0].discussion_list.splice(index, 1);

    this.localSave.deleteData(key);
    this.localSave.saveData(list, key);
  }
  
  async getPassMsgKey(): Promise<any>{
    let key = 'SECURITY_DISC_KEY'+this.id_currentUser;
    let list : SecurityMsg[] = await this.localSave.getData(key);


    return Array.isArray(list) ? list[0].pass_key: '';
  }
  
 async getListMsgSecure(): Promise<number[]>{
    let key = 'SECURITY_DISC_KEY'+this.id_currentUser;
    let list : any = await this.localSave.getData(key);

    return  Array.isArray(list) ? list[0].discussion_list: [];
  }
  async isDiscussionSecured(id: number): Promise<boolean>{
    let key = 'SECURITY_DISC_KEY'+this.id_currentUser;
    let list : SecurityMsg[] = await this.localSave.getData(key);

      if(typeof list !== 'undefined'){
         return list[0].discussion_list.includes(id);
      }else{
        return false;
      }
  }
 
  rangeMessage(id_sender: any){
    this.init();
    this.msgRage = this.processRangeMsg(id_sender);

  }

  buildLastMsgDiscussion(): Array<Message>{
    this.init();
    var tabLastMessage = new Array<Message>();

      this.listOfSender.forEach((element: Message)=>{
        this.init();
          var tmp = new Array<Message>();
          tmp = this.processRangeMsg(element.id_sender).reverse();
          tabLastMessage.push({
            id_message: tmp[0].id_message,
            libelle: tmp[0].libelle,
            date_envoie : tmp[0].date_envoie,
            statut: tmp[0].statut,
            id_sender: tmp[0].id_sender
          });
        });  
          

      return tabLastMessage;
  }

  processRangeMsg(id_sender: any): Array<Message>{

    var tab = new Array<Message>();

     //load message Receive
     if(this.AllMessage[0].length > 0){
          this.AllMessage[0].forEach((element: Message) => {
              if(element.id_sender == id_sender){
                this.tabSenderMsg.push({
                  libelle: element.libelle,
                  imageEnvoyeur: element.imageEnvoyeur,
                  date_envoie: element.date_envoie,
                  nom: element.nom,
                  prenom: element.prenom,
                  id_message: element.id_message,
                  id_sender: element.id_sender,
                  id_destinateur_user: element.id_destinateur_user
               });
              }
          });
     }
     //load message send
     if(this.AllMessage[1].length > 0){
        this.AllMessage[1].forEach((element: Message) => {
            if(element.id_destinateur_user === id_sender){
              this.TabCurrentUserMsgSend.push({
                libelle: element.libelle,
                imageEnvoyeur: element.imageEnvoyeur,
                date_envoie: element.date_envoie,
                nom: element.nom,
                id_message: element.id_message,
                prenom: element.prenom,
                id_sender: element.id_sender,
                id_destinateur_user: element.id_destinateur_user
            });

            }
        });
     }

        this.TabCurrentUserMsgSend.forEach((elmt: Message)=>{
          elmt.isReceived= false;
        });
        this.tabSenderMsg.forEach((elmt: Message)=>{
          elmt.isReceived = true;
        });      

      if(this.tabSenderMsg.length == 0 && this.TabCurrentUserMsgSend.length > 0){
        // no message receive for this id and have send fiew msg to him
        tab = this.TabCurrentUserMsgSend;
        tab.sort((a, b)=> a.id_message.toString().localeCompare(b.id_message.toString()));
      return tab;


      }else if( this.tabSenderMsg.length > 0 && this.TabCurrentUserMsgSend.length == 0 ){
        //msg received for this id_sender and no message send for him
        tab = this.tabSenderMsg;
        tab.sort((a, b)=> a.id_message.toString().localeCompare(b.id_message.toString()));
      return tab;

      }else{
        //hava already together write
        tab = this.tabSenderMsg.concat(this.TabCurrentUserMsgSend);
        tab.sort((a, b)=> a.id_message.toString().localeCompare(b.id_message.toString()));
        
        for(let i = 0; i< tab.length; i++ ){
          console.log('id message N=', tab[i].id_message);
        }
        
        return tab;


      }
  }

  

  setListOfsender(){
    this.listOfSender.length = 0;
    let prevAdd = new Array();
    let count = 0;
    prevAdd.length = 0;
    var tmp = this.AllMessage[0];
    for(let i=0; i < this.AllMessage[0].length; i++ ){
      count = 0;  

      if(prevAdd.length > 0){
        for(let k = 0; k < prevAdd.length; k++ ){
            if( prevAdd[k] === tmp[i].id_sender){
              count++;

            }
        }
        if(count === 0 ){
          prevAdd.push(tmp[i].id_sender);
          this.listOfSender.push(tmp[i]);

        }
      }else{
        prevAdd.push(tmp[i].id_sender);
        this.listOfSender.push(tmp[i]);
      }
    }

    
  }

  getMessageOfDiscussion(): Array<any>{
      return this.lastMessageToTheDiscussion;
  }
  init(){
    this.TabCurrentUserMsgSend.length = 0;
    this.tabSenderMsg.length = 0; 
  }
  initAll(){
    this.init();
    this.AllMessage.length = 0;
    this.listOfSender.length = 0;
  }

  listWsSender(msgToAdd: Message){
    let count = 0;
    let indexMsg = 0;
    if(this.wsSender.length > 0){
      this.wsSender.forEach((userMsg: Message, index: any)=>{
         if(userMsg.id_sender == msgToAdd.id_sender){
            count++;
            indexMsg = index;
         }
      })
      if(count == 0){
        //not yet this sender in the list
        this.wsSender.push(msgToAdd);
      }else{
        //present in the list, updating libelle
        this.wsSender[indexMsg].libelle = msgToAdd.libelle;
      }
    }else{
      this.wsSender.push(msgToAdd);
    }
    count = 0;
    indexMsg = 0;
  }

  wsRangeDiscuss(id_sender: any): Array<Message>{
    let tabDiscussion = new Array<Message>();
    let tabSender = [];
    this.wsAllMsg.forEach((msg: Message, index: any)=>{
        if(msg.id_sender == id_sender){
          msg.received = true;
          tabDiscussion.push(msg);
        }
        if(msg.id_destinateur_user == id_sender){
          tabDiscussion.push(msg);
        }
    });
    return tabDiscussion;
  }

  getMsgDiscuss(tab?: any): Array<Message>{
    return tab;
  }


  /*
        **-- Hier sind die Implementation des Sqlites Module, das heisst das neues update
  */

  createLocalDataBase(){
  /*  try{

      this.sqlite.create({
        'name': 'hi-chat.db',
        'location': 'default'
      }).then((dataBase: SQLiteObject)=>{
            dataBase.executeSql('create table MESSAGES(senderID int, receiverID int, nom varchar(32), prenom varchar(32), profilImgUrl varchar(50), libelle text)')
            .then(()=>{
              console.log('created');
            }).catch(e => console.log('chiff', e));
      }).catch(e => console.log('errorrrrrr', e));

    }catch(e){
          console.log(e);
    }*/
      
  }


}
