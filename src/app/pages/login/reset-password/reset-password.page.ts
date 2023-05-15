import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.page.html',
  styleUrls: ['./reset-password.page.scss'],
})
export class ResetPasswordPage implements OnInit {

  code: string = '';
  addressEmail: string = '';

  constructor() { }

  ngOnInit() {
  }

  sendCode(){
    //endpoint reset-passe word;
    console.log('email User to recovery his pass', this.addressEmail);
  }

}
