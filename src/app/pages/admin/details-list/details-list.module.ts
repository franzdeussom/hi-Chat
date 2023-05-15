import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DetailsListPageRoutingModule } from './details-list-routing.module';

import { DetailsListPage } from './details-list.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DetailsListPageRoutingModule
  ],
  declarations: [DetailsListPage]
})
export class DetailsListPageModule {}
