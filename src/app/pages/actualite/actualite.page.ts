import { ToastAppService } from './../../services/Toast/toast-app.service';
import { AccountApiService } from './../../services/account-api.service';
import { IonModal, NavController, ActionSheetController, AlertController } from '@ionic/angular';
import { User } from './../signup/users.model';
import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { DataUserService } from '../data-user.service';
import { OverlayEventDetail } from '@ionic/core/components';
import { Publication } from './publicatin.model';
import { ListBgColorService } from './list-bg-color.service';
import { SearchService } from '../search/search.service';
import { Clipboard } from '@ionic-native/clipboard/ngx';
import { SaveResultSearchService } from '../search/save-result-search.service';
import { GetNotificationService } from 'src/app/pages/notifications/get-notification.service';
import { TypeNotification } from 'src/app/pages/notifications/typeNotif.enum';
@Component({
  selector: 'app-actualite',
  templateUrl: './actualite.page.html',
  styleUrls: ['./actualite.page.scss'],
}) 
export class ActualitePage implements OnInit {
  type: string = 'home';
  dataUser: User = new User();
  @ViewChild(IonModal) modal!: IonModal;
  typeList: string = 'girl';
  searchValueListLike: string = '';
  activeFieldListLikeRslt: boolean = false;
  listUserLikeRslt: Array<User>;
  listUsersLike: Array<User>;
  name!: string;
  publication: Publication;
  listPublication: Array<Publication>;
  isPublic: boolean = false;
  showApercu: boolean = false;
  colorBgApercu: string = '';
  Color: Array<any>;
  typeNotif!: TypeNotification;
  
  constructor(private dataUserServ: DataUserService,
              private cdRef:ChangeDetectorRef,
              private navCtrl: NavController ,
              private accountApi: AccountApiService,
              private toast: ToastAppService,
              private wsNotif: GetNotificationService,
              private listColor: ListBgColorService,
              private search : SearchService,
              private actionSheet: ActionSheetController,
              private alertController: AlertController,
              private saveSearch: SaveResultSearchService,
              private copyCliboard: Clipboard
              ) { this.publication = new Publication();
                  this.Color = new Array();
                  this.Color = this.listColor.Color;
                  this.listPublication = new Array<Publication>();
                  this.listUserLikeRslt = new Array<User>(); 
                  this.listUsersLike = new Array<User>(); 
              }

  ngOnInit() {
    this.loadUserData();
    this.loadFriendPublications();

  }
  ngAfterViewChecked() {
    this.onPubLikeListenner();
    this.cdRef.detectChanges();
  }

  onPubLikeListenner(){
    const PID = this.wsNotif.addLikeOnPublication.PID; 
    if(typeof PID !== 'undefined'){
        let index = this.listPublication.findIndex((pub =>  pub.PID === PID));
        
        if(index != -1){
          if(this.wsNotif.addLikeOnPublication.type === TypeNotification.LIKE){
            this.listPublication[index].nbrLike = this.listPublication[index].nbrLike +1;
            this.wsNotif.addLikeOnPublication.PID = undefined;
          }else{
            this.listPublication[index].nbrLike = this.listPublication[index].nbrLike - 1;
            this.wsNotif.addLikeOnPublication.PID = undefined;
            this.wsNotif.addLikeOnPublication.type = '';
          }
            
        }

    }
  }
 
  cancel() {
    this.renit();
    this.modal.dismiss(null, 'cancel');
  }

  confirm() {
    this.modal.dismiss(this.publication, 'confirm');
  }

  onWillDismiss(event: Event) {
    const ev = event as CustomEvent<OverlayEventDetail<any>>;
    if(ev.detail.role === 'confirm') {
      this.createPub(ev.detail.data);
    }
  }

  segmentChanged(event:any){
        if(this.type === 'globe'){
          console.log('load globe publications');
        }
  }

  createPub(pub: Publication){
    if(!this.isPubConform(pub)){
        console.log(pub);
        this.toast.makeToast('impossible de publier. Veuillez ecrire un statut !')
    }else{
      let PubToSend = this.setParamPub(pub);
      console.log('pub to send', PubToSend);
          this.accountApi.post('user-api/postPublication.php', PubToSend).subscribe((data)=>{
              if(Object.keys(data).length > 0 ? true:false){
                  this.toast.makeToast('Votre publication a été publiée avec success!');
                  this.listPublication.unshift(JSON.parse(PubToSend));
                  this.wsNotif.sendNotification(TypeNotification.NEW_PUBLICATION, this.dataUser, JSON.parse(PubToSend))
                }else{
                this.toast.makeToast('Erreur interne du serveur');
              }
          });
      }   
  }
  isPubConform(pub: Publication): boolean{
      return (pub.libelle !== '' && pub.libelle?.length != 0);
  }
  isPubColorBgSet(pub: Publication): boolean{
    return (pub.colorBg !== '' && pub.colorBg?.length != 0);
  }
  setParamPub(tmpPub: Publication): any{
    let Pub = new Publication();
      Pub.id_user = this.dataUser.id_users;
      Pub.PID = " "+ (Math.random() * 1).toFixed(2) + this.dataUser.id_users;
      Pub.is_public = this.isPublic ? 1:0;
      Pub.libelle = tmpPub.libelle;
      Pub.alreadyLike = 0;
      Pub.colorBg  = this.isPubColorBgSet(tmpPub) ? tmpPub.colorBg : this.Color[0].value; //when the user hat don't a color choose, set the default color
      let min = new Date().getMinutes() < 10 ? '0'+new Date().getMinutes():new Date().getMinutes();
      Pub.date_pub = '' + new Date().getHours().toString() + ':' +  min.toString() + ' | ' + new Date().toString().split(' ')[1]  + ' - ' + new Date().toString().split(' ')[0];
      //this.publication.url_file = null;
      Pub.nom = this.dataUser.nom;
      Pub.prenom = this.dataUser.prenom;
      Pub.profilImgUrl = this.dataUser.profilImgUrl;

      this.renit();

      return JSON.stringify(Pub);
  }

  renit(){
    this.publication.libelle = '';
    this.isPublic = false;
    this.publication.colorBg = '';
    this.renitAp();
  }

  doLike(idPublication: any, index:number, pub: any){
    let data: {
      id_users: any,
      id_pub: number,
      PID: any
    } = { 
      id_users: this.dataUser.id_users,
      id_pub: idPublication,
      PID: pub.PID
    }

    if(this.listPublication[index].alreadyLike == 0 ){
      this.addLike(index, this.listPublication[index].nbrLike);
        this.accountApi.post('user-api/addLike.php', JSON.stringify(data)).subscribe((response)=>{
            if(Object.keys(response).length > 0){
              if(this.listPublication[index].id_user !== this.dataUser.id_users){
                  this.wsNotif.sendNotification(TypeNotification.LIKE, this.dataUser, pub);
              }
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

  doUnLike(idPublication: any, index:number, pub: Publication){
    let data: {
      id_users: any,
      id_pub: number
      PID: any
    } = { 
      id_users: this.dataUser.id_users,
      id_pub: idPublication,
      PID: pub.PID
    }
    this.delLike(index, this.listPublication[index].nbrLike);

    this.accountApi.post('user-api/unLike.php', JSON.stringify(data)).subscribe((response)=>{
           if(Object.keys(response).length === 0){
                this.toast.makeToast('Erreur !');     
            }else{
              this.wsNotif.sendNotification(TypeNotification.UNLIKE, this.dataUser, pub)
            }
    });
  }

  setOrUnsetPub(){
    if(this.isPublic){
      this.isPublic = false;
    }else{
      this.isPublic = true;
    }
  }

  loadFriendPublications(){
        this.accountApi.post('user-api/getFriendPub.php', JSON.stringify(this.dataUser)).subscribe((data)=>{
            let response = JSON.parse(data);
            this.addOnListPub(response);
        });
  }

  addOnListPub(dataToAdd: Publication[]){
      if(this.listPublication.length > 0){
          dataToAdd.concat(this.listPublication);
          this.listPublication.length = 0;
          this.listPublication = dataToAdd;
      }else{
        this.listPublication = dataToAdd;

      }
  }

  loadGlobePublication(){

  }

  loadUserData(){
    this.dataUser = JSON.parse(this.dataUserServ.userData)[0];
  }

  renitAp(){
    this.showApercu = false;
    this.colorBgApercu = '';
  }
  setBgApercu(color: string){
    this.showApercu = true;
    this.colorBgApercu = color;
    this.publication.colorBg  = color;
  }

  handleRefresh(event:any) {
    setTimeout(() => {
      // Any calls to load data go here
      if(this.type === 'home'){
        console.log('isHome');
      }else{
        console.log('isGlobe');

      }
      event.target.complete();
    }, 2100);
  }

  searchUserListLike(){
    this.activeFieldListLikeRslt = this.searchValueListLike.length > 0;
    let execSearch = (user: User)=>{
      return user.nom?.toLowerCase().substring(0, this.searchValueListLike.length) === this.searchValueListLike.toLowerCase();
    }
      this.listUserLikeRslt = this.listUsersLike.filter(execSearch);
      this.searchValueListLike ='';
  }

  async actionSheetPub(idUserWhoCommented: any, id_pub: any, PID:any, index:number,  prevText?:any, isFromSeachList?: boolean){
    if(idUserWhoCommented === this.dataUser.id_users){
      const actionSheet = await this.actionSheet.create({
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
              console.log('Copier');
            }
          },
          {
            text:'Supprimer',
            role: 'confirm',
            handler: ()=>{
              this.deletePub(index, id_pub, PID, isFromSeachList);
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
    }else{
      const actionSheet = await this.actionSheet.create({
        header: 'Quelle action pour cette publication ?',
        buttons: [
          {
            text: 'Copier le text',
            role: 'confirm',
            handler: ()=>{
              this.copiedText(prevText);
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

  deletePub(index:any, idPublication:any, PID : any, isFromSeachList?: boolean){
    console.log('PID', PID);   
    const data : { 
          id_pub: number,
          id_users: any,
          PID: any
     } = {
      id_pub : idPublication,
      id_users : this.dataUser.id_users,
      PID: PID
     };

      this.accountApi.post('user-api/deletePub.php', JSON.stringify(data)).subscribe((response)=>{
            if(Object.keys(response).length > 0){
                this.listPublication.splice(index, 1);
                console.log(data);
            }
      });
  }


  goToProfilFriend(nom: any, prenom:any){
    if(nom === this.dataUser.nom){
      this.navCtrl.navigateBack('tabs/account-profils');
    }else{
      let simpleSearchValues : {
        'nom': string,
        'prenom': string
      } = {
        nom: nom,
        prenom: prenom
      };

      this.search.simpleSearch('user-api/search.php', JSON.stringify(simpleSearchValues)).subscribe((data)=>{
        if(Object.keys(data).length === 0 ? false : true ){
              console.log(data);
               this.loadDataFriend(data);
            }else{
            }
      });
    }
      
  }

  loadDataFriend(profil: any){
    this.saveSearch.dataUserFound = profil;
    this.saveSearch.isOderUser = true;
    this.navCtrl.navigateForward('search/profils');
  }

  getListUsersLike(idPub: any, idUsersPub: any){
    this.listUsersLike.length = 0;
    let param : { id_pub : any, id_user: any } = {id_pub: idPub , id_user: idUsersPub }
      this.accountApi.post('user-api/getLikeList.php', JSON.stringify(param)).subscribe((data)=>{
          if(Object.keys(data).length > 0){
              this.listUsersLike = JSON.parse(data);
              console.log(this.listUsersLike);
          }else{
              this.listUsersLike = [];
          }
      });
  }

  goToDetail(pub: Publication, index: number){
      this.dataUserServ.publication = pub;
      this.dataUserServ.indexPub = index;

      this.navCtrl.navigateForward('details');
  }
  goToProfil(){
      this.navCtrl.navigateForward('tabs/account-profils');
  }
}
