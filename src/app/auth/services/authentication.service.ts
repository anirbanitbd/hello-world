import { Injectable } from '@angular/core';
import {BehaviorSubject, map, Observable} from "rxjs";
import {User, ResponseBody, RegisterUser, AdminUser} from '../models/user';
import {HttpClient} from "@angular/common/http";
import {environment} from "../../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  public currentUser: Observable<AdminUser |null>;
  private currentUserSubject: BehaviorSubject<AdminUser |null>;

  constructor(private _http: HttpClient) {

    this.currentUserSubject = new BehaviorSubject<AdminUser |null>(localStorage.getItem('currentUser')?JSON.parse(localStorage.getItem('currentUser')!):null);
    this.currentUser = this.currentUserSubject.asObservable();
  }

  public get currentUserValue(): AdminUser {
    return this.currentUserSubject.value!;
  }
  //is user logged in
  get isLoggedIn(): boolean {
    return !!this.currentUserSubject.value?.user_id && !! JSON.parse(localStorage.getItem('currentUser')!)?.['user_id'];
  }
  setCurrentUser(user:AdminUser){
    this.currentUserSubject.next(user);
    localStorage.setItem('currentUser', JSON.stringify(user));
  }

  login(data:any):Observable<User> {
    return this._http.post<ResponseBody>(`${environment.adminApiUrl}/admin/login`, data)
      .pipe(
        map((response:any) => {
          // login successful if there's a jwt token in the response
          if (response?.flag==false){
            throw response.message;
          }
          if ( response.data?.user_id) {
            let userData:AdminUser ={
              user_id: response.data.user_id,
              email_id: response.data.email_id,
              user_name: response.data.user_name,
              role: response.data.role,
              jwt: response.token
            }

            // store user details and jwt token in local storage to keep user logged in between page refreshes
            localStorage.setItem('currentUser', JSON.stringify(userData));

            // notify
            this.currentUserSubject.next(userData);
          }

          return response.data;
        })
      );
  }


  logout() {
    // remove user from local storage to log user out
    localStorage.removeItem('currentUser');
    // notify
    this.currentUserSubject.next(null);
  }
}
