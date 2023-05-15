import { ProfilsPage } from './../../search/profils/profils.page';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DetailsListPage } from './details-list.page';

const routes: Routes = [
  {
    path: '',
    component: DetailsListPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DetailsListPageRoutingModule {}
