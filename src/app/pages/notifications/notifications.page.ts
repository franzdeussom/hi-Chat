import { Component, OnInit } from '@angular/core';
import { NotificationApp } from './notification.model';

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.page.html',
  styleUrls: ['./notifications.page.scss'],
})

export class NotificationsPage implements OnInit {
  listOfNotifations: Array<NotificationApp>
  
  constructor() {
        this.listOfNotifations = new Array<NotificationApp>();
   }

  ngOnInit() {
  }
  ionViewWillEnter(){
   
  }
}
