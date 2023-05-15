import { SignupPage } from './../signup/signup.page';
import { NgModule, Component } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LoginPage } from './login.page';

const routes: Routes = [
  {
    path: '',
    component: LoginPage
  },
  {
    path:'signup',
    loadChildren: ()=> import('../signup/signup.module').then(m=> m.SignupPageModule)
  },
  {
    path: 'tabs/home',
    loadChildren: ()=> import('../tabs/tabs.module').then(p=>p.TabsPageModule)
  },
  
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LoginPageRoutingModule {}
