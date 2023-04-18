import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})

export class DataUserService {
 public userData: any;
 public publication: any;
 public indexPub: any;
 public isFromNotifList!: boolean;
  constructor() {  }
}
