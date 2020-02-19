import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {BehaviorSubject, Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {environment} from '@environments/environment';

export class User {
  email: string;
  password: string;
  fullName: string;
  accessToken?: string;
  refreshToken?: string;
}

@Injectable({ providedIn: 'root' })
export class AuthenticationService {
  private currentUserSubject: BehaviorSubject<User>;
  public currentUser: Observable<User>;

  constructor(private http: HttpClient) {
    this.currentUserSubject = new BehaviorSubject<User>(JSON.parse(localStorage.getItem('currentUser')));
    this.currentUser = this.currentUserSubject.asObservable();
  }

  public get currentUserValue(): User | null {
    return this.currentUserSubject.value;
  }

  public set currentUserValue(val) {
    this.logout();
  }

  login(email: string, password: string) {
    return this.http.post<any>(`${environment.baseUrl}user/login`, { email, password })
      .pipe(map(user => {
        // store user details and jwt token in local storage to keep user logged in between page refreshes
        localStorage.setItem('currentUser', JSON.stringify(user));
        this.currentUserSubject.next(user);
        return user;
      }));
  }

  logout() {
    // remove user from local storage to log user out
    localStorage.removeItem('currentUser');
    this.currentUserSubject.next(null);
  }

  // todo: refresh token
  refreshToken() {
    if (this.currentUserValue) {
      return this.http.post<any>(`${environment.baseUrl}user/refreshAccessToken`, {refreshToken: this.currentUserValue.refreshToken})
        .pipe(map( res => res.accessToken));
    }
  }
}
