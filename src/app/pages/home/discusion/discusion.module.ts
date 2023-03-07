import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DiscusionPageRoutingModule } from './discusion-routing.module';

import { DiscusionPage } from './discusion.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DiscusionPageRoutingModule
  ],
  declarations: [DiscusionPage]
})
export class DiscusionPageModule {}
