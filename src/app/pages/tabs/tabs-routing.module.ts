import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TabsPage } from './tabs.page';

const routes: Routes = [
  {
    path: '',
    component: TabsPage,
    children: [
      {
        path: 'home',
        children: [
          {
            path: '',
           loadChildren: ()=> import('../home/home.module').then(m => m.HomePageModule)

          }
        ]
        
      },
      {
        path: 'search',
        children: [
          {
            path: '',
           loadChildren: ()=> import('../search/search.module').then(m => m.SearchPageModule)
          }
        ]
      },
      {
        path: 'account-profils',
        children: [
          {
            path: '',
            loadChildren: ()=> import('../account-profils/account-profils.module').then(m=> m.AccountProfilsPageModule)
          }
        ]
      },
      {
        path: '',
        redirectTo: '/tabs/home',
        pathMatch: 'full',
      },
      {
        path: 'actualite',
        children: [
          {
            path: '',
            loadChildren: ()=> import('../actualite/actualite.module').then(m => m.ActualitePageModule)
          }
        ]
      },
      {
        path: 'notifications',
        children: [
          {
            path: '',
            loadChildren: ()=> import('../notifications/notifications.module').then(m => m.NotificationsPageModule)
          }
        ]
      }
    ]
  },
  {
    path: '',
    redirectTo: '/tabs/home',
    pathMatch: 'full',
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TabsPageRoutingModule {}
