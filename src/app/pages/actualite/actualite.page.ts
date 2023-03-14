import { ToastAppService } from './../../services/Toast/toast-app.service';
import { AccountApiService } from './../../services/account-api.service';
import { IonModal, NavController } from '@ionic/angular';
import { User } from './../signup/users.model';
import { Component, OnInit, ViewChild } from '@angular/core';
import { DataUserService } from '../data-user.service';
import { OverlayEventDetail } from '@ionic/core/components';
import { Publication } from './publicatin.model';
import { ListBgColorService } from './list-bg-color.service';
import { SearchService } from '../search/search.service';
import { SaveResultSearchService } from '../search/save-result-search.service';
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
  
  constructor(private dataUserServ: DataUserService,
              private navCtrl: NavController ,
              private accountApi: AccountApiService,
              private toast: ToastAppService,
              private listColor: ListBgColorService,
              private search : SearchService,
              private saveSearch: SaveResultSearchService
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
    if(pub.libelle?.length === 0 || pub.libelle === ''){
        this.toast.makeToast('impossible de publier. Veuillez ecrire un statut !')
    }else{
      let PubToSend = this.setParamPub(pub);
          this.accountApi.post('user-api/postPublication.php', PubToSend).subscribe((data)=>{
              if(Object.keys(data).length > 0 ? true:false){
                  this.toast.makeToast('Votre publication a été publiée avec success!')
                  this.listPublication.unshift(JSON.parse(PubToSend));
                  console.log(this.listPublication);
                }else{
                this.toast.makeToast('Erreur interne du serveur');
              }
          });
      }   
  }

  setParamPub(tmpPub: Publication): any{
    let Pub = new Publication();
      Pub.id_user = this.dataUser.id_users;
      Pub.is_public = this.isPublic ? 1:0;
      Pub.libelle = tmpPub.libelle;
      Pub.colorBg  = tmpPub.colorBg;
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

  doLike(idPublication: any, index:number){
    let data: {
      id_users: any,
      id_pub: number
    } = { 
      id_users: this.dataUser.id_users,
      id_pub: idPublication
    }
    if(this.listPublication[index].alreadyLike == 0 ){
        this.accountApi.post('user-api/addLike.php', JSON.stringify(data)).subscribe((response)=>{
            if(Object.keys(response).length > 0){
                this.addLike(index, this.listPublication[index].nbrLike)
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
      id_users: this.dataUser.id_users,
      id_pub: idPublication
    }
    this.accountApi.post('user-api/unLike.php', JSON.stringify(data)).subscribe((response)=>{
           if(Object.keys(response).length > 0){
                this.delLike(index, this.listPublication[index].nbrLike);
            }else{
              console.log('erreur');
            }
    })
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
            console.log(response);
            this.addOnListPub(response);
        });
  }

  addOnListPub(dataToAdd: Publication[]){
      if(this.listPublication.length > 0){
          dataToAdd.concat(this.listPublication);
          this.listPublication.length = 0;
          this.listPublication = dataToAdd;
          console.log(this.listPublication)
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
  };
  searchUserListLike(){
    this.activeFieldListLikeRslt = this.searchValueListLike.length > 0;
    let execSearch = (user: User)=>{
      return user.nom?.toLowerCase().substring(0, this.searchValueListLike.length) === this.searchValueListLike.toLowerCase();
    }
      this.listUserLikeRslt = this.listUsersLike.filter(execSearch);
      this.searchValueListLike ='';
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
