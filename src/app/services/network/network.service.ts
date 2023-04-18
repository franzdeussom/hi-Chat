import { ToastAppService } from './../Toast/toast-app.service';
import { Injectable } from '@angular/core';
import { Network } from '@capacitor/network';

@Injectable({
  providedIn: 'root'
})
export class NetworkService {
 public CONNEXION_DB_STATE = 200;

  constructor(private toast: ToastAppService) { }

 async isConnect(){
      const status = await Network.getStatus();
      console.log(status);
      return status;
  }

  onStatutChange(){
    Network.addListener('networkStatusChange', ()=>{
         this.toast.makeToast('Connection retablie !');
    });
  }

  makeToastErrorConnection(msg: string){
      if(this.CONNEXION_DB_STATE == 500){
          this.toast.makeToast(msg);
      }
  }

}
