import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ActualitePage } from './actualite.page';

const routes: Routes = [
  {
    path: '',
    component: ActualitePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ActualitePageRoutingModule {}
