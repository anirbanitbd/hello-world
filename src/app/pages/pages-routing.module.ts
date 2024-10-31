import {inject, NgModule} from '@angular/core';
import {CanActivateFn, Router, RouterModule, Routes} from '@angular/router';
import {PageComponent} from "./page/page.component";
import {AuthenticationService} from "../auth/services/authentication.service";

const canActiveLoginFN: CanActivateFn = async (route, state) => {
  console.log('canActiveLoginFN');
  const isLogin = inject(AuthenticationService).isLoggedIn;
  if (isLogin) {
    //redirect to home page
    await inject(Router).navigate(['/']);
    return false;
  }
  return true;
}

const routes: Routes = [
  {
    path: '',
    component: PageComponent,
    children: [
      {
        path: '',
        redirectTo: 'login-register',
        pathMatch: 'full'
      },
      {
        path: 'login-register',
        title: 'Login/Register',
        canActivate: [canActiveLoginFN],
        loadComponent: () => import('./login-register/login-register.component').then(m => m.LoginRegisterComponent),
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PagesRoutingModule {
}
