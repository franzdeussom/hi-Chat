import { User } from './signup/users.model';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})

export class DataUserService {
 public userData: any;
  constructor() {  }
}
