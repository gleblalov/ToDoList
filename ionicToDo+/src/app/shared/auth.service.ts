import { Injectable } from '@angular/core';
import { HttpClient,   } from '@angular/common/http';

import { Observable } from 'rxjs'

import { Storage } from '@ionic/storage';

import { JwtPayload, SocialUser, } from '../model';

 
@Injectable({
  providedIn: 'root'
})
export class AuthService {
 
  public jwt: string
  // urlForRegistr = 'http://10.10.3.185:3333/auth/reg';
  // urlForRegistrSocial = 'http://10.10.3.185:3333/auth/social';
  // urlForLogin = 'http://10.10.3.185:3333/auth/login';
  // urlForUser = 'http://10.10.3.185:3333/auth/user';
  // urlForChangeUser = 'http://10.10.3.185:3333/auth/changeUser';
  // urlForUploadPhoto = 'http://10.10.3.185:3333/auth/uploadPhoto';
  urlForRegistr = 'http://192.168.0.101:3333/auth/reg';
  urlForRegistrSocial = 'http://192.168.0.101:3333/auth/social';
  urlForLogin = 'http://192.168.0.101:3333/auth/login';
  urlForUser = 'http://192.168.0.101:3333/auth/user';
  urlForChangeUser = 'http://192.168.0.101:3333/auth/changeUser';
  urlForUploadPhoto = 'http://192.168.0.101:3333/auth/uploadPhoto';


  constructor(
    private http: HttpClient,
    private storage: Storage,){

  }

  registration(user): Observable<JwtPayload>{
    return this.http.post<JwtPayload>(`${this.urlForRegistr}`, user);
  }

  signIn(user): Observable<JwtPayload>{
    return this.http.post<JwtPayload>(`${this.urlForLogin}`, user);
  }

  registrationSocial(user): Observable<JwtPayload>{
    return this.http.post<JwtPayload>(`${this.urlForRegistrSocial}`, user);
  }

  getUser(): Observable<any> {
    return this.http.get<any>(this.urlForUser);
  }

  uploadImage(fd){
    return this.http.post(`${this.urlForUploadPhoto}`, fd);
  }

  changeUser(user): Observable<SocialUser> {
    return this.http.put<SocialUser>(`http://192.168.0.101:3333/auth/${user.id}`, user);
  }

  public async getToken() {
    return await this.storage.get('token').then(a => {
      return a;
    });
  }
  public async getUserID() {
    return await this.storage.get('userID').then(a => {
      return a;
    });;
  }
}


