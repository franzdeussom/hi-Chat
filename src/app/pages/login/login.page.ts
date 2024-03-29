import { DataUserService } from './../data-user.service';
import { GlobalStorageService } from './../../services/localStorage/global-storage.service';
import { NavController } from '@ionic/angular';
import { AccountApiService } from './../../services/account-api.service';
import { Component, OnInit } from '@angular/core';
import { RangeMessageService } from '../home/range-message.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  account : {
    'login': string,
    'mdp': string
    } = {
    'login': '',
    'mdp': ''
    };
    currentUserData: any;
    rememberMe!: boolean;
    errorMessage!: string;
    showSpinner: boolean = false;
    
  constructor(private apiAccount: AccountApiService, private navController: NavController,
              private globalStorage : GlobalStorageService, private dataUser: DataUserService,
              private rangeMessage: RangeMessageService
              ) {  
                this.rememberMe = false; 
                const checking = async ()=>{
                  if(await this.checkLocalUserData()){
                    //already account present
                    this.loadPresentData();
              
                      this.navController.navigateRoot('tabs/home'); 
                  }
                }
                checking();
              }

   async ngOnInit() {
  
  }

  hideMessage(){
    this.showSpinner = false;
    setTimeout(()=>{
        this.errorMessage = '';
    }, 2500);
  }

  doLogin(){
    if(this.isDataComplete()){
      this.setConformData();
      this.sendData();
    }else{
      this.errorMessage = 'Veuiller complete tous les champs';
      this.hideMessage();
    }
  }

  isDataComplete(): boolean{
      return (typeof this.account.login != 'undefined' && typeof this.account.mdp != 'undefined') || (this.account.login !== '' && this.account.mdp !== '' );
  }

  setConformData(){
      this.account.login = this.account.login.trim();
      this.account.mdp = this.account.mdp.trim();
  }

  sendData(){
    this.showSpinner = true;
    this.apiAccount.login('user-api/login.php', JSON.stringify(this.account)).subscribe((data)=>{
      this.init();
      if(data.length > 0 ){
         if(!data.noData){
          console.log('dat retrieve', );
          this.currentUserData = JSON.stringify(data[0]);
          this.globalStorage.currentUser = this.currentUserData;
         // this.globalStorage.listLike = JSON.parse(data)[1];
          this.showSpinner = false;
         // console.log(JSON.parse(data)[2]);

          //localStorage.setItem('id_users', );
          this.rangeMessage.checkLocalStoreSize();

          if(this.rememberMe){
            this.saveUserData();
          }
          //save data of the current user, to use in the App
          this.dataUser.userData = JSON.stringify(data[0]);
         }
          
          this.navController.navigateRoot('tabs/home');

        }else{
          this.errorMessage = 'Echec ! Mot de passe ou login incorrect';
          this.hideMessage();
        }
    },(error)=>{
        if(error.statut === 500){
          this.errorMessage = 'Erreur Interne du Serveur.';
          this.hideMessage();
        }else if(error.statut === 404){
          //no connection
          this.errorMessage = 'Echec de connexion verifier votre connexion WIFI ou donnee mobile'
        }else{
          this.errorMessage = 'Echec de connexion verifier votre connexion WIFI ou donnee mobile'
          this.hideMessage();
        }
        this.showSpinner = false;

    }
    
    )
  }

  rememberUser(){
    if(this.rememberMe){
      this.rememberMe = false;
    }else{
      this.rememberMe = true;
    }
  }
  
  checkLocalUserData(){
    // verify if local data of user exist
    let isAlreadyData = this.globalStorage.isAlreadyData('userAccountData');
    return isAlreadyData;
  }

  async loadPresentData(){
    var data = await this.globalStorage.getData('userAccountData');
    this.dataUser.userData = data;
    this.currentUserData = data;
    this.globalStorage.currentUser = data;
  }

  saveUserData(){
    //set data with plugin Capacitor Storage  
    this.globalStorage.clearWithKey('userAccountData');
    this.globalStorage.saveData(this.currentUserData, 'userAccountData');
  }

  init(){
    this.account.login = '';
    this.account.mdp = '';
  }

  resetPassword(){
    this.navController.navigateForward('reset-password');
  }
  goSignup(){
    this.navController.navigateForward('signup');
  }
}
