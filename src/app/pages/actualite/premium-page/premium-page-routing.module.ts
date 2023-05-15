import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PremiumPagePage } from './premium-page.page';

const routes: Routes = [
  {
    path: '',
    component: PremiumPagePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PremiumPagePageRoutingModule {}
