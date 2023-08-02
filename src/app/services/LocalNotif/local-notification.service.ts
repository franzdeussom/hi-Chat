import { Injectable } from '@angular/core';
import { LocalNotifications } from '@awesome-cordova-plugins/local-notifications/ngx';


@Injectable({
  providedIn: 'root'
})
export class LocalNotificationService {
  icon : string = '';
  soundSrc : string ='';

  constructor(private localNotif : LocalNotifications) { }

  doLocalNotifOnMessage(nameSender: string,  message: string, prenom?: string){
      this.localNotif.schedule({
        id: 1,
        title: prenom + nameSender,
        text: 'Single ILocalNotification' + message,
        data: { secret: '2' }
      });
  }
}
 