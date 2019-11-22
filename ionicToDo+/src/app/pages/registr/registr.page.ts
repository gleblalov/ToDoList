import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { Storage } from '@ionic/storage';

import { User } from '../../model';
import { AuthService, } from '../../shared';


@Component({
  selector: 'app-registr',
  templateUrl: './registr.page.html',
  styleUrls: ['./registr.page.scss'],
})
export class RegistrPage implements OnInit {

  login:string;
  password:string;
  email:string;
  name:string;

  constructor(
    private auth: AuthService,
    private storage: Storage,
    private router: Router,
    ) {
    this.login = '';
    this.password = '';
    this.email = '';
    
   }

  ngOnInit() {
  }

  registration(){
    const user: User = {
      login: this.login,
      password: this.password,
      email: this.email,
      
    }

    if (user.login !== '' && user.password !== '') {
      this.auth.registration(user).subscribe((response) => {
        this.storage.set('token', `${response.token}`);
        this.storage.set('userID', `${response.id}`);
        this.router.navigate(['/home']);
        this.login = '';
        this.password = '';
        this.email = '';
        this.name = '';
      });
    }
  }
}
