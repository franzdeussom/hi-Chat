import { DataUserService } from './../data-user.service';
import { TransitService } from './transit.service';
import { NavController, AlertController } from '@ionic/angular';
import { AccountApiService } from 'src/app/services/account-api.service';
import { Component, OnInit } from '@angular/core';
import { User } from '../signup/users.model';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.page.html',
  styleUrls: ['./admin.page.scss'],
})

export class AdminPage implements OnInit {
  UserMale: Array<User> = [];
  UserFemalle: Array<User> = [];
  user: User = new User();

  systemData: { NbrUsersOnline: string, NbrMessageStore: string, NbrNotifStore: string } = {
        NbrUsersOnline: '',
        NbrMessageStore: '',
        NbrNotifStore: '',
  }

  constructor(
      private accountApi: AccountApiService,
      private transit: TransitService,
      private alertCtrl: AlertController,
      private navCtrl : NavController,
      private dataUserSrv: DataUserService
  ) { }

  ngOnInit() {
    this.loadDataUser();
    this.loadUsers();
  }

  loadUsers(){
      this.accountApi.get('API-ADMIN/getAllUsers.php').subscribe((response)=>{
          this.UserMale = response[0];
          this.UserFemalle = response[1];
          this.systemData = response[2];
      });
  }

  loadDataUser(){
      Object.assign(this.user, JSON.parse(this.dataUserSrv.userData)[0]);
      if(!this.accountApi.isAdmin(this.user.id_users)){
        throw new Error('Pas d autorisation pour acceder a cette page !');
      }
  }


  handlerRefresh(evt: any){

    setTimeout(() => {
      this.loadUsers();
        evt.target.complete();
    }, 1200);
  }
  
  getDataSystem(){
    let param : {who: string, typeRequest: string}={who: 'Admin', typeRequest: '*'};

    this.accountApi.get('API-ADMIN/getSystemData.php').subscribe((response)=>{
        console.log(response);
    });
  }

  async showAlertCtrl(isMale: boolean){
    const msg = isMale ? 'Quelle notification pour les hommes':'Quelle notification pour les femmes';
      const action = await this.alertCtrl.create({
        header: msg,
        buttons:[
          {
            text: 'Envoyer',
            role: 'confirm',
            handler: (data)=>{
                if(isMale){
                    this.transit.notifToMale(this.UserMale, data.message);
                }else{
                  this.transit.notifToFemalle(this.UserFemalle, data.message);
                }
            }
          },
          {
            text: 'Annuler',
            role: 'cancel'
          }
        ],
        inputs: [
          {
            type: 'text',
            name:'message'
          }
        ]
      });
    await action.present();
  }

  goToDetails(number: number,  nameTemplate:string){
    if(number == 1){
      this.transit.listUser = this.UserMale;
    }else{
      this.transit.listUser = this.UserFemalle;
    }
    this.navCtrl.navigateForward(nameTemplate);
  }
}
