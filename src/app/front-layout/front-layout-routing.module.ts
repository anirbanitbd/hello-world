import {inject, NgModule} from '@angular/core';
import {
  CanActivateFn,
  Router,
  RouterModule,
  Routes
} from '@angular/router';
import {FrontLayoutComponent} from "./front-layout/front-layout.component";
import {AuthenticationService} from "../auth/services/authentication.service";


const canActiveLoginFN: CanActivateFn = async (route, state) => {
  const isLogin = inject(AuthenticationService).isLoggedIn;
  if (isLogin) return true;
  await inject(Router).navigate(['/pages/login-register'], {queryParams: {returnUrl: state.url}});
  return true;
}

const routes: Routes = [
  {
    path: '',
    component: FrontLayoutComponent,
    children: [
      {
        path: 'transaction',
        title: 'Transaction',
        canActivate: [canActiveLoginFN],
        loadComponent: () => import('../front/transaction/transaction.component').then(m => m.TransactionComponent),
      },
      {
        path:'wallet',
        title:'Wallet',
        canActivate: [canActiveLoginFN],
        loadComponent: () => import('../front/wallet/wallet.component').then(m => m.WalletComponent),
      },
      {
        path: '',
        pathMatch: 'full',
        title: 'Katikaa',
        loadComponent: () => import('../front/dashboard/dashboard.component').then(m => m.DashboardComponent),
        canActivate: [canActiveLoginFN],
      },
      {
        path: 'communities',
        title: 'Communities',
        canActivate: [canActiveLoginFN],
        loadComponent: () => import('../front/community-list/community-list.component').then(m => m.CommunityListComponent),
      },
      {
        path: 'users',
        title: 'Users',
        canActivate: [canActiveLoginFN],
        loadComponent: () => import('../front/user-list/user-list.component').then(m => m.UserListComponent),
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FrontLayoutRoutingModule {
}
