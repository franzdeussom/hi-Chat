import { PublicationType } from './../../actualite/publicationType.enum';
import { TimeSystemService } from './../../../services/timestamp/time-system.service';
import { SinalAccountService } from './sinal-account.service';
import { NetworkService } from './../../../services/network/network.service';
import { TypeNotification } from '../../notifications/typeNotif.enum';
import { GetNotificationService } from '../../notifications/get-notification.service';
import { Publication } from './../../actualite/publicatin.model';
import { User } from './../../signup/users.model';
import { AccountApiService } from './../../../services/account-api.service';
import { SecurityMsg } from './../../home/securitymsg.model';
import { ToastAppService } from './../../../services/Toast/toast-app.service';
import { DataUserService } from './../../data-user.service';
import { RangeMessageService } from './../../home/range-message.service';
import { ReceiverDataService } from './../../home/receiver-data.service';
import { NavController, AlertController } from '@ionic/angular';
import { SaveResultSearchService } from './../save-result-search.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-profils',
  templateUrl: './profils.page.html',
  styleUrls: ['./profils.page.scss'],
})
export class ProfilsPage implements OnInit {
  dataUserFound!: any;
  dataCurrentUser: User;
  listDiscSecur: SecurityMsg;
  type: string = 'publications';
  listAbonne: Array<User>;
  listAbonnenment: Array<User>;
  listPublication: Array<Publication>;
  isAlreadyFollowed!: boolean;
  indexIfIsFollowed: number = 0;
  searchValue: string = '';
  searchValueAbm: string = '';
  listSearchFollowers: Array<User>;
  activeFieldSearchResult: boolean = false;
  listSearchAbm: Array<User>;
  activeFieldSearchResultAbm: boolean = false;
  fullScreenBgUrl: any = '';
  showFullScreenImg: boolean = false;
  typeList: string = 'girl';
  searchValueListLike: string = '';
  activeFieldListLikeRslt: boolean = false;
  listUserLikeRslt: Array<User> = [];
  listUsersLike: Array<User> = [];
  isVideo : string = PublicationType.PUBLICATION_VIDEO;

  constructor(private searchResltService: SaveResultSearchService,
              private navCtrl : NavController,
              private rangeMessage: RangeMessageService,
              private toast: ToastAppService,
              private accountApi: AccountApiService,
              private alertController: AlertController,
              private dataUser: DataUserService,
              private network: NetworkService,
              private wsNotif: GetNotificationService,
              private timeSystem : TimeSystemService,
              private receiverData: ReceiverDataService)
              {
                this.listDiscSecur = new SecurityMsg();
                this.dataCurrentUser = new User();
                this.listAbonne = new Array<User>();
                this.listAbonnenment = new Array<User>();
                this.listPublication = new Array<Publication>();
                this.listSearchFollowers = new Array<User>();
                this.listSearchAbm = new Array<User>();
                
               }

  ngOnInit() {
      this.checkTheData();
      this.loadSecurityDisc();
      this.getDataCurrentUser();
      this.isAlreadyAddOnFollowList();
}

ionViewWillEnter(){
  this.loadFwAbmPubThisUsers();      
} 

  async loadSecurityDisc(){
      this.listDiscSecur.discussion_list  = await this.rangeMessage.getListMsgSecure();
      this.listDiscSecur.pass_key = await this.rangeMessage.getPassMsgKey();

      if(!Array.isArray(this.listDiscSecur.discussion_list)){
        this.listDiscSecur.discussion_list = [];
      }
   }

  signal(){
    
      const data = { 
        id_user_WMS: this.dataCurrentUser.id_users,
        id_user_S: this.dataUserFound.id_users
      };

      this.accountApi.postSignal('user-api/signalAccount.php', data).subscribe((resp) =>{
          if(Object.keys(resp).length > 0){
            this.wsNotif.kontoMelden(this.dataUserFound.id_users);
            this.toast.makeToast('Compte Signalé ! Merci de signaler des activités supectes ! Hi-Chat ')  
          }else{
            this.toast.makeToast('Erreur lors du singalement de ce profil !');
          }
      });
      
  }
  
  checkTheData(){
    if(this.searchResltService.isFromSearch){
      this.dataUserFound = this.searchResltService.dataUserFound;
      this.searchResltService.isFromSearch = false;
    }else{
      this.dataUserFound = this.searchResltService.dataUserFound[0];
    }
  }

  async presentEntryPassword(){
    const alert = await this.alertController.create({
      header: 'Entrer le mot de passe pour acceder à la discussion',
      buttons: [
        {
          text: 'Annuler',
          role: 'cancel'
        },
          {
            text: 'Valider',
            role: 'confirm',
            handler: (password)=>{
                if(password.pass === this.listDiscSecur.pass_key){
                    //password correct, then nav to discussion
                    this.rangeMessage.setMessageOfDiscusion(this.dataUserFound.id_users);
                    this.navCtrl.navigateForward('discusion');
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

  follow(){
    //id_WF = id users who make follow; id_F = id user who is followed
      const getParamQuery = ()=>{
            const queryParam : {
              id_WF: any,
              id_F: number
          } = {
            id_WF: this.dataCurrentUser.id_users,
            id_F: this.dataUserFound.id_users
          };
          return JSON.stringify(queryParam);
      }
      
      if(!this.isAlreadyAddOnFollowList()){
          this.accountApi.post('user-api/addFollowers.php', getParamQuery()).subscribe((response)=>{
                if(Object.keys(response).length > 0 ? true:false){
                    this.toast.makeToast('Vous suivez desormais ' + this.dataUserFound.prenom);
                    this.listAbonne.push(this.dataCurrentUser);
                    this.isAlreadyFollowed = true;
                    this.wsNotif.sendNotification(TypeNotification.NEW_FOLLOWER, this.dataCurrentUser, 0, this.dataUserFound);
                }else{
                    this.toast.makeToast('Erreur interne du serveur');
              }
          });
      }else{
        this.accountApi.post('user-api/delFollowers.php', getParamQuery()).subscribe((response)=>{
          if(Object.keys(response).length > 0 ? true:false){
              this.toast.makeToast("Vous n'ètes plus abonné(e) à " + this.dataUserFound.prenom);
              this.listAbonne.splice(this.indexIfIsFollowed, 1);
              this.isAlreadyFollowed = false;
          }else{
              this.toast.makeToast('Erreur interne du serveur');
          }
        });
      }
   }

   isAlreadyAddOnFollowList(): boolean{
    let isExist = false;

        if(Array.isArray(this.listAbonne)){
            this.listAbonne.forEach((user: User, index: number)=>{
                if(user.id_users === this.dataCurrentUser.id_users){
                    isExist = true;
                    this.isAlreadyFollowed = true;
                    this.indexIfIsFollowed = index;
                }
            });
        }else{
          this.isAlreadyFollowed = false;
        }

    return isExist;
   }

  loadFwAbmPubThisUsers(){
    if(typeof this.searchResltService.isOderUser === 'boolean' || this.searchResltService.isOderUser){
          this.accountApi.post('user-api/getFwAbmPubOrderUser.php', this.getParamQuery(true)).subscribe((response: any)=>{
          if(Object.keys(response).length > 0 ? true:false){
                this.setValuelist(JSON.parse(response));
                this.isAlreadyAddOnFollowList();
            }else{
            this.toast.makeToast('Erreur interne du serveur');
          }
      });
    }else{
        this.accountApi.post('user-api/getFwAbmPub.php', this.getParamQuery(false)).subscribe((response: any)=>{
          if(Object.keys(response).length > 0 ? true:false){
                this.setValuelist(JSON.parse(response));
                this.isAlreadyAddOnFollowList();
            }else{
            this.toast.makeToast('Erreur interne du serveur');
          }
      });
    }
      

  }

  setValuelist(data: any){
    this.listPublication = data[0].length === 0 ? [] : data[0];
    this.listAbonne = data[1].length === 0 ? [] : data[1];
    this.listAbonnenment = data[2].length === 0 ? [] : data[2];
    this.listPublication = this.timeSystem.getElapsedTime(this.listPublication);

  }

  getParamQuery(isOrderUser: boolean): any{
    if(isOrderUser){
      const dataUser : {
        id_users: number,
        id_oderUser: any
        nom: string
      } = {
        id_users: this.dataUserFound.id_users,
        id_oderUser: this.dataCurrentUser.id_users,
        nom: this.dataUserFound.nom
      };
      return JSON.stringify(dataUser);
    }else{
      const dataUser : {
        id_users: number,
        nom: string
      } = {
        id_users: this.dataUserFound.id_users,
        nom: this.dataUserFound.nom
      };
      return JSON.stringify(dataUser);
    }
    
  }

  getDataCurrentUser(){
        this.dataCurrentUser = JSON.parse(this.dataUser.userData)[0];
  }

  searchFollowers(tokken: number){
    if(tokken == 1){
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

            this.listSearchAbm = this.listAbonnenment.filter(execAbm);
            this.searchValueAbm = '';
  }

  doLike(idPublication: any, index:number){
    let data: {
      id_users: any,
      id_pub: number
    } = { 
      id_users: this.dataCurrentUser.id_users,
      id_pub: idPublication
    }
    if(this.listPublication[index].alreadyLike == 0 ){
      this.addLike(index, this.listPublication[index].nbrLike);
        this.accountApi.post('user-api/addLike.php', JSON.stringify(data)).subscribe((response)=>{
            if(Object.keys(response).length > 0){
                  this.wsNotif.sendNotification(TypeNotification.LIKE, this.dataCurrentUser, this.listPublication[index]);
            }else{
              console.log('erreur');
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
      id_users: this.dataCurrentUser.id_users,
      id_pub: idPublication
    }
    this.accountApi.post('user-api/unLike.php', JSON.stringify(data)).subscribe((response)=>{
           if(Object.keys(response).length > 0){
              this.wsNotif.sendNotification(TypeNotification.UNLIKE, this.dataCurrentUser, this.listPublication[index])
                this.delLike(index, this.listPublication[index].nbrLike);
            }else{
              console.log('erreur');
            }
    })
  }

  getListUsersLike(idPub: any, idUsersPub: any){
    //get list of users who have liked this current pub
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

  searchUserListLike(){
    this.activeFieldListLikeRslt = this.searchValueListLike.length > 0;
    let execSearch = (user: User)=>{
      return user.nom?.toLowerCase().substring(0, this.searchValueListLike.length) === this.searchValueListLike.toLowerCase();
    }
      this.listUserLikeRslt = this.listUsersLike.filter(execSearch);
      this.searchValueListLike ='';
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

  goToDetail(pub: Publication, index: number){
    this.dataUser.publication = pub;
    this.dataUser.indexPub =index;

    this.navCtrl.navigateForward('details');
  }

  async goToChatPage(){
      this.receiverData.ID_RECIVER_AND_DATA = this.dataUserFound;
      if(await this.rangeMessage.isDiscussionSecured(this.dataUserFound.id_users)){
          this.presentEntryPassword();
      }else{
        this.rangeMessage.setMessageOfDiscusion(this.dataUserFound.id_users);
        this.navCtrl.navigateForward('discusion');
      }

  }

}
