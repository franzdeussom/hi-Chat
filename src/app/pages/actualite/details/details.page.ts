import { ToastAppService } from 'src/app/services/Toast/toast-app.service';
import { DataUserService } from '../../data-user.service';
import { User } from '../../signup/users.model';
import { Publication } from './../publicatin.model';
import { Component, OnInit } from '@angular/core';
import { AccountApiService } from 'src/app/services/account-api.service';
import { Commentaire } from './Commentaire.model';

@Component({
  selector: 'app-details',
  templateUrl: './details.page.html',
  styleUrls: ['./details.page.scss'],
})
export class DetailsPage implements OnInit {
  pub: Publication
  dataUser: User;
  indexPub: any;
  commentaires: Array<Commentaire>;
  searchUserValueComment: string = '';
  listSearchRslt: Array<Commentaire>;
  activeFieldRslt: boolean = false;
  constructor(
              private dataUserServ: DataUserService,
              private accountApi: AccountApiService,
              private toast: ToastAppService
  ) {
    this.pub = new Publication();
    this.dataUser = new User();
    this.commentaires = new Array<Commentaire>;
    this.listSearchRslt = new Array<Commentaire>;
   }

  ngOnInit() {
    this.loadUserData();
  }
  ionViewWillEnter(){
    this.loadPublication();
  }

  handleRefresh(event:any) {
    setTimeout(() => {
      // Any calls to load data go here
      event.target.complete();
    }, 2100);
  }

  loadUserData(){
    this.dataUser = JSON.parse(this.dataUserServ.userData)[0];
  }
  loadPublication(){
    this.pub = this.dataUserServ.publication;
    this.indexPub = this.dataUserServ.indexPub;
    console.log(this.pub);
    console.log('index', this.indexPub);
  }

  doLike(idPublication: any){
    let data: {
      id_users: any,
      id_pub: number
    } = { 
      id_users: this.dataUser.id_users,
      id_pub: idPublication
    }
    if(this.pub.alreadyLike == 0 ){
        this.accountApi.post('user-api/addLike.php', JSON.stringify(data)).subscribe((response)=>{
            if(Object.keys(response).length > 0){
                this.addLike(0, 0)
            }else{
              console.log('erreur');
            }
        }, (err)=>{
            this.toast.makeToast(''+ err.getMessage());
        });
    }
        
  }

  addLike(index: number, nbrLike:any){
 
  }
  delLike(index: number, nbrLike:any){
  
  }

  doUnLike(idPublication: any){
    let data: {
      id_users: any,
      id_pub: number
    } = { 
      id_users: this.dataUser.id_users,
      id_pub: idPublication
    }
    this.accountApi.post('user-api/unLike.php', JSON.stringify(data)).subscribe((response)=>{
           if(Object.keys(response).length > 0){
                this.delLike(0, 0);
            }else{
              console.log('erreur');
            }
    })
  }
  searchUserInComments(){
    this.activeFieldRslt = this.searchUserValueComment.length > 0;
    const exec = (comment: Commentaire)=>{

      return comment.nom.toLowerCase().substring(0, this.searchUserValueComment.length) === this.searchUserValueComment;
    }

    this.listSearchRslt = this.commentaires.filter(exec);
    this.searchUserValueComment = '';
  }
  goToProfil(){

  }
}
