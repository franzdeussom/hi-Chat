import { MessageApiService } from './../../services/message-api.service';
import { User } from './../signup/users.model';
import { DataUserService } from './../data-user.service';
import { RangeMessageService } from './../home/range-message.service';
import { NavController } from '@ionic/angular';
import { GlobalStorageService } from './../../services/localStorage/global-storage.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-account-profils',
  templateUrl: './account-profils.page.html',
  styleUrls: ['./account-profils.page.scss'],
})
export class AccountProfilsPage implements OnInit {
  actived!: boolean;
  dataUser: User;
  constructor(private globalStorage: GlobalStorageService,
              private navController: NavController,
              private dataUsers: DataUserService,
              private rangeMessage: RangeMessageService,
              private websocket: MessageApiService
              ) { this.dataUser = new User()}

  ngOnInit() {
      this.loadDataCurrentUser();
  }

  loadDataCurrentUser(){
    this.dataUser = JSON.parse(this.dataUsers.userData)[0];

  }

  UpdateProfil(){

  }

  logout(){
    this.rangeMessage.AllMessage.length = 0;
    this.rangeMessage.listOfSender.length = 0; 
    this.websocket.webSocketOnClose();
    this.globalStorage.deleteData('userAccountData');
    window.location.reload()
    this.navController.navigateForward('login');
    
  }
}
