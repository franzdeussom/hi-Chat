import { Injectable } from '@angular/core';
import { ToastController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class ToastAppService {

  constructor(private toast: ToastController) { }

async makeToast(msg: string){
  const  toast  = await this.toast.create({
    message: msg,
    duration: 3000,
    position: 'top'
  });
 await toast.present();
  } 
}
