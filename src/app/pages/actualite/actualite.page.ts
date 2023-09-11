import { PublicationType } from './publicationType.enum';
import { PremiumService } from './../../services/premium.service';
import { SheetControllerService } from './../../services/Toast/sheet-controller.service';
import { TimeSystemService } from './../../services/timestamp/time-system.service';
import { NetworkService } from './../../services/network/network.service';
import { ToastAppService } from './../../services/Toast/toast-app.service';
import { AccountApiService } from './../../services/account-api.service';
import { IonModal, NavController, ActionSheetController, AlertController } from '@ionic/angular';
import { User } from './../signup/users.model';
import { ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { DataUserService } from '../data-user.service';
import { OverlayEventDetail } from '@ionic/core/components';
import { Publication } from './publicatin.model';
import { ListBgColorService } from './list-bg-color.service';
import { SearchService } from '../search/search.service';
import { Clipboard } from '@ionic-native/clipboard/ngx';
import { SaveResultSearchService } from '../search/save-result-search.service';
import { TypeNotification } from '../notifications/typeNotif.enum';
import { GetNotificationService } from '../notifications/get-notification.service';
@Component({
  selector: 'app-actualite',
  templateUrl: './actualite.page.html',
  styleUrls: ['./actualite.page.scss'],
}) 
export class ActualitePage implements OnInit {
  @ViewChild('filechoose', { static: true}) public FileChooserElementRef!: ElementRef;

  items: File[] = [];
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
  listPublicationGLobe: Array<Publication>;
  isPublic: boolean = false;
  showApercu: boolean = false;
  colorBgApercu: string = '';
  Color: Array<any>;
  typeNotif!: TypeNotification;
  num: number = 0;
  fullScreenBgUrl: any = '';
  typePublication: string ='';
  showFullScreenImg: boolean = false;
  waitingResponse: boolean =false;
  isVideo : string = PublicationType.PUBLICATION_VIDEO;
  isImage : string = PublicationType.PUBLICATION_IMAGE;

  constructor(private dataUserServ: DataUserService,
              private cdRef:ChangeDetectorRef,
              private navCtrl: NavController ,
              private saveSearch: SaveResultSearchService,
              private accountApi: AccountApiService,
              private toast: ToastAppService,
              private wsNotif: GetNotificationService,
              private listColor: ListBgColorService,
              private search : SearchService,
              private timeSystem : TimeSystemService,
              private globalSheetCtrl: SheetControllerService, 
              private actionSheet: ActionSheetController,
              private alertController: AlertController,
              private copyCliboard: Clipboard,
              private network: NetworkService,
              private premiumService: PremiumService
              ) { this.publication = new Publication();
                  this.Color = new Array();
                  this.Color = this.listColor.Color;
                  this.listPublication = new Array<Publication>();
                  this.listPublicationGLobe = new Array<Publication>();
                  this.listUserLikeRslt = new Array<User>(); 
                  this.listUsersLike = new Array<User>(); 
              }

 ngOnInit() {
    this.loadUserData();
    setTimeout(() => {
      this.loadFriendPublications();
      this.init();
    }, 800);
    this.checkPremiumAccount();
  }

  ngAfterViewChecked() {
    this.loadUserData();
    this.onPubLikeListenner();
    this.cdRef.detectChanges();
  }


  init(){
    this.publication.type_pub = '';
    this.publication.libelle = '';
    this.isPublic = false;
    this.publication.colorBg = '';
    this.publication.url_file = null;
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
         this.getPubGlobalOnListPub();
        }else if(this.type === 'watched'){
          //loadVideo
          
        }
  }

  createPub(pub: Publication){
    if(!this.isPubConform(pub)){
        this.toast.makeToast('impossible de publier. Veuillez ecrire un statut !')
    }else{
      let PubToSend = this.setParamPub(pub);
          this.accountApi.post('user-api/postPublication.php', PubToSend).subscribe((data)=>{
              if(Object.keys(data).length > 0 ? true:false){
                  this.toast.makeToast('Votre publication a été publiée avec success!');
                  this.listPublication.unshift(JSON.parse(PubToSend));
                  
                  this.wsNotif.sendNotification(TypeNotification.NEW_PUBLICATION, this.dataUser, JSON.parse(PubToSend));

                  this.listPublication[0].date_pub = this.timeSystem.buildElapsedTime(this.listPublication[0].date_pub);
                }else{
                this.toast.makeToast('Erreur interne du serveur');
              }
          });
      }   
  }
  
  listenerInputChange(evt: any) {
    const wireUpFileChooser = (e:any) => {
            const files = e.target.files as File[];
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
    };
    wireUpFileChooser(evt);
    
 }

 isFileValid(file: File): any{
  let response : {
    isValid: boolean,
    extension: string
  } = {
    isValid : false,
    extension: ''
  };

  const extensionSupportList = ['JPG', 'PNG', 'JPEG', 'SVG', 'TIF', 'GIF', 'MP4', 'MOV','AVI', 'MPEG', 'VOD']
  let extension = file.type.split('/')[1].toUpperCase();
  let index = extensionSupportList.indexOf(extension);

  const getType = (indexTab:number)=>{
          return (indexTab+1) > 6 ? PublicationType.PUBLICATION_VIDEO:PublicationType.PUBLICATION_IMAGE;
  }

  if(index != -1){
      response.isValid  = true;
      response.extension = extensionSupportList[index];
      this.typePublication = getType(index);
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
     this.publication.url_file = base64Url;
  });

  reader.readAsDataURL(file);
  this.items.length = 0;
  return base64Url;
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
      Pub.is_public = this.isPublic ? 0:1;
      Pub.libelle = tmpPub.libelle;
      Pub.alreadyLike = 0;
      Pub.colorBg  = this.isPubColorBgSet(tmpPub) ? tmpPub.colorBg : this.Color[0].value; //when the user hat don't a color choose, set the default colorBg
      //Pub.date_pub = '' + new Date().getHours().toString() + ':' +  min.toString() + ' | ' + new Date().toString().split(' ')[1]  + ' - ' + new Date().toString().split(' ')[0] + '/*/' + new Date().getFullYear() + '/*/' + new Date().getMonth() + '/*/' + new Date().getDay();
      Pub.date_pub = new Date();
      Pub.url_file = typeof tmpPub.url_file !== 'undefined' ? tmpPub.url_file: null;
      Pub.nom = this.dataUser.nom;
      Pub.prenom = this.dataUser.prenom;
      Pub.profilImgUrl = this.dataUser.profilImgUrl;

      Pub.type_pub = this.typePublication;

      this.renit();

      return JSON.stringify(Pub);
  }

  renit(){
    this.publication.libelle = '';
    this.isPublic = false;
    this.publication.colorBg = '';
    this.publication.type_pub ='';
    this.renitAp();
  }

  doLike(idPublication: any, index:number, pub: any, isFromGlobe?: boolean){
    let data: {
      id_users: any,
      id_pub: number,
      PID: any
    } = { 
      id_users: this.dataUser.id_users,
      id_pub: idPublication,
      PID: pub.PID
    }
    this.playSoundOnLike();

      if(isFromGlobe){
        if(this.listPublicationGLobe[index].alreadyLike === 0){
             this.addLike(index, this.listPublicationGLobe[index].nbrLike, isFromGlobe);
                  this.accountApi.post('user-api/addLike.php', JSON.stringify(data)).subscribe((response)=>{
              if(Object.keys(response).length > 0){
                if(this.listPublicationGLobe[index].id_user !== this.dataUser.id_users){
                    this.wsNotif.sendNotification(TypeNotification.LIKE, this.dataUser, pub);
                }
              }
          }, (err)=>{
              this.toast.makeToast(''+ err.getMessage());
          });
        }
      }else{
        if(this.listPublication[index].alreadyLike === 0){
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
              
  }

  addLike(index: number, nbrLike:any, isFromGlobe?: boolean){
    if(isFromGlobe){
      this.listPublicationGLobe[index].nbrLike = nbrLike+1; 
      this.listPublicationGLobe[index].alreadyLike = 1;
    }else{
      this.listPublication[index].nbrLike = nbrLike+1; 
      this.listPublication[index].alreadyLike = 1;  
    }
  }
  
  delLike(index: number, nbrLike:any, isFromGlobe?:boolean){
    if(isFromGlobe){
      this.listPublicationGLobe[index].nbrLike = nbrLike-1; 
      this.listPublicationGLobe[index].alreadyLike = 0;
    }else{
      this.listPublication[index].nbrLike = nbrLike-1; 
      this.listPublication[index].alreadyLike = 0;  
    }
  }

  doUnLike(idPublication: any, index:number, pub: Publication, isFromGlobe?: boolean){
    let data: {
      id_users: any,
      id_pub: number
      PID: any
    } = { 
      id_users: this.dataUser.id_users,
      id_pub: idPublication,
      PID: pub.PID
    }

    if(isFromGlobe){
        this.delLike(index, this.listPublicationGLobe[index].nbrLike, isFromGlobe);  
    }else{
        this.delLike(index, this.listPublication[index].nbrLike);     
    }

    this.accountApi.post('user-api/unLike.php', JSON.stringify(data)).subscribe((response)=>{
           if(Object.keys(response).length === 0){
                this.toast.makeToast('Erreur !');     
            }else{
              this.wsNotif.sendNotification(TypeNotification.UNLIKE, this.dataUser, pub)
            }
    });
  }

  playSoundOnLike(){

  }

  setOrUnsetPub(){

    if(this.isPublic){
      this.isPublic = false;
    }else{
      if(this.dataUser.isPremiumAccount){
          this.isPublic = true;
      }else{
          this.globalSheetCtrl.AlertSuscribePremiumController();
          this.modal.dismiss();
      }
    }
  }

  loadFriendPublications(){
    this.waitingResponse = true;
        this.accountApi.post('user-api/getFriendPub.php', JSON.stringify(this.dataUser)).subscribe((data)=>{
            let response = data;
            this.waitingResponse =false;
            this.addOnListPub(response);
            this.network.CONNEXION_DB_STATE = 200;
            this.listPublication = this.timeSystem.getElapsedTime(this.listPublication);


        }, (err)=>{
            this.waitingResponse =false;
            this.network.CONNEXION_DB_STATE = 500;
            this.network.makeToastErrorConnection('Aucune connexion internet');
        });
  }

  async addOnListPub(dataToAdd: Publication[]){
      if(this.listPublication.length > 0){
          dataToAdd.concat(this.listPublication);
          this.listPublication.length = 0;
          this.listPublication = dataToAdd;
      }else{
        this.listPublication = dataToAdd;
      }
  }

  loadGlobePublication(): Promise<any>{
     return new Promise((resole, reject)=>{
          this.waitingResponse = true;
          this.accountApi.post('user-api/getGlobePub.php', JSON.stringify(this.dataUser)).subscribe((data)=>{
            this.waitingResponse =false;
         
           if(Object.keys(data).length > 0){
            this.listPublicationGLobe = JSON.parse(data);
            this.network.CONNEXION_DB_STATE = 200;
            this.listPublicationGLobe = this.timeSystem.getElapsedTime(this.listPublicationGLobe);

              resole(this.listPublicationGLobe);
            }
      }, (err)=> {
          reject(err);
          this.waitingResponse =false;
          this.network.CONNEXION_DB_STATE = 500;
          this.network.makeToastErrorConnection('Aucune connexion internet');
      });
    }) 
  }
     
  async getPubGlobalOnListPub(){
    if(this.listPublicationGLobe.length === 0){
          this.listPublicationGLobe = await this.loadGlobePublication();
    }
  }

  loadUserData(){
    this.dataUser = JSON.parse(this.dataUserServ.userData)[0];
    this.dataUser.isPremiumAccount = this.dataUser.isPremiumAccount == 1 ? true:false;
  }

  async checkPremiumAccount(){
    if(this.dataUser.isPremiumAccount){
      let isPremiumValid = this.timeSystem.isPremiumDateValid(this.dataUser.dateStartPremium, this.dataUser.dateEndPremium);
      if(!isPremiumValid){
        //premium validity expired
          this.dataUser.isPremiumAccount = false;
          Object.assign(this.dataUserServ.userData, [this.dataUser]);
          //update in database
          await this.premiumService.updateAccountPremium('user-api/updatePremium.php', this.dataUser.id_users, false);
  
      }
    }
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
    if(this.type === 'home'){
      this.loadFriendPublications();
    }else{
      this.loadGlobePublication();
    }
    setTimeout(() => {
      // Any calls to load data go here
     
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
              this.copiedText(prevText);
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
            this.network.CONNEXION_DB_STATE = 200;
      }, (err)=>{
          this.network.CONNEXION_DB_STATE = 500;
          this.network.makeToastErrorConnection('Erreur de connexion');
      });
  }

  deletePub(index:any, idPublication:any, PID : any, isFromSeachList?: boolean){
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
            }
          this.wsNotif.sendNotification(TypeNotification.DELETE_PUB, this.dataUser, this.listPublication[index]);
          this.network.CONNEXION_DB_STATE = 200;

      },  (err)=>{
        this.network.CONNEXION_DB_STATE = 500;
        this.network.makeToastErrorConnection('Erreur de connexion.');

      });
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

  showFullScreen(imgBase64Url?: any){
    if(!this.showFullScreenImg){
      this.fullScreenBgUrl = imgBase64Url;
      this.showFullScreenImg = true;
  
    }else{
      this.fullScreenBgUrl = '';
      this.showFullScreenImg = false;
    }
  
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

      this.search.simpleSearch('user-api/search/search.php', JSON.stringify(simpleSearchValues)).subscribe((data)=>{
        if(Object.keys(data).length === 0 ? false : true ){
               this.loadDataFriend(data);
            }
      });
 }
  
    
}

loadDataFriend(profil: any){
  this.saveSearch.dataUserFound = profil;
  this.saveSearch.isOderUser = true;
  this.navCtrl.navigateForward('search/profils');
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
