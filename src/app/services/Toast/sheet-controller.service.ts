import { ToastAppService } from 'src/app/services/Toast/toast-app.service';
import { MessageApiService } from './../message-api.service';
import { Injectable } from '@angular/core';
import { ActionSheetController, AlertController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class SheetControllerService {

  constructor(
    private alertController: AlertController,
    private actionSheet: ActionSheetController,
    private wsMessage: MessageApiService,
    private toast: ToastAppService
  ) { }

 async makeSimpleAlertController(header: string, id_users:any){
    const alert = await this.alertController.create({
      header: header,
      buttons: [
        {
          text: 'Retablir la connexion',
          role: 'confirm',
          handler: ()=>{
            this.wsMessage.connectionState = 200;
            this.wsMessage.webSocketInit(id_users);
            setTimeout(() => {
              if(this.wsMessage.connectionState !== 200){
                this.makeSimpleAlertController('Impossible de se connecter.', id_users);
              }else{
                this.toast.makeToast('Connexion rétablie, renvoyez votre Message. Hi-Chat');
              }
            }, 1000);
            
          }
        },
        {
          text: 'Ok',
          role: 'cancel'
        }
      ]
    });

    await alert.present();
  }

  async makeSimpleActionSheetController(header: string){
    const actionSheet = await this.actionSheet.create({
      header: header,
      buttons: [
        {
          text:'Quitter',
          role:'cancel'
        }
      ],
    });

   await  actionSheet.present();
  }
}
