import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PremiumPagePageRoutingModule } from './premium-page-routing.module';

import { PremiumPagePage } from './premium-page.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PremiumPagePageRoutingModule
  ],
  declarations: [PremiumPagePage]
})
export class PremiumPagePageModule {}
