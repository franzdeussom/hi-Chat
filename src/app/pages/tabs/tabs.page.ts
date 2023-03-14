import { GlobalStorageService } from './../../services/localStorage/global-storage.service';
import { User } from './../signup/users.model';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-tabs',
  templateUrl: './tabs.page.html',
  styleUrls: ['./tabs.page.scss'],
})
export class TabsPage implements OnInit {
  dataUser: any;
  isAdmin: boolean = false;

  constructor(private globalStore: GlobalStorageService) { }

  ngOnInit() {
    this.getDataUser();
  }
  getDataUser(){
    this.dataUser = JSON.parse(this.globalStore.currentUser)[0];
    if(this.dataUser.nom === 'admin'){
      this.isAdmin = true;
    }
  }
}
