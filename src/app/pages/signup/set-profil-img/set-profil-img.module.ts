import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SetProfilImgPageRoutingModule } from './set-profil-img-routing.module';

import { SetProfilImgPage } from './set-profil-img.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SetProfilImgPageRoutingModule
  ],
  declarations: [SetProfilImgPage]
})
export class SetProfilImgPageModule {}
