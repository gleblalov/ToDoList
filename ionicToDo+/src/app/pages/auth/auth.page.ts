import { Component, OnInit } from '@angular/core';
import { NavigationExtras } from '@angular/router';

import { Router } from '@angular/router';

import { LoadingController } from '@ionic/angular';
import { GooglePlus } from '@ionic-native/google-plus/ngx';
import { Platform } from '@ionic/angular';
import { Storage } from '@ionic/storage';

import { Facebook, FacebookLoginResponse } from '@ionic-native/facebook/ngx';

import { User, SocialUser } from '../../model';
import { AuthService, } from '../../shared';


@Component({
  selector: 'app-auth',
  templateUrl: './auth.page.html',
  styleUrls: ['./auth.page.scss'],
})
export class AuthPage implements OnInit {
  
  login:string;
  password:string;
  jwt: Object;
  isRegistr: boolean;
  isLoggedIn = false;
  userData: { name: any; email: any; };
  
  constructor( 
    private auth: AuthService, 
    private storage: Storage, 
    private router: Router,
    private platform: Platform,
    private google: GooglePlus,
    public loadingController: LoadingController,
    private fb: Facebook,) 
    {  
      this.login = '';
      this.password = '';
    }

  ngOnInit() {
  }

  signIn(){
    const user: User = {
      login: this.login,
      password: this.password
    }
    
    if (user.login !== '' && user.password !== '') {
      this.auth.signIn(user).subscribe((response) => {
    
        this.storage.set('token', `${response.token}`);
        this.storage.set('userID', `${response.id}`);
        this.login = '';
        this.password = '';
        this.router.navigate(['/home']);
      });
    }
  }

  openHomePage(jwt){
    let navigationExtras: NavigationExtras = {
      queryParams: {
        jwt: JSON.stringify(jwt)
      }
    };
    this.router.navigate(['/home'], navigationExtras);
    }


  googleSignIn(){
  const params = {
        'webClientId': '956153456177-8rddu627dl0tlvp81s889hofqe15n1th.apps.googleusercontent.com',
        'offline': true
      }
   this.google.login(params)
    .then((response) => {
      this.registrGoogleUser(response);
    }).catch((error) => {
      alert('error:' + JSON.stringify(error))
    });
  }

  registrGoogleUser(user){
    const googleUser: SocialUser = {
      email: user.email,
      login: user.displayName,
      imageUrl: user.imageUrl
    }
    this.auth.registrationSocial(googleUser).subscribe(response => {
      this.storage.set('token', `${response.token}`);
      this.storage.set('userID', `${response.id}`);
      this.router.navigate(['/home']);
    });
  }

  fbLogin() {
    this.fb.login(['public_profile', 'email'])
      .then(res => {
        if (res.status === 'connected') {
          this.getUserDetail(res.authResponse.userID);
        } 
      })
      .catch(e => console.log('Error logging into Facebook', e));
  }

  getUserDetail(userid: any) {
    this.fb.api('/' + userid + '/?fields=id,email,name,picture', ['public_profile'])
      .then(res => {
        this.registrFacebookUser(res);
      })
      .catch(e => {
        console.log(e);
      });
  }

  registrFacebookUser(user){
    const facebookUser: SocialUser = {
      email: user.email,
      login: user.name,
      imageUrl: user.picture.data.url,
    }

   this.auth.registrationSocial(facebookUser).subscribe(response => {
     console.log(response);
      this.storage.set('token', `${response.token}`);
      this.storage.set('userID', `${response.id}`);
      this.router.navigate(['/home']);
    });
  }
}
    



