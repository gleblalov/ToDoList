import { Component } from '@angular/core';

import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { Storage } from '@ionic/storage';
import { Router } from '@angular/router';


@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent {
  
  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private storage: Storage,
    private router: Router,
  ) {

    this.initializeApp();
  }

   async initializeApp() {
    await this.platform.ready().then(() => {
      

     this.storage.get('userID').then( data =>{
      if (data === null){
        this.router.navigate(["/auth"]);
        this.splashScreen.hide();
      } else {
        console.log(data);
        this.router.navigate(["/home"]);
        this.splashScreen.hide();
      }
        
      });
      this.statusBar.styleDefault();
    });
  }
}



// initializeApp() {
//   this.platform.ready().then(() => {
//     this.statusBar.styleDefault();
//     this.splashScreen.hide();
//   });
// }