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
import { OverlayEventDetail } from '@ionic/core/components';
import { SaveResultSearchService } from '../search/save-result-search.service';
import { SearchService } from '../search/search.service';
import { Clipboard } from '@ionic-native/clipboard/ngx';

@Component({
  selector: 'app-account-profils',
  templateUrl: './account-profils.page.html',
  styleUrls: ['./account-profils.page.scss'],
})
export class AccountProfilsPage implements OnInit {
  @ViewChild(IonModal) modal!: IonModal;

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
  activeFieldSearchResultAbm: boolean = false;
  
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
              private search : SearchService,
              private copyCliboard: Clipboard,
              private saveSearch: SaveResultSearchService
              ) { this.dataUser = new User()
                  this.listAbonne = new Array<User>();
                  this.listAbonnement = new Array<User>();
                  this.listPublication = new Array<Publication>();
                  this.listSearchAbm = new Array<User>();
                  this.listSearchFollowers = new Array<User>();
                  this.listUsersLike = new Array<User>();
                  this.listUserLikeRslt = new Array<User>();
              }

  ngOnInit() {
      this.loadDataCurrentUser();
      this.loadFwAbmPubThisUsers();

  }

  handleRefresh(event:any) {
    setTimeout(() => {
      // Any calls to load data go here
      this.loadFwAbmPubThisUsers();      
      event.target.complete();
    }, 2100);
  }

  cancel() {
    this.listUsersLike.length = 0;
    this.modal.dismiss('cancel');
  }

  loadDataCurrentUser(){
    this.dataUser = JSON.parse(this.dataUsers.userData)[0];
  }

  UpdateProfil(){

  }

  updatePp(){
    
  }

  /*canDismiss = async () => {
    const actionSheet = await this.actionSheetCtrl.create({
      header: 'Voulez vous vraiment changer votre photo de profil ?',
      buttons: [
        {
          text: 'Changer',
          role: 'confirm',
          handler: ()=>{
            console.log('Photo changer');
          }
        },
        {
          text: 'Annuler',
          role: 'cancel',
        },
      ],
    });

    actionSheet.present();

    const { role } = await actionSheet.onWillDismiss();

    return role === 'confirm';
  };*/

  loadFwAbmPubThisUsers(){

    this.accountApi.post('user-api/getFwAbmPub.php', this.getParamQuery()).subscribe((response: any)=>{
        if(Object.keys(response).length > 0 ? true:false){
              this.setValuelist(JSON.parse(response));
          }else{
          this.toast.makeToast('Erreur interne du serveur');
        }
    });

}

setValuelist(data: any){
  this.listPublication = data[0].length === 0 ? [] : data[0];
  this.listAbonne = data[1].length === 0 ? [] : data[1];
  this.listAbonnement = data[2].length === 0 ? [] : data[2];
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
          console.log(this.listSearchAbm);
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
          }else{
          }
  })
}

getListUsersLike(idPub: any, idUsersPub: any){
    this.listUsersLike.length = 0;
    let param : { id_pub : any, id_user: any } = {id_pub: idPub , id_user: idUsersPub }
      this.accountApi.post('user-api/getLikeList.php', JSON.stringify(param)).subscribe((data)=>{
          if(Object.keys(data).length > 0){
              this.listUsersLike = JSON.parse(data);
          }else{
              this.listUsersLike = [];
          }
      });
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
              console.log('id:', id_pub);
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
     console.log(idPublication)
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

  logout(){
    this.rangeMessage.AllMessage.length = 0;
    this.rangeMessage.listOfSender.length = 0; 
    this.websocket.webSocketOnClose();
    this.globalStorage.deleteData('userAccountData');
    window.location.reload()
    this.navController.navigateForward('login');
    
  }
}
