import { Injectable } from '@angular/core';
import * as CryptoJS from 'crypto-js'

@Injectable({
  providedIn: 'root'
})
export class CryptAndDecryptMessage {
  encryptSecretKey: string = 'FRANZ_DEUSSOM_ADMIN_HICHAT_237';

  constructor() { }

  cryptMessage(message: string){
      try{
        return CryptoJS.AES.encrypt(JSON.stringify(message), this.encryptSecretKey).toString();
      }catch(e){
        console.log(e);
        return '00000';
      }
  }

  decryptMessage(message: string){
      try{
        const byte = CryptoJS.AES.decrypt(message, this.encryptSecretKey);
        if(byte.toString()){
          return JSON.parse(byte.toString(CryptoJS.enc.Utf8));
        }
        return message;
      }catch(e){
          console.log(e);
      }
  }
}
