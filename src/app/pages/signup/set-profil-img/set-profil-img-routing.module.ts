import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SetProfilImgPage } from './set-profil-img.page';

const routes: Routes = [
  {
    path: '',
    component: SetProfilImgPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SetProfilImgPageRoutingModule {}
