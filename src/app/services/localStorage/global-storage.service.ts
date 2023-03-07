import { User } from './../../pages/signup/users.model';
import { Injectable } from '@angular/core';
import { Storage } from '@capacitor/storage';

@Injectable({
  providedIn: 'root'
})
export class GlobalStorageService {
public currentUser: any;

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

}
