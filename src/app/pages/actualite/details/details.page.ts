import { TimeSystemService } from './../../../services/timestamp/time-system.service';
import { TmpCommentService } from './tmp-comment.service';
import { ToastAppService } from 'src/app/services/Toast/toast-app.service';
import { DataUserService } from '../../data-user.service';
import { User } from '../../signup/users.model';
import { Publication } from './../publicatin.model';
import { Component, OnInit } from '@angular/core';
import { AccountApiService } from 'src/app/services/account-api.service';
import { Commentaire } from './Commentaire.model';
import { ActionSheetController, AlertController, NavController } from '@ionic/angular';
import { SaveResultSearchService } from '../../search/save-result-search.service';
import { SearchService } from '../../search/search.service';
import { Clipboard } from '@ionic-native/clipboard/ngx';
import { GetNotificationService } from 'src/app/pages/notifications/get-notification.service';
import { TypeNotification } from 'src/app/pages/notifications/typeNotif.enum';

@Component({
  selector: 'app-details',
  templateUrl: './details.page.html',
  styleUrls: ['./details.page.scss'],
})
export class DetailsPage implements OnInit {
  pub: Publication
  dataUser: User;
  indexPub: any;
  commentaires!: Array<Commentaire>;
  searchUserValueComment: string = '';
  listSearchRslt: Array<Commentaire>;
  activeFieldRslt: boolean = false;
  commentaire: string = '';
  confirm: boolean = false;
  hideSpinnear: boolean = false;
  fullScreenBgUrl: any = '';
  showFullScreenImg: boolean = false;

  constructor(
              private dataUserServ: DataUserService,
              private accountApi: AccountApiService,
              private toast: ToastAppService,
              private tmpComment: TmpCommentService,
              private navCtrl: NavController,
              private search : SearchService,
              private copyCliboard: Clipboard,
              private wsNotif: GetNotificationService,
              private timeSystem: TimeSystemService,
              private saveSearch: SaveResultSearchService,
              private alertController: AlertController,
              private actionSheetCtrl: ActionSheetController,

  ) {
    this.pub = new Publication();
    this.dataUser = new User();
    this.listSearchRslt = new Array<Commentaire>;
   }

  ngOnInit() {
    this.loadUserData();
    this.commentaires = new Array<Commentaire>;

  }
  ionViewWillEnter(){
    this.loadPublication();
    this.checkIfSamePub();
  }

  handleRefresh(event:any) {
    setTimeout(() => {
      // Any calls to load data go here
      this.loadComment();
      event.target.complete();
    }, 2100);
  }

  checkIfSamePub(){
    //verify if the comments of this publication are already loaded
    this.pub.id_CurrentUsers = this.dataUser.id_users;
    if(typeof this.tmpComment.Comment !== 'undefined'){
      if(typeof this.tmpComment.Comment[0] !== 'undefined'){
            if(this.tmpComment.Comment[0].id_publication !== this.pub.id_pub){
              this.commentaires.length = 0;
              this.loadComment();
          }else{
            //same publication
              this.commentaires = this.tmpComment.Comment;
          }
      }else{
        this.loadComment();
      }
     
    }else{
        this.loadComment();
    }
  }

  loadUserData(){
    this.dataUser = JSON.parse(this.dataUserServ.userData)[0];
  }
  
  loadPublication(){
    this.pub = this.dataUserServ.publication;
    this.indexPub = this.dataUserServ.indexPub;
  }

  loadComment(){
    const time = 1800;
          this.accountApi.post('user-api/getCommentOfPubID.php', JSON.stringify(this.pub)).subscribe((data)=>{
                this.commentaires = this.timeSystem.getElapsedTimeComment(JSON.parse(data));
                this.tmpComment.Comment = this.commentaires;
                
          }, (err)=>{
              this.toast.makeToast(''+err.getMessage());
          });
        //set time out to hide spinner after 5s if comment list is null 
          setTimeout(() => {
              if(this.commentaires.length === 0){
                this.hideSpinnear = true;
              } 
          }, time);
  }

  doLike(idCommentaire: any, PID:any, index: number){
    let data: {
      id_users: any,
      id_commentaire: number
      PID: any
    } = { 
      id_users: this.dataUser.id_users,
      id_commentaire: idCommentaire,
      PID: PID
    }
    if(this.commentaires[index].alreadyLike == 0 ){
      this.addLike(index, this.commentaires[index].nbrLike);
        this.accountApi.post('user-api/addLikeComment.php', JSON.stringify(data)).subscribe((response)=>{
            if(Object.keys(response).length > 0){
              
                if(this.commentaires[index].id_users !== this.dataUser.id_users){
                  this.wsNotif.sendNotification(TypeNotification.LIKE_COMMENT, this.dataUser, this.pub, 0,  this.commentaires[index]);
                }
                
            }
        }, (err)=>{
            this.toast.makeToast(''+ err.getMessage());
        });
    }
        
  }

  addLike(index: number, nbrLike:number){
        this.commentaires[index].nbrLike = nbrLike+1;
        this.commentaires[index].alreadyLike = 1;
        this.tmpComment.updateLikeAdd(index, nbrLike);
  }

  delLike(index: number, nbrLike:any){
    this.commentaires[index].nbrLike = nbrLike-1;
    this.commentaires[index].alreadyLike = 0;
    this.tmpComment.updateLikeDel(index, nbrLike);
  }

  addComment(comment: Commentaire){
      this.pub.nbrCommentaire = this.pub.nbrCommentaire + 1;
      this.tmpComment.updateAddComment(comment);
  }

  doUnLike(idCommentaire: any, PID:any, index:number){
    let data: {
      id_users: any,
      id_commentaire: number,
      PID: any
    } = { 
      id_users: this.dataUser.id_users,
      id_commentaire: idCommentaire,
      PID: PID
    }
    this.delLike(index, this.commentaires[index].nbrLike);
    this.accountApi.post('user-api/unLikeComment.php', JSON.stringify(data)).subscribe((response)=>{}, (err)=>{ console.log(err.mesage)})
  }

  searchUserInComments(){
    this.activeFieldRslt = this.searchUserValueComment.length > 0;
    const exec = (comment: Commentaire)=>{

      return comment.nom.toLowerCase().substring(0, this.searchUserValueComment.length) === this.searchUserValueComment;
    }

    this.listSearchRslt = this.commentaires.filter(exec);
  }

  sendComment(){
      if(this.commentaire.length > 0 && this.commentaire !== '' ){
       let comment = this.setParamComment();
          this.accountApi.post('user-api/addCommentOfPubID.php', JSON.stringify(comment)).subscribe((data)=>{
              if(Object.keys(JSON.parse(data)).length > 0){
                  this.confirm = true;
                  this.wsNotif.sendNotification(TypeNotification.COMMENT, this.dataUser, this.pub, comment.libelle);
                  comment.date_comment = "à l'instant";
                  this.commentaires.unshift(comment);
                  this.addComment(comment);
                  this.renit();
                  this.hideConfirmation();
              }
          });
      }
  }

  setParamComment(): Commentaire{
    let value = new Commentaire();
      value.PID = " " + (Math.random() * 1).toFixed(2) + this.dataUser.id_users;
      value.id_users = this.dataUser.id_users;
      value.id_publication = this.pub.id_pub;
      value.profilImgUrl = this.dataUser.profilImgUrl;
      value.libelle = this.commentaire;
      value.nom = this.dataUser.nom;
      value.prenom = this.dataUser.prenom;
      value.nbrLike = 0;
      value.alreadyLike = 0;
      value.pub_PID = this.pub.PID;
      value.date_comment = new Date();

      return value;
  }
  renit(){
    this.commentaire ='';
    this.hideSpinnear = false;
  }

  hideConfirmation(){
    const time = 1700;
        setTimeout(()=>{
            this.commentaires[0].isSend = false;
        }, time);
  }

  async actionSheet(idUserWhoCommented: any, id_commentaire: any, index:number, date:string, PID : any, prevText?:any, isFromSeachList?: boolean){
    if(idUserWhoCommented === this.dataUser.id_users){
      const actionSheet = await this.actionSheetCtrl.create({
        header: 'Quelle action pour ce Commentaire ?',
        buttons: [
          {
            text: 'Modifier',
            role: 'confirm',
            handler: ()=>{
              this.showAlertNewValueComment(id_commentaire, PID, prevText, index, isFromSeachList);
            }
          },
          {
            text: 'Copier',
            role: 'confirm',
            handler: ()=>{
              this.copyTextContent(prevText);
            }
          },
          {
            text:'Supprimer',
            role: 'confirm',
            handler: ()=>{
              this.deleteComment(id_commentaire, PID, this.pub.id_pub, index, idUserWhoCommented, date, isFromSeachList);
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
    }else if(this.pub.id_user === this.dataUser.id_users){
      const actionSheet = await this.actionSheetCtrl.create({
        header: 'Quelle action pour ce Commentaire ?',
        buttons: [
          {
            text: 'Copier',
            role: 'confirm',
            handler: ()=>{
              this.copyTextContent(prevText);
            }
          },
          {
            text:'Supprimer',
            role: 'confirm',
            handler: ()=>{
              this.deleteComment(id_commentaire, PID, this.pub.id_pub, index, idUserWhoCommented, date, isFromSeachList);
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
      const actionSheet = await this.actionSheetCtrl.create({
        header: 'Quelle action pour ce Commentaire ?',
        buttons: [
          {
            text: 'Copier',
            role: 'confirm',
            handler: ()=>{
              this.copyTextContent(prevText);
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
    
  };

  deleteComment(id_commentaire: number, PID: any, id_pub: any, index: number, id_usersWhoCommented: any, date:string, isFromSeachList?:boolean){
    const data : {id_comment: any, id_pub: any, id_users: any,  date: string, PID: any} = {
        id_comment: id_commentaire,
        id_pub: id_pub,
        id_users: id_usersWhoCommented,
        date: date,
        PID: PID
    }
        this.accountApi.post('user-api/delComment.php', JSON.stringify(data)).subscribe((response)=>{});
        

        if(isFromSeachList){
            const indexInCommentList = this.commentaires.findIndex(comment => (comment.id_commentaire === id_commentaire || comment.PID === PID) );
            if(indexInCommentList !== -1){
                this.commentaires.splice(indexInCommentList, 1);
                this.tmpComment.delComment(indexInCommentList);
                this.listSearchRslt.splice(indexInCommentList, 1);
                this.pub.nbrCommentaire = this.pub.nbrCommentaire - 1;
               
            }
        }else{
          this.commentaires.splice(index, 1);
          this.tmpComment.delComment(index);
          this.pub.nbrCommentaire = this.pub.nbrCommentaire - 1;
        }
  }

  async showAlertNewValueComment(id_commentaire: any, PID:any, prevValue:any, index:number, isFromSeachList?:boolean){
    const alert = await this.alertController.create({
      header: 'Nouveau Commentaire:',
      buttons: [
        {
          text: 'Annuler',
          role: 'cancel'
        },
          {
            text: 'Modifier',
            role: 'confirm',
            handler: (updateComment)=>{
                if(updateComment.newValue !== ''){
                    //password correct, then show the discu key
                    this.modifyComment(id_commentaire, PID, prevValue, updateComment.newValue, index, isFromSeachList);
                }else{
                  this.toast.makeToast('Aucun message !');
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

  modifyComment(id_commentaire: any, PID:any, prevValue:any, newValue: any, index:number, isFromSeachList?:boolean){
          const data : {id_commentaire: any, newValue: string, PID: any} = { id_commentaire: id_commentaire, newValue: newValue, PID: PID};

            this.accountApi.post('user-api/updateTextComment.php', JSON.stringify(data)).subscribe((data)=>{
                if(Object.keys(data).length > 0){
                  this.updateComment(id_commentaire, index, newValue, isFromSeachList);
                }
            });
            
  }

  updateComment(id_commentaire:any, index:number, newValue:string, isFromSeachList?:boolean){
        if(isFromSeachList){
            const findIndx = this.commentaires.findIndex(comment => comment.id_commentaire === id_commentaire);
            this.commentaires[findIndx].libelle = newValue;
            this.tmpComment.Comment = this.commentaires;
        }else{
            this.commentaires[index].libelle = newValue;
            this.tmpComment.Comment = this.commentaires;
        }
  }
  
  copyTextContent(textToCopy: string){
    //add plugin copyClipboard
    this.copyCliboard.copy(textToCopy);

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

  showFullScreen(imgBase64Url?: any){
    if(!this.showFullScreenImg){
      this.fullScreenBgUrl = imgBase64Url;
      this.showFullScreenImg = true;
  
    }else{
      this.fullScreenBgUrl = '';
      this.showFullScreenImg = false;
    }
  
  }
}
