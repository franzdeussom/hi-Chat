import { TimeSystemService } from './../../services/timestamp/time-system.service';
import { PathPpService } from './path-pp.service';
import { SecurityMsg } from './../home/securitymsg.model';
import { TypeNotification } from './../notifications/typeNotif.enum';
import { GetNotificationService } from 'src/app/pages/notifications/get-notification.service';
import { MessageApiService } from './../../services/message-api.service';
import { User } from './../signup/users.model';
import { DataUserService } from './../data-user.service';
import { RangeMessageService } from './../home/range-message.service';
import { ActionSheetController, IonModal, NavController, AlertController } from '@ionic/angular';
import { GlobalStorageService } from './../../services/localStorage/global-storage.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { ToastAppService } from 'src/app/services/Toast/toast-app.service';
import { AccountApiService } from 'src/app/services/account-api.service';
import { Publication } from '../actualite/publicatin.model';
import { Clipboard } from '@ionic-native/clipboard/ngx';
import { NetworkService } from 'src/app/services/network/network.service';
import { Avatar } from './avatar.model';
import { PublicationType } from '../actualite/publicationType.enum';


@Component({
  selector: 'app-account-profils',
  templateUrl: './account-profils.page.html',
  styleUrls: ['./account-profils.page.scss'],
})
export class AccountProfilsPage implements OnInit {
  @ViewChild(IonModal) modal!: IonModal;
  @ViewChild(IonModal) modal1!: IonModal;
  
  actived!: boolean;
  typeList: string = 'girl';
  searchValueListLike: string = '';
  activeFieldListLikeRslt: boolean = false;
  listUserLikeRslt: Array<User>;
  dataUser: User;
  type: string = 'publications';
  listUsersLike: Array<User>;
  listPublication: Array<Publication>;
  listAbonne: Array<User>;
  listAbonnement: Array<User>;
  searchValue: string = '';
  searchValueAbm: string = '';
  listSearchFollowers: Array<User>;
  activeFieldSearchResult: boolean = false;
  listSearchAbm: Array<User>;
  listIdAbm: Array<number> = [];
  activeFieldSearchResultAbm: boolean = false;
  dataUpdate : User = new User();
  listDiscSecur: SecurityMsg = new SecurityMsg();
  discKey: any;
  fullScreenBgUrl: any = '';
  showFullScreenImg: boolean = false;
  listAvatar: Avatar[] = [];
  isVideo : string ;
  isImage : string;
  showSpinnear: boolean = true; 

  constructor(private globalStorage: GlobalStorageService,
              private navController: NavController,
              private dataUsers: DataUserService,
              private rangeMessage: RangeMessageService,
              private websocket: MessageApiService,
              private toast: ToastAppService,
              private accountApi: AccountApiService,
              private actionSheetCtrl: ActionSheetController,
              private alertController: AlertController,
              private wsNotif: GetNotificationService,
              private pathPP: PathPpService,
              private network : NetworkService,
              private timeSystem : TimeSystemService,
              private copyCliboard: Clipboard,
              ) { this.dataUser = new User()
                  this.listAbonne = new Array<User>();
                  this.listAbonnement = new Array<User>();
                  this.listPublication = new Array<Publication>();
                  this.listSearchAbm = new Array<User>();
                  this.listSearchFollowers = new Array<User>();
                  this.listUsersLike = new Array<User>();
                  this.listUserLikeRslt = new Array<User>();
                  
                  this.isVideo = PublicationType.PUBLICATION_VIDEO;;
                  this.isImage = PublicationType.PUBLICATION_IMAGE;
                  this.loadDataCurrentUser();
              }

 async ngOnInit() {

    setTimeout(async ()=>{
      await this.loadFwAbmPubThisUsers();
    }, 800);  
      this.init();
  }

  handleRefresh(event:any) {
    setTimeout(() => {
      // Any calls to load data go here
      this.loadFwAbmPubThisUsers();
      event.target.complete();
    }, 2100);

  }

  init(){
    Object.assign(this.dataUpdate, this.dataUser);
    this.loadAvatar();
    this.loadSecurityDisc();
  }

  cancel() {
    this.listUsersLike.length = 0;
    this.modal.dismiss('cancel');
  }

  loadDataCurrentUser(){
    this.dataUser = JSON.parse(this.dataUsers.userData)[0];
  }

  async loadSecurityDisc(){
    let key = 'SECURITY_DISC_KEY'+this.dataUser.id_users;
  
    if(await this.globalStorage.isAlreadyData(key) ? true:false){
      this.listDiscSecur.pass_key = await this.rangeMessage.getPassMsgKey();
      this.listDiscSecur.discussion_list = await this.rangeMessage.getListMsgSecure();
    }else{
        this.listDiscSecur.discussion_list = [];
    }
    this.discKey = this.listDiscSecur.pass_key;   
  }

  loadAvatar(){
    this.listAvatar = this.pathPP.path_pp;
  }

  async showActionSheetCtrl(name: any, path: any){
    const action = await this.actionSheetCtrl.create({
        header: "Voulez vous vraiment definir l'avatar '" + name + "' comme votre photo de profil ?",
        buttons:[
          {
            text: 'Definir comme photo de profile',
            role: 'confirm',
            handler: ()=>{
              this.confirmToChangePp(path)
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

  async confirmToChangePp(path: any){
      const action = await this.alertController.create({
        header: 'Entrer votre mot de passe pour confirmer votre identité',
        buttons: [
          {
            text:'Confirmer',
            role:'confirm',
            handler: (data)=>{
                if(data.pass === this.dataUser.mdp){
                  this.AvatarChoose(path)
                }else{
                  this.toast.makeToast('Echec mot de passe incorrect !');
                }
            }
          },
          {
            text:'Annuler',
            role: 'cancel',
          }
        ],
        inputs:[
          {
            type: 'password',
            name : 'pass'
          }
        ]
      });

      await action.present();
  }

  async confirmToChangePpimg(base64: any, img : File){
    const action = await this.alertController.create({
      header: 'Entrer votre mot de passe pour confirmer votre identité',
      buttons: [
        {
          text:'Confirmer',
          role:'confirm',
          handler: (data)=>{
              if(data.pass === this.dataUser.mdp){
                this.pathPP.doUpdatingPp(this.dataUser.id_users, base64, true, this.dataUser.profilImgUrl);

                    const doUpdate = (base64: any)=>{
                      this.dataUser.profilImgUrl = base64;
                      this.listPublication.map(
                        (pub)=>{
                          pub.profilImgUrl = base64;
                        }
                      );
                      this.dataUsers.userData = JSON.stringify([this.dataUser]);
                    }
                doUpdate(base64);

              }else{
                this.toast.makeToast('Echec mot de passe incorrect !');
              }
          }
        },
        {
          text:'Annuler',
          role: 'cancel',
        }
      ],
      inputs:[
        {
          type: 'password',
          name : 'pass'
        }
      ]
    });

    await action.present();
}


  AvatarChoose(path: any){
    this.dataUser.profilImgUrl = path;
    this.listPublication.map(
      (pub)=>{
        pub.profilImgUrl = path;
      }
    );
        
       this.pathPP.doUpdatingPp(this.dataUser.id_users, path, false);
       this.dataUsers.userData = JSON.stringify([this.dataUser]);
   }  

  updatePp(evt?: any){
      const gestion = evt.target.files[0] as File;

      const check = (file: File)=>{
            const supportFile = ['JPEG', 'GIF', 'PNG', 'JPG'];
            const extension = file.type.toString().split('/')[1].toUpperCase();
            const index = supportFile.indexOf(extension);
            if(index != -1){
              return true;
            }else{
              return false;
            }
      }

     

      const isFileValid = check(gestion);

      if(isFileValid){
        let fileReader = new FileReader();
        let base64;
          fileReader.addEventListener('load', ()=>{
            base64 = fileReader.result as ArrayBuffer;
            this.confirmToChangePpimg(base64, gestion);
        });
  
        fileReader.readAsDataURL(gestion);
      }else{
        //alert error of file type 
        this.toast.makeToast('Format de fichier pas supporter');
      }
      
  }


  loadFwAbmPubThisUsers(){

    this.accountApi.post('user-api/getFwAbmPub.php', this.getParamQuery()).subscribe((response: any)=>{
        if(Object.keys(response).length > 0 ? true:false){
              this.setValuelist(JSON.parse(response));
              this.buildTabIdAbmnt(); 
              this.network.CONNEXION_DB_STATE = 200;
          }else{
          this.toast.makeToast('Erreur interne du serveur');
        }
    }, (err)=>{
          this.network.CONNEXION_DB_STATE = 500;
          this.network.makeToastErrorConnection('Impossible de charger vos données ! Erreur de connexion.')
    });

 }

 async buildTabIdAbmnt(){
     this.listIdAbm = await this.getTabAbmId();
 }

 getTabAbmId(): Promise<number[]>{
  let tab = Array();
    return new Promise((resolve, reject)=>{
            this.listAbonnement.forEach(user=>{
                tab.push(user.id_users);
            });

            resolve(tab);
            reject('Error on loading abmt');
    })
 }

setValuelist(data: any){
  this.listPublication = data[0].length === 0 ? [] : data[0];
  this.listAbonne = data[1].length === 0 ? [] : data[1];
  this.listAbonnement = data[2].length === 0 ? [] : data[2];
  this.listPublication = this.timeSystem.getElapsedTime(this.listPublication);
  this.showSpinnear = false;
}

getParamQuery(): any{
  const dataUser : {
    id_users: any,
    nom: any
  } = {
    id_users: this.dataUser.id_users,
    nom: this.dataUser.nom
  };
  return JSON.stringify(dataUser);
}

addFollower(idUser:any, dataUser:any){
        const getParamQuery = ()=>{
          const queryParam : {
            id_WF: any,
            id_F: any
        } = {
          id_WF: this.dataUser.id_users,
          id_F: idUser
        };
        return JSON.stringify(queryParam);
      }
      this.accountApi.post('user-api/addFollowers.php', getParamQuery()).subscribe((response)=>{
        if(Object.keys(response).length > 0 ? true:false){
            this.toast.makeToast('Vous suivez desormais ' + dataUser.prenom);
            this.listAbonnement.push(dataUser);
            this.listIdAbm.push(idUser);
            this.wsNotif.sendNotification(TypeNotification.NEW_FOLLOWER, this.dataUser, 0, dataUser);
        }else{
            this.toast.makeToast('Erreur interne du serveur');
      }
  });
}

unFollow(idUser: any, dataUser: any, index:number, isFromSeachList?:boolean){
  const getParamQuery = ()=>{
        const queryParam : {
          id_WF: any,
          id_F: any
      } = {
        id_WF: this.dataUser.id_users,
        id_F: idUser
      };
      return JSON.stringify(queryParam);
   }
   
  this.accountApi.post('user-api/delFollowers.php', getParamQuery()).subscribe((response)=>{
    if(Object.keys(response).length > 0 ? true:false){
        this.toast.makeToast("Vous n'ètes plus abonné(e) à " + dataUser.prenom);
          if(isFromSeachList){
                const index = this.listSearchAbm.findIndex((user=> user.id_users === idUser));
                this.listSearchAbm.splice(index, 1);
                const indexMainList = this.listAbonnement.findIndex((user => user.id_users === idUser));
                this.listAbonnement.splice(indexMainList, 1);
            }else{
              this.listAbonnement.splice(index, 1);
              const tmpIndex = this.listIdAbm.indexOf(idUser);
              this.listIdAbm.splice(tmpIndex, 1);
            }
      }else{
        this.toast.makeToast('Erreur interne du serveur');
    }
  });
}

searchUserListLike(){
  this.activeFieldListLikeRslt = this.searchValueListLike.length > 0;
  let execSearch = (user: User)=>{
    return user.nom?.toLowerCase().substring(0, this.searchValueListLike.length) === this.searchValueListLike.toLowerCase();
  }
    this.listUserLikeRslt = this.listUsersLike.filter(execSearch);
    this.searchValueListLike ='';
}

searchAbm(){
  if(this.searchValueAbm.length > 0){
        this.activeFieldSearchResultAbm = true;
   }else{
        this.activeFieldSearchResultAbm = false;
   }
          let execAbm = (user: User)=>{
            return user.nom?.toLowerCase().substring(0, this.searchValueAbm.length) === this.searchValueAbm.toLowerCase();
          }

          this.listSearchAbm = this.listAbonnement.filter(execAbm);
          this.searchValueAbm = '';
}

searchFollowers(){
        if(this.searchValue.length > 0){
          this.activeFieldSearchResult = true;
        }else{
          this.activeFieldSearchResult = false;
        }

        let exec = (user: User)=>{
          return user.nom?.toLowerCase().substring(0, this.searchValue.length)=== this.searchValue.toLowerCase();
        }

        this.listSearchFollowers = this.listAbonne.filter(exec);

        this.searchValue = '';
}

doLike(idPublication: any, index:number, pub: Publication){
  let data: {
    id_users: any,
    id_pub: number
  } = { 
    id_users: this.dataUser.id_users,
    id_pub: idPublication
  }
  if(this.listPublication[index].alreadyLike == 0 ){
    this.addLike(index, this.listPublication[index].nbrLike)
      this.accountApi.post('user-api/addLike.php', JSON.stringify(data)).subscribe((response)=>{
          if(Object.keys(response).length < 0){
              this.toast.makeToast('Operation Error');
          }
      }, (err)=>{
          this.toast.makeToast(''+ err.getMessage());
      });
  }
      
}

addLike(index: number, nbrLike:any){
  this.listPublication[index].nbrLike = nbrLike+1; 
  this.listPublication[index].alreadyLike = 1;
}

delLike(index: number, nbrLike:any){
  this.listPublication[index].nbrLike = nbrLike-1; 
  this.listPublication[index].alreadyLike = 0; 
}

doUnLike(idPublication: any, index:number){
  let data: {
    id_users: any,
    id_pub: number
  } = { 
    id_users: this.dataUser.id_users,
    id_pub: idPublication
  }
  this.accountApi.post('user-api/unLike.php', JSON.stringify(data)).subscribe((response)=>{
         if(Object.keys(response).length > 0){
              this.delLike(index, this.listPublication[index].nbrLike);
          }
  })
}

getListUsersLike(idPub: any, idUsersPub: any){
  let previousID_PUB_ = localStorage.getItem('ID_PUB_LIST');

  if(typeof previousID_PUB_ !== 'undefined' &&  previousID_PUB_ != idPub ){
    this.listUsersLike.length = 0;

    let param : { id_pub : any, id_user: any } = {id_pub: idPub , id_user: idUsersPub }
      this.accountApi.post('user-api/getLikeList.php', JSON.stringify(param)).subscribe((data)=>{
          if(Object.keys(data).length > 0){
              this.listUsersLike = JSON.parse(data);
              localStorage.setItem('ID_PUB_LIST', idPub);
          }else{
              this.listUsersLike = [];
          }
      });
  }
   
  }
  async actionSheetPub(idUserWhoCommented: any, id_pub: any, index:number,  prevText?:any, isFromSeachList?: boolean){
      const actionSheet = await this.actionSheetCtrl.create({
        header: 'Quelle action pour cette publication ?',
        buttons: [
          {
            text: 'Modifier le text',
            role: 'confirm',
            handler: ()=>{
              this.showAlertNewValuePub(id_pub, idUserWhoCommented, prevText, index, isFromSeachList);
            }
          },
          {
            text: 'Copier le text',
            role: 'confirm',
            handler: ()=>{
             this.copiedText(prevText);
            }
          },
          {
            text:'Supprimer',
            role: 'confirm',
            handler: ()=>{
              this.deletePub(id_pub, index, isFromSeachList);
            }
          },
          {
            text:'Annuler',
            role:'cancel'
          }
        ],
      });
  
      actionSheet.present();
      const { role } = await actionSheet.onWillDismiss();
  
      return role === 'confirm';
    }

    copiedText(textToCopy: string){
         this.copyCliboard.copy(textToCopy);
    }
    
  async showAlertNewValuePub(idPublication:any, id_users:any,  prevValue:string, index:number, isFromSeachList?:boolean){
    const alert = await this.alertController.create({
      header: 'Nouveau text :',
      buttons: [
        {
          text: 'Annuler',
          role: 'cancel'
        },
          {
            text: 'Modifier',
            role: 'confirm',
            handler: (data)=>{
                  if(data.newValue !== ''){
                        this.updatePubText(idPublication, index, data.newValue, isFromSeachList);
                  }else{
                    this.toast.makeToast('Aucune Entrée !')
                  }
            }
          },
      ],
      inputs: [
        {
          type: 'text',
          name: 'newValue',
          value: prevValue
          
        }
      ],
    });

    await alert.present();
  }

  updatePubText(idPub: number, index: any, newValue:string, isFromSeachList?: any){
      const data : { 
          id_pub: number,
          newValue: string
     } = {
      id_pub : idPub,
      newValue : newValue
     };
      this.accountApi.post('user-api/updateTextPublication.php', JSON.stringify(data)).subscribe((response)=>{
            if(Object.keys(response).length > 0){
                this.listPublication[index].libelle = data.newValue;
            }
      });
  }

  deletePub(idPublication:any, index:any, isFromSeachList?: boolean){
          const data : { 
          id_pub: number,
          id_users: any
     } = {
      id_pub : idPublication,
      id_users : this.dataUser.id_users
     };
      this.accountApi.post('user-api/deletePub.php', JSON.stringify(data)).subscribe((response)=>{
            if(Object.keys(response).length > 0){
                this.listPublication.splice(index, 1);
            }
      });
  }


  goToDetail(pub: Publication, index: number){
    this.dataUsers.publication = pub;
    this.dataUsers.indexPub =index;

    this.navController.navigateForward('details');
}

async actionSheetDeleteAccount(){
  const actionSheet = await this.actionSheetCtrl.create({
    header: "Après cette action votre compte sera Supprimer definitivement\n Continuer ?",
    buttons: [
      {
        text: 'Annuler',
        role: 'cancel',
        handler: ()=>{
          this.toast.makeToast("Content de vous avoir encore avec nous. Hi-Chat !")
        }
      },
      {
        text: 'Continuer',
        role: 'confirm',
        handler: ()=>{
          this.confrimationToUpdateActionCtrl(true);
        }
      }
    ],
  });

  actionSheet.present();
  const { role } = await actionSheet.onWillDismiss();

  return role === 'confirm';
}

deleteAccount(){
        this.accountApi.post('user-api/deleteAccount.php', JSON.stringify(this.dataUser)).subscribe((data)=>{
            if(Object.keys(data).length > 0 ){
                 this.globalStorage.deleteData('userAccountData');

                 window.location.href = '/';               
            }
        });
}

setAge(){
    
  let currentYear = new Date().getFullYear();
   var usersBDY = Number.parseInt(this.dataUpdate.date_naiss?.split('-')[0]);
    if(usersBDY > 2015){
      return;
    }
    this.dataUpdate.age = currentYear - usersBDY;

}

async confrimationToUpdateActionCtrl(isDeleteAccount?:boolean){
  if(isDeleteAccount){
    const alert = await this.alertController.create({
      header: 'Entrer le mot de passe de votre compte pour confirmer votre identité :',
      buttons: [
        {
          text: 'Annuler',
          role: 'cancel',
          handler: ()=>{
            this.toast.makeToast("Content de vous avoir encore avec nous. Hi-Chat !")
          }
        },
          {
            text: 'Supprimer',
            role: 'confirm',
            handler: (data)=>{
                  if(data.mdp === this.dataUser.mdp){
                        this.deleteAccount();
                  }else{
                    this.toast.makeToast('Mot de passe incorrect !')
                  }
            }
          },
      ],
      inputs: [
        {
          type: 'text',
          name: 'mdp',        
        }
      ],
    });
  
    await alert.present();
  }else{
    const alert = await this.alertController.create({
      header: 'Entrer le mot de passe de votre compte pour confirmer votre identité :',
      buttons: [
        {
          text: 'Annuler',
          role: 'cancel'
        },
          {
            text: 'Modifier',
            role: 'confirm',
            handler: (data)=>{
                  if(data.mdp === this.dataUser.mdp){
                        this.UpdateProfil();
                  }else{
                    this.toast.makeToast('Mot de passe incorrect !')
                  }
            }
          },
      ],
      inputs: [
        {
          type: 'text',
          name: 'mdp',        
        }
      ],
    });
  
    await alert.present();
  }
  
}

UpdateProfil(){
  if(!this.checkDataUserChanged()){
    //dataUser hat change,check data before launch updating process
    if(this.isDataToUpdateCorrect()){
      this.accountApi.post('user-api/updateProfile.php', JSON.stringify(this.dataUpdate)).subscribe((response)=>{
            if(Object.keys(response).length>0){
              this.updatePasswordDiscu(true);
              this.toast.makeToast('Mise à jour effectué avec succes');
              Object.assign(this.dataUser, this.dataUpdate);
              this.dataUsers.userData = JSON.stringify([this.dataUpdate]);
            }
      });
    }
  }else{
      if( this.listDiscSecur.pass_key !== this.discKey){
        this.updatePasswordDiscu();
      }
  }
     
}

updatePasswordDiscu(check?:boolean){
  if(check){  
    if( this.listDiscSecur.pass_key !== this.discKey){
      this.updatePasswordDiscu();
    }
  }else{
    this.rangeMessage.updatePasswordDiscu(this.listDiscSecur.pass_key);
    this.toast.makeToast('Mot de passe des discussions changé !');  
  }
}

checkDataUserChanged(): boolean{
  return Object.is(this.dataUpdate, this.dataUser);

}

isDataToUpdateCorrect(){
  return this.dataUpdate.age !== '' && this.dataUpdate.nom !== '' && this.dataUpdate.prenom !=='' && this.dataUpdate.date_naiss !=='' && this.dataUpdate.mdp !=='' && this.dataUpdate.pays !== '' && this.dataUpdate.ville !=='' && this.dataUpdate.sexe !== '';
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


  logout(){
    this.rangeMessage.AllMessage.length = 0;
    this.rangeMessage.listOfSender.length = 0; 
    this.websocket.webSocketOnClose();
    localStorage.removeItem('ID_PUB_LIST');
    this.globalStorage.deleteData('userAccountData');
    window.location.href = '/?id=' + new Date().getTime();    
  }
}
