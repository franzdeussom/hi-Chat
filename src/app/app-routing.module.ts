import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'home',
    loadChildren: () => import('./pages/home/home.module').then( m => m.HomePageModule)
  }, 
  {
    path: 'login',
    loadChildren: () => import('./pages/login/login.module').then( m => m.LoginPageModule)
  },
  {
    path: 'signup',
    loadChildren: () => import('./pages/signup/signup.module').then( m => m.SignupPageModule)
  },
  {
    path: 'search/profils',
    loadChildren: () => import('./pages/search/profils/profils.module').then(m => m.ProfilsPageModule)
  },
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  {
    path: 'tabs',
    loadChildren: () => import('./pages/tabs/tabs.module').then( m => m.TabsPageModule)
  },
  {
    path: 'search',
    loadChildren: () => import('./pages/search/search.module').then( m => m.SearchPageModule)
  },
  {
    path: 'account-profils',
    loadChildren: () => import('./pages/account-profils/account-profils.module').then( m => m.AccountProfilsPageModule)
  },
  {
    path: 'discusion',
    loadChildren: () => import('./pages/home/discusion/discusion.module').then(m => m.DiscusionPageModule)
  },
  {
    path: 'actualite',
    loadChildren: () => import('./pages/actualite/actualite.module').then( m => m.ActualitePageModule)
  },
  {
    path: 'details',
    loadChildren: () => import('./pages/actualite/details/details.module').then( m => m.DetailsPageModule)
  },
  {
    path: 'notifications',
    loadChildren: () => import('./pages/notifications/notifications.module').then( m => m.NotificationsPageModule)
  },
  {
    path: 'admin',
    loadChildren: () => import('./pages/admin/admin.module').then( m => m.AdminPageModule)
  },
  {
    path: 'UsersList',
    loadChildren: () => import('./pages/admin/details-list/details-list.module').then( m => m.DetailsListPageModule)
  },
  {
    path: 'premium-page',
    loadChildren: () => import('./pages/actualite/premium-page/premium-page.module').then( m => m.PremiumPagePageModule)
  },
  {
    path: 'premium-request',
    loadChildren: () => import('./pages/admin/premium-request/premium-request.module').then( m => m.PremiumRequestPageModule)
  },
  {
    path: 'reset-password',
    loadChildren: () => import('./pages/login/reset-password/reset-password.module').then( m => m.ResetPasswordPageModule)
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
