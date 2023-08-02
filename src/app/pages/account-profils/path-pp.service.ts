import { ToastAppService } from './../../services/Toast/toast-app.service';
import { Avatar } from './avatar.model';
import { AccountApiService } from './../../services/account-api.service';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class PathPpService {
  public path_pp : Avatar[] = [
    {
      id: 1,
      name:'Default A',
      path: '/assets/icon/avatar.svg',
    },
    {
      id: 2,
      name:'Default B',
      path: '/assets/icon/avatarB.jpeg',
    },
    {
      id: 3,
      name:'Hello',
      path: '/assets/icon/avatar.svg',
    }
    ,
    {
      id: 4,
      name:'Essaie',
      path: '/assets/icon/avatar.svg',
    }
    ,
    {
      id: 5,
      name:'TEST',
      path: '/assets/icon/avatar.svg',
    }
]
  newUrlImg: string = '';

  constructor(
      private accountApi : AccountApiService,
      private toast: ToastAppService
  ) { }

  doUpdatingPp(idUser: number, newImgUrl: any, isBase64File: boolean, fileImg?: any){
    let param = {id_users: idUser, profilImgUrl: newImgUrl , imgUrl: fileImg, isBase64File: isBase64File, isUrlPresent: false}

      const details = fileImg.split('../hichatpubs/');
      if(details.length > 1){
        param.isUrlPresent = true;
        param.imgUrl = details[1];
      }else{
        if(this.newUrlImg.length > 1){
          param.isUrlPresent = true;
          param.imgUrl = this.newUrlImg.split('../hichatpubs/')[1];
        }
      }

      this.accountApi.post('user-api/updateAvatar.php', JSON.stringify(param)).subscribe((response)=>{
          if(Object.keys(response).length > 0){
            this.toast.makeToast('Photo de profil mise à jour !');
            this.newUrlImg = JSON.parse(response).imgUrl;
            console.log(this.newUrlImg)
          }else{
             this.toast.makeToast('Une Erreur interne est survenue lors du changement.')
          }
      },()=>{
       this.toast.makeToast('INTERNAL ERROR');
      });
  }
}
