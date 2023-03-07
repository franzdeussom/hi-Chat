import { LoginPage } from './../login/login.page';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AccountProfilsPage } from './account-profils.page';

const routes: Routes = [
  {
    path: '',
    component: AccountProfilsPage
  },
  {
    path: 'login',
    component: LoginPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AccountProfilsPageRoutingModule {}
