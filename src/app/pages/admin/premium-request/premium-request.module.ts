import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PremiumRequestPageRoutingModule } from './premium-request-routing.module';

import { PremiumRequestPage } from './premium-request.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PremiumRequestPageRoutingModule
  ],
  declarations: [PremiumRequestPage]
})
export class PremiumRequestPageModule {}
