import { User } from './../../pages/signup/users.model';
import { Injectable } from '@angular/core';
import { Storage } from '@capacitor/storage';

@Injectable({
  providedIn: 'root'
})
export class GlobalStorageService {
public currentUser: any;
public listLike : any;

  constructor() {  }

  saveData(data: any, key: string){
      Storage.set({ 
        key: key,
        value: JSON.stringify(data)
      });
  }

  async getData(key: string): Promise<any>{
    const { value } = await Storage.get({ key: key });
    if(!value || value === '[]' || value.length === 0){
      //no data present
      return;
    }else{
      var data =  value;
      return JSON.parse(data);
    }

  }

  async isAlreadyData(key: string): Promise<boolean>{
    const { value } = await Storage.get({ key: key });
    if(!value || value === '[]' || value.length === 0){
      //no data present
      return false;
    }else{
      return true;
    }
  }

  deleteData(key : string){
    Storage.remove({key: key});

  }

  clear(){
    Storage.clear();
  }

  saveNotif(notif: any, key: string){
    localStorage.setItem(key, JSON.stringify(notif));
  }

  getNotifSaved(key: string): any{
      return localStorage.getItem(key);
  }

  isAlreadyNotif(key: string): boolean{
      return typeof localStorage.getItem(key) !== 'undefined' ? true:false;
  }

  deleteNotif(key: string){
    localStorage.removeItem(key);
  }

  deleteAllNotif(){
    localStorage.clear();
  }

}
