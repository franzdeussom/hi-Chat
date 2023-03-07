import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AccountProfilsPageRoutingModule } from './account-profils-routing.module';

import { AccountProfilsPage } from './account-profils.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AccountProfilsPageRoutingModule
  ],
  declarations: [AccountProfilsPage]
})
export class AccountProfilsPageModule {}
