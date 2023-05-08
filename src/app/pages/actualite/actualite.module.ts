import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ActualitePageRoutingModule } from './actualite-routing.module';

import { ActualitePage } from './actualite.page';
import { SafePipePipe } from './safe-pipe.pipe';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ActualitePageRoutingModule
  ],
  declarations: [ActualitePage, SafePipePipe]
})
export class ActualitePageModule {}
