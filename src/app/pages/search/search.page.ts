import { ToastAppService } from './../../services/Toast/toast-app.service';
import { DataUserService } from './../data-user.service';
import { GlobalStorageService } from './../../services/localStorage/global-storage.service';
import { SaveResultSearchService } from './save-result-search.service';
import { NavController } from '@ionic/angular';
import { SearchService } from './search.service';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-search',
  templateUrl: './search.page.html',
  styleUrls: ['./search.page.scss'],
})
export class SearchPage implements OnInit {
  simpleSearchValues : {
    'nom': any,
    'prenom': any
  } = {
    nom: '',
    prenom: ''
  };

  optionSearch : {
    'withOption': boolean
    'age': any,
    'ville': any,
    'pays': any,
    'sexe': any
  } = {
    withOption: true,
    age : undefined,
    ville: undefined,
    pays: undefined,
    sexe: undefined
  };

  isWithOption: boolean = false;
  disableSpaceOption: boolean = false;
  name_result!: string;
  lastName_result!: string;
  isNotFound!: boolean;
  isNotFoundOption!: boolean;
  GlobalSearchResult!: any;
  value!: any;
  
  constructor(private search : SearchService, 
              private route : NavController,
              private dataUser: DataUserService,
              private toast: ToastAppService,
              private saveSearch: SaveResultSearchService,
              ) { }

  ngOnInit() {

  }

  simpleSearch(){
    console.log(this.value);
    this.devidedVal();
    this.enableSearchSpaceWithOption();
    this.enableSearchWithOption();
    this.search.simpleSearch('user-api/search.php', JSON.stringify(this.simpleSearchValues)).subscribe((data)=>{
         this.isNotFound= false;
         this.isNotFoundOption = false;
      if(Object.keys(data).length === 0 ? false : true ){
            this.GlobalSearchResult = data;
            this.disableSpaceOption = true
          }else{
              this.isNotFound = true;
         }
    });
  }

  devidedVal(){
    let tabVal = this.value.split(" ");
    if(tabVal.length > 1){
      //presence of lastName
      this.simpleSearchValues.nom = tabVal[0];
      this.simpleSearchValues.prenom = tabVal[1];
    }else{
      this.simpleSearchValues.nom = this.value;
    }
  }

  enableSearchWithOption(){
    if(this.isWithOption){
      this.isWithOption = false;
    }else{
      this.isWithOption = true;
    }
  }
  disableSearchWithOption(){
    this.disableSpaceOption = true;
  }
  enableSearchSpaceWithOption(){
    if(this.value.length == 0 || this.value == ''){
       this.disableSpaceOption = false;
       this.GlobalSearchResult.length = 0;
    }
  }

  launchSearchWithOption(){
    this.isNotFoundOption = false;

      if(!this.isAllParamSet()){
        this.toast.makeToast('Veuillez Remplir au moins un champ !');
      }else{
        this.search.searchWithOption('user-api/search.php', JSON.stringify(this.optionSearch)).subscribe((data: any)=>{
          if(Object.keys(data).length === 0 ? false : true){
            this.GlobalSearchResult = data;
            this.init();

          }else {
            this.isNotFoundOption = true;
          }
        })
      }
  }

  isSexeEntryValid(): boolean{
   let sexe = this.optionSearch.sexe.trim().toUpperCase();
    if(sexe != 'F' || sexe != 'M'){
      this.toast.makeToast('Veuillez entrer un caracter valide pour le Sexe !')
      return false;
    }else{
      return true;
    }
  }

  isAgeEntryValid(): boolean{
    let age = this.optionSearch.age;
    if(isNaN(age) && age >= 80){
      this.toast.makeToast('Entrez un age inferrieur a 80 !');
      return false;
    }else{
      return true;
    }
  }

  isAllParamSet(): boolean{
    return typeof this.optionSearch.age !== 'undefined' || typeof this.optionSearch.pays !== 'undefined' || typeof this.optionSearch.ville !== 'undefined' || typeof this.optionSearch.sexe !== 'undefined';
  }

  init(){
    this.optionSearch.age = undefined;
    this.optionSearch.pays = undefined;
    this.optionSearch.sexe = undefined;
    this.optionSearch.ville = undefined;

  }

   goToProfil(profil : any){
      //save the response data beforre navigate to profil details
      this.saveSearch.dataUserFound = profil;
      this.GlobalSearchResult.length = [];
      if(profil.id_users === JSON.parse(this.dataUser.userData)[0].id_users){
        this.route.navigateBack('tabs/account-profils');

      }else{
        this.saveSearch.isFromSearch = true;
         this.route.navigateForward('search/profils');
      }
  }

}
