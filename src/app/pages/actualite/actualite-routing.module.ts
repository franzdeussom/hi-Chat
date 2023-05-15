import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ActualitePage } from './actualite.page';
import { PremiumPagePage } from './premium-page/premium-page.page';

const routes: Routes = [
  {
    path: '',
    component: ActualitePage
  },
  {
    path:'premium-page',
    component: PremiumPagePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ActualitePageRoutingModule {}
