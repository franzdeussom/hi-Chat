import { Injectable } from '@angular/core';
import { Storage } from '@capacitor/storage';

@Injectable({
  providedIn: 'root'
})
export class SaveResultSearchService {
  public dataUserFound : any;
  public isOderUser: any;
  public isFromSearch: boolean;
  constructor() { this.isFromSearch = false }

  setHistorySearch(){
      Storage.set({
        key: 'historySearch',
        value: this.dataUserFound
      });
  }
 async getHistorySearch(): Promise<any>{
      const { value } = await Storage.get({key : 'historySearch'});
      return value;
  }
}
