import { ToastAppService } from './../../services/Toast/toast-app.service';
import { GlobalStorageService } from './../../services/localStorage/global-storage.service';
import { DataUserService } from './../data-user.service';
import { AccountApiService } from './../../services/account-api.service';
import { Component, OnInit } from '@angular/core';
import { User } from './users.model';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.page.html',
  styleUrls: ['./signup.page.scss'],
})
export class SignupPage implements OnInit {
  account!: User;
  responseUser!: any;
  showBtnSend!: boolean;
  errorMessage!: string;
  sexCharCorrect!: string;
  fieldCompleted: [{
    'showItem': boolean,
    'isCompleted': boolean
  }, 
  {
    'showItem': boolean,
    'isCompleted': boolean
  },
  {
    'showItem': boolean,
    'isCompleted': boolean
  }
] = [{
  'showItem': true,
  'isCompleted': false
  },
  {
    'showItem': false,
    'isCompleted': false
    },
    {
      'showItem': false,
      'isCompleted': false
      }];

  constructor(private apiAccount: AccountApiService, 
              private dataUser : DataUserService,
              private globalStorage: GlobalStorageService,
              private toast: ToastAppService,
              private navController: NavController) 
  { }

  ngOnInit() {
    this.account = new User();
    this.showBtnSend = this.checkData();
  }

  doSignup(){
    let hideError = ()=>{
      setTimeout(()=>{
        this.errorMessage = '';
      }, 3000)
    }

    if(this.checkData()){
      this.sendData();
    }else{
      this.errorMessage = 'Veuillez remplir tous les champs !';
      hideError();
    }

  }

  checkData(): boolean{
        return this.isBlock1Ok() && this.isBlock2Ok() && this.isBlock3Ok() && this.sexCharCorrect ? true : false;
  }

  sendData(){
    let hideError = ()=>{
      setTimeout(()=>{
        this.errorMessage = '';
      }, 4500)
    }

    this.apiAccount.post('user-api/register.php', JSON.stringify(this.account)).subscribe((response: any)=>{
      this.responseUser = response;
 
      if(Object.keys(response).length > 0 ? true:false){
        //data inser t
        this.dataUser.userData = this.responseUser;
        this.globalStorage.currentUser = this.responseUser;
        console.log('id current user:', this.globalStorage.currentUser.id_users);
        this.toast.makeToast('Cration de compte reussie ! Veuillez vous connecter. Hi-Chat')
        this.navController.navigateForward('/login');
      }else{
          this.errorMessage = 'Echec ! Un utilisateur possede deja ces identifiants(Nom ou email) !';
          hideError();
      }
      

    }, (error)=>{
        if(error.statut == 500){
          //api error
          this.errorMessage = 'Probleme Interne Du Serveur !';
          hideError();
        }else if(error.statut == 404 ) {
          this.errorMessage = 'Aucune Connexion Internet';
          hideError();
        }
    });

  }

  isBlock1Ok(): boolean{
    console.log('nom:', this.account.nom)
    return typeof this.account.nom  != 'undefined' && typeof this.account.prenom != 'undefined' && typeof this.account.email != 'undefined' && this.isEmailValid() != 'undefined';
  }
  isBlock2Ok(): boolean{
    return typeof this.account.tel != 'undefined' && typeof this.account.date_naiss !=  'undefined' && typeof this.account.age != 'undefined';
  }
  isBlock3Ok(): boolean{
    return typeof this.account.sexe != 'undefined' && this.sexCharCorrect != 'undefined'  && typeof this.account.pays != 'undefined' && typeof this.account.ville != 'undefined' && typeof this.account.mdp != 'undefined';
  }

  next(){
    let position = 0;
    this.fieldCompleted.forEach((elmt, index)=>{
        if(elmt.showItem){
          elmt.showItem = false;
          position = index;
        }
    });
    this.verifBlock(position);

    this.showBtnSend = this.checkData();
    if(position === 2){
      this.fieldCompleted[0].showItem = true;
    }else{
      this.fieldCompleted[position+1].showItem = true;
    }
  }

  prev(){
    let position = 0;
    this.fieldCompleted.forEach((elmt, index)=>{
        if(elmt.showItem){
          elmt.showItem = false;
          position = index;
        }
    });
    this.verifBlock(position);

    this.showBtnSend = this.checkData();

    if(position === 0){
      this.fieldCompleted[2].showItem = true;
    }else{
      this.fieldCompleted[position-1].showItem = true;
    }
  }
  
  verifBlock(position: number){
    if(position === 0){
      this.fieldCompleted[0].isCompleted = this.isBlock1Ok();
 
     }else if(position === 1){
       this.fieldCompleted[1].isCompleted = this.isBlock2Ok();
     }else if(position === 2){
       this.fieldCompleted[2].isCompleted = this.isBlock3Ok();
     }
  }

   setAge(){
    
      let currentYear = new Date().getFullYear();
       var usersBDY = Number.parseInt(this.account.date_naiss?.split('-')[0]);
        if(usersBDY > 2015){
          this.errorMessage = 'Vous etes trop jeune !'
          return;
        }
        this.errorMessage = '';
        this.account.age = currentYear - usersBDY;

  }

  sexeChar(){
    if(this.account.sexe?.toUpperCase() != 'M' && this.account.sexe?.toUpperCase() != 'F'){
        this.sexCharCorrect = 'undefined';
        this.errorMessage = 'Veuiller entrer un Character correct correspondant a votre sex !';

        }else{
          this.sexCharCorrect = 'Correct';
         this.errorMessage = '';
    }
  }

  verifEmail(){
    let etat = this.isEmailValid();
  }
  
  isEmailValid(): string{
    this.account.email = this.account.email.trim().toLowerCase();

    if(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(this.account.email)){
      this.errorMessage = '';
      return 'Correct';
      
    }else{
      this.errorMessage = 'Email invalid !'
      return 'undefined';
    }
  }
}
