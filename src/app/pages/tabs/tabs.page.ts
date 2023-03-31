import { GetNotificationService } from 'src/app/pages/notifications/get-notification.service';
import { GlobalStorageService } from './../../services/localStorage/global-storage.service';
import { User } from './../signup/users.model';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-tabs',
  templateUrl: './tabs.page.html',
  styleUrls: ['./tabs.page.scss'],
})
export class TabsPage implements OnInit {
  dataUser: User = new User();
  isAdmin: boolean = false;
  nbrNotif!: number;
  nbrMessage!: number;
  constructor(private globalStore: GlobalStorageService,
              private wsNotif: GetNotificationService,
              private cdRef:ChangeDetectorRef
    ) { }

  ngOnInit() {
    this.getDataUser();
    this.loadNotif();
  }

  ngAfterViewChecked() {
    this.nbrNotif = this.wsNotif.globalNotification.length;
    this.nbrMessage = this.wsNotif.countMsgNotRead;
    this.cdRef.detectChanges();

  }

  getDataUser(){
    this.dataUser = JSON.parse(this.globalStore.currentUser)[0];
    if(this.dataUser.nom === 'admin'){
      this.isAdmin = true;
    }
  }
  loadNotif(){
      this.wsNotif.loadNotifSave(this.dataUser.id_users);
  }

  renit(){
      this.wsNotif.countMsgNotRead = 0;
  }
}
