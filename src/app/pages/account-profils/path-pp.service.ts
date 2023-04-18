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
      name:'Default',
      path: '/assets/icon/avatar.svg',
    },
    {
      id: 2,
      name:'Une autre pp',
      path: '/assets/icon/avatar.svg',
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
  constructor(
      private accountApi : AccountApiService,
      private toast: ToastAppService
  ) { }

  doUpdatingPp(idUser: number, newImgUrl: any){
      const param = {id_users: idUser, profilImgUrl: newImgUrl }
      this.accountApi.post('user-api/updateAvatar.php', JSON.stringify(param)).subscribe((response)=>{
          if(Object.keys(response).length > 0){
            this.toast.makeToast('Photo de profil mise à jour !');
          }else{
             this.toast.makeToast('Une Erreur interne est survenue lors du changement.')
          }
      },()=>{
       this.toast.makeToast('INTERNAL ERROR');
      });
  }
}
